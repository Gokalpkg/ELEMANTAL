import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'boss_component.dart';
import 'boss_state.dart';

/// 4. Water Leviathan (Derinlik Lordu)
/// Weakness: Lightning / Fire
/// Attack: Whirlpool / Tsunami (360 Nova Telegraph)
/// Phase 2: Tsunami Lord
class WaterLeviathanBoss extends BossComponent {
  WaterLeviathanBoss()
      : super(
          bossId: 'water',
          bossNameTr: 'Derinlik Lordu Leviathan',
          bossNameEn: 'Abyssal Lord Leviathan',
          maxHp: 480,
          size: Vector2(80, 80),
        );

  @override
  Future<Map<BossState, SpriteAnimation>> loadBossAnimations() async {
    const col = Color(0xFF0369A1);
    return {
      BossState.idle: await createPlaceholderAnimation(col, 3, 0.18, true),
      BossState.move: await createPlaceholderAnimation(col, 4, 0.12, true),
      BossState.telegraph: await createPlaceholderAnimation(const Color(0xFF00B0FF), 2, 0.1, true),
      BossState.attack: await createPlaceholderAnimation(const Color(0xFFE0F2FE), 3, 0.1, false),
      BossState.phaseTransition: await createPlaceholderAnimation(const Color(0xFF38BDF8), 4, 0.15, false),
      BossState.death: await createPlaceholderAnimation(const Color(0xFF082F49), 3, 0.2, false),
    };
  }

  @override
  void renderTelegraph(Canvas canvas) {
    // 360 Nova Circle Telegraph
    final paint = Paint()
      ..color = const Color(0xFF00B0FF).withValues(alpha: 0.35)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4;
    canvas.drawCircle(Offset(size.x / 2, size.y / 2), 160, paint);
  }

  @override
  void onSpawnAttackHitbox() {
    // Spawns 360-degree tidal wave projectiles
  }

  @override
  void onPhase2Enter() {
    // Tsunami Lord: Continuous whirlpool attraction
  }
}
