import { describe, it, expect } from 'vitest';
import { getAdvancementProb, runTournamentSimulation } from '@/lib/engine/monte-carlo';
import { TEAMS } from '@/lib/data/teams';
import { ROUND_OF_16_FIXTURES } from '@/lib/data/matches';

describe('Monte Carlo Tournament Simulation Engine', () => {
  it('should calculate knockout advancement probability between 0 and 1', () => {
    const teamA = TEAMS[0];
    const teamB = TEAMS[1];
    const prob = getAdvancementProb(teamA, teamB);
    expect(prob).toBeGreaterThan(0);
    expect(prob).toBeLessThan(1);
  });

  it('should run tournament simulation and return championship probabilities', () => {
    // Run a smaller 500-iteration simulation for fast unit testing
    const res = runTournamentSimulation(TEAMS, ROUND_OF_16_FIXTURES, 500);
    expect(res.stats.length).toBeGreaterThan(0);
    expect(res.bracketPreview.length).toBeGreaterThan(0);
    
    // Sum of championProb probabilities should be approximately 100%
    const totalWinProb = res.stats.reduce((acc, curr) => acc + curr.championProb, 0);
    expect(totalWinProb).toBeGreaterThan(95);
    expect(totalWinProb).toBeLessThan(105);
  });
});
