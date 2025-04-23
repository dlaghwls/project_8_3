
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from .models import Patient
from .serializers import (
    PatientCreateSerializer,
    PatientListSerializer,
    PatientDetailSerializer
)


class PatientListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Patient.objects.all()

    def get_serializer_class(self):
        # 🔥 POST 요청이면 등록용, GET 요청이면 리스트용
        if self.request.method == 'POST':
            return PatientCreateSerializer
        return PatientListSerializer

    def create(self, request, *args, **kwargs):
        print('[POST 요청 데이터]', dict(request.data))
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print('[유효성 검사 실패]', serializer.errors)
            return Response(serializer.errors, status=400)

        print('[validated_data]', serializer.validated_data)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)


class PatientRetrieveUpdateView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Patient.objects.all()
    serializer_class = PatientDetailSerializer  
    lookup_field = 'id'
