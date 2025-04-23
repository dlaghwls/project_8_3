// lib/services/api_service.dart
import 'package:dio/dio.dart';
import 'package:stroke_care_mobile/mock/mock_api_service.dart' show BaseApiService;
import 'package:stroke_care_mobile/models/selfcheck.dart';
import 'package:stroke_care_mobile/models/selfcheck_request.dart';
import 'package:stroke_care_mobile/utils/constants.dart';

class ApiService implements BaseApiService {
  final Dio _dio = Dio(BaseOptions(baseUrl: ApiConstants.baseUrl));

  @override
  Future<void> login(String id, String pw) async {
    await _dio.post(
      '/token/',
      data: {'username': id, 'password': pw},
    );
  }

  @override
  Future<void> signUp(String id, String pw) async {
    await _dio.post(
      '/signup/',
      data: {'username': id, 'password': pw},
    );
  }

  @override
  Future<List<SelfCheck>> getSelfChecks() async {
    final resp = await _dio.get('/selfcheck/');
    final raw = resp.data as List<dynamic>;
    return raw
        .map((e) => SelfCheck.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<void> postSelfCheck(SelfCheckRequest req) async {
    await _dio.post('/selfcheck/', data: req.toJson());
  }
}
