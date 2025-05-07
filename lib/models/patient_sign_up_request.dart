// lib/models/patient_sign_up_request.dart

/// 환자 회원가입 요청 모델
class PatientSignUpRequest {
  final String patientId;
  final String name;
  final String gender;      // 'M', 'F', 'O'
  final String birthDate;   // 'YYYY-MM-DD'
  final String? phone;
  final String? address;

  PatientSignUpRequest({
    required this.patientId,
    required this.name,
    required this.gender,
    required this.birthDate,
    this.phone,
    this.address,
  });

  Map<String, dynamic> toJson() => {
    'patient_id': patientId,
    'name'      : name,
    'gender'    : gender,
    'birth_date': birthDate,
    'phone'     : phone,
    'address'   : address,
  };
}