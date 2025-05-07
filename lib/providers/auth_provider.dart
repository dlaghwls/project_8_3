// lib/providers/auth_provider.dart

import 'package:flutter/material.dart';
import 'package:stroke_care_mobile/models/patient.dart';

class AuthProvider extends ChangeNotifier {
  Patient? _currentPatient;    // 로그인된 환자 정보
  bool get isLoggedIn => _currentPatient != null;

  /// 로그인된 환자 정보 반환
  /// 로그인 전엔 null이 아니어야 하므로 호출 전 isLoggedIn 체크를 권장합니다.
  Patient get currentPatient {
    if (_currentPatient == null) {
      throw Exception('환자 정보가 설정되지 않았습니다.');
    }
    return _currentPatient!;
  }

  /// 로그인 성공 시 호출하세요.
  void setCurrentPatient(Patient patient) {
    _currentPatient = patient;
    notifyListeners();
  }

  /// 로그아웃 시 호출하세요.
  void logout() {
    _currentPatient = null;
    notifyListeners();
  }
}