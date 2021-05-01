from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UmbrellaSerializer
from .models import Umbrella

# Create your views here.

class UmbrellaView(viewsets.ModelViewSet):
    serializer_class = UmbrellaSerializer
    queryset = Umbrella.objects.all()
