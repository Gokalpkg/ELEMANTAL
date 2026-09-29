import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'boss_component.dart';
import 'boss_state.dart';

/// 6. Forest Dryad (Ulu Orman Ruhu)
/// Weakness: Fire / Storm
/// Attack: Bramble Root Trap (Circle Telegraph & Spores)
/// Phase 2: Nature's Wrath
class ForestDryadBoss extends BossComponent {
  ForestDryadBoss()
      : super(
          bossId: 'forest',
          bossNameTr: 'Ulu Orman Ruhu',
          bossNameEn: 'Ancient Forest Dryad',
          maxHp: 420,
          size: Vector2(74, 74),
        );

  @override
  Future<Map<BossState, SpriteAnimation>> loadBossAnimations() async {
    const col = Color(0xFF16A34A);
    return {
      BossState.idle: await createPlaceholderAnimation(col, 3, 0.2, true),
      BossState.move: await createPlaceholderAnimation(col, 4, 0.14, true),
      BossState.telegraph: await createPlaceholderAnimation(const Color(0xFF76FF03), 2, 0.1, true),
      BossState.attack: await createPlaceholderAnimation(const Color(0xFFBBF7D0), 3, 0.1, false),
      BossState.phaseTransition: await createPlaceholderAnimation(const Color(0xFF4ADE80), 4, 0.15, false),
      BossState.death: await createPlaceholderAnimation(const Color(0xFF14532D), 3, 0.2, false),
    };
  }

  @override
  void renderTelegraph(Canvas canvas) {
    // Circle Bramble Telegraph
    final paint = Paint()
      ..color = const Color(0xFF76FF03).withValues(alpha: 0.4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;
    canvas.drawCircle(Offset(size.x / 2, size.y / 2), 120, paint);
  }

  @override
  void onSpawnAttackHitbox() {
    // Spawns bramble root hazard trap and toxic spore ring
  }

  @override
  void onPhase2Enter() {
    // Nature's Wrath: Thorns aura and lifesteal seed rain
  }
}
