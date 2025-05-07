import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:stroke_care_mobile/services/base_api_service.dart';
import 'package:stroke_care_mobile/models/patient.dart';
import 'package:stroke_care_mobile/models/patient_sign_up_request.dart';
import 'package:stroke_care_mobile/models/selfcheck.dart';
import 'package:stroke_care_mobile/models/selfcheck_request.dart';
import 'package:stroke_care_mobile/models/message.dart';
import 'package:stroke_care_mobile/models/message_request.dart';
import 'package:stroke_care_mobile/utils/constants.dart';

class ApiService implements BaseApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: ApiConstants.baseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
    sendTimeout: const Duration(seconds: 30),
  ));
  final _storage = const FlutterSecureStorage();

  // lib/services/api_service.dart
  ApiService() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: 'access_token');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token'; // ✅ 토큰 추가
          }
          return handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            try {
              final refreshToken = await _storage.read(key: 'refresh_token');
              final resp = await Dio().post(
                '${ApiConstants.baseUrl}/token/refresh/',
                data: {'refresh': refreshToken},
              );
              await _storage.write(
                  key: 'access_token', value: resp.data['access']);
              error.requestOptions.headers['Authorization'] =
                  'Bearer ${resp.data['access']}';
              return handler.resolve(await _dio.fetch(error.requestOptions));
            } catch (e) {
              await _storage.deleteAll();
              print('토큰 갱신 실패: 로그아웃 처리');
            }
          }
          return handler.next(error);
        },
      ),
    );
  }

  @override
  Future<Patient> signUp(PatientSignUpRequest req) async {
    try {
      // 회원가입은 토큰 없이 요청
      final dio = Dio(BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: const Duration(seconds: 30),
        validateStatus: (status) => status! < 500, // 500 에러만 예외로 처리
      ));

      if (kDebugMode) {
        print('회원가입 요청: ${req.toJson()}');
      }

      final resp = await dio.post('/patients/', data: req.toJson());

      if (kDebugMode) {
        print('회원가입 응답: ${resp.statusCode}, ${resp.data}');
      }

      if (resp.statusCode == 201 || resp.statusCode == 200) {
        return Patient.fromJson(resp.data);
      } else {
        throw Exception('회원가입 실패: ${resp.statusCode}, ${resp.data}');
      }
    } catch (e) {
      if (kDebugMode) {
        print('회원가입 오류: $e');
      }
      rethrow;
    }
  }

  @override
  Future<Patient> login(String patientId) async {
    try {
      // 로그인도 토큰 없이 요청
      final dio = Dio(BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: const Duration(seconds: 30),
      ));

      final resp = await dio.post(
        '/patients/login/',
        data: {'patient_id': patientId},
      );

      if (kDebugMode) {
        print('로그인 응답: ${resp.statusCode}, ${resp.data}');
      }

      // 토큰 저장
      if (resp.data['access'] != null) {
        await _storage.write(key: 'access_token', value: resp.data['access']);
        if (kDebugMode) {
          print('액세스 토큰 저장됨: ${resp.data['access']}');
        }
      }

      if (resp.data['refresh'] != null) {
        await _storage.write(key: 'refresh_token', value: resp.data['refresh']);
      }

      // patient 키가 있는 경우
      if (resp.data['patient'] != null) {
        return Patient.fromJson(resp.data['patient']);
      }

      // 직접 patient 객체가 반환된 경우
      return Patient.fromJson(resp.data);
    } catch (e) {
      if (kDebugMode) {
        print('로그인 오류: $e');
      }
      rethrow;
    }
  }

  @override
  Future<List<SelfCheck>> getSelfChecks({required int patientId}) async {
    try {
      final resp = await _dio.get(
        '/selfcheck/patient/$patientId/',
        queryParameters: {'patient': patientId},
      );
      return (resp.data as List)
          .map((e) => SelfCheck.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (e) {
      if (kDebugMode) {
        print('자가문진 조회 오류: $e');
      }
      rethrow;
    }
  }

  @override
  Future<void> postSelfCheck(SelfCheckRequest req) async {
    try {
      // 요청 및 응답 상세 로깅 추가
      print('전송 데이터 상세: ${req.toJson()}');

      final resp = await _dio.post(
        '/selfcheck/',
        data: req.toJson(),
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization':
                'Bearer ${await _storage.read(key: 'access_token')}',
          },
        ),
      );

      print('자가문진 저장 성공: ${resp.data}');
    } catch (e) {
      if (e is DioException && e.response != null) {
        // 서버 오류 메시지 상세 출력
        print('서버 응답 상세: ${e.response?.data}');
      }
      print('자가문진 저장 오류: ${e.toString()}');
      rethrow;
    }
  }

  @override
  Future<List<Message>> getMessages({
    int? patientId, // ✅ 필수 필드에서 선택적 필드로 변경
    int? sinceId,
  }) async {
    try {
      final Map<String, dynamic> queryParams = {};

      // ✅ patientId가 있을 때만 추가
      if (patientId != null) {
        queryParams['patient'] = patientId;
      }
      if (sinceId != null) {
        queryParams['since'] = sinceId;
      }

      final resp = await _dio.get(
        '/messages/',
        queryParameters: queryParams, // ✅ 조건부 파라미터
      );
      return (resp.data as List)
          .map((e) => Message.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (e) {
      if (kDebugMode) {
        print('메시지 조회 오류: $e');
      }
      return [];
    }
  }

  @override
  Future<Message> postMessage(MessageRequest req) async {
    try {
      final token = await _storage.read(key: 'access_token');
      final resp = await _dio.post(
        '/messages/',
        data: {
          'receiver': req.receiver, // ✅ Django 필드명과 정확히 일치
          'content': req.content,
        },
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json', // ✅ 명시적 헤더 추가
          },
        ),
      );
      return Message.fromJson(resp.data);
    } catch (e) {
      print('메시지 전송 오류: ${e.toString()}');
      rethrow;
    }
  }
}
