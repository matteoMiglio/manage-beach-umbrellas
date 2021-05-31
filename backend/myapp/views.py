from django.http.response import JsonResponse, HttpResponse
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
    serializer_class = ConstantSerializer
    queryset = Constant.objects.all()

class UmbrellaView(viewsets.ModelViewSet):
    serializer_class = UmbrellaSerializer
    queryset = Umbrella.objects.all()


class SubscriptionList(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()

    def create(self, request, *args, **kwargs): 
        subscription_data = request.data

        umbrella = Umbrella.objects.get(id=subscription_data['umbrella'])

        new_subscription = Subscription.objects.create(umbrella=umbrella, code="9999", customer=subscription_data['customer'], beachLoungers=subscription_data['beachLoungers'], subscriptionType=subscription_data['subscriptionType'], endDate=subscription_data['endDate'], startDate=subscription_data['startDate'], paid=subscription_data['paid'])

        new_subscription.save()

        start_date = datetime.strptime(new_subscription.startDate, '%Y-%m-%d')
        end_date = datetime.strptime(new_subscription.endDate, '%Y-%m-%d')
        delta = timedelta(days=1)
        while start_date <= end_date:
            r = Reservation.objects.create(umbrella=umbrella, subscription=new_subscription, customer=new_subscription.customer, beachLoungers=new_subscription.beachLoungers, date=start_date, paid=new_subscription.paid)
            
            r.save()

            start_date += delta

        serializer = SubscriptionSerializer(new_subscription)

        return Response(serializer.data, status=status.HTTP_200_OK)

class SubscriptionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()

    def put(self, request, *args, **kwargs):
        subscription_data = request.data

        umbrella = Umbrella.objects.get(id=subscription_data['umbrella'])

        # new_subscription = Subscription.objects.create(umbrella=umbrella, code="9999", customer=subscription_data['customer'], beachLoungers=subscription_data['beachLoungers'], subscriptionType=subscription_data['subscriptionType'], endDate=subscription_data['endDate'], startDate=subscription_data['startDate'], paid=subscription_data['paid'])

        # new_subscription.save()

        start_date = datetime.strptime(new_subscription.startDate, '%Y-%m-%d')
        end_date = datetime.strptime(new_subscription.endDate, '%Y-%m-%d')
        delta = timedelta(days=1)
        while start_date <= end_date:
            # r = Reservation.objects.create(umbrella=umbrella, subscription=new_subscription, customer=new_subscription.customer, beachLoungers=new_subscription.beachLoungers, date=start_date, paid=new_subscription.paid)
            
            # r.save()

            start_date += delta

        serializer = SubscriptionSerializer(new_subscription)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        return self.put(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)



class ReservationList(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer

    def get_queryset(self):

        queryset = Reservation.objects.all()
        date = self.request.query_params.get('date')
        umbrella_id = self.request.query_params.get('umbrella')
        paid = self.request.query_params.get('paid')
        if date is not None:
            queryset = queryset.filter(date__exact=date)
        if umbrella_id is not None:
            queryset = queryset.filter(umbrella__exact=umbrella_id)
        if paid is not None:
            queryset = queryset.filter(paid__exact=paid)
        return queryset

class ReservationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()

# class CustomUmbrellaList(generics.ListCreateAPIView):
# def CustomUmbrellaList(request):
#     queryset = Reservation.objects.raw('select * from myapp_umbrella LEFT OUTER JOIN myapp_reservation ON myapp_umbrella.id = myapp_reservation.umbrella_id AND myapp_reservation.date IS "2021-05-29"')
#     data = serialize("json", queryset, fields=('row', 'myapp_umbrella.id', 'beachLoungers', 'paid', 'date'))
#     return JsonResponse(data, safe=False)