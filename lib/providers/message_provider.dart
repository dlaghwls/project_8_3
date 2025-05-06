import 'package:flutter/material.dart';
import '../models/message.dart';
import '../services/api_service.dart'; // ApiService 클래스 사용

// ✅ MessageProvider 클래스 정의 (Consumer에서 인식되도록 필수!)
class MessageProvider extends ChangeNotifier {
  final ApiService _api = ApiService(); // API 호출용 인스턴스

  List<Message> _messages = [];
  bool _isLoading = false;

  // ✅ 외부에서 읽을 수 있도록 getter 정의
  List<Message> get messages => _messages;
  bool get isLoading => _isLoading;

  // ✅ 메시지 수를 기반으로 한 알림 뱃지
  int get unreadCount => _messages.length;

  /// ✅ 메시지 불러오는 함수
  Future<void> loadMessages({
    required int patientId,
    int? sinceId,
  }) async {
    _isLoading = true;
    notifyListeners(); // 로딩 상태 갱신

    try {
      final List<Message> fetched = await _api.getMessages(
        patientId: patientId,
        sinceId: sinceId,
      );

      // ✅ 최신순 정렬
      fetched.sort((a, b) => b.createdAt.compareTo(a.createdAt));

      _messages = fetched;
    } catch (e) {
      debugPrint('메시지 로드 중 오류: $e');
      _messages = []; // 실패 시 비워줌
    }

    _isLoading = false;
    notifyListeners(); // 로딩 종료 알림
  }
}