from django.http.response import Http404, HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets, generics
from .serializers import *
from .models import *
from datetime import datetime, date, timedelta
from django.db.models import Avg, Count, Min, Sum
from .printer import Printer
from django.utils.crypto import get_random_string
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core import serializers
import json
import calendar

ELEMENT_PER_PAGE = 10

class ConstantView(viewsets.ModelViewSet):
    serializer_class = ConstantSerializer
    queryset = Constant.objects.all()

class BeachLoungersFreeView(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):

        date = self.request.query_params.get('date')
        
        # total_beach_loungers = Constant.objects.all()
        total_beach_loungers = 400

        umbrella_beach_loungers = Reservation.objects.filter(umbrella__isnull=False, date__exact=date).aggregate(Sum('beachLoungers'))
        beach_loungers = Reservation.objects.filter(umbrella__isnull=True, date__exact=date).aggregate(Sum('beachLoungers'))

        if beach_loungers['beachLoungers__sum'] == None:
            beach_loungers_int = 0
        else:
            beach_loungers_int = beach_loungers['beachLoungers__sum']

        return HttpResponse(total_beach_loungers - umbrella_beach_loungers['beachLoungers__sum'] - beach_loungers_int)

class PrintTicketView(generics.CreateAPIView):

    def create(self, request, *args, **kwargs):

        printer = Printer()
        
        ticket = request.data
        type = ticket.get('type')
        umbrella_number = ticket.get('umbrella', None)
        beach_loungers = ticket.get('beachLoungers')

        if type == "reservation":

            printer.print_reservation(umbrella_number, beach_loungers)

            return Response("OK", status=status.HTTP_200_OK)

        if type == "subscription":
            start_date = ticket.get('startDate')
            end_date = ticket.get('endDate')
            code = ticket.get('code')

            printer.print_subscription(umbrella_number, beach_loungers, code, start_date, end_date)

            return Response("OK", status=status.HTTP_200_OK)

class UmbrellaView(viewsets.ModelViewSet):
    serializer_class = UmbrellaSerializer
    queryset = Umbrella.objects.exclude(code__exact="")

class SubscriptionList(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer

    def get_queryset(self):

        queryset = Subscription.objects.all()

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

        if subscription_data['startDate'] == "":
            start_date = None
        else:
            start_date = subscription_data['startDate']

        if subscription_data['endDate'] == "":
            end_date = None
        else: 
            end_date = subscription_data['endDate'] 

        new_subscription = Subscription.objects.create(umbrella=umbrella_id, code=code, customer=subscription_data['customer'], beachLoungers=subscription_data['beachLoungers'], type=subscription_data['type'], endDate=end_date, startDate=start_date, paid=subscription_data['paid'], deposit=subscription_data['deposit'], custom_period=subscription_data['customPeriod'])

        new_subscription.save()

        if subscription_data['type'] == "C":
            tmp = new_subscription.custom_period.split("-")
            custom_days = tmp[0].split(",")
            custom_months = tmp[1].split(",")

            current_year = datetime.now().year

            for month in custom_months:
                tuple = calendar.monthrange(current_year, int(month))

                start_date = datetime(current_year, int(month), tuple[0])
                end_date = datetime(current_year, int(month), tuple[1])
                delta = timedelta(days=1)
                
                while start_date <= end_date:

                    if str(start_date.weekday()) in custom_days:
                        reservation = Reservation.objects.create(umbrella=new_subscription.umbrella, date=start_date, customer=new_subscription.customer, beachLoungers=new_subscription.beachLoungers, paid=new_subscription.paid, subscription=new_subscription)

                        reservation.save()

                    start_date += delta

        else:
            start_date = datetime.strptime(new_subscription.startDate, '%Y-%m-%d')
            end_date = datetime.strptime(new_subscription.endDate, '%Y-%m-%d')
            delta = timedelta(days=1)
            while start_date <= end_date:

                reservation = Reservation.objects.create(umbrella=new_subscription.umbrella, date=start_date, customer=new_subscription.customer, beachLoungers=new_subscription.beachLoungers, paid=new_subscription.paid, subscription=new_subscription)

                reservation.save()

                start_date += delta

        serializer = SubscriptionSerializer(new_subscription)

        return Response(serializer.data, status=status.HTTP_200_OK)

class SubscriptionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()

    def put(self, request, *args, **kwargs):
        subscription_data = request.data

        if subscription_data['umbrella'] and subscription_data['umbrella'] != "null" and subscription_data['umbrella'] != None:
            umbrella = Umbrella.objects.get(id=subscription_data['umbrella'])
        else:
            umbrella = None

        subscription = Subscription.objects.get(id=subscription_data['id'])

        subscription.umbrella = umbrella
        subscription.type = subscription_data['type']
        subscription.paid = subscription_data['paid']
        subscription.startDate = subscription_data['startDate']
        subscription.endDate = subscription_data['endDate']
        subscription.beachLoungers = subscription_data['beachLoungers']
        subscription.customer = subscription_data['customer']
        subscription.deposit = subscription_data['deposit']

        if subscription.custom_period == subscription_data['customPeriod']:
            update_period = False
        else:
            subscription.custom_period = subscription_data['customPeriod']
            update_period = True

        subscription.save()        

        if subscription_data['type'] == "C":
            reservation_list = Reservation.objects.filter(subscription__exact=subscription.id)

            if len(reservation_list) > 0:
                for reservation in reservation_list:

                    reservation.subscription = subscription
                    reservation.customer = subscription.customer
                    reservation.beachLoungers = subscription.beachLoungers
                    reservation.paid = subscription.paid

                    reservation.save()

        else:
            if umbrella:
                reservation_list = Reservation.objects.filter(umbrella__exact=umbrella, date__range=[subscription.startDate, subscription.endDate])
            else:
                reservation_list = Reservation.objects.filter(umbrella__isnull=True, date__range=[subscription.startDate, subscription.endDate])

            if len(reservation_list) > 0:
                for reservation in reservation_list:

                    reservation.subscription = subscription
                    reservation.customer = subscription.customer
                    reservation.beachLoungers = subscription.beachLoungers
                    reservation.paid = subscription.paid

                    reservation.save()

        serializer = SubscriptionSerializer(subscription)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):

        try:
            subscription = self.get_object()

            reservation_list = Reservation.objects.filter(subscription__exact=subscription.id)

            for reservation in reservation_list:
                reservation.delete()

            subscription.delete()

        except Http404:
            pass

        return Response(status=status.HTTP_204_NO_CONTENT)


