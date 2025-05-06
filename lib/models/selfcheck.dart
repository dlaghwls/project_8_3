class SelfCheck {
  final int id;
  final int score;
  final DateTime createdAt;
  final int patient;

  // ✅ 추가 필드
  final String? patientName;
  final String? painLocation;
  final String? moodChoice;
  final bool? headache;
  final bool? paralysis;
  final bool? slurredSpeech;
  final bool? visionBlurred;

  SelfCheck({
    required this.id,
    required this.score,
    required this.createdAt,
    required this.patient,

    this.patientName,
    this.painLocation,
    this.moodChoice,
    this.headache,
    this.paralysis,
    this.slurredSpeech,
    this.visionBlurred,
  });

  factory SelfCheck.fromJson(Map<String, dynamic> json) {
    return SelfCheck(
      id: json['id'] is int ? json['id'] as int : int.tryParse(json['id'].toString()) ?? 0,
      score: json['score'] is int ? json['score'] as int : int.tryParse(json['score'].toString()) ?? 0,
      patient: json['patient'] is int ? json['patient'] as int : int.tryParse(json['patient'].toString()) ?? 0,
      createdAt: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),

      // nullable 필드
      patientName: json['patient_name'] as String?,
      painLocation: json['pain_location'] as String?,
      moodChoice: json['mood_choice'] as String?,
      headache: json['headache'] as bool?,
      paralysis: json['paralysis'] as bool?,
      slurredSpeech: json['slurred_speech'] as bool?,
      visionBlurred: json['vision_blurred'] as bool?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'score': score,
        'created_at': createdAt.toIso8601String(),
        'patient': patient,
        'patient_name': patientName,
        'pain_location': painLocation,
        'mood_choice': moodChoice,
        'headache': headache,
        'paralysis': paralysis,
        'slurred_speech': slurredSpeech,
        'vision_blurred': visionBlurred,
      };
}