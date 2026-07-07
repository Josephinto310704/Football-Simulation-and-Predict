import { describe, it, expect } from 'vitest';
import { calculateEloUpdate, bayesianUpdateProb, calculateBrierScore } from '@/lib/engine/elo';

describe('Elo & Bayesian Calibration Engine', () => {
  it('should increase Elo of winning team and decrease Elo of losing team', () => {
    const res = calculateEloUpdate(2000, 1900, 2, 0, true);
    expect(res.newEloA).toBeGreaterThan(2000);
    expect(res.newEloB).toBeLessThan(1900);
    expect(res.deltaA).toBeGreaterThan(0);
    expect(res.deltaB).toBeLessThan(0);
  });

  it('should apply higher multiplier (G) for bigger goal margins', () => {
    const winBy1 = calculateEloUpdate(2000, 2000, 1, 0, true);
    const winBy3 = calculateEloUpdate(2000, 2000, 3, 0, true);
    expect(winBy3.deltaA).toBeGreaterThan(winBy1.deltaA);
  });

  it('should correctly calculate Brier score where 0.0 is perfect prediction', () => {
    const perfectWin = calculateBrierScore(1.0, 0.0, 0.0, 'win');
    expect(perfectWin).toBe(0);

    const worstWin = calculateBrierScore(0.0, 0.0, 1.0, 'win');
    expect(worstWin).toBeCloseTo(0.6667, 3);
  });

  it('should update prior probabilities rationally via Bayesian update', () => {
    const prior = 0.5;
    const postHigher = bayesianUpdateProb(prior, 1.5); // Likelihood > 1
    const postLower = bayesianUpdateProb(prior, 0.5);  // Likelihood < 1
    expect(postHigher).toBeGreaterThan(prior);
    expect(postLower).toBeLessThan(prior);
  });
});
