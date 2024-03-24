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
from .models.constant import Constant
from datetime import datetime, timedelta, time
from django.db.models import Avg, Count, Min, Sum
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import IntegrityError, transaction
import json
import calendar
import pytz
from .printer.main import Printer
from datetime import datetime

ELEMENT_PER_PAGE = 10

tz_rome = pytz.timezone('Europe/Rome')

try:
    current_season = Season.objects.get(active=True)
except:
    current_season = datetime.now().year


class ConstantView(viewsets.ModelViewSet):
    serializer_class = ConstantSerializer
    queryset = Constant.objects.all()

class SeasonView(viewsets.ModelViewSet):
    serializer_class = SeasonSerializer
    queryset = Season.objects.all()

class SunbedsFreeView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):

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

class ReservedUmbrellaView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):

        date = self.request.query_params.get('date')
        reserved = self.request.query_params.get('reserved')

        if date:
            if reserved and reserved == 'True':
                reservations = Reservation.objects.filter(date__exact=date, umbrella__isnull=False, season__exact=current_season).exclude(umbrella__code__exact="")
            else:
                # gestire questo fatto. torna 0 non va bene
                reservations = Reservation.objects.filter(date__exact=date, umbrella__isnull=True, season__exact=current_season)

            return HttpResponse(len(reservations))
        else:
            return HttpResponse(0)

class PrintTicketView(generics.CreateAPIView):

    def create(self, request, *args, **kwargs):

        printer = Printer()
        
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
    queryset = Umbrella.objects.filter(season__exact=current_season).extra(select={'int_code': 'CAST(code AS INTEGER)'}).order_by('int_code')

class SubscriptionList(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer

    def get_queryset(self):

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
        subscription_data = request.data

        umbrella = subscription_data.get('umbrella', None)

        if umbrella:
            umbrella_obj = Umbrella.objects.filter(code__exact=umbrella, season__exact=current_season).first()
        else:
            umbrella_obj = None

        subcription_type = subscription_data['type']
        custom_period = None

        if subcription_type == "S":
            start_date = current_season.start_date
            end_date = current_season.end_date

        elif subcription_type == "P":
            start_date = datetime.strptime(subscription_data['start_date'], '%Y-%m-%d')
            end_date = datetime.strptime(subscription_data['end_date'] , '%Y-%m-%d')

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

        except IntegrityError as e:
            
            print(repr(e))
            print("Non è stato possibile creare l'abbonamento perchè va in overlap")

            audit_log = Audit.objects.create(
                message=f"Non è stato possibile creare l'abbonamento perchè va in overlap",
                type="A",
                category="S"
            )
            audit_log.save()            

            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)       

class SubscriptionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.filter(season__exact=current_season).order_by('id')

    def put(self, request, *args, **kwargs):
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

            print("Non è stato possibile creare la prenotazione perchè va in overlap")

            audit_log = Audit.objects.create(
                message=f"Non è stato possibile creare la prenotazione perchè va in overlap",
                type="A",
                category="R"
            )
            audit_log.save()         

            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)  

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
    queryset = Reservation.objects.filter(season__exact=current_season).order_by('id')

    def put(self, request, *args, **kwargs):

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

        date = self.request.query_params.get('date')

        matrix = list()

        for i in range(0, 12):
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
        return HttpResponse(json_stuff, content_type ="application/json")

class FreeUmbrellaReservationView(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):

        date = self.request.query_params.get('date')

        reservations = Reservation.objects.filter(date__exact=date, umbrella_id__isnull=False, season__exact=current_season)

        object_id_list = [reservation.umbrella.id for reservation in reservations]

        free_umbrellas = Umbrella.objects.filter(season__exact=current_season) \
                            .exclude(id__in=object_id_list) \
                            .extra(select={'int_code': 'CAST(code AS INTEGER)'}).order_by('int_code')

        serializer = UmbrellaSerializer(free_umbrellas, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)