// lib/models/message_request.dart

/// 간호사 앱에서 메시지 전송할 때 사용하는 모델
class MessageRequest {
  final int patient;
  final int receiver;
  final int? selfcheck;
  final String senderRole;
  final String content;

  MessageRequest({
    required this.patient,
    required this.receiver,
    this.selfcheck,
    required this.senderRole,
    required this.content,
  });

  Map<String, dynamic> toJson() => {
        'patient': patient,
        'selfcheck': selfcheck,
        'sender_role': senderRole,
        'content': content,
        'receiver': receiver,
        if (selfcheck != null) 'selfcheck': selfcheck,
      };
}
