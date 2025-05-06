import 'package:flutter/material.dart';
import 'package:stroke_care_mobile/models/selfcheck.dart';

class SelfCheckDetailScreen extends StatelessWidget {
  final SelfCheck check;
  const SelfCheckDetailScreen({super.key, required this.check});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('문진 #${check.id} 상세')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: ListView( // ✅ Column → ListView (스크롤 가능하게)
          children: [
            _row('점수', '${check.score}'),
            _row('작성일', check.createdAt.toLocal().toString().split('.')[0]),
            _row('통증 위치', check.painLocation ?? '미입력'), // ✅ painLocation 표시
            _row('기분 선택', check.moodChoice ?? '미입력'),   // ✅ 기분 표시 (nullable 처리)

            const Divider(height: 32),
            const Text('Boolean 항목'), // ✅ 아래 항목은 예시, 실제 필드에 맞게 수정 필요
            const SizedBox(height: 10),
            _boolRow('두통 있음', check.headache),
            _boolRow('팔/다리 마비 있음', check.paralysis),
            _boolRow('말이 어눌해짐', check.slurredSpeech),
            _boolRow('시야 흐려짐', check.visionBlurred),
          ],
        ),
      ),
    );
  }

  Widget _row(String title, String value) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          children: [
            Text('$title: ', style: const TextStyle(fontWeight: FontWeight.bold)),
            Expanded(child: Text(value)),
          ],
        ),
      );

  // ✅ Boolean 항목 출력용 위젯
  Widget _boolRow(String title, bool? value) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 2),
        child: Row(
          children: [
            const Icon(Icons.circle, size: 6),
            const SizedBox(width: 8),
            Text(title),
            const Spacer(),
            Text(value == true ? '예' : '아니오',
                style: TextStyle(
                  color: value == true ? Colors.red : Colors.grey,
                  fontWeight: FontWeight.bold,
                )),
          ],
        ),
      );
}