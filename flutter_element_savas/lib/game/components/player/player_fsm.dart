enum PlayerState {
  idle,
  run,
  attack,
  dash,
  hurt,
  death,
}

class PlayerFsm {
  PlayerState currentState = PlayerState.idle;
  int comboStep = 1;
  double stateTimer = 0.0;
  double invulnerabilityTimer = 0.0;

  bool get isInvulnerable => invulnerabilityTimer > 0;

  void triggerDash(double durationSeconds) {
    currentState = PlayerState.dash;
    stateTimer = durationSeconds;
    invulnerabilityTimer = durationSeconds + 0.15; // I-Frames during dash + recovery
  }

  void triggerAttack(int combo) {
    currentState = PlayerState.attack;
    comboStep = combo;
    stateTimer = 0.22;
  }

  void triggerHurt(double durationSeconds) {
    currentState = PlayerState.hurt;
    stateTimer = durationSeconds;
    invulnerabilityTimer = 0.4;
  }

  void update(double dt, bool isMoving) {
    if (invulnerabilityTimer > 0) {
      invulnerabilityTimer -= dt;
    }

    if (stateTimer > 0) {
      stateTimer -= dt;
      return;
    }

    if (isMoving) {
      currentState = PlayerState.run;
    } else {
      currentState = PlayerState.idle;
    }
  }
}
