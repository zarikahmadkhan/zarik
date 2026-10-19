import { describe, expect, it } from 'vitest';
import { derivePresent, freshPast, HISTORY } from './past';

describe('derivePresent', () => {
  it('recorded history produces the baseline present', () => {
    expect(derivePresent(freshPast())).toBe('baseline');
  });

  it('cancelling the crossing produces A1 regardless of method', () => {
    for (const cancelMethod of ['sabotage', 'panic', 'adrift'] as const) {
      expect(derivePresent({ ...HISTORY, crossing: 'cancelled', cancelMethod })).toBe('A1');
    }
  });

  it('replacing the coupling produces A2 regardless of who released the part', () => {
    for (const fixRoute of ['mara', 'jun', 'dell'] as const) {
      expect(derivePresent({ ...HISTORY, coupling: 'replaced', fixRoute })).toBe('A2');
    }
  });

  it('fix plus cancellation on the same trip: cancellation dominates', () => {
    expect(derivePresent({ ...HISTORY, coupling: 'replaced', crossing: 'cancelled' })).toBe('A1');
  });

  it('freshPast never aliases recorded history', () => {
    const p = freshPast();
    p.crossing = 'cancelled';
    expect(HISTORY.crossing).toBe('sailed');
  });
});
