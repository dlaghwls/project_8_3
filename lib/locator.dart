// lib/locator.dart

import 'package:flutter/foundation.dart';
import 'package:stroke_care_mobile/mock/mock_api_service.dart';
import 'package:stroke_care_mobile/services/api_service.dart';

late final BaseApiService api;

void setupLocator() {
  if (kDebugMode) {
    api = MockApiService();  // Mock에 _users 맵이 있으니 login 검증이 동작합니다
  } else {
    api = ApiService();
  }
}
