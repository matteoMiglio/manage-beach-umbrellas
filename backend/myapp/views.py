from django.db.models.query import QuerySet
from django.http.response import Http404, JsonResponse, HttpResponse
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets, generics
from .serializers import *
from .models import *
from django.core.serializers import serialize
from datetime import datetime, date, timedelta

# Create your views here.

class ConstantView(viewsets.ModelViewSet):
    # serializer_class = ConstantSerializer
    # queryset = Constant.objects.all()
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.filter(umbrella__exact=72, date__range=["2021-05-1", "2021-06-10"])


class UmbrellaView(viewsets.ModelViewSet):
    serializer_class = UmbrellaSerializer
    queryset = Umbrella.objects.all()


class SubscriptionList(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer

    def get_queryset(self):

        queryset = Subscription.objects.all()

        subscription_type = self.request.query_params.get('subscriptionType')
        umbrella_id = self.request.query_params.get('umbrella')
        paid = self.request.query_params.get('paid')

        if subscription_type is not None:
            queryset = queryset.filter(subscriptionType__exact=subscription_type)
        if umbrella_id is not None:
            queryset = queryset.filter(umbrella__exact=umbrella_id)
        if paid is not None:
            queryset = queryset.filter(paid__exact=paid)

        return queryset

    def create(self, request, *args, **kwargs): 
        subscription_data = request.data

        umbrella = Umbrella.objects.get(id=subscription_data['umbrella'])

        new_subscription = Subscription.objects.create(umbrella=umbrella, code="9999", customer=subscription_data['customer'], beachLoungers=subscription_data['beachLoungers'], subscriptionType=subscription_data['subscriptionType'], endDate=subscription_data['endDate'], startDate=subscription_data['startDate'], paid=subscription_data['paid'])

        new_subscription.save()

        if subscription_data['subscriptionType'] == "C":
            pass
        else:
            reservation_list = Reservation.objects.filter(umbrella__exact=umbrella, date__range=[new_subscription.startDate, new_subscription.endDate])

            if len(reservation_list) > 0:
                for reservation in reservation_list:

                    reservation.subscription = new_subscription
                    reservation.customer = new_subscription.customer
                    reservation.beachLoungers = new_subscription.beachLoungers
                    reservation.paid = new_subscription.paid

                    reservation.save()

        serializer = SubscriptionSerializer(new_subscription)

        return Response(serializer.data, status=status.HTTP_200_OK)

class SubscriptionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()

    def put(self, request, *args, **kwargs):
        subscription_data = request.data

        umbrella = Umbrella.objects.get(id=subscription_data['umbrella'])

        subscription = Subscription.objects.get(id=subscription_data['id'])

        subscription.umbrella = umbrella
        subscription.subscriptionType = subscription_data['subscriptionType'] if subscription_data['subscriptionType'] else True
        subscription.paid = subscription_data['paid'] if subscription_data['paid'] else True
        subscription.startDate = subscription_data['startDate'] if subscription_data['startDate'] else True
        subscription.endDate = subscription_data['endDate'] if subscription_data['endDate'] else True
        subscription.beachLoungers = subscription_data['beachLoungers'] if subscription_data['beachLoungers'] else True
        subscription.customer = subscription_data['customer'] if subscription_data['customer'] else True

        subscription.save()        

        if subscription_data['subscriptionType'] == "C":
            pass
        else:
            reservation_list = Reservation.objects.filter(umbrella__exact=umbrella, date__range=[subscription.startDate, subscription.endDate])

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

            if subscription.subscriptionType == "C":
                pass
            else:
                reservation_list = Reservation.objects.filter(umbrella__exact=subscription.umbrella.id, date__range=[subscription.startDate, subscription.endDate])

                if len(reservation_list) > 0:
                    for reservation in reservation_list:

                        reservation.subscription = None
                        reservation.customer = ""
                        reservation.beachLoungers = 1
                        reservation.paid = None

                        reservation.save()

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

        if date is not None:
            queryset = queryset.filter(date__exact=date)
        if umbrella_id is not None:
            queryset = queryset.filter(umbrella__exact=umbrella_id)
        if paid is not None:
            queryset = queryset.filter(paid__exact=paid)
        if subscription is not None:
            queryset = queryset.filter(subscription__exact=subscription)
        if customer is not None:
            queryset = queryset.filter(customer__contains=customer)

        return queryset

    def create(self, request, *args, **kwargs): 
        reservation_data = request.data

        reservation = Reservation.objects.filter(umbrella__exact=reservation_data['umbrella'], date__exact=reservation_data['date']).first()

        # reservation.subscription = new_subscription
        reservation.customer = reservation_data['customer']
        reservation.beachLoungers = reservation_data['beachLoungers']
        reservation.paid = reservation_data['paid']

        reservation.save()

        serializer = ReservationSerializer(reservation)

        return Response(serializer.data, status=status.HTTP_200_OK)

class ReservationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()

    def put(self, request, *args, **kwargs):
        reservation_data = request.data

        reservation = Reservation.objects.get(id=reservation_data['id'])

        # reservation.subscription = new_subscription
        reservation.customer = reservation_data['customer']
        reservation.beachLoungers = reservation_data['beachLoungers']
        reservation.paid = reservation_data['paid']

        reservation.save()
    
        serializer = ReservationSerializer(reservation)

        return Response(serializer.data, status=status.HTTP_200_OK)


    def delete(self, request, *args, **kwargs):

        try:
            reservation = self.get_object()

            reservation.subscription = None
            reservation.customer = ""
            reservation.beachLoungers = 1
            reservation.paid = None

            reservation.save()

        except Http404:
            pass

        return Response(status=status.HTTP_204_NO_CONTENT)

# class CustomUmbrellaList(generics.ListCreateAPIView):
# def CustomUmbrellaList(request):
#     queryset = Reservation.objects.raw('select * from myapp_umbrella LEFT OUTER JOIN myapp_reservation ON myapp_umbrella.id = myapp_reservation.umbrella_id AND myapp_reservation.date IS "2021-05-29"')
#     data = serialize("json", queryset, fields=('row', 'myapp_umbrella.id', 'beachLoungers', 'paid', 'date'))
#     return JsonResponse(data, safe=False)