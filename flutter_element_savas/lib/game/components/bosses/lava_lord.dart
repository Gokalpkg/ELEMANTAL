import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'boss_component.dart';
import 'boss_state.dart';

/// 2. Lava Lord (Lav Lordu İfrit)
/// Weakness: Water / Ice
/// Attack: Dash Lava Trail (Line Telegraph & Magma Geysers)
/// Phase 2: Apocalyptic Flame
class LavaLordBoss extends BossComponent {
  LavaLordBoss()
      : super(
          bossId: 'lava',
          bossNameTr: 'Lav Lordu İfrit',
          bossNameEn: 'Lava Lord Ifrit',
          maxHp: 460,
          size: Vector2(76, 76),
        );

  @override
  Future<Map<BossState, SpriteAnimation>> loadBossAnimations() async {
    const col = Color(0xFFEA580C);
    return {
      BossState.idle: await createPlaceholderAnimation(col, 3, 0.18, true),
      BossState.move: await createPlaceholderAnimation(col, 4, 0.12, true),
      BossState.telegraph: await createPlaceholderAnimation(const Color(0xFFFF3D00), 2, 0.1, true),
      BossState.attack: await createPlaceholderAnimation(const Color(0xFFFF9100), 3, 0.1, false),
      BossState.phaseTransition: await createPlaceholderAnimation(const Color(0xFFFFD600), 4, 0.12, false),
      BossState.death: await createPlaceholderAnimation(const Color(0xFF7C2D12), 3, 0.2, false),
    };
  }

  @override
  void renderTelegraph(Canvas canvas) {
    final paint = Paint()
      ..color = const Color(0xFFFF3D00).withValues(alpha: 0.5)
      ..strokeWidth = 32
      ..style = PaintingStyle.stroke;
    canvas.drawLine(
      Offset(size.x / 2, size.y / 2),
      Offset(size.x / 2 + facingDirection.x * 240, size.y / 2 + facingDirection.y * 240),
      paint,
    );
  }

  @override
  void onSpawnAttackHitbox() {
    // Spawns dash flame trail & magma pools
  }

  @override
  void onPhase2Enter() {
    // Apocalyptic Flame: fiery aura and constant embers
  }
}