class ReservationList(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer

    def get_queryset(self):

        queryset = Reservation.objects.all()

        date = self.request.query_params.get('date')
        umbrella_id = self.request.query_params.get('umbrella')
        paid = self.request.query_params.get('paid')
        subscription = self.request.query_params.get('subscription')
        customer = self.request.query_params.get('customer')
        page = self.request.query_params.get('page')
        single = self.request.query_params.get('single')

        try:
            if date is not None:
                queryset = queryset.filter(date__exact=date)
            if single is not None:
                queryset = queryset.exclude(paid__isnull=True)
            if umbrella_id is not None:
                queryset = queryset.filter(umbrella__exact=umbrella_id)
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
        if reservation_data['umbrella'] and reservation_data['umbrella'] != "null" and reservation_data['umbrella'] != None:
            umbrella_id = Umbrella.objects.filter(code__exact=reservation_data['umbrella']).first()
        else:
            umbrella_id = None

        subscription = reservation_data.get('subscription', None)

        reservation = Reservation.objects.create(umbrella=umbrella_id, date=reservation_data['date'], customer=reservation_data['customer'], beachLoungers=reservation_data['beachLoungers'], paid=reservation_data['paid'], subscription=subscription)

        reservation.save()

        serializer = ReservationSerializer(reservation)

        return Response(serializer.data, status=status.HTTP_200_OK)

class ReservationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()

    def put(self, request, *args, **kwargs):

        reservation_data = request.data

        reservation = Reservation.objects.get(id=reservation_data['id'])

        reservation.customer = reservation_data['customer']
        reservation.beachLoungers = reservation_data['beachLoungers']
        reservation.paid = reservation_data['paid']
        reservation.date = reservation_data['date']

        reservation.save()
    
        serializer = ReservationSerializer(reservation)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):

        try:
            reservation = self.get_object()
            reservation.delete()

        except Http404:
            pass

        return Response(status=status.HTTP_204_NO_CONTENT)

# class CustomUmbrellaList(generics.ListCreateAPIView):
# def CustomUmbrellaList(request):
#     queryset = Reservation.objects.raw('select * from myapp_umbrella LEFT OUTER JOIN myapp_reservation ON myapp_umbrella.id = myapp_reservation.umbrella_id AND myapp_reservation.date IS "2021-05-29"')
#     data = serialize("json", queryset, fields=('row', 'myapp_umbrella.id', 'beachLoungers', 'paid', 'date'))
#     return JsonResponse(data, safe=False)


# query papabili

class TMPHomeView(generics.RetrieveAPIView):

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