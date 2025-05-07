import 'dart:async';

import 'package:stroke_care_mobile/models/selfcheck.dart';
import 'package:stroke_care_mobile/models/selfcheck_request.dart';
import 'package:stroke_care_mobile/models/patient.dart';
import 'package:stroke_care_mobile/models/patient_sign_up_request.dart';
import 'package:stroke_care_mobile/models/message.dart';
import 'package:stroke_care_mobile/models/message_request.dart';
import 'package:stroke_care_mobile/services/base_api_service.dart';

class MockApiService implements BaseApiService {
  final Map<String, Patient> _users = {};
  final List<SelfCheck> _cache = [];
  final List<Message> _messages = [];

  // ───────── 가입 / 로그인 ─────────
  @override
  Future<Patient> signUp(PatientSignUpRequest req) async {
    await Future.delayed(const Duration(milliseconds: 500));
    if (_users.containsKey(req.patientId)) {
      throw Exception('이미 가입된 등록번호입니다.');
    }
    final now = DateTime.now();
    final patient = Patient(
      id: _users.length + 1,
      patientId: req.patientId,
      name: req.name,
      gender: req.gender,
      birthDate: DateTime.parse(req.birthDate),
      phone: req.phone,
      address: req.address,
      createdAt: now,
    );
    _users[req.patientId] = patient;
    return patient;
  }

  @override
  Future<Patient> login(String patientId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final patient = _users[patientId];
    if (patient == null) throw Exception('등록번호가 없습니다.');
    return patient;
  }

  // ───────── 자가문진 ─────────
  @override
  Future<List<SelfCheck>> getSelfChecks({required int patientId}) async {
    await Future.delayed(const Duration(milliseconds: 400));
    return _cache.where((c) => c.patient == patientId).toList().reversed.toList();
  }

  @override
  Future<void> postSelfCheck(SelfCheckRequest req) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final now = DateTime.now();
    _cache.add(SelfCheck(
      id: now.microsecondsSinceEpoch,
      patient: req.patientId,
      patientName: '', // 실제 이름은 생략
      score: req.painScore,
      createdAt: now,
      painLocation: req.painLocation,
    ));
  }

  // ───────── 메시지 폴링 ─────────
  @override
  Future<List<Message>> getMessages({
    required int patientId,
    int? sinceId,
  }) async {
    await Future.delayed(const Duration(milliseconds: 300));
    var list = _messages.where((m) => m.patient == patientId);
    if (sinceId != null) {
      list = list.where((m) => m.id > sinceId);
    }
    return List.from(list);
  }

  // ───────── 메시지 전송 ─────────
  @override
  Future<Message> postMessage(MessageRequest req) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final now = DateTime.now();
    final msg = Message(
      id: now.microsecondsSinceEpoch,
      patient: req.patient,
      selfcheck: req.selfcheck,
      senderRole: req.senderRole,
      content: req.content,
      createdAt: now,
    );
    _messages.add(msg);
    return msg;
  }
}