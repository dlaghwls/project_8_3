// lib/screens/login_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:stroke_care_mobile/locator.dart';
import 'package:stroke_care_mobile/services/base_api_service.dart';
import 'package:stroke_care_mobile/utils/constants.dart';
import 'package:provider/provider.dart'; // ✅ 이거 추가!
import 'package:stroke_care_mobile/providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _idCtrl  = TextEditingController();
  bool _loading  = false;
  final api = locator<BaseApiService>();

  Future<void> _submit() async {
  if (!_formKey.currentState!.validate()) return;
  setState(() => _loading = true);
  try {
    debugPrint('▶ 로그인 요청: ${_idCtrl.text.trim()}');
    final patient = await api.login(_idCtrl.text.trim());
    debugPrint('▶ 로그인 성공: ${patient.name}');
    context.read<AuthProvider>().setCurrentPatient(patient); // ✅ 이 줄 추가
    Navigator.pushReplacementNamed(context, Routes.home, arguments: patient);
  } catch (e, st) {
    debugPrint('✖ 로그인 오류: $e\n$st');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('로그인 실패: $e')),
    );
  } finally {
    setState(() => _loading = false);
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('로그인')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
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
                validator: (v) => v == null || v.length != 8
                  ? '8자리 숫자를 입력하세요' : null,
              ),
              const SizedBox(height: 24),

              // 로그인 버튼
              _loading
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _submit,
                    child: const Text('로그인'),
                  ),

              // **회원가입 버튼 추가**
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, Routes.signUp);
                },
                child: const Text('회원가입'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}