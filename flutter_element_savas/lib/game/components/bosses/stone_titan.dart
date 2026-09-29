import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'boss_component.dart';
import 'boss_state.dart';

/// 1. Stone Titan (Kadim Taş Titanı)
/// Weakness: Earth / Water
/// Attack: Seismic Fissure (Line Telegraph)
/// Phase 2: Overcharged Runic Core
class StoneTitanBoss extends BossComponent {
  StoneTitanBoss()
      : super(
          bossId: 'stone',
          bossNameTr: 'Kadim Taş Titanı',
          bossNameEn: 'Ancient Stone Titan',
          maxHp: 400,
          size: Vector2(80, 80),
        );

  @override
  Future<Map<BossState, SpriteAnimation>> loadBossAnimations() async {
    const col = Color(0xFF78716C);
    return {
      BossState.idle: await createPlaceholderAnimation(col, 3, 0.2, true),
      BossState.move: await createPlaceholderAnimation(col, 4, 0.15, true),
      BossState.telegraph: await createPlaceholderAnimation(const Color(0xFFA8A29E), 2, 0.1, true),
      BossState.attack: await createPlaceholderAnimation(const Color(0xFFD6D3D1), 3, 0.12, false),
      BossState.phaseTransition: await createPlaceholderAnimation(const Color(0xFF00E5FF), 4, 0.15, false),
      BossState.death: await createPlaceholderAnimation(const Color(0xFF44403C), 3, 0.2, false),
    };
  }

  @override
  void renderTelegraph(Canvas canvas) {
    // Line Telegraph for Seismic Fissure
    final paint = Paint()
      ..color = const Color(0xFFFF1744).withValues(alpha: 0.45)
      ..strokeWidth = 24
      ..style = PaintingStyle.stroke;
    canvas.drawLine(
      Offset(size.x / 2, size.y / 2),
      Offset(size.x / 2 + facingDirection.x * 220, size.y / 2 + facingDirection.y * 220),
      paint,
    );
  }

  @override
  void onSpawnAttackHitbox() {
    // Spawns Seismic Fissure ground rupture line
  }

  @override
  void onPhase2Enter() {
    // Overcharged Runic Core: gains cyan glow and faster slam rate
  }
}
