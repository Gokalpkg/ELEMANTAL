import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'boss_component.dart';
import 'boss_state.dart';

/// 5. Storm Raijin (Yıldırım Titanı)
/// Weakness: Earth / Nature
/// Attack: Static Orb Mines & Lightning Beams
/// Phase 2: Overcharged Core
class StormRaijinBoss extends BossComponent {
  StormRaijinBoss()
      : super(
          bossId: 'storm',
          bossNameTr: 'Yıldırım Titanı Raijin',
          bossNameEn: 'Storm Titan Raijin',
          maxHp: 440,
          size: Vector2(76, 76),
        );

  @override
  Future<Map<BossState, SpriteAnimation>> loadBossAnimations() async {
    const col = Color(0xFFCA8A04);
    return {
      BossState.idle: await createPlaceholderAnimation(col, 3, 0.16, true),
      BossState.move: await createPlaceholderAnimation(col, 4, 0.1, true),
      BossState.telegraph: await createPlaceholderAnimation(const Color(0xFFFFD600), 2, 0.08, true),
      BossState.attack: await createPlaceholderAnimation(const Color(0xFFFEF08A), 3, 0.08, false),
      BossState.phaseTransition: await createPlaceholderAnimation(const Color(0xFFFFFFFF), 4, 0.1, false),
      BossState.death: await createPlaceholderAnimation(const Color(0xFF713F12), 3, 0.2, false),
    };
  }

  @override
  void renderTelegraph(Canvas canvas) {
    // Crosshair beam telegraph
    final paint = Paint()
      ..color = const Color(0xFFFFD600).withValues(alpha: 0.5)
      ..strokeWidth = 12
      ..style = PaintingStyle.stroke;
    canvas.drawLine(
      Offset(size.x / 2, size.y / 2),
      Offset(size.x / 2 + facingDirection.x * 280, size.y / 2 + facingDirection.y * 280),
      paint,
    );
  }

  @override
  void onSpawnAttackHitbox() {
    // Spawns static lightning mines and thunder shockwave
  }

  @override
  void onPhase2Enter() {
    // Overcharged Core: chain lightning sparks
  }
}
