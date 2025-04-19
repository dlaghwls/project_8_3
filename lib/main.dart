import 'package:flutter/material.dart';
// import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:stroke_care_mobile/screens/selfcheck_start_screen.dart';
import 'package:stroke_care_mobile/screens/selfcheck_detail_screen.dart';
// import 'services/api_service.dart';
import 'utils/constants.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'providers/auth_provider.dart';
import 'package:stroke_care_mobile/locator.dart'; 
import 'package:stroke_care_mobile/models/selfcheck.dart';
import 'screens/signup_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // await Firebase.initializeApp();
  setupLocator();  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp(
        title: 'StrokeCare+',
        theme: ThemeData(primarySwatch: Colors.blue),
        initialRoute: Routes.login,
        routes: {
  Routes.login          : (_) => const LoginScreen(),
  Routes.signUp  : (_) => const SignUpScreen(),   
  Routes.home           : (_) => const HomeScreen(),
  Routes.selfCheckStart : (_) => const SelfCheckStartScreen(),
  // detail 화면은 arguments로 SelfCheck 객체를 전달
  Routes.selfCheckDetail: (ctx) {
    final check = ModalRoute.of(ctx)!.settings.arguments as SelfCheck;
    return SelfCheckDetailScreen(check: check);
  },
},
));
}
}
