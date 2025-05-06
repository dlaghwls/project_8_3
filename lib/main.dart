// lib/main.dart

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'package:stroke_care_mobile/locator.dart';
import 'package:stroke_care_mobile/utils/constants.dart';
import 'package:stroke_care_mobile/providers/auth_provider.dart';
import 'package:stroke_care_mobile/providers/message_provider.dart';
import 'package:stroke_care_mobile/models/selfcheck.dart';
import 'package:stroke_care_mobile/screens/login_screen.dart';
import 'package:stroke_care_mobile/screens/signup_screen.dart';
import 'package:stroke_care_mobile/screens/home_screen.dart';
import 'package:stroke_care_mobile/screens/selfcheck_start_screen.dart';
import 'package:stroke_care_mobile/screens/selfcheck_detail_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  setupLocator();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  // 키 파라미터 추가
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      // ← 여기에 providers: 네임드 인자를 꼭 붙여야 합니다.
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => MessageProvider()),
      ],
      child: MaterialApp(
        title: 'StrokeCare+',
        theme: ThemeData(primarySwatch: Colors.blue),

        localizationsDelegates: const [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        supportedLocales: const [
          Locale('ko', 'KR'),
          Locale('en', 'US'),
        ],

        initialRoute: Routes.login,
        routes: {
          Routes.login          : (_) => const LoginScreen(),
          Routes.signUp         : (_) => const SignUpScreen(),
          Routes.home           : (_) => const HomeScreen(),
          Routes.selfCheckStart : (_) => const SelfCheckStartScreen(),
          Routes.selfCheckDetail: (ctx) {
            final check = ModalRoute.of(ctx)!.settings.arguments as SelfCheck;
            return SelfCheckDetailScreen(check: check);
          },
        },
      ),
    );
  }
}