import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/lobby_screen.dart';

void main() {
  runApp(const CheckiskiMobileApp());
}

class CheckiskiMobileApp extends StatelessWidget {
  const CheckiskiMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Checkiski Mobile',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const LobbyScreen(),
    );
  }
}
