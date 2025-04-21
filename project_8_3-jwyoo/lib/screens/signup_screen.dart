// lib/screens/signup_screen.dart

import 'package:flutter/material.dart';
import 'package:stroke_care_mobile/utils/constants.dart';
import 'package:stroke_care_mobile/locator.dart';
import 'package:stroke_care_mobile/services/api_service.dart'; // 나중에 활성화

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});
  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _idCtrl = TextEditingController();
  final _pwCtrl = TextEditingController();
  final _pw2Ctrl = TextEditingController();
  bool _loading = false;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final id = _idCtrl.text.trim();
    final pw = _pwCtrl.text.trim();

    setState(() => _loading = true);
    try {
      // 👉 백엔드 준비되면 이 줄을 활성화하세요.
      await api.signUp(id, pw);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('회원가입 성공! 로그인해주세요.')),
      );
      Navigator.pushReplacementNamed(context, Routes.login);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('회원가입 실패: $e')),
      );
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('회원가입')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _idCtrl,
                decoration: const InputDecoration(labelText: '아이디'),
                validator: (v) =>
                    v == null || v.isEmpty ? '아이디를 입력하세요' : null,
              ),
              TextFormField(
                controller: _pwCtrl,
                decoration: const InputDecoration(labelText: '비밀번호'),
                obscureText: true,
                validator: (v) => v == null || v.length < 6
                    ? '6자 이상 입력하세요'
                    : null,
              ),
              TextFormField(
                controller: _pw2Ctrl,
                decoration:
                    const InputDecoration(labelText: '비밀번호 확인'),
                obscureText: true,
                validator: (v) => v != _pwCtrl.text
                    ? '비밀번호가 일치하지 않습니다'
                    : null,
              ),
              const SizedBox(height: 30),
              _loading
                  ? const CircularProgressIndicator()
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
