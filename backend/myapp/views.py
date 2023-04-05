from django.http.response import Http404, HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets, generics
from .serializers import *
from .models import *
from datetime import datetime, timedelta
from django.db.models import Avg, Count, Min, Sum
from .printer.printer import Printer
from django.utils.crypto import get_random_string
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json
import calendar
from django.db import transaction

ELEMENT_PER_PAGE = 10

class ConstantView(viewsets.ModelViewSet):
    serializer_class = ConstantSerializer
    queryset = Constant.objects.all()

class SunbedsFreeView(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):

        date = self.request.query_params.get('date')
        
        # total_beach_loungers = Constant.objects.all()
        total_sunbeds = 200

        sunbeds = Reservation.objects.filter(umbrella__isnull=True, date__exact=date).aggregate(Sum('sunbeds'))

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
                reservations = Reservation.objects.filter(date__exact=date, umbrella__isnull=False).exclude(umbrella__code__exact="")
            else:
                # gestire questo fatto. torna 0 non va bene
                reservations = Reservation.objects.filter(date__exact=date, umbrella__isnull=True)

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

            printer.print_reservation(umbrella_code, sunbeds)

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
    queryset = Umbrella.objects.exclude(code__exact="")

class SubscriptionList(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer

    def get_queryset(self):

        queryset = Subscription.objects.all().order_by('id')

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
            umbrella_id = Umbrella.objects.filter(code__exact=umbrella).first()
        else:
            umbrella_id = None

        code = get_random_string(length=4, allowed_chars='1234567890')

        if subscription_data['start_date'] == "":
            start_date = None
        else:
            start_date = subscription_data['start_date']

        if subscription_data['end_date'] == "":
            end_date = None
        else: 
            end_date = subscription_data['end_date'] 

        with transaction.atomic():
            new_subscription = Subscription.objects.create(
                umbrella=umbrella_id, 
                code=code, 
                customer=subscription_data['customer'], 
                sunbeds=subscription_data['sunbeds'], 
                type=subscription_data['type'], 
                end_date=end_date, 
                start_date=start_date, 
                paid=subscription_data['paid'], 
                deposit=subscription_data['deposit'], 
                custom_period=subscription_data.get('customPeriod', ""), 
                total=subscription_data['total']
            )
            new_subscription.save()

            audit_log = Audit.objects.create(
                message=f"È stato creato un nuovo abbonamento con ID {new_subscription.id}",
                type="A",
                category="S"
            )
            audit_log.save()

            if subscription_data['type'] == "C": # periodo custom, es. tutti i sabati e domeniche di ogni mese
                tmp = new_subscription.custom_period.split("-")
                custom_days = tmp[0].split(",")
                custom_months = tmp[1].split(",")

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
                                subscription=new_subscription
                            )

                            reservation.save()

                        start_date += delta

            else:
                start_date = datetime.strptime(new_subscription.start_date, '%Y-%m-%d')
                end_date = datetime.strptime(new_subscription.end_date, '%Y-%m-%d')
                delta = timedelta(days=1)
                while start_date <= end_date:

                    reservation = Reservation.objects.create(
                        umbrella=new_subscription.umbrella, 
                        date=start_date, 
                        customer=new_subscription.customer, 
                        sunbeds=new_subscription.sunbeds, 
                        paid=new_subscription.paid, 
                        subscription=new_subscription
                    )

                    reservation.save()

                    start_date += delta

        serializer = SubscriptionSerializer(new_subscription)

        return Response(serializer.data, status=status.HTTP_200_OK)

class SubscriptionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all().order_by('id')

    def put(self, request, *args, **kwargs):
        subscription_data = request.data

        umbrella_id = subscription_data.get('umbrella', {}).get('id', None)
        umbrella_object = Umbrella.objects.get(id=umbrella_id)

        with transaction.atomic():
            subscription = Subscription.objects.get(id=subscription_data['id'])

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

            # if subscription.custom_period == subscription_data['custom_period']:
            #     update_period = False
            # else:
            #     subscription.custom_period = subscription_data['custom_period']
            #     update_period = True

            # if subscription_data['type'] == "C":
            #     reservation_list = Reservation.objects.filter(subscription__exact=subscription.id)

            #     if len(reservation_list) > 0:
            #         for reservation in reservation_list:

            #             reservation.subscription = subscription
            #             reservation.customer = subscription.customer
            #             reservation.sunbeds = subscription.sunbeds
            #             reservation.paid = subscription.paid

            #             reservation.save()

            # else:
            #     if umbrella_id:
            #         reservation_list = Reservation.objects.filter(umbrella__exact=umbrella_id, date__range=[subscription.start_date, subscription.end_date])
            #     else:
            #         reservation_list = Reservation.objects.filter(umbrella__isnull=True, date__range=[subscription.start_date, subscription.end_date])

            #     if len(reservation_list) > 0:
            #         for reservation in reservation_list:

            #             reservation.subscription = subscription
            #             reservation.customer = subscription.customer
            #             reservation.sunbeds = subscription.sunbeds
            #             reservation.paid = subscription.paid

            #             reservation.save()

        serializer = SubscriptionSerializer(subscription)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):

        with transaction.atomic():
            subscription = self.get_object()

            reservation_list = Reservation.objects.filter(subscription__exact=subscription.id)

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

        queryset = Reservation.objects.all().order_by('id')

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
        umbrella_selected = reservation_data.get('umbrella', None)
        if umbrella_selected:
            umbrella_id = Umbrella.objects.filter(code__exact=umbrella_selected).first()
        else:
            umbrella_id = None

        subscription = reservation_data.get('subscription', None)

        with transaction.atomic():
            reservation = Reservation.objects.create(
                umbrella=umbrella_id, 
                date=reservation_data['date'], 
                customer=reservation_data['customer'], 
                sunbeds=reservation_data['sunbeds'], 
                paid=reservation_data['paid'], 
                subscription=subscription
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

class ReservationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all().order_by('id')

    def put(self, request, *args, **kwargs):

        reservation_data = request.data

        if reservation_data.get('subscription'):
           print("You can't update a reservation that is related to a subscription") 
           return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            print(reservation_data)

            umbrella = reservation_data.get('umbrella', None)

            with transaction.atomic():
                reservation = Reservation.objects.get(id=reservation_data['id'])

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
            u_list = Umbrella.objects.filter(row__exact=i)
            
            row_list = []
            for u in u_list:
                el = {}
                serializer = UmbrellaSerializer(u)
                el['tmp_umbrella'] = serializer.data

                r = u.reservation_set.filter(date__exact=date).first()

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

        umbrellas = list(Umbrella.objects.exclude(code__exact=""))

        reservations = Reservation.objects.filter(date__exact=date)

        reserved_umbrella = []
        for reservation in reservations:
            reserved_umbrella.append(reservation.umbrella)

        free_umbrella = set(umbrellas).difference(set(reserved_umbrella))

        serializer = UmbrellaSerializer(free_umbrella, many=True)

        json_stuff = json.dumps(serializer.data)    
        return HttpResponse(json_stuff, content_type ="application/json")