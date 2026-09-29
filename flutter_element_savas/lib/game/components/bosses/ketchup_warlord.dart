import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'boss_component.dart';
import 'boss_state.dart';

/// 8. Ketchup Warlord (Ketçap Savaş Lordu)
/// Weakness: Water / Ice
/// Attack: Mustard Fire & Ketchup Dash
/// Phase 2: Spicy Wrath
class KetchupWarlordBoss extends BossComponent {
  KetchupWarlordBoss()
      : super(
          bossId: 'ketchup',
          bossNameTr: 'Ketçap Savaş Lordu',
          bossNameEn: 'Ketchup Warlord',
          maxHp: 460,
          size: Vector2(76, 76),
        );

  @override
  Future<Map<BossState, SpriteAnimation>> loadBossAnimations() async {
    const col = Color(0xFFDC2626);
    return {
      BossState.idle: await createPlaceholderAnimation(col, 3, 0.16, true),
      BossState.move: await createPlaceholderAnimation(col, 4, 0.1, true),
      BossState.telegraph: await createPlaceholderAnimation(const Color(0xFFFF1744), 2, 0.08, true),
      BossState.attack: await createPlaceholderAnimation(const Color(0xFFFDE047), 3, 0.1, false),
      BossState.phaseTransition: await createPlaceholderAnimation(const Color(0xFFEF4444), 4, 0.12, false),
      BossState.death: await createPlaceholderAnimation(const Color(0xFF7F1D1D), 3, 0.2, false),
    };
  }

  @override
  void renderTelegraph(Canvas canvas) {
    // Line Dash Telegraph with Mustard border
    final paint = Paint()
      ..color = const Color(0xFFFF1744).withValues(alpha: 0.5)
      ..strokeWidth = 36
      ..style = PaintingStyle.stroke;
    canvas.drawLine(
      Offset(size.x / 2, size.y / 2),
      Offset(size.x / 2 + facingDirection.x * 250, size.y / 2 + facingDirection.y * 250),
      paint,
    );
  }

  @override
  void onSpawnAttackHitbox() {
    // Spawns fast charging dash and mustard projectile shotgun
  }

  @override
  void onPhase2Enter() {
    // Spicy Wrath: Double-speed dash and spicy ground puddle
  }
}
