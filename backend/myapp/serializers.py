from rest_framework import serializers
from .models import Umbrella
from .models import Subscription
from .models import Reservation

class UmbrellaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Umbrella
        fields = ('id', 'code', 'description', 'row')

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ('id', 'code', 'umbrella', 'customer', 'startDate', 'endDate', 'beachLoungers', 'paid', 'subscriptionType')

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ('id', 'umbrella', 'customer', 'date', 'beachLoungers', 'paid', 'subscription')