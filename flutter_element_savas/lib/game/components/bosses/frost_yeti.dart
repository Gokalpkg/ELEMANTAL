import 'dart:math';
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'boss_component.dart';
import 'boss_state.dart';

/// 3. Frost Yeti (Kutup Hükümdarı)
/// Weakness: Fire / Lightning
/// Attack: Ice Pillar Smash (Cone Telegraph)
/// Phase 2: Freezing Wrath
class FrostYetiBoss extends BossComponent {
  FrostYetiBoss()
      : super(
          bossId: 'ice',
          bossNameTr: 'Kutup Hükümdarı Yeti',
          bossNameEn: 'Frost Yeti Monarch',
          maxHp: 520,
          size: Vector2(84, 84),
        );

  @override
  Future<Map<BossState, SpriteAnimation>> loadBossAnimations() async {
    const col = Color(0xFF0284C7);
    return {
      BossState.idle: await createPlaceholderAnimation(col, 3, 0.2, true),
      BossState.move: await createPlaceholderAnimation(col, 4, 0.16, true),
      BossState.telegraph: await createPlaceholderAnimation(const Color(0xFF00E5FF), 2, 0.1, true),
      BossState.attack: await createPlaceholderAnimation(const Color(0xFFE0F7FA), 3, 0.12, false),
      BossState.phaseTransition: await createPlaceholderAnimation(const Color(0xFF38BDF8), 4, 0.15, false),
      BossState.death: await createPlaceholderAnimation(const Color(0xFF0C4A6E), 3, 0.2, false),
    };
  }

  @override
  void renderTelegraph(Canvas canvas) {
    // Cone Telegraph for Ice Breath / Pillar Smash
    final paint = Paint()
      ..color = const Color(0xFF00E5FF).withValues(alpha: 0.35)
      ..style = PaintingStyle.fill;
    final path = Path()
      ..moveTo(size.x / 2, size.y / 2)
      ..arcTo(
        Rect.fromCircle(center: Offset(size.x / 2, size.y / 2), radius: 200),
        atan2(facingDirection.y, facingDirection.x) - 0.45,
        0.9,
        false,
      )
      ..close();
    canvas.drawPath(path, paint);
  }

  @override
  void onSpawnAttackHitbox() {
    // Spawns Frost Nova cone and glacier spikes
  }

  @override
  void onPhase2Enter() {
    // Freezing Wrath: Blizzard ground aura
  }
}
