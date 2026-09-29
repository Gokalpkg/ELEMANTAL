import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'boss_component.dart';
import 'boss_state.dart';

/// 9. Night Archon (Karanlık Kontu)
/// Weakness: Fire / Storm
/// Attack: Bat Swarm Nova & Blood Salt Trap
/// Phase 2: True Blood Lord
class NightArchonBoss extends BossComponent {
  NightArchonBoss()
      : super(
          bossId: 'night',
          bossNameTr: 'Karanlık Kontu Archon',
          bossNameEn: 'Night Archon',
          maxHp: 560,
          size: Vector2(78, 78),
        );

  @override
  Future<Map<BossState, SpriteAnimation>> loadBossAnimations() async {
    const col = Color(0xFF7E22CE);
    return {
      BossState.idle: await createPlaceholderAnimation(col, 3, 0.18, true),
      BossState.move: await createPlaceholderAnimation(col, 4, 0.12, true),
      BossState.telegraph: await createPlaceholderAnimation(const Color(0xFFB71C1C), 2, 0.08, true),
      BossState.attack: await createPlaceholderAnimation(const Color(0xFFD8B4FE), 3, 0.1, false),
      BossState.phaseTransition: await createPlaceholderAnimation(const Color(0xFFC084FC), 4, 0.12, false),
      BossState.death: await createPlaceholderAnimation(const Color(0xFF3B0764), 3, 0.2, false),
    };
  }

  @override
  void renderTelegraph(Canvas canvas) {
    // Blood trap circular warning with runic teeth
    final paint = Paint()
      ..color = const Color(0xFFB71C1C).withValues(alpha: 0.5)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;
    canvas.drawCircle(Offset(size.x / 2, size.y / 2), 140, paint);
  }

  @override
  void onSpawnAttackHitbox() {
    // Spawns homing bat swarm and blood vortex trap
  }

  @override
  void onPhase2Enter() {
    // True Blood Lord: Massive wings, blood drain pulse
  }
}
