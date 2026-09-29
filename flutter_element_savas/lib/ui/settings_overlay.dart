import 'package:flutter/material.dart';
import '../game/element_game.dart';
import '../game/systems/localization_system.dart';

class SettingsOverlay extends StatefulWidget {
  final ElementGame game;

  const SettingsOverlay({super.key, required this.game});

  @override
  State<SettingsOverlay> createState() => _SettingsOverlayState();
}

class _SettingsOverlayState extends State<SettingsOverlay> {
  @override
  Widget build(BuildContext context) {
    final loc = LocalizationSystem();
    final acc = widget.game.accessibility;

    return Center(
      child: Container(
        width: 380,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF38BDF8), width: 1.5),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              loc.get('settings_title'),
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              loc.get('shake_title'),
              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                _optionBtn('100%', acc.screenShakeMultiplier == 1.0, () {
                  setState(() => acc.setShake(1.0));
                }),
                const SizedBox(width: 8),
                _optionBtn('50%', acc.screenShakeMultiplier == 0.5, () {
                  setState(() => acc.setShake(0.5));
                }),
                const SizedBox(width: 8),
                _optionBtn('OFF', acc.screenShakeMultiplier == 0.0, () {
                  setState(() => acc.setShake(0.0));
                }),
              ],
            ),
            const SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: () => widget.game.overlays.remove('Settings'),
                child: const Text('OK'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _optionBtn(String label, bool isSelected, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF0284C7) : Colors.black26,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isSelected ? const Color(0xFF38BDF8) : Colors.white12,
            ),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : Colors.white70,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
