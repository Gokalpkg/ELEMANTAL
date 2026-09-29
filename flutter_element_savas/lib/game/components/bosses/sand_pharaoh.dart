import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'boss_component.dart';
import 'boss_state.dart';

/// 10. Sand Pharaoh (Kum Akrep Firavunu)
/// Weakness: Water / Nature
/// Attack: Golden Sand Dust & Emerald Venom (Burrow & Stinger Strike)
/// Phase 2: Sand Vortex Guard
class SandPharaohBoss extends BossComponent {
  SandPharaohBoss()
      : super(
          bossId: 'sand',
          bossNameTr: 'Kum Firavunu Akrep',
          bossNameEn: 'Scorpion Sand Pharaoh',
          maxHp: 500,
          size: Vector2(80, 80),
        );

  @override
  Future<Map<BossState, SpriteAnimation>> loadBossAnimations() async {
    const col = Color(0xFFD97706);
    return {
      BossState.idle: await createPlaceholderAnimation(col, 3, 0.2, true),
      BossState.move: await createPlaceholderAnimation(col, 4, 0.14, true),
      BossState.telegraph: await createPlaceholderAnimation(const Color(0xFFFFB300), 2, 0.08, true),
      BossState.attack: await createPlaceholderAnimation(const Color(0xFFFEF3C7), 3, 0.1, false),
      BossState.phaseTransition: await createPlaceholderAnimation(const Color(0xFFFBBF24), 4, 0.12, false),
      BossState.death: await createPlaceholderAnimation(const Color(0xFF78350F), 3, 0.2, false),
    };
  }

  @override
  void renderTelegraph(Canvas canvas) {
    // Quicksand circular indicator
    final paint = Paint()
      ..color = const Color(0xFFFFB300).withValues(alpha: 0.4)
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke;
    canvas.drawCircle(Offset(size.x / 2, size.y / 2), 130, paint);
  }

  @override
  void onSpawnAttackHitbox() {
    // Spawns stinger venom shockwave and quicksand whirlpool
  }

  @override
  void onPhase2Enter() {
    // Sand Vortex Guard: Sandstorm aura obscuring surroundings
  }
}
