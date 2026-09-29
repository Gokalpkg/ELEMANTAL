import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'systems/hit_stop_system.dart';
import 'systems/accessibility_settings.dart';
import 'components/player/player_component.dart';
import 'components/bosses/stone_titan.dart';

class ElementGame extends FlameGame {
  final HitStopSystem hitStop = HitStopSystem();
  final AccessibilitySettings accessibility = AccessibilitySettings();

  PlayerComponent? player;
  StoneTitanBoss? currentBoss;

  @override
  Color backgroundColor() => const Color(0xFF0F172A);

  @override
  Future<void> onLoad() async {
    super.onLoad();

    // Initialize player and initial boss
    player = PlayerComponent()..position = Vector2(size.x / 2, size.y * 0.7);
    add(player!);

    currentBoss = StoneTitanBoss()..position = Vector2(size.x / 2, size.y * 0.3);
    add(currentBoss!);
  }

  @override
  void update(double dt) {
    // Hit-stop halts updates when micro-freeze is active
    if (hitStop.update(dt)) {
      return;
    }
    super.update(dt);
  }
}
