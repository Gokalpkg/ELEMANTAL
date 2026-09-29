// =============================================================================
// FLAME ENGINE - PLAYER FINITE STATE MACHINE (FSM)
// Package: flutter_flame_core
// Maps directly to Hero Design Sheet: media_1790028339940.jpg
// =============================================================================

import 'package:flame/components.dart';
import 'package:flame/sprite.dart';
import 'package:flutter/services.dart';

enum PlayerState {
  idle,
  run,
  attack,
  hurt,
}

class PlayerHeroFSM extends SpriteAnimationGroupComponent<PlayerState>
    with HasGameRef {
  // Movement & Kinematics
  Vector2 velocity = Vector2.zero();
  double moveSpeed = 160.0;
  bool isFacingLeft = false;

  // Combat & State Machine Timers
  double attackTimer = 0.0;
  final double attackDuration = 0.32; // 3-frame quick combo swing
  int comboStep = 1; // 1: Horizontal, 2: Diagonal, 3: Thrust
  double hurtTimer = 0.0;
  final double hurtDuration = 0.22;

  PlayerHeroFSM({required Vector2 position})
      : super(position: position, size: Vector2(48, 48), anchor: Anchor.center);

  @override
  Future<void> onLoad() async {
    await super.onLoad();

    // Sprite Sheets Slicing Definition (from media_1790028339940.jpg)
    // 1. IDLE Animation: 4 frames, breathing stance with broadsword & shield
    // 2. RUN Animation: 6 frames, rhythmic armored boots walk cycle
    // 3. ATTACK Animation: 3-frame combo with glowing crescent slash trails
    // 4. HURT Animation: 2-frame recoil, flashing red with knockback

    // Note: Bind actual SpriteSheet images loaded via Flame.images
    current = PlayerState.idle;
  }

  @override
  void update(double dt) {
    super.update(dt);

    // 1. State: HURT (Highest Priority - Overrides all inputs)
    if (hurtTimer > 0) {
      hurtTimer -= dt;
      current = PlayerState.hurt;
      if (hurtTimer <= 0) {
        current = PlayerState.idle;
      }
      return; // Lock input while recovering
    }

    // 2. State: ATTACK (Locks movement until combo frame finishes)
    if (attackTimer > 0) {
      attackTimer -= dt;
      current = PlayerState.attack;
      if (attackTimer <= 0) {
        // Return cleanly to Run or Idle based on current joystick velocity
        current = velocity.length > 10 ? PlayerState.run : PlayerState.idle;
      }
      return; // Prevent moonwalking during slash!
    }

    // 3. State: RUN vs IDLE
    if (velocity.length > 10) {
      current = PlayerState.run;
      position += velocity * dt;

      // Flip sprite based on movement direction
      if (velocity.x < 0 && !isFacingLeft) {
        flipHorizontallyAroundCenter();
        isFacingLeft = true;
      } else if (velocity.x > 0 && isFacingLeft) {
        flipHorizontallyAroundCenter();
        isFacingLeft = false;
      }
    } else {
      current = PlayerState.idle;
    }
  }

  /// Trigger 3-Hit Combo Attack
  void attack() {
    if (current == PlayerState.hurt) return; // Cannot attack while in recoil

    attackTimer = attackDuration;
    current = PlayerState.attack;
    comboStep = (comboStep % 3) + 1;

    // Reset animation frame to frame 0 for crisp responsiveness
    animationTicker?.reset();

    // Spawns Crescent Slash VFX on frame 2
  }

  /// Trigger Recoil and Damage
  void takeHit(double damage, Vector2 knockbackDir) {
    hurtTimer = hurtDuration;
    current = PlayerState.hurt;
    animationTicker?.reset();

    // Knockback movement
    position += knockbackDir.normalized() * 12.0;
  }
}
