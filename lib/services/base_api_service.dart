// lib/services/base_api_service.dart

import 'package:stroke_care_mobile/models/patient.dart';
import 'package:stroke_care_mobile/models/patient_sign_up_request.dart';
import 'package:stroke_care_mobile/models/selfcheck.dart';
import 'package:stroke_care_mobile/models/selfcheck_request.dart';
import 'package:stroke_care_mobile/models/message.dart';
import 'package:stroke_care_mobile/models/message_request.dart';

abstract class BaseApiService {
  Future<Patient> signUp(PatientSignUpRequest req);
  Future<Patient> login(String patientId);
  Future<List<SelfCheck>> getSelfChecks({ required int patientId });
  Future<void> postSelfCheck(SelfCheckRequest req);

  /// 수정된 부분 ───
  /// 환자별 메시지 조회
  Future<List<Message>> getMessages({
    required int patientId,  // ← String receiver → int patientId
    int? sinceId,            // ← 파라미터 이름 sinceId 로 통일
  });

  /// 간호사 메시지 전송
  Future<Message> postMessage(MessageRequest req);  // ← 이름 그대로
}