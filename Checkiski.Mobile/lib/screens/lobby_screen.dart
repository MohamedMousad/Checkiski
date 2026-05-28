import 'package:flutter/material.dart';
import '../widgets/main_layout.dart';
import '../services/api_service.dart';
import '../theme/app_colors.dart';
import 'chessboard_screen.dart';

class LobbyScreen extends StatefulWidget {
  const LobbyScreen({Key? key}) : super(key: key);

  @override
  State<LobbyScreen> createState() => _LobbyScreenState();
}

class _LobbyScreenState extends State<LobbyScreen> {
  List<dynamic> _leaderboard = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final data = await ApiService.getLeaderboard();
    setState(() {
      _leaderboard = data;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'CHECKISKI',
                        style: Theme.of(context).textTheme.displaySmall,
                      ),
                      Text(
                        'Play like a Grandmaster',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                  const CircleAvatar(
                    radius: 24,
                    backgroundImage: NetworkImage('https://i.pravatar.cc/150?img=11'),
                  ),
                ],
              ),
              const SizedBox(height: 40),
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ChessboardScreen()),
                  );
                },
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 24),
                  decoration: BoxDecoration(
                    color: AppColors.glassPanel,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white.withOpacity(0.1)),
                  ),
                  child: Column(
                    children: [
                      Icon(Icons.play_arrow_rounded, size: 48, color: AppColors.neonCyan),
                      const SizedBox(height: 8),
                      Text(
                        'PLAY NOW',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          letterSpacing: 2.0,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 40),
              Text(
                'Top Players',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: _isLoading
                    ? const Center(child: CircularProgressIndicator(color: AppColors.neonCyan))
                    : ListView.builder(
                        itemCount: _leaderboard.length,
                        itemBuilder: (context, index) {
                          final player = _leaderboard[index];
                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppColors.glassPanel,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Row(
                              children: [
                                Text(
                                  '#${index + 1}',
                                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                    color: AppColors.neonCyan,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Text(
                                    player['username'] ?? 'Unknown',
                                    style: Theme.of(context).textTheme.bodyLarge,
                                  ),
                                ),
                                Text(
                                  '${player['rating']} ELO',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                              ],
                            ),
                          );
                        },
                      ),
              ),
              // Pad bottom for the nav bar
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
    );
  }
}
