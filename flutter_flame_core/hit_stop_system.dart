// =============================================================================
// FLAME ENGINE - HIT-STOP (MICRO-FREEZE) SYSTEM
// Package: flutter_flame_core
// Game-feel impact pauses (Hades / Dead Cells / Smash Bros style)
// =============================================================================

class HitStopManager {
  static final HitStopManager _instance = HitStopManager._internal();
  factory HitStopManager() => _instance;
  HitStopManager._internal();

  double _freezeTimer = 0.0;

  bool get isFrozen => _freezeTimer > 0;

  /// Trigger micro-freeze in seconds (default: 0.08s for normal hits, 0.12s for criticals)
  void trigger({double duration = 0.08}) {
    if (duration > _freezeTimer) {
      _freezeTimer = duration;
    }
  }

  /// Called in main game loop before updating game components
  bool update(double dt) {
    if (_freezeTimer > 0) {
      _freezeTimer -= dt;
      return false; // Skips update on other components to freeze frame!
    }
    return true; // Proceed with normal update
  }
}
