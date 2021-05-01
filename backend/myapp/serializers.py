from rest_framework import serializers
from .models import Umbrella

class UmbrellaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Umbrella
        fields = ('id', 'code', 'description', 'state', 'pos_x', 'pos_y')
