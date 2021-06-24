from rest_framework import serializers
from .models import Umbrella
from .models import Subscription
from .models import Reservation
from .models import Constant

class ConstantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Constant
        fields = ('id', 'key', 'value', 'created_at', 'updated_at')

class UmbrellaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Umbrella
        fields = ('id', 'code', 'description', 'beachLoungers', 'row', 'col', 'created_at', 'updated_at')

class ReservationSerializer(serializers.ModelSerializer):
    umbrella = UmbrellaSerializer(many=False)

    class Meta:
        model = Reservation
        fields = ('id', 'umbrella', 'customer', 'date', 'beachLoungers', 'paid', 'subscription', 'created_at', 'updated_at')

class SubscriptionSerializer(serializers.ModelSerializer):
    umbrella = UmbrellaSerializer(many=False)

    class Meta:
        model = Subscription
        fields = ('id', 'code', 'umbrella', 'customer', 'startDate', 'endDate', 'beachLoungers', 'paid', 'type', 'deposit', 'total', 'custom_period', 'created_at', 'updated_at')
