from django.http.response import Http404, HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets, generics
from .serializers import *
from .models.season import Season
from .models.audit import Audit
from .models.reservation import Reservation
from .models.subscription import Subscription
from .models.umbrella import Umbrella
from datetime import datetime, timedelta, time
from django.db.models import Avg, Count, Min, Sum, Max
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import IntegrityError, transaction
import json
import calendar
import pytz
from .printer.main import Printer
from datetime import datetime

ELEMENT_PER_PAGE = 10

tz_rome = pytz.timezone('Europe/Rome')


class SeasonView(viewsets.ModelViewSet):
    serializer_class = SeasonSerializer
    queryset = Season.objects.all()

class ActiveSeasonView(generics.RetrieveAPIView):
    serializer_class = SeasonSerializer

    def get(self, request):

        active_season = Season.objects.filter(active=True).first()
        serializer = SeasonSerializer(active_season)

        return Response(serializer.data, status=status.HTTP_200_OK)

class SunbedsFreeView(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):
        try:
            current_season = Season.objects.get(active=True)
        except:
            current_season = datetime.now().year

        date = self.request.query_params.get('date')
        
        # total_beach_loungers = Constant.objects.all()
        total_sunbeds = 200

        sunbeds = Reservation.objects.filter(umbrella__isnull=True, date__exact=date, season__exact=current_season).aggregate(Sum('sunbeds'))

        umbrella_sunbeds_int = 0

        if sunbeds['sunbeds__sum'] == None:
            sunbeds_int = 0
        else:
            sunbeds_int = sunbeds['sunbeds__sum']

        return HttpResponse(total_sunbeds - umbrella_sunbeds_int - sunbeds_int)

class CountUmbrellaView(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):
        try:
            current_season = Season.objects.get(active=True)
        except:
            current_season = datetime.now().year

        date = self.request.query_params.get('date')
        reserved = self.request.query_params.get('reserved')

        if reserved and reserved.lower() == 'true':
            reserved = True
        else:
            reserved = False

        if date and reserved:
                reservations = Reservation.objects.filter(date__exact=date, umbrella__isnull=False, season__exact=current_season).exclude(umbrella__code__exact="").count()

                return HttpResponse(reservations)
        else:
            total = Umbrella.objects.filter(season__exact=current_season).count()
            return HttpResponse(total)

class PrinterStatusView(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):

        ip = "192.168.1.100"

        try:
            printer = Printer(ip)
        except Exception as e:
            return Response("KO", status=status.HTTP_503_SERVICE_UNAVAILABLE)

        printer_status = printer.is_online()

        if printer_status:
            return Response("OK", status=status.HTTP_200_OK)
        else:
            return Response("KO", status=status.HTTP_503_SERVICE_UNAVAILABLE)

class PrinterPaperStatusView(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):

        ip = "192.168.1.100"

        try:
            printer = Printer(ip)
        except Exception as e:
            return Response("KO", status=status.HTTP_503_SERVICE_UNAVAILABLE)

        paper_status = printer.paper_status()

        if paper_status == 2:
            return Response("Adeguato", status=status.HTTP_200_OK)
        elif paper_status == 1:
            return Response("In esaurimento", status=status.HTTP_200_OK)
        elif paper_status == 0:
            return Response("Terminata", status=status.HTTP_200_OK)
        else:
            return Response("KO", status=status.HTTP_503_SERVICE_UNAVAILABLE)

class PrintTicketView(generics.CreateAPIView):

    def create(self, request, *args, **kwargs):
        ip = "192.168.1.100"

        try:
            printer = Printer(ip)
        except Exception as e:
            return Response("KO", status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        ticket = request.data
        type = ticket.get('type')
        sunbeds = ticket.get('sunbeds')
        umbrella = ticket.get('umbrella')

        if isinstance(umbrella, dict):
            umbrella_code = umbrella.get('code')
        else:
            umbrella_code = umbrella

        if type == "reservation":
            
            ticket_id = ticket.get('code')

            printer.print_reservation(ticket_id, umbrella_code, sunbeds)

            return Response("OK", status=status.HTTP_200_OK)

        if type == "subscription":

            subscription_type = ticket.get('subscription_type')
            start_date = ticket.get('start_date')
            end_date = ticket.get('end_date')
            code = ticket.get('code')
            custom_period = ticket.get('custom_period')

            printer.print_subscription(umbrella_code, sunbeds, code, start_date, end_date, subscription_type, custom_period)

            return Response("OK", status=status.HTTP_200_OK)

class UmbrellaView(viewsets.ModelViewSet):
    serializer_class = UmbrellaSerializer

    def get_queryset(self):
        try:
            current_season = Season.objects.get(active=True)
        except:
            current_season = datetime.now().year

        queryset = Umbrella.objects.filter(season__exact=current_season).extra(select={'int_code': 'CAST(code AS INTEGER)'}).order_by('int_code')

        return queryset

class SubscriptionList(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        try:
            current_season = Season.objects.get(active=True)
        except:
            current_season = datetime.now().year

        queryset = Subscription.objects.filter(season__exact=current_season).order_by('id')

        subscription_type = self.request.query_params.get('type')
        umbrella_id = self.request.query_params.get('umbrella')
        paid = self.request.query_params.get('paid')
        page = self.request.query_params.get('page')

        try:
            if subscription_type is not None:
                queryset = queryset.filter(type__exact=subscription_type)
            if umbrella_id is not None:
                queryset = queryset.filter(umbrella__exact=umbrella_id)
            if paid is not None:
                queryset = queryset.filter(paid__exact=paid)

            paginator = Paginator(queryset, ELEMENT_PER_PAGE)
            if page is not None:
                queryset = paginator.page(page)

        except PageNotAnInteger:
            queryset = paginator.page(1)
        except EmptyPage:
            queryset = paginator.page(paginator.num_pages)

        return queryset

    def create(self, request, *args, **kwargs): 
        try:
            current_season = Season.objects.get(active=True)
        except:
            current_season = datetime.now().year

        subscription_data = request.data

        umbrella = subscription_data.get('umbrella', None)

        if umbrella:
            umbrella_obj = Umbrella.objects.filter(code__exact=umbrella, season__exact=current_season).first()
        else:
            umbrella_obj = None

        subcription_type = subscription_data['type']
        custom_period = None
        start_date = None
        end_date = None

        if subcription_type == "S":
            start_date = current_season.start_date
            end_date = current_season.end_date

        elif subcription_type == "P":
            start_date = datetime.strptime(subscription_data['start_date'], '%Y-%m-%d').date()
            end_date = datetime.strptime(subscription_data['end_date'] , '%Y-%m-%d').date()
        elif subcription_type == "C":
            custom_days = subscription_data.get('customDays')
            custom_days.sort()

            custom_months = subscription_data.get('customMonths')
            custom_months.sort()

            custom_period = ','.join(custom_days) + '-' + ','.join(custom_months)

        try:
            with transaction.atomic():
                new_subscription = Subscription.objects.create(
                    umbrella=umbrella_obj, 
                    customer=subscription_data['customer'], 
                    sunbeds=subscription_data['sunbeds'], 
                    type=subcription_type, 
                    end_date=end_date, 
                    start_date=start_date, 
                    paid=subscription_data['paid'], 
                    deposit=subscription_data['deposit'], 
                    custom_period=custom_period, 
                    total=subscription_data['total'],
                    season=current_season
                )
                new_subscription.save()

                audit_log = Audit.objects.create(
                    message=f"È stato creato un nuovo abbonamento con ID {new_subscription.id}",
                    type="A",
                    category="S"
                )
                audit_log.save()

                if subcription_type == "C": # periodo custom, es. tutti i sabati e domeniche di ogni mese
                    custom_days = subscription_data.get('customDays')
                    custom_months = subscription_data.get('customMonths')

                    current_year = datetime.now().year

                    for month in custom_months:
                        tuple = calendar.monthrange(current_year, int(month))

                        start_date = datetime(current_year, int(month), 1)
                        end_date = datetime(current_year, int(month), tuple[1])
                        delta = timedelta(days=1)
                        
                        while start_date <= end_date:

                            if str(start_date.weekday()) in custom_days:
                                reservation = Reservation.objects.create(
                                    umbrella=new_subscription.umbrella, 
                                    date=start_date, 
                                    customer=new_subscription.customer, 
                                    sunbeds=new_subscription.sunbeds, 
                                    paid=new_subscription.paid, 
                                    subscription=new_subscription,
                                    season=current_season
                                )

                                reservation.save()

                            start_date += delta

                else:
                    start_date = new_subscription.start_date
                    end_date = new_subscription.end_date
                    delta = timedelta(days=1)
                    while start_date <= end_date:

                        reservation = Reservation.objects.create(
                            umbrella=new_subscription.umbrella, 
                            date=start_date, 
                            customer=new_subscription.customer, 
                            sunbeds=new_subscription.sunbeds, 
                            paid=new_subscription.paid, 
                            subscription=new_subscription,
                            season=current_season
                        )

                        reservation.save()

                        start_date += delta

            serializer = SubscriptionSerializer(new_subscription)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except IntegrityError:
            
            overlap_error = "Non è stato possibile creare l'abbonamento perchè le date vanno in overlap"
            print(f"IntegrityError: {overlap_error}")

            audit_log = Audit.objects.create(
                message=overlap_error,
                type="A",
                category="S"
            )
            audit_log.save()

            return Response(overlap_error, status=status.HTTP_409_CONFLICT)

class SubscriptionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()

    def put(self, request, *args, **kwargs):
        try:
            current_season = Season.objects.get(active=True)
        except:
            current_season = datetime.now().year

        subscription_data = request.data

        umbrella_id = subscription_data.get('umbrella', {}).get('id', None)
        umbrella_object = Umbrella.objects.filter(season__exact=current_season).get(id=umbrella_id)

        with transaction.atomic():
            subscription = Subscription.objects.filter(season__exact=current_season).get(id=subscription_data['id'])

            subscription.umbrella = umbrella_object
            subscription.type = subscription_data['type']
            subscription.paid = subscription_data['paid']
            subscription.start_date = subscription_data['start_date']
            subscription.end_date = subscription_data['end_date']
            subscription.sunbeds = subscription_data['sunbeds']
            subscription.customer = subscription_data['customer']
            subscription.deposit = subscription_data['deposit']
            subscription.total = subscription_data['total']

            subscription.save()        

            audit_log = Audit.objects.create(
                message=f"È stato modificato l'abbonamento con ID {subscription.id}",
                type="U",
                category="S"
            )
            audit_log.save()

        serializer = SubscriptionSerializer(subscription)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):

        try:
            current_season = Season.objects.get(active=True)
        except:
            current_season = datetime.now().year

        with transaction.atomic():
            subscription = self.get_object()

            reservation_list = Reservation.objects.filter(subscription__exact=subscription.id, season__exact=current_season)

            for reservation in reservation_list:
                reservation.delete()

            subscription.delete()

            audit_log = Audit.objects.create(
                message=f"È stato cancellato l'abbonamento con ID {subscription.id}",
                type="D",
                category="S"
            )
            audit_log.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

class ReservationList(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer

    def get_queryset(self):
        try:
            current_season = Season.objects.get(active=True)
        except:
            current_season = datetime.now().year

        queryset = Reservation.objects.filter(season__exact=current_season).order_by('id')

        date = self.request.query_params.get('date')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        umbrella_id = self.request.query_params.get('umbrella')
        umbrella_code = self.request.query_params.get('umbrella_code')
        paid = self.request.query_params.get('paid')
        subscription = self.request.query_params.get('subscription')
        customer = self.request.query_params.get('customer')
        page = self.request.query_params.get('page')
        single = self.request.query_params.get('single')

        try:
            if date is not None:
                queryset = queryset.filter(date__exact=date)
            if start_date is not None and end_date is not None:
                queryset = queryset.filter(date__range=[start_date, end_date])
            if single is not None:
                queryset = queryset.exclude(paid__isnull=True)
            if umbrella_id is not None:
                queryset = queryset.filter(umbrella__exact=umbrella_id)
            if umbrella_code is not None:
                queryset = queryset.filter(umbrella__code__exact=umbrella_code)
            if paid is not None:
                queryset = queryset.filter(paid__exact=paid)
            if subscription is not None:
                queryset = queryset.filter(subscription__exact=subscription)
            if customer is not None:
                queryset = queryset.filter(customer__contains=customer)

            paginator = Paginator(queryset, ELEMENT_PER_PAGE)
            if page is not None:
                queryset = paginator.page(page)

        except PageNotAnInteger:
            queryset = paginator.page(1)
        except EmptyPage:
            queryset = paginator.page(paginator.num_pages)

        return queryset

    def create(self, request, *args, **kwargs): 
        try:
            current_season = Season.objects.get(active=True)
        except:
            current_season = datetime.now().year

        reservation_data = request.data

        # se contiene umbrella vuol dire che è una prenotazione per un ombrellone
        umbrella_selected = reservation_data.get('umbrella')
        if umbrella_selected:
            umbrella_obj = Umbrella.objects.filter(code__exact=umbrella_selected, season__exact=current_season).first()
        else:
            umbrella_obj = None

        dt = reservation_data['date']

        price = self.get_reservation_price(umbrella_obj, int(reservation_data['sunbeds']))

        try: 
            with transaction.atomic():
                reservation = Reservation.objects.create(
                    umbrella=umbrella_obj, 
                    date=dt, 
                    customer=reservation_data['customer'], 
                    sunbeds=reservation_data['sunbeds'], 
                    paid=reservation_data['paid'],
                    price=price,
                    code=1,
                    season=current_season
                )

                reservation.save()

                audit_log = Audit.objects.create(
                    message=f"È stata creata una nuova prenotazione con ID {reservation.id}",
                    type="A",
                    category="R"
                )
                audit_log.save()

            serializer = ReservationSerializer(reservation)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except IntegrityError:

            overlap_error = "Non è stato possibile creare la prenotazione perchè va in overlap"
            print(f"IntegrityError: {overlap_error}")

            audit_log = Audit.objects.create(
                message=overlap_error,
                type="A",
                category="R"
            )            
            audit_log.save()

            return Response(overlap_error, status=status.HTTP_409_CONFLICT)

    def get_reservation_price(self, umbrella, sunbeds):

        price = 0

        now = datetime.now(tz=tz_rome)
        half_day_time =  time(hour = 14, minute = 00, second = 00)

        if now.time() >= half_day_time:
            half_day = True
        else: 
            half_day = False

        if umbrella:

            if sunbeds == 1:
                price = 15
            elif sunbeds == 2:
                price = 20
            elif sunbeds == 3:
                price = 25
            elif sunbeds == 4:
                price = 30

            if half_day:
                price -= 5
        else:
            if half_day:
                price = 5 * sunbeds
            else:
                price = 7 * sunbeds

        return price

class ReservationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()

    def put(self, request, *args, **kwargs):
        try:
            current_season = Season.objects.get(active=True)
        except:
            current_season = datetime.now().year

        reservation_data = request.data

        if reservation_data.get('subscription'):
           print("You can't update a reservation that is related to a subscription") 
           return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            print(reservation_data)

            umbrella = reservation_data.get('umbrella', None)

            with transaction.atomic():
                reservation = Reservation.objects.filter(season__exact=current_season).get(id=reservation_data['id'])

                if reservation.subscription:
                    reservation.umbrella = umbrella
                    
                reservation.customer = reservation_data['customer']
                reservation.sunbeds = reservation_data['sunbeds']
                reservation.paid = reservation_data['paid']
                reservation.date = reservation_data['date']

                reservation.save()

                audit_log = Audit.objects.create(
                    message=f"È stato modificata la prenotazione con ID {reservation.id}",
                    type="U",
                    category="R"
                )

                audit_log.save()

            serializer = ReservationSerializer(reservation)

            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):

        reservation = self.get_object()
        if reservation.subscription:
            print("You can't delete a reservation that is related to a subscription")
        else:
            with transaction.atomic():
                reservation.delete()

                audit_log = Audit.objects.create(
                    message=f"È stato cancellato la prenotazione con ID {reservation.id}",
                    type="D",
                    category="R"
                )

                audit_log.save()
                
        return Response(status=status.HTTP_204_NO_CONTENT)

class HomeView(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):
        try:
            current_season = Season.objects.get(active=True)
        except:
            current_season = datetime.now().year

        date = self.request.query_params.get('date')

        matrix = list()

        min_row = Umbrella.objects.aggregate(Min('row'))['row__min']
        max_row = Umbrella.objects.aggregate(Max('row'))['row__max']

        for i in range(min_row, max_row+1):
            umbrella_list = Umbrella.objects.filter(row__exact=i, season__exact=current_season)
            
            row_list = []
            for umbrella in umbrella_list:
                el = {}
                serializer = UmbrellaSerializer(umbrella)
                el['tmp_umbrella'] = serializer.data

                r = umbrella.reservation_set.filter(date__exact=date, season__exact=current_season).first()

                if r == None:
                    el['tmp_res'] = None
                else:
                    serializer = ReservationSerializer(r)
                    el['tmp_res'] = serializer.data

                row_list.append(el)
            
            matrix.append(row_list)

        json_stuff = json.dumps(matrix)    
        return HttpResponse(json_stuff, content_type="application/json")

class FreeUmbrellaReservationView(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):

        try:
            current_season = Season.objects.get(active=True)
        except:
            current_season = datetime.now().year

        date = self.request.query_params.get('date')

        reservations = Reservation.objects.filter(date__exact=date, umbrella_id__isnull=False, season__exact=current_season)

        object_id_list = [reservation.umbrella.id for reservation in reservations]

        free_umbrellas = Umbrella.objects.filter(season__exact=current_season) \
                            .exclude(id__in=object_id_list) \
                            .extra(select={'int_code': 'CAST(code AS INTEGER)'}).order_by('int_code')

        serializer = UmbrellaSerializer(free_umbrellas, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)