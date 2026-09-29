import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'boss_component.dart';
import 'boss_state.dart';

/// 7. Sugar Princess (Şeker Prensesi)
/// Weakness: Earth / Fire
/// Attack: Lollipop Bomb & Pastel Star Barrage
/// Phase 2: Magical Lollipop Rule
class SugarPrincessBoss extends BossComponent {
  SugarPrincessBoss()
      : super(
          bossId: 'sugar',
          bossNameTr: 'Şeker Prensesi',
          bossNameEn: 'Sugar Princess',
          maxHp: 380,
          size: Vector2(68, 68),
        );

  @override
  Future<Map<BossState, SpriteAnimation>> loadBossAnimations() async {
    const col = Color(0xFFDB2777);
    return {
      BossState.idle: await createPlaceholderAnimation(col, 3, 0.18, true),
      BossState.move: await createPlaceholderAnimation(col, 4, 0.12, true),
      BossState.telegraph: await createPlaceholderAnimation(const Color(0xFFFF4081), 2, 0.08, true),
      BossState.attack: await createPlaceholderAnimation(const Color(0xFFFBCFE8), 3, 0.1, false),
      BossState.phaseTransition: await createPlaceholderAnimation(const Color(0xFFF472B6), 4, 0.12, false),
      BossState.death: await createPlaceholderAnimation(const Color(0xFF831843), 3, 0.2, false),
    };
  }

  @override
  void renderTelegraph(Canvas canvas) {
    // Star barrage reticle
    final paint = Paint()
      ..color = const Color(0xFFFF4081).withValues(alpha: 0.45)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(size.x / 2, size.y / 2), 90, paint);
  }

  @override
  void onSpawnAttackHitbox() {
    // Spawns bouncing pastel stars and candy cluster bombs
  }

  @override
  void onPhase2Enter() {
    // Magical Lollipop Rule: Rapid spiral candy barrage
  }
}
