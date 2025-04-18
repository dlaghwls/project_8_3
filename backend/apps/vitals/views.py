from django.shortcuts import render
from rest_framework import generics
from .models import Vital
from .serializers import VitalSerializer

class VitalListCreateView(generics.ListCreateAPIView):
    queryset = Vital.objects.all().order_by('-measured_at')
    serializer_class = VitalSerializer

class VitalDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vital.objects.all()
    serializer_class = VitalSerializer

