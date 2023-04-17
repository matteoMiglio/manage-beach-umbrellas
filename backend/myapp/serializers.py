from rest_framework import serializers
from .models import Umbrella
from .models import Subscription
from .models import Reservation
from .models import Constant
from .models import Audit

class AuditSerializer(serializers.ModelSerializer):

    class Meta:
        model = Audit
        fields = ('id', 'message', 'type', 'created_at')

class ConstantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Constant
        fields = ('id', 'key', 'value', 'created_at', 'updated_at')

class UmbrellaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Umbrella
        fields = ('id', 'code', 'description', 'sunbeds', 'row', 'column', 'created_at', 'updated_at')

class ReservationSerializer(serializers.ModelSerializer):
    umbrella = UmbrellaSerializer(many=False)

    class Meta:
        model = Reservation
        fields = ('id', 'umbrella', 'customer', 'date', 'sunbeds', 'paid', 'price', 'subscription', 'created_at', 'updated_at')

class SubscriptionSerializer(serializers.ModelSerializer):
    umbrella = UmbrellaSerializer(many=False)

    class Meta:
        model = Subscription
        fields = ('id', 'umbrella', 'customer', 'start_date', 'end_date', 'sunbeds', 'paid', 'type', 'deposit', 'total', 'custom_period', 'created_at', 'updated_at')
