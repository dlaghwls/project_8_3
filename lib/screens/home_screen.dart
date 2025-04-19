// lib/screens/home_screen.dart
import 'package:flutter/material.dart';
import 'package:stroke_care_mobile/locator.dart';
import 'package:stroke_care_mobile/models/selfcheck.dart';
import 'package:stroke_care_mobile/utils/constants.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<List<SelfCheck>> _futureChecks;

  @override
  void initState() {
    super.initState();
    _futureChecks = _loadSelfChecks();
  }

  Future<List<SelfCheck>> _loadSelfChecks() async {
    try {
      final checks = await api.getSelfChecks()
          .timeout(const Duration(seconds: 5));
      return checks;
    } catch (e, st) {
      debugPrint('<< SELF‑CHECK LOAD ERROR >> $e\n$st');
      rethrow;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('자가 문진 기록'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.pushReplacementNamed(context, Routes.login);
            },
          ),
        ],
      ),
      body: FutureBuilder<List<SelfCheck>>(
        future: _futureChecks,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Text(
                '오류 발생:\n${snapshot.error}',
                textAlign: TextAlign.center,
              ),
            );
          }

          final checks = snapshot.data!;
          if (checks.isEmpty) {
            return const Center(child: Text('아직 기록된 문진이 없습니다.'));
          }

          return ListView.separated(
            itemCount: checks.length,
            separatorBuilder: (_, __) => const Divider(),
            itemBuilder: (context, i) {
              final c = checks[i];
              // UTC→KST: +9시간
              final kst = c.createdAt.toUtc().add(const Duration(hours: 9));
              final ts = kst.toString().split('.')[0];
              return ListTile(
                leading: CircleAvatar(child: Text('${c.score}')),
                title: Text('문진 #${c.id}'),
                subtitle: Text('작성일: $ts'),
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    Routes.selfCheckDetail,
                    arguments: c,
                  );
                },
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result =
              await Navigator.pushNamed(context, Routes.selfCheckStart);

          if (result is SelfCheck) {
            setState(() {
              _futureChecks =
                  _futureChecks.then((list) => [result, ...list]);
            });
          }
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
