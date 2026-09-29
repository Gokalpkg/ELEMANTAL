import 'dart:math';
import 'dart:ui';
import 'package:flame/components.dart';
import 'boss_state.dart';

/// Robust generic BossComponent in Flame with strict FSM movement locking.
/// Completely prevents moonwalking/sliding during telegraphs, attacks, and phase transitions.
abstract class BossComponent extends SpriteAnimationGroupComponent<BossState>
    with HasGameReference {
  BossComponent({
    required this.bossId,
    required this.bossNameTr,
    required this.bossNameEn,
    required this.maxHp,
    Vector2? size,
  }) : super(
          size: size ?? Vector2(72, 72),
          anchor: Anchor.center,
        ) {
    currentHp = maxHp;
  }

  final String bossId;
  final String bossNameTr;
  final String bossNameEn;
  final int maxHp;

  int currentHp = 100;
  double moveSpeed = 65.0;
  Vector2 velocity = Vector2.zero();
  Vector2 facingDirection = Vector2(0, 1);

  // FSM Timers
  double telegraphTimer = 0.0;
  double telegraphDuration = 1.2;
  double recoveryTimer = 0.0;
  double attackCooldown = 3.5;

  bool isPhase2 = false;
  bool hasTriggeredHitbox = false;
  int attackHitboxFrame = 2; // Frame index to spawn damage/projectiles

  @override
  Future<void> onLoad() async {
    await super.onLoad();

    // Setup base animations
    animations = await loadBossAnimations();
    current = BossState.idle;

    // Attach animation ticker callbacks to prevent state overlap
    final attackTicker = animationTickers?[BossState.attack];
    if (attackTicker != null) {
      attackTicker.onComplete = () {
        // Cleanly transition to recovery then idle/move
        current = BossState.idle;
        recoveryTimer = 0.35;
      };
    }

    final transitionTicker = animationTickers?[BossState.phaseTransition];
    if (transitionTicker != null) {
      transitionTicker.onComplete = () {
        current = BossState.move;
      };
    }
  }

  /// Must be implemented by subclasses to load specific sprite animations
  Future<Map<BossState, SpriteAnimation>> loadBossAnimations();

  /// Abstract hook for specific boss telegraph visuals (circle, line, cone)
  void renderTelegraph(Canvas canvas);

  /// Abstract hook for specific boss attack hitbox / projectiles
  void onSpawnAttackHitbox();

  /// Abstract hook for specific boss Phase 2 transformation
  void onPhase2Enter();

  /// Initiates the attack sequence flow with strict movement lock
  void executeAttack() {
    if (current == BossState.telegraph ||
        current == BossState.attack ||
        current == BossState.phaseTransition ||
        current == BossState.death) {
      return;
    }

    // Step 1: Enter Telegraph (Zero Velocity)
    current = BossState.telegraph;
    velocity = Vector2.zero();
    telegraphTimer = telegraphDuration;
    hasTriggeredHitbox = false;
  }

  double posture = 0.0;
  double maxPosture = 180.0;
  double staggerTimer = 0.0;

  /// Takes damage, handles Posture buildup, Stagger state, and Phase 2 transition (< 50% HP)
  void takeDamage(int amount) {
    if (current == BossState.death) return;

    // Staggered Execution: 3.0x Damage!
    final effectiveDmg = current == BossState.staggered ? amount * 3 : amount;
    currentHp = max(0, currentHp - effectiveDmg);

    if (currentHp <= 0) {
      current = BossState.death;
      velocity = Vector2.zero();
      return;
    }

    // Build Posture when not staggered
    if (current != BossState.staggered) {
      posture += amount * 1.5;
      if (posture >= maxPosture) {
        // Break Boss Posture: Enter Stagger
        current = BossState.staggered;
        staggerTimer = 2.4;
        posture = 0.0;
        velocity = Vector2.zero();
      }
    }

    // Phase 2 Transition Check
    if (!isPhase2 && currentHp <= (maxHp * 0.5)) {
      isPhase2 = true;
      moveSpeed *= 1.3;
      velocity = Vector2.zero();
      current = BossState.phaseTransition;
      animationTickers?[BossState.phaseTransition]?.reset();
      onPhase2Enter();
    }
  }

  @override
  void update(double dt) {
    super.update(dt);

    if (current == BossState.death) {
      velocity = Vector2.zero();
      return;
    }

    // Handle Staggered state countdown
    if (current == BossState.staggered) {
      velocity = Vector2.zero();
      staggerTimer -= dt;
      if (staggerTimer <= 0) {
        current = BossState.move;
      }
      return;
    }

    // CRITICAL MOVEMENT LOCKING:
    // Boss can ONLY move and change coordinates when current == BossState.move.
    // Velocity is strictly zero in all other states.
    if (current != BossState.move) {
      velocity = Vector2.zero();
    }

    // 1. Telegraph State Handling
    if (current == BossState.telegraph) {
      telegraphTimer -= dt;

      if (telegraphTimer <= 0) {
        // Step 2: Transition to Attack State
        current = BossState.attack;
        hasTriggeredHitbox = false;
        animationTickers?[BossState.attack]?.reset();
      }
      return;
    }

    // 2. Attack State Handling & Hitbox Synchronization
    if (current == BossState.attack) {
      final ticker = animationTickers?[BossState.attack];
      if (ticker != null &&
          !hasTriggeredHitbox &&
          ticker.currentIndex >= attackHitboxFrame) {
        hasTriggeredHitbox = true;
        onSpawnAttackHitbox();
      }
      return;
    }

    // 3. Phase Transition Handling
    if (current == BossState.phaseTransition) {
      return;
    }

    // 4. Recovery Pause Handling
    if (recoveryTimer > 0) {
      recoveryTimer -= dt;
      if (recoveryTimer <= 0) {
        current = BossState.move;
      }
      return;
    }

    // 5. Active Movement State
    if (current == BossState.move) {
      if (velocity.length2 > 0) {
        position += velocity * dt;
        facingDirection = velocity.normalized();
      }
    }
  }

  @override
  void render(Canvas canvas) {
    // Render ground telegraph if winding up
    if (current == BossState.telegraph) {
      renderTelegraph(canvas);
    }
    super.render(canvas);
  }

  /// Helper to create fallback placeholder animations
  Future<SpriteAnimation> createPlaceholderAnimation(
    Color color,
    int frames,
    double stepTime,
    bool loop,
  ) async {
    final recorder = PictureRecorder();
    final canvas = Canvas(recorder);
    final paint = Paint()..color = color;
    canvas.drawCircle(Offset(size.x / 2, size.y / 2), size.x / 2 - 4, paint);
    final img = await recorder.endRecording().toImage(size.x.toInt(), size.y.toInt());
    final sprite = Sprite(img);
    return SpriteAnimation.spriteList(
      List.generate(frames, (_) => sprite),
      stepTime: stepTime,
      loop: loop,
    );
  }
}
