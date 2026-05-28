import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class MainLayout extends StatefulWidget {
  final Widget child;

  const MainLayout({Key? key, required this.child}) : super(key: key);

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _selectedIndex = 1;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0, -0.2),
            radius: 1.2,
            colors: [
              AppColors.backgroundCenter,
              AppColors.backgroundBottom,
              Color(0xFF2A3640),
            ],
            stops: [0.0, 0.6, 1.0],
          ),
        ),
        child: widget.child,
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(40),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
              child: Container(
                height: 70,
                decoration: BoxDecoration(
                  color: AppColors.glassPanel,
                  borderRadius: BorderRadius.circular(40),
                  border: Border.all(color: Colors.white.withOpacity(0.1)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildNavItem(0, Icons.arrow_back_ios_new_rounded),
                    _buildNavItem(1, Icons.track_changes_rounded),
                    _buildNavItem(2, Icons.refresh_rounded),
                    _buildNavItem(3, Icons.chat_bubble_outline_rounded, badgeCount: 5),
                    _buildNavItem(4, Icons.menu_rounded),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, {int? badgeCount}) {
    final isSelected = _selectedIndex == index;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedIndex = index;
        });
      },
      child: Container(
        width: 48,
        height: 48,
        decoration: BoxDecoration(
          color: isSelected ? AppColors.neonCyan : Colors.transparent,
          shape: BoxShape.circle,
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : AppColors.textSecondary,
              size: 24,
            ),
            if (badgeCount != null)
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: AppColors.neonCyan,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    badgeCount.toString(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
