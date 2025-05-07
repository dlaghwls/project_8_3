// lib/screens/signup_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:stroke_care_mobile/locator.dart';
import 'package:stroke_care_mobile/models/patient_sign_up_request.dart';
import 'package:stroke_care_mobile/services/base_api_service.dart';
import 'package:stroke_care_mobile/utils/constants.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _formKey     = GlobalKey<FormState>();
  final _idCtrl      = TextEditingController();
  final _nameCtrl    = TextEditingController();
  String  _gender    = 'M';
  DateTime? _birthDate;
  final _phoneCtrl   = TextEditingController();
  final _addressCtrl = TextEditingController();
  bool _loading      = false;

  final BaseApiService api = locator<BaseApiService>();

  Future<void> _pickBirthDate() async {
    final today = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: today,
      firstDate: DateTime(1900),
      lastDate: today,
      locale: const Locale('ko', 'KR'),
    );
    if (picked != null) {
      setState(() => _birthDate = picked);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_birthDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('생년월일을 선택하세요')),
      );
      return;
    }

    setState(() => _loading = true);

    final req = PatientSignUpRequest(
      patientId : _idCtrl.text.trim(),
      name      : _nameCtrl.text.trim(),
      gender    : _gender,
      birthDate : DateFormat('yyyy-MM-dd').format(_birthDate!),
      phone     : _phoneCtrl.text.trim().isEmpty ? null : _phoneCtrl.text.trim(),
      address   : _addressCtrl.text.trim().isEmpty ? null : _addressCtrl.text.trim(),
    );

    try {
      await api.signUp(req);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('회원가입 성공! 로그인해주세요.')),
      );
      Navigator.pushReplacementNamed(context, Routes.login);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('회원가입 실패: $e')),
      );
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('회원가입')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. 환자등록번호 (8자리 숫자)
              TextFormField(
                controller: _idCtrl,
                decoration: const InputDecoration(
                  labelText: '환자등록번호 (8자리)',
                ),
                keyboardType: TextInputType.number,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(8),
                ],
                validator: (v) =>
                    v == null || v.length != 8 ? '8자리 숫자를 입력하세요' : null,
              ),
              const SizedBox(height: 12),

              // 2. 이름 (validator로 한글·영문·공백만 허용)
              // 수정된 TextFormField
              TextFormField(
                controller: _nameCtrl,
                decoration: const InputDecoration(labelText: '이름'),
                keyboardType: TextInputType.name,
                validator: (v) {
                  if (v == null || v.isEmpty) return '이름을 입력하세요';
                  final pattern = RegExp(r'^[가-힣a-zA-Z\s]+$'); // ✅ 수정된 정규식
                  if (!pattern.hasMatch(v)) {
                    return '한글/영문/공백만 사용 가능합니다';
                  }
                  return null;
                },
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'[가-힣a-zA-Z\s]')), // ✅ 추가
                ],
              ),

              const SizedBox(height: 12),

              // 3. 성별 선택
              DropdownButtonFormField<String>(
                value: _gender,
                decoration: const InputDecoration(labelText: '성별'),
                items: const [
                  DropdownMenuItem(value: 'M', child: Text('남자')),
                  DropdownMenuItem(value: 'F', child: Text('여자')),
                  DropdownMenuItem(value: 'O', child: Text('기타')),
                ],
                onChanged: (v) => setState(() => _gender = v!),
              ),
              const SizedBox(height: 12),

              // 4. 생년월일 선택
              TextFormField(
                readOnly: true,
                decoration: InputDecoration(
                  labelText: '생년월일 (YYYY-MM-DD)',
                  suffixIcon: const Icon(Icons.calendar_today),
                ),
                controller: TextEditingController(
                  text: _birthDate == null
                      ? ''
                      : DateFormat('yyyy-MM-dd').format(_birthDate!),
                ),
                onTap: _pickBirthDate,
              ),
              const SizedBox(height: 12),

              // 5. 전화 (선택)
              TextFormField(
                controller: _phoneCtrl,
                decoration: const InputDecoration(labelText: '전화번호 (선택)'),
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 12),

              // 6. 주소 (선택)
              TextFormField(
                controller: _addressCtrl,
                decoration: const InputDecoration(labelText: '주소 (선택)'),
              ),
              const SizedBox(height: 24),

              // 7. 제출 버튼
              _loading
                  ? const Center(child: CircularProgressIndicator())
                  : ElevatedButton(
                      onPressed: _submit, child: const Text('회원가입')),
              TextButton(
                onPressed: () {
                  Navigator.pushReplacementNamed(context, Routes.login);
                },
                child: const Text('이미 계정이 있나요? 로그인'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}