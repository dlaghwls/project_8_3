// lib/screens/login_screen.dart

import 'package:flutter/material.dart';
import 'package:stroke_care_mobile/utils/constants.dart';
import 'package:stroke_care_mobile/locator.dart';        // api 전역 인스턴스
import 'package:stroke_care_mobile/screens/signup_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _userCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('로그인')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _userCtrl,
              decoration: const InputDecoration(labelText: 'ID'),
            ),
            TextField(
              controller: _passCtrl,
              decoration: const InputDecoration(labelText: 'PW'),
              obscureText: true,
            ),
            const SizedBox(height: 20),
            _loading
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: () async {
                      final id = _userCtrl.text.trim();
                      final pw = _passCtrl.text.trim();

                      if (id.isEmpty || pw.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('ID / PW를 입력하세요')),
                        );
                        return;
                      }

                      setState(() => _loading = true);
                      try {
                        // 실제 로그인 API 호출
                        await api.login(id, pw);

                        // 로그인 성공 시 홈으로 이동
                        Navigator.pushReplacementNamed(context, Routes.home);
                      } catch (e) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('로그인 실패: $e')),
                        );
                      } finally {
                        if (mounted) setState(() => _loading = false);
                      }
                    },
                    child: const Text('로그인'),
                  ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () {
                Navigator.pushReplacementNamed(context, Routes.signUp);
              },
              child: const Text('계정이 없으신가요? 회원가입'),
            ),
          ],
        ),
      ),
    );
  }
}
