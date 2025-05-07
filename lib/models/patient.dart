class Patient {
  final int id;
  final String patientId;
  final String name;
  final String gender;
  final DateTime birthDate;
  final String? phone;
  final String? address;
  final DateTime createdAt;

  Patient({
    required this.id,
    required this.patientId,
    required this.name,
    required this.gender,
    required this.birthDate,
    this.phone,
    this.address,
    required this.createdAt,
  });

    factory Patient.fromJson(Map<String, dynamic> json) {
      try {
        return Patient(
          id: json['id'] is int 
              ? json['id'] 
              : int.tryParse(json['id']?.toString() ?? '') ?? 0,
          patientId: json['patient_id']?.toString() ?? '',
          name: json['name']?.toString() ?? '',
          gender: json['gender']?.toString() ?? '',
          birthDate: DateTime.parse(json['birth_date'] as String),
          phone: json['phone'] as String?,
          address: json['address'] as String?,
          createdAt: DateTime.parse(json['created_at'] as String),
        );
      } catch (e) {
        print('Patient 객체 변환 오류: $e');
        rethrow;
      }
    }

}
