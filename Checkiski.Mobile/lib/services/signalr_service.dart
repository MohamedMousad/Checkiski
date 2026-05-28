import 'package:flutter/foundation.dart';
import 'package:signalr_netcore/signalr_client.dart';

class SignalRService {
  late HubConnection _hubConnection;
  
  static const String hubUrl = 'http://10.0.2.2:5091/chessHub';

  SignalRService() {
    _hubConnection = HubConnectionBuilder()
        .withUrl(hubUrl)
        .build();

    _hubConnection.onclose(({error}) {
      debugPrint("Connection closed. $error");
    });
  }

  Future<void> startConnection() async {
    if (_hubConnection.state == HubConnectionState.Disconnected) {
      try {
        await _hubConnection.start();
        debugPrint("SignalR Connected to $hubUrl");
      } catch (e) {
        debugPrint("Error connecting to SignalR: $e");
      }
    }
  }

  void onGameUpdated(void Function(List<Object?>?) callback) {
    _hubConnection.on("ReceiveGameUpdate", callback);
  }

  Future<void> joinGame(String gameId) async {
    if (_hubConnection.state == HubConnectionState.Connected) {
      await _hubConnection.invoke("JoinGame", args: [gameId]);
    }
  }
}
