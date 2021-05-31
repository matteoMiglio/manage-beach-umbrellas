from rest_framework import serializers
from .models import Umbrella
from .models import Subscription
from .models import Reservation
from .models import Constant

class ConstantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Constant
        fields = ('id', 'key', 'value')

class UmbrellaSerializer(serializers.ModelSerializer):
    # reservation = serializers.StringRelatedField(many=False)
    # reservation = ReservationSerializer(many=False, read_only=True)

    class Meta:
        model = Umbrella
        fields = ('id', 'code', 'description', 'row')

class ReservationSerializer(serializers.ModelSerializer):
    # umbrella = UmbrellaSerializer(many=False)

    class Meta:
        model = Reservation
        fields = ('id', 'umbrella', 'customer', 'date', 'beachLoungers', 'paid', 'subscription')

class SubscriptionSerializer(serializers.ModelSerializer):
    # umbrella = UmbrellaSerializer(many=False)

    class Meta:
        model = Subscription
        fields = ('id', 'code', 'umbrella', 'customer', 'startDate', 'endDate', 'beachLoungers', 'paid', 'subscriptionType')
