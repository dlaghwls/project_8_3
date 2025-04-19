// lib/models/selfcheck.dart

class SelfCheck {
  final int id;
  final int score;
  final DateTime createdAt;

  SelfCheck({
    required this.id,
    required this.score,
    required this.createdAt,
  });

  /// 서버 → 앱 : JSON을 SelfCheck 객체로 변환
  factory SelfCheck.fromJson(Map<String, dynamic> json) {
    return SelfCheck(
      id: json['id'] as int,
      score: json['score'] as int,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  /// 앱 → 서버 : SelfCheck 객체를 JSON으로 변환
  Map<String, dynamic> toJson() => {
        'id': id,
        'score': score,
        'created_at': createdAt.toIso8601String(),
      };
}
