import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.backgroundBottom,
      
      // We use DM Sans as the closest open-source alternative to Google Sans
      textTheme: GoogleFonts.dmSansTextTheme(ThemeData.dark().textTheme).copyWith(
        // We use Cinzel as the closest elegant serif alternative to Imperator Small Caps
        displayLarge: GoogleFonts.cinzel(
          color: AppColors.textPrimary,
          fontSize: 64,
          fontWeight: FontWeight.w400,
          letterSpacing: 2.0,
        ),
        displayMedium: GoogleFonts.cinzel(
          color: AppColors.textPrimary,
          fontSize: 48,
          fontWeight: FontWeight.w400,
        ),
        displaySmall: GoogleFonts.cinzel(
          color: AppColors.textPrimary,
          fontSize: 32,
          fontWeight: FontWeight.w400,
        ),
        bodyLarge: GoogleFonts.dmSans(
          color: AppColors.textPrimary,
          fontSize: 16,
        ),
        bodyMedium: GoogleFonts.dmSans(
          color: AppColors.textSecondary,
          fontSize: 14,
        ),
      ),
      
      colorScheme: const ColorScheme.dark(
        primary: AppColors.neonCyan,
        secondary: AppColors.neonCyan,
        surface: AppColors.glassPanel,
      ),
    );
  }
}
