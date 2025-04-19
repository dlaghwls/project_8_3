// lib/screens/selfcheck_start_screen.dart
// mood → moodChoice, 제출 시 SelfCheck 객체를 홈으로 전달

import 'package:flutter/material.dart';
import 'package:stroke_care_mobile/locator.dart';                 // api 전역
import 'package:stroke_care_mobile/models/selfcheck.dart';       // ★ 새로 추가
import 'package:stroke_care_mobile/models/selfcheck_request.dart';

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

  bool _submitting = false;

  // lib/screens/selfcheck_start_screen.dart

Future<void> _submit() async {
  setState(() => _submitting = true);
  final now = DateTime.now();    // ← 여기에 현재 시각을 저장

  final req = SelfCheckRequest(
    headache: headache,
    dizziness: dizziness,
    numbness: numbness,
    speechDifficulty: speechDifficulty,
    visionBlur: visionBlur,
    nausea: nausea,
    painScore: painScore.toInt(),
    moodChoice: moodChoice,
  );

  try {
    await api.postSelfCheck(req);

    // 이 SelfCheck 객체를 홈 화면으로 돌려보낼 때
    final selfCheck = SelfCheck(
      id: now.microsecondsSinceEpoch,  
      score: req.painScore,
      createdAt: now.toLocal(),       // ← now.toLocal() 로 로컬 타임존 반영
    );

    if (mounted) Navigator.pop(context, selfCheck);
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
            style: Theme.of(context).textTheme.titleMedium, // subtitle1 → titleMedium
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
