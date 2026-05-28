import 'package:flutter/material.dart';
import 'package:flutter_chess_board/flutter_chess_board.dart';
import '../widgets/main_layout.dart';
import '../theme/app_colors.dart';

class ChessboardScreen extends StatefulWidget {
  const ChessboardScreen({Key? key}) : super(key: key);

  @override
  State<ChessboardScreen> createState() => _ChessboardScreenState();
}

class _ChessboardScreenState extends State<ChessboardScreen> {
  final ChessBoardController controller = ChessBoardController();

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            children: [
              // Opponent Profile
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const CircleAvatar(
                        radius: 20,
                        backgroundImage: NetworkImage('https://i.pravatar.cc/150?img=33'),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Tomasz', style: Theme.of(context).textTheme.bodyLarge),
                          Text('Master', style: Theme.of(context).textTheme.bodyMedium),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppColors.glassPanel,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text('Tomasz move', style: Theme.of(context).textTheme.bodyMedium),
                  ),
                ],
              ),
              
              const Spacer(),

              // Chessboard
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    )
                  ]
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: ChessBoard(
                    controller: controller,
                    boardColor: BoardColor.brown,
                    boardOrientation: PlayerColor.white,
                    enableUserMoves: true,
                    onMove: () {
                      // SignalR move broadcast goes here
                    },
                  ),
                ),
              ),

              const Spacer(),

              // Player Profile
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const CircleAvatar(
                        radius: 20,
                        backgroundImage: NetworkImage('https://i.pravatar.cc/150?img=11'),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Jessica', style: Theme.of(context).textTheme.bodyLarge),
                          Text('Junior', style: Theme.of(context).textTheme.bodyMedium),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
              
              const SizedBox(height: 100), // padding for bottom nav
            ],
          ),
        ),
      ),
    );
  }
}
