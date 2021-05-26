from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UmbrellaSerializer
from .serializers import SubscriptionSerializer
from .serializers import ReservationSerializer
from .models import Umbrella
from .models import Subscription
from .models import Reservation

# Create your views here.

class UmbrellaView(viewsets.ModelViewSet):
    serializer_class = UmbrellaSerializer
    queryset = Umbrella.objects.all()

class SubscriptionView(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()

class ReservationView(viewsets.ModelViewSet):
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()