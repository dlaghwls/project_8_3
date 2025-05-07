// lib/screens/selfcheck_start_screen.dart
// mood → moodChoice, 통증 위치 작성 기능 추가, 제출 시 SelfCheck 객체를 홈으로 전달

import 'package:flutter/material.dart';
import 'package:stroke_care_mobile/locator.dart';                 // api 전역
import 'package:stroke_care_mobile/models/selfcheck.dart';       // ★ 새로 추가
import 'package:stroke_care_mobile/models/selfcheck_request.dart';
import 'package:stroke_care_mobile/services/base_api_service.dart';
// ↓ 이 두 줄을 추가 (AuthProvider를 통해 patient PK를 가져오기 위함)
import 'package:provider/provider.dart';                          // ★ 추가
import 'package:stroke_care_mobile/providers/auth_provider.dart'; // ★ 추가

// ← 이 줄은 그대로 두세요
final api = locator<BaseApiService>();

// ✅ mood 한글 → 서버 코드 변환 함수
String _mapMoodToCode(String mood) {
  switch (mood) {
    case '좋음':
      return 'happy';
    case '불안':
      return 'anxious';
    case '우울':
      return 'depressed';
    default:
      return 'happy'; // 기본값
  }
}

class SelfCheckStartScreen extends StatefulWidget {
  const SelfCheckStartScreen({super.key});

  @override
  State<SelfCheckStartScreen> createState() => _SelfCheckStartScreenState();
}

class _SelfCheckStartScreenState extends State<SelfCheckStartScreen> {
  // Boolean 항목들 -------------------------------
  bool headache = false;
  bool dizziness = false;
  bool numbness = false;
  bool speechDifficulty = false;
  bool visionBlur = false;
  bool nausea = false;
  
  // 슬라이더 -------------------------------------
  double painScore = 0;

  // 기분 상태(MOOD_CHOICE) ------------------------
  String moodChoice = '좋음';
  final _moodOptions = ['좋음', '불안', '우울'];

  // 통증 위치 입력 --------------------------------
  final TextEditingController _painLocationController = TextEditingController();

  bool _submitting = false;

  @override
  void dispose() {
    _painLocationController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() => _submitting = true);

    // 로그인된 환자 PK를 AuthProvider에서 가져오기
    final auth = context.read<AuthProvider>();

    // 요청 모델 생성
    final req = SelfCheckRequest(
      patientId: auth.currentPatient.id,           // ★ 추가된 필드
      headache: headache,
      dizziness: dizziness,
      numbness: numbness,
      speechDifficulty: speechDifficulty,
      visionBlur: visionBlur,
      nausea: nausea,
      painScore: painScore.toInt(),
      moodChoice: _mapMoodToCode(moodChoice), 
      painLocation: _painLocationController.text,
    );

    try {
        debugPrint('🚀 자가문진 요청: ${req.toJson()}');  // ✅ 이 줄 추가
        await api.postSelfCheck(req);
        debugPrint('✅ 제출 완료');                      // ✅ 이 줄 추가

      // SelfCheck 객체를 홈 화면으로 돌려보낼 때
      final now = DateTime.now();
      final selfCheck = SelfCheck(
        id: now.microsecondsSinceEpoch,
        patient: auth.currentPatient.id,        
        patientName: auth.currentPatient.name,
        painLocation: req.painLocation, // ★ 전달
        score: req.painScore,
        createdAt: now.toLocal(),       // 현지 시간 반영
      );

      if (mounted) Navigator.pop(context, selfCheck);
    } catch (e, st) {
      debugPrint('✖ POST 에러: $e\n$st');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('제출 실패: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('자가 문진')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _boolTile('두통이 있습니까?', headache, (v) => setState(() => headache = v)),
            _boolTile('어지러움이 있습니까?', dizziness, (v) => setState(() => dizziness = v)),
            _boolTile('팔/다리 저림이 있습니까?', numbness, (v) => setState(() => numbness = v)),
            _boolTile('언어장애가 있습니까?', speechDifficulty, (v) => setState(() => speechDifficulty = v)),
            _boolTile('시야가 흐립니까?', visionBlur, (v) => setState(() => visionBlur = v)),
            _boolTile('메스꺼움/구토가 있습니까?', nausea, (v) => setState(() => nausea = v)),
            const SizedBox(height: 20),
            _sliderTile(),
            const SizedBox(height: 20),
            _moodDropdown(),
            const SizedBox(height: 20),
            // 통증 위치 입력 필드
            TextField(
              controller: _painLocationController,
              decoration: InputDecoration(
                labelText: '통증 위치',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 30),
            _submitting
                ? const CircularProgressIndicator()
                : ElevatedButton.icon(
                    icon: const Icon(Icons.check),
                    label: const Text('제출'),
                    onPressed: _submit,
                  ),
          ],
        ),
      ),
    );
  }

  // ---------- 재사용 위젯 ----------
  Widget _boolTile(String title, bool value, ValueChanged<bool> onChanged) =>
      SwitchListTile(title: Text(title), value: value, onChanged: onChanged);

  Widget _sliderTile() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '통증 강도 (${painScore.toInt()})',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          Slider(
            value: painScore,
            min: 0,
            max: 10,
            divisions: 10,
            label: painScore.toInt().toString(),
            onChanged: (v) => setState(() => painScore = v),
          ),
        ],
      );

  Widget _moodDropdown() => Row(
        children: [
          const Text('현재 기분: '),
          const SizedBox(width: 16),
          DropdownButton<String>(
            value: moodChoice,
            items: _moodOptions
                .map((m) => DropdownMenuItem(value: m, child: Text(m)))
                .toList(),
            onChanged: (v) => setState(() => moodChoice = v!),
          ),
        ],
      );
}