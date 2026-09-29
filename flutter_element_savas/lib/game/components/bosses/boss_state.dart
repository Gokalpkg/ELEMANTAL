/// States of the Boss Finite State Machine
enum BossState {
  idle,
  move,
  telegraph,
  attack,
  staggered,
  phaseTransition,
  death,
}
