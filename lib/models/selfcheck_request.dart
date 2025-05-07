// lib/models/selfcheck_request.dart

class SelfCheckRequest {
  final int patientId;          // 여기에 추가한 부분입니다 25.04.21 15:48
  bool headache;
  bool dizziness;
  bool numbness;
  bool speechDifficulty;
  bool visionBlur;
  bool nausea;
  int  painScore;
  String moodChoice;
  final String painLocation;

  SelfCheckRequest({
    required this.patientId,            // 여기에 추가한 부분입니다 25.04.21 15:48
    required this.headache,
    required this.dizziness,
    required this.numbness,
    required this.speechDifficulty,
    required this.visionBlur,
    required this.nausea,
    required this.painScore,
    required this.moodChoice,
    required this.painLocation,
  });

  Map<String, dynamic> toJson() => {
        'patient': patientId,           // 여기에 추가한 부분입니다 25.04.21 15:48
        'headache': headache,
        'dizziness': dizziness,
        'numbness': numbness,
        'speech_difficulty': speechDifficulty,
        'vision_blur': visionBlur,
        'nausea': nausea,
        'pain_score': painScore,
        'mood': moodChoice.toLowerCase(),           // key를 'mood'로 완전히 맞췄습니다
        'pain_location': painLocation, // key를 'pain_location'으로 완전히 맞췄습니다
      };
}

