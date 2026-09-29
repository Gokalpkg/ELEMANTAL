import 'dart:math';

/// Global Hit-Stop System
/// Micro-freezes the game engine on heavy impacts, critical strikes, and player damage.
class HitStopSystem {
  static final HitStopSystem _instance = HitStopSystem._internal();
  factory HitStopSystem() => _instance;
  HitStopSystem._internal();

  double _freezeRemainingSeconds = 0.0;

  bool get isFrozen => _freezeRemainingSeconds > 0;

  void trigger(double durationSeconds) {
    _freezeRemainingSeconds = max(_freezeRemainingSeconds, durationSeconds);
  }

  void triggerFrames(int frames) {
    trigger(frames * (1.0 / 60.0));
  }

  /// Returns true if execution was consumed by hit-stop freeze.
  bool update(double dt) {
    if (_freezeRemainingSeconds > 0) {
      _freezeRemainingSeconds -= dt;
      return true;
    }
    return false;
  }
}
