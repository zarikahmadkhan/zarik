// The whole causal model: what the player changed on Lantern Night 1984,
// and the present it produces. See docs/DESIGN.md §1.

export type Crossing = 'sailed' | 'cancelled';
export type Coupling = 'cracked' | 'replaced';
export type CancelMethod = 'sabotage' | 'panic' | 'adrift' | null;
export type FixRoute = 'mara' | 'jun' | 'dell' | null;

export interface PastState {
  crossing: Crossing;
  coupling: Coupling;
  cancelMethod: CancelMethod; // flavour only
  fixRoute: FixRoute; // flavour only
}

export type Present = 'baseline' | 'A1' | 'A2';
export type Timeline = 'p1984' | Present;

export const HISTORY: Readonly<PastState> = {
  crossing: 'sailed',
  coupling: 'cracked',
  cancelMethod: null,
  fixRoute: null,
};

/** Each trip to 1984 starts from recorded history (D3: interventions replace, never stack). */
export function freshPast(): PastState {
  return { ...HISTORY };
}

/** Cancellation dominates: a fixed ferry that never sails still costs the company the night. */
export function derivePresent(past: PastState): Present {
  if (past.crossing === 'cancelled') return 'A1';
  if (past.coupling === 'replaced') return 'A2';
  return 'baseline';
}
