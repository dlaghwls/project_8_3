import 'package:flutter/material.dart';

class AuthProvider extends ChangeNotifier {
  bool _isLoggedIn = false;
  bool get isLoggedIn => _isLoggedIn;

  void setLoggedIn(bool val) {
    _isLoggedIn = val;
    notifyListeners();
  }
}
