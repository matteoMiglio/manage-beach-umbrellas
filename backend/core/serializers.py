from rest_framework import serializers
from .models.season import Season
from .models.audit import Audit
from .models.reservation import Reservation
from .models.subscription import Subscription
from .models.umbrella import Umbrella

class AuditSerializer(serializers.ModelSerializer):

    class Meta:
        model = Audit
        fields = ('id', 'message', 'type', 'created_at')

class SeasonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Season
        fields = ('season', 'start_date', 'end_date', 'active')

class UmbrellaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Umbrella
        fields = ('id', 'code', 'description', 'sunbeds', 'row', 'column', 'season', 'created_at', 'updated_at')

class ReservationSerializer(serializers.ModelSerializer):
    umbrella = UmbrellaSerializer(many=False)

    class Meta:
        model = Reservation
        fields = ('id', 'umbrella', 'code', 'customer', 'date', 'sunbeds', 'paid', 'price', 'subscription', 'season', 'created_at', 'updated_at')

class SubscriptionSerializer(serializers.ModelSerializer):
    umbrella = UmbrellaSerializer(many=False)

    class Meta:
        model = Subscription
        fields = ('id', 'code', 'umbrella', 'customer', 'start_date', 'end_date', 'sunbeds', 'paid', 'type', 'deposit', 'total', 'custom_period', 'season', 'created_at', 'updated_at')
