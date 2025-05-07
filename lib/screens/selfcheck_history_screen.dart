import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:stroke_care_mobile/locator.dart';
import 'package:stroke_care_mobile/models/selfcheck.dart';
import 'package:stroke_care_mobile/providers/auth_provider.dart';
import 'package:stroke_care_mobile/services/base_api_service.dart';

// ✅ 상세 페이지 import
import 'package:stroke_care_mobile/screens/selfcheck_detail_screen.dart';

class SelfCheckHistoryScreen extends StatelessWidget {
  const SelfCheckHistoryScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final patient = context.read<AuthProvider>().currentPatient;
    final api = locator<BaseApiService>();

    return Scaffold(
      appBar: AppBar(title: const Text('내 자가문진 기록')),
      body: FutureBuilder<List<SelfCheck>>(
        future: api.getSelfChecks(patientId: patient.id),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('오류: ${snapshot.error}'));
          }

          final allList = snapshot.data!;
          final list = allList
              .where((c) => c.patient == patient.id)
              .toList();

          if (list.isEmpty) {
            return const Center(child: Text('문진 기록이 없습니다.'));
          }

          list.sort((a, b) => b.id.compareTo(a.id));

          return ListView.separated(
            itemCount: list.length,
            separatorBuilder: (_, __) => const Divider(),
            itemBuilder: (_, i) {
              final c = list[i];
              return ListTile(
                leading: CircleAvatar(child: Text('${c.score}')),
                title: Text('문진 #${c.id}'),
                subtitle: Text(
                  '${c.createdAt.toLocal().toString().split('.')[0]}\n통증 위치: ${c.painLocation}',
                  maxLines: 2,
                ),
                isThreeLine: true,
                onTap: () {
                  // ✅ 문진 항목 클릭 시 상세 페이지로 이동
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => SelfCheckDetailScreen(check: c), // ✅ 수정: check로 넘김
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}