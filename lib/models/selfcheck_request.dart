class SelfCheckRequest {
  bool headache;
  bool dizziness;
  bool numbness;
  bool speechDifficulty;
  bool visionBlur;
  bool nausea;
  int  painScore;
  String moodChoice;

  SelfCheckRequest({
    required this.headache,
    required this.dizziness,
    required this.numbness,
    required this.speechDifficulty,
    required this.visionBlur,
    required this.nausea,
    required this.painScore,
    required this.moodChoice,
  });

  Map<String, dynamic> toJson() => {
        'headache': headache,
        'dizziness': dizziness,
        'numbness': numbness,
        'speech_difficulty': speechDifficulty,
        'vision_blur': visionBlur,
        'nausea': nausea,
        'pain_score': painScore,
        'mood_choice': moodChoice,
      };
}
