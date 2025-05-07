import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:stroke_care_mobile/locator.dart';
import 'package:stroke_care_mobile/models/message.dart';
import 'package:stroke_care_mobile/models/selfcheck.dart';
import 'package:stroke_care_mobile/providers/auth_provider.dart';
import 'package:stroke_care_mobile/services/base_api_service.dart';
import 'package:stroke_care_mobile/utils/constants.dart';
import 'selfcheck_history_screen.dart';

final api = locator<BaseApiService>();

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Timer? _pollTimer;
  int? _lastMessageId;
  final List<Message> _messages = [];

  @override
  void initState() {
    super.initState();
    _pollTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      _checkNewMessages();
    });
    _checkNewMessages();
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    super.dispose();
  }

  /// ✅ 중복 메시지 제거 (id + createdAt + content 기준)
  Future<void> _checkNewMessages() async {
    final patient = context.read<AuthProvider>().currentPatient;
    try {
      final newMsgs = await api.getMessages(
        patientId: patient.id,
        sinceId: _lastMessageId,
      );

      if (newMsgs.isNotEmpty) {
        setState(() {
          // ✅ 복합 기준으로 중복 제거
          final existingSet = _messages
              .map((m) => '${m.id}_${m.createdAt}_${m.content}')
              .toSet();

          final filtered = newMsgs
              .where((m) =>
                  !existingSet.contains('${m.id}_${m.createdAt}_${m.content}'))
              .toList();

          _messages.insertAll(0, filtered);
          _messages.sort((a, b) => b.createdAt.compareTo(a.createdAt));

          if (_messages.isNotEmpty) {
            _lastMessageId =
                _messages.map((m) => m.id).reduce((a, b) => a > b ? a : b);
          }
        });
      }
    } catch (e) {
      debugPrint('메시지 폴링 중 오류: $e');
    }
  }

  Future<void> _showChatSheet() async {
    await _checkNewMessages();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => DraggableScrollableSheet(
        expand: false,
        builder: (_, ctrl) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
          ),
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 8),
                decoration: BoxDecoration(
                  color: Colors.grey[400],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Expanded(
                child: _messages.isEmpty
                    ? const Center(child: Text('받은 메시지가 없습니다.'))
                    : ListView.builder(
                        controller: ctrl,
                        itemCount: _messages.length,
                        itemBuilder: (_, i) {
                          final m = _messages[i];
                          final sender = m.senderRole == 'nurse' ? '간호사' : '의사';
                          final time = DateFormat('yyyy-MM-dd HH:mm').format(m.createdAt);

                          return Align(
                            alignment: Alignment.centerLeft,
                            child: Container(
                              margin: const EdgeInsets.symmetric(vertical: 4),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.grey[200],
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '$sender • $time',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    m.content,
                                    style: const TextStyle(fontSize: 15),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('홈'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: _showChatSheet,
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              context.read<AuthProvider>().logout();
              Navigator.pushReplacementNamed(context, Routes.login);
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const SelfCheckHistoryScreen(),
                  ),
                );
              },
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.black),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  children: [
                    Expanded(
                      child: Text(
                        '내 자가문진 기록',
                        style: TextStyle(fontSize: 18),
                      ),
                    ),
                    Icon(Icons.arrow_forward_ios, size: 18),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result =
              await Navigator.pushNamed(context, Routes.selfCheckStart);
          if (result is SelfCheck) {
            // 작성 후 처리
          }
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}