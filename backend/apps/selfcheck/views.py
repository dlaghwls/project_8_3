from django.shortcuts import render
from rest_framework import generics
from .models import SelfCheck
from .serializers import SelfCheckSerializer

class SelfCheckListCreateView(generics.ListCreateAPIView):
    queryset = SelfCheck.objects.all().order_by('-submitted_at')
    serializer_class = SelfCheckSerializer

class SelfCheckDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SelfCheck.objects.all()
    serializer_class = SelfCheckSerializer

