from rest_framework import serializers
from .models import Patient, CTScan
from apps.vitals.serializers import VitalSignSerializer, CommentSerializer
from .m1.utils import make_preview
import os

class CTScanUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CTScan
        fields = ['id', 'dicom_file', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

    def create(self, validated_data):
        # Patient 객체는 View에서 전달됩니다.
        return super().create(validated_data)


class CTScanSerializer(serializers.ModelSerializer):
    preview_url = serializers.SerializerMethodField()
    class Meta:
        model = CTScan
        fields = ['id', 'dicom_file', 'uploaded_at', 'preview_url']
    def get_preview_url(self, obj):
        dicom_path = obj.dicom_file.path
        # 1) 파일이 실제로 있는지
        if not os.path.exists(dicom_path):
            return None
        # 2) 예외가 나도 None 반환
        try:
            return make_preview(dicom_path)
        except Exception:
            return None
        
class PatientSerializer(serializers.ModelSerializer):
    """목록 조회(ListCreate)용"""
    class Meta:
        model = Patient
        fields = [
            'id', 'patient_id', 'name', 'gender',
            'birth_date', 'phone', 'address', 'created_at'
        ]

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"환자 생성 오류: {str(e)}")
            raise


class PatientDetailSerializer(PatientSerializer):
    """단일 조회(Retrieve) 시 Nested 포함"""
    vitals = VitalSignSerializer(many=True, read_only=True)
    ct_scans = CTScanSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta(PatientSerializer.Meta):
        fields = PatientSerializer.Meta.fields + ['vitals', 'ct_scans', 'comments']
