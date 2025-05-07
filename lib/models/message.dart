// lib/models/message.dart

class Message {
  final int id;
  final int? patient;      // backend의 Patient PK(id)
  final int? selfcheck;   // 자가문진 ID (nullable)
  final String senderRole; // 'nurse' 또는 'doctor'
  final String content;
  final DateTime createdAt;

  Message({
    required this.id,
    required this.patient,
    this.selfcheck,
    required this.senderRole,
    required this.content,
    required this.createdAt,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'] as int? ?? 0,
      patient: json['patient'] as int,
      selfcheck: json['selfcheck'] as int?, 
      senderRole: json['sender_role'] as String,
      content: json['content'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
        'patient': patient,
        'selfcheck': selfcheck,
        'sender_role': senderRole,
        'content': content,
      };
}