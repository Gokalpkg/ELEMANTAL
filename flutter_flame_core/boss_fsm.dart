// =============================================================================
// FLAME ENGINE - BOSS FINITE STATE MACHINE (FSM) & TELEGRAPH SYNC
// Package: flutter_flame_core
// Maps to Boss Sheets: Stone Titan, Lava Lord, Frost Yeti, Leviathan, Raijin, Archon
// =============================================================================

import 'package:flame/components.dart';

enum BossState {
  idle,
  chase,
  windup,     // Telegraphing glowing circles / fissure corridors
  swing,      // Release frame: spawns actual projectiles & hitboxes
  recovery,   // Brief opening for player counter-attack
  hurt,
  enraged,    // Phase 2 transition
}

class BossFSM extends PositionComponent with HasGameRef {
  BossState state = BossState.idle;

  // AI & Attack Timers
  double stateTimer = 0.0;
  final double windupDuration = 0.65;   // 0.65s telegraphing phase
  final double swingDuration = 0.20;    // Active damage frames
  final double recoveryDuration = 0.40; // Cooldown opening

  bool isPhase2 = false;
  double maxHp = 500;
  double currentHp = 500;

  // Attack Type
  String currentAttackKind = 'fissure'; // e.g., 'fissure', 'geyser', 'orb_mine'

  BossFSM({required Vector2 position}) : super(position: position);

  @override
  void update(double dt) {
    super.update(dt);

    switch (state) {
      case BossState.idle:
      case BossState.chase:
        // Move towards target player
        break;

      case BossState.windup:
        stateTimer -= dt;
        // Boss stays rooted in place, raising weapon
        // Glowing warning circles / telegraphs render on screen
        if (stateTimer <= 0) {
          triggerReleaseSwing();
        }
        break;

      case BossState.swing:
        stateTimer -= dt;
        if (stateTimer <= 0) {
          state = BossState.recovery;
          stateTimer = recoveryDuration;
        }
        break;

      case BossState.recovery:
        stateTimer -= dt;
        if (stateTimer <= 0) {
          state = BossState.chase;
        }
        break;

      case BossState.hurt:
        stateTimer -= dt;
        if (stateTimer <= 0) {
          state = BossState.chase;
        }
        break;

      case BossState.enraged:
        stateTimer -= dt;
        if (stateTimer <= 0) {
          state = BossState.chase;
        }
        break;
    }
  }

  /// Start telegraphed attack sequence
  void startTelegraphedAttack(String attackKind) {
    currentAttackKind = attackKind;
    state = BossState.windup;
    stateTimer = windupDuration;
    // Show glowing warning circles or ground fissure telegraphs
  }

  /// Exact frame where the boss releases damage hitboxes
  void triggerReleaseSwing() {
    state = BossState.swing;
    stateTimer = swingDuration;

    // 1. Spawn actual damage projectiles / hitboxes
    // 2. Trigger screen shake
    // 3. Trigger 0.08s Hit-Stop if hitting player
  }
}
