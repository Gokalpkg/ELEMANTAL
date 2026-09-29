import 'dart:math';
import 'dart:ui';
import 'package:flame/components.dart';
import 'hero_state.dart';

/// Robust Player Component extending SpriteAnimationGroupComponent<HeroState>
/// Enforces strict FSM animation locking, i-frame dashing, and movement prevention during attacks.
class PlayerComponent extends SpriteAnimationGroupComponent<HeroState>
    with HasGameReference {
  PlayerComponent()
      : super(
          size: Vector2(48, 48),
          anchor: Anchor.center,
        );

  // Stats & Movement
  double moveSpeed = 160.0;
  Vector2 velocity = Vector2.zero();
  Vector2 facingDirection = Vector2(1, 0);

  // States & Locks
  bool isMovementLocked = false;
  double invulnerabilityTimer = 0.0;
  double dashTimer = 0.0;
  static const double dashDuration = 0.4;
  static const double dashSpeedMultiplier = 2.8;

  // Auto-Attack Range (Halved indicator circle)
  double autoAttackRange = 130.0;

  // Build Game Changer Relics
  bool isGlassCannon = false;
  bool isBloodPact = false;
  bool isMagnetNova = false;

  bool get isInvulnerable => invulnerabilityTimer > 0;

  @override
  Future<void> onLoad() async {
    await super.onLoad();

    // Map each HeroState to its SpriteAnimation
    animations = {
      HeroState.idle: await _createOrLoadAnimation('hero_idle.png', 3, 0.18, true),
      HeroState.run: await _createOrLoadAnimation('hero_run.png', 4, 0.12, true),
      HeroState.attack: await _createOrLoadAnimation('hero_attack.png', 3, 0.10, false),
      HeroState.dash: await _createOrLoadAnimation('hero_dash.png', 2, 0.20, true),
      HeroState.hurt: await _createOrLoadAnimation('hero_hurt.png', 2, 0.15, false),
    };

    current = HeroState.idle;

    // Attach animation ticker callbacks to prevent overlapping states
    final attackTicker = animationTickers?[HeroState.attack];
    if (attackTicker != null) {
      attackTicker.onComplete = () {
        // Unlock movement when attack animation completes cleanly
        isMovementLocked = false;
        if (velocity.length2 > 0) {
          current = HeroState.run;
        } else {
          current = HeroState.idle;
        }
      };
    }

    final hurtTicker = animationTickers?[HeroState.hurt];
    if (hurtTicker != null) {
      hurtTicker.onComplete = () {
        isMovementLocked = false;
        current = velocity.length2 > 0 ? HeroState.run : HeroState.idle;
      };
    }
  }

  /// Initiates an attack.
  /// Locks movement and prevents attacking again until animation strictly finishes.
  void attack() {
    if (isMovementLocked || current == HeroState.attack) return;

    isMovementLocked = true;
    velocity = Vector2.zero();
    current = HeroState.attack;

    // Reset ticker to start frame 0 cleanly
    animationTickers?[HeroState.attack]?.reset();
  }

  /// Initiates a swift dash with 0.4 seconds of invulnerability (I-Frames).
  void dash() {
    if (isMovementLocked && current == HeroState.attack) return;

    invulnerabilityTimer = dashDuration;
    dashTimer = dashDuration;
    current = HeroState.dash;

    // Swift movement in current facing direction
    final dir = facingDirection.normalized();
    velocity = dir * (moveSpeed * dashSpeedMultiplier);
  }

  /// Applies damage unless player is within I-Frames
  void takeDamage(int amount) {
    if (isInvulnerable || current == HeroState.hurt) return;

    invulnerabilityTimer = 0.5; // Brief post-hit grace period
    isMovementLocked = true;
    velocity = Vector2.zero();
    current = HeroState.hurt;
    animationTickers?[HeroState.hurt]?.reset();
  }

  @override
  void update(double dt) {
    super.update(dt);

    // Update invulnerability timer
    if (invulnerabilityTimer > 0) {
      invulnerabilityTimer = max(0.0, invulnerabilityTimer - dt);
    }

    // Handle Active Dash
    if (dashTimer > 0) {
      dashTimer = max(0.0, dashTimer - dt);
      position += velocity * dt;

      if (dashTimer <= 0) {
        current = velocity.length2 > 0 ? HeroState.run : HeroState.idle;
      }
      return;
    }

    // If movement is locked (during Attack or Hurt), do not update position
    if (isMovementLocked) {
      velocity = Vector2.zero();
      return;
    }

    // Standard Movement
    if (velocity.length2 > 0) {
      position += velocity * dt;
      facingDirection = velocity.normalized();

      // Flip sprite based on movement direction
      if (facingDirection.x < 0 && scale.x > 0) {
        flipHorizontallyAroundCenter();
      } else if (facingDirection.x > 0 && scale.x < 0) {
        flipHorizontallyAroundCenter();
      }

      if (current != HeroState.run && current != HeroState.attack) {
        current = HeroState.run;
      }
    } else {
      if (current != HeroState.idle && current != HeroState.attack) {
        current = HeroState.idle;
      }
    }
  }

  @override
  void render(Canvas canvas) {
    // 1. Soft Elliptical Drop Shadow Under Hero Feet
    final shadowPaint = Paint()..color = const Color(0x99000000);
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(size.x / 2, size.y - 2),
        width: size.x * 0.75,
        height: size.y * 0.3,
      ),
      shadowPaint,
    );

    // 2. Run Tilt Lean (6-7 degrees into movement direction)
    if (current == HeroState.run && velocity.length2 > 0) {
      canvas.save();
      final tilt = facingDirection.x < 0 ? -0.11 : 0.11;
      canvas.translate(size.x / 2, size.y / 2);
      canvas.rotate(tilt);
      canvas.translate(-size.x / 2, -size.y / 2);
      super.render(canvas);
      canvas.restore();
      return;
    }

    // 3. Relic Visual Auras
    if (isGlassCannon) {
      final glassPaint = Paint()
        ..color = const Color(0x99C084FC)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.0;
      canvas.drawCircle(Offset(size.x / 2, size.y / 2), size.x * 0.65, glassPaint);
    }
    if (isBloodPact) {
      final bloodPaint = Paint()
        ..color = const Color(0x99EF4444)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.0;
      canvas.drawCircle(Offset(size.x / 2, size.y / 2), size.x * 0.6, bloodPaint);
    }
    if (isMagnetNova) {
      final magnetPaint = Paint()
        ..color = const Color(0x99FACC15)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.8;
      canvas.drawCircle(Offset(size.x / 2, size.y / 2), size.x * 0.7, magnetPaint);
    }

    super.render(canvas);
  }

  /// Helper to load animation or generate placeholder frames if asset is missing
  Future<SpriteAnimation> _createOrLoadAnimation(
    String path,
    int frames,
    double stepTime,
    bool loop,
  ) async {
    try {
      final img = await game.images.load(path);
      final frameWidth = img.width / frames;
      return SpriteAnimation.fromFrameData(
        img,
        SpriteAnimationData.sequenced(
          amount: frames,
          stepTime: stepTime,
          textureSize: Vector2(frameWidth, img.height.toDouble()),
          loop: loop,
        ),
      );
    } catch (_) {
      // Fallback: Generate clean procedural placeholder animation
      final recorder = PictureRecorder();
      final canvas = Canvas(recorder);
      final paint = Paint()..color = const Color(0xFF38BDF8);
      canvas.drawCircle(const Offset(24, 24), 18, paint);
      final img = await recorder.endRecording().toImage(48, 48);

      final sprite = Sprite(img);
      final spriteList = List.generate(frames, (_) => sprite);
      return SpriteAnimation.spriteList(
        spriteList,
        stepTime: stepTime,
        loop: loop,
      );
    }
  }
}
