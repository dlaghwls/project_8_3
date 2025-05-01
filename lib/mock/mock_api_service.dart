// lib/mock/mock_api_service.dart
import 'package:stroke_care_mobile/models/selfcheck.dart';
import 'package:stroke_care_mobile/models/selfcheck_request.dart';

abstract class BaseApiService {
  Future<void> login(String id, String pw);
  Future<void> signUp(String id, String pw);
  Future<List<SelfCheck>> getSelfChecks();
  Future<void> postSelfCheck(SelfCheckRequest req);
}

class MockApiService implements BaseApiService {
  final Map<String, String> _users = {};    // 가입된 사용자 저장 (id → pw)
  final List<SelfCheck> _cache = [];

  // ---- 로그인: 가입 여부·비번 검사 후 성공 ----------------
  @override
  Future<void> login(String id, String pw) async {
    await Future.delayed(const Duration(milliseconds: 300));
    if (!_users.containsKey(id)) {
      throw Exception('등록되지 않은 계정입니다');
    }
    if (_users[id] != pw) {
      throw Exception('비밀번호가 일치하지 않습니다');
    }
    // 성공
  }

  // ---- 회원가입: _users에 저장 --------------------------
  @override
  Future<void> signUp(String id, String pw) async {
    await Future.delayed(const Duration(milliseconds: 500));
    if (_users.containsKey(id)) {
      throw Exception('이미 가입된 아이디입니다');
    }
    _users[id] = pw;
  }

  // ---- 자가문진 조회 -----------------------------------
  @override
  Future<List<SelfCheck>> getSelfChecks() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return _cache.reversed.toList();
  }

  // ---- 자가문진 제출 ---------------------------------
  @override
  Future<void> postSelfCheck(SelfCheckRequest req) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final now = DateTime.now();
    _cache.add(
      SelfCheck(
        id: now.microsecondsSinceEpoch,
        score: req.painScore,
        createdAt: now,
      ),
    );
  }
}
