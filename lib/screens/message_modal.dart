import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:stroke_care_mobile/providers/message_provider.dart';
import 'package:stroke_care_mobile/models/message.dart';

class MessageModal extends StatefulWidget {
  final int patientId;

  const MessageModal({super.key, required this.patientId});

  @override
  State<MessageModal> createState() => _MessageModalState();
}

class _MessageModalState extends State<MessageModal> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      final provider = Provider.of<MessageProvider>(context, listen: false);
      provider.loadMessages(patientId: widget.patientId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<MessageProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        final messages = provider.messages;

        if (messages.isEmpty) {
          return const Center(child: Text('메시지가 없습니다.'));
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: messages.length,
          itemBuilder: (context, index) {
            final msg = messages[index];
            final sender = msg.senderRole == 'nurse' ? '간호사' : '의사';
            final timeStr = DateFormat('yyyy-MM-dd HH:mm').format(msg.createdAt);

            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '$sender • $timeStr',
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    msg.content,
                    style: const TextStyle(fontSize: 15),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}