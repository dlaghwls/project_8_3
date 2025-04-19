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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _row('점수', '${check.score}'),
            _row('작성일', check.createdAt.toLocal().toString().split('.')[0]),
            const Divider(height: 32),
            // TODO: 추후 Boolean 항목, moodChoice 등 세부 내용 표시
            const Text('상세 항목은 백엔드 연결 후 추가 예정'),
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
}
