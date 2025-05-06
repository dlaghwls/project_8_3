// lib/locator.dart
import 'package:get_it/get_it.dart';
import 'package:stroke_care_mobile/services/base_api_service.dart';
import 'package:stroke_care_mobile/services/api_service.dart';

final GetIt locator = GetIt.instance;

void setupLocator() {
  locator.registerLazySingleton<BaseApiService>(() => ApiService());
  locator.registerLazySingleton<ApiService>(() => ApiService());
  // 또는 MockApiService
  // locator.registerLazySingleton<BaseApiService>(() => MockApiService());
}

// 편하게 쓰려면 아래 getter도 추가
BaseApiService get api => locator<BaseApiService>();