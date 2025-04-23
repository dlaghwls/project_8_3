
from django.shortcuts import render
from rest_framework import generics
from .models import Vital
from .serializers import VitalSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

class VitalListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Vital.objects.all()
    serializer_class = VitalSerializer

    def create(self, request, *args, **kwargs):
        print("[요청 데이터] request.data =", request.data)
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print("[유효성 에러] errors =", serializer.errors)
            return Response(serializer.errors, status=400)

        saved_instance = serializer.save()
        return Response({
            'id': saved_instance.id,
            'patient': saved_instance.patient.id,
        }, status=status.HTTP_201_CREATED)

class VitalDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vital.objects.all()
    serializer_class = VitalSerializer
