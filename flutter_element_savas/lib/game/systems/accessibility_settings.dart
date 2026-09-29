enum DamageNumberDisplay { all, onlyCrits, off }

class AccessibilitySettings {
  static final AccessibilitySettings _instance = AccessibilitySettings._internal();
  factory AccessibilitySettings() => _instance;
  AccessibilitySettings._internal();

  double screenShakeMultiplier = 1.0; // 1.0, 0.5, 0.0
  DamageNumberDisplay damageDisplay = DamageNumberDisplay.all;

  void setShake(double factor) {
    screenShakeMultiplier = factor.clamp(0.0, 1.0);
  }

  void setDamageDisplay(DamageNumberDisplay mode) {
    damageDisplay = mode;
  }
}
