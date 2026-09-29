import 'package:flutter/material.dart';
import '../game/element_game.dart';
import '../game/systems/localization_system.dart';

class AncientSanctuaryOverlay extends StatelessWidget {
  final ElementGame game;

  const AncientSanctuaryOverlay({super.key, required this.game});

  @override
  Widget build(BuildContext context) {
    final loc = LocalizationSystem();
    final heroName = loc.heroName;

    return Center(
      child: Container(
        width: 380,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF1E1B4B), Color(0xFF0F172A)],
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFA855F7), width: 2),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFA855F7).withValues(alpha: 0.3),
              blurRadius: 20,
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              loc.get('sanctuary_title'),
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFFFACC15),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              loc.get('sanctuary_welcome').replaceAll('{name}', heroName),
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 12,
                fontStyle: FontStyle.italic,
                color: Color(0xFFE2E8F0),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF9333EA),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () {
                game.overlays.remove('AncientSanctuary');
              },
              child: Text(loc.get('return_combat')),
            ),
          ],
        ),
      ),
    );
  }
}
