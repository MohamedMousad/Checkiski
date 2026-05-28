import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Use 10.0.2.2 for Android Emulator, or localhost for Chrome/Windows.
  static const String baseUrl = 'http://10.0.2.2:5091/api';

  static Future<List<dynamic>> getLeaderboard() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/Player/leaderboard'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to load leaderboard');
      }
    } catch (e) {
      print('Error fetching leaderboard: $e');
      return [];
    }
  }

  static Future<List<dynamic>> getLiveGames() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/Game/list'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to load live games');
      }
    } catch (e) {
      print('Error fetching live games: $e');
      return [];
    }
  }
}
