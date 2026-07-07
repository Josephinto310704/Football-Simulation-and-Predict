import { describe, it, expect } from 'vitest';
import { predictMatch } from '@/lib/engine/poisson';
import { Team } from '@/types';

const dummyTeamA: Team = {
  id: 'esp',
  name: 'Spanyol',
  code: 'ESP',
  group: 'A',
  elo: 2060,
  xgAttack: 2.3,
  xgDefense: 0.8,
  ppda: 8.5,
  moneyballScore: 92
};

const dummyTeamB: Team = {
  id: 'mar',
  name: 'Maroko',
  code: 'MAR',
  group: 'A',
  elo: 1940,
  xgAttack: 1.5,
  xgDefense: 0.9,
  ppda: 11.2,
  moneyballScore: 84
};

describe('Dixon-Coles Poisson Prediction Engine', () => {
  it('should generate valid probabilities summing to approximately 100%', () => {
    const res = predictMatch(dummyTeamA, dummyTeamB, true);
    const sum = res.homeWinProb + res.drawProb + res.awayWinProb;
    expect(sum).toBeGreaterThan(0.98);
    expect(sum).toBeLessThan(1.02);
  });

  it('should give higher winning probability to stronger team (higher xG & Elo)', () => {
    const res = predictMatch(dummyTeamA, dummyTeamB, true);
    expect(res.homeWinProb).toBeGreaterThan(res.awayWinProb);
  });

  it('should return valid top scorelines with probabilities', () => {
    const res = predictMatch(dummyTeamA, dummyTeamB, true);
    expect(res.topScorelines.length).toBeGreaterThan(0);
    expect(res.topScorelines[0]).toHaveProperty('home');
    expect(res.topScorelines[0]).toHaveProperty('away');
    expect(res.topScorelines[0]).toHaveProperty('prob');
  });
});
