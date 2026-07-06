import { Team } from '@/types';

/**
 * Calculate Elo rating update after a match
 * @param teamAElo Current Elo of Team A
 * @param teamBElo Current Elo of Team B
 * @param goalsA Goals scored by Team A (including extra time)
 * @param goalsB Goals scored by Team B (including extra time)
 * @param isKnockout Whether it's a World Cup knockout match (K=40)
 */
export function calculateEloUpdate(
  teamAElo: number,
  teamBElo: number,
  goalsA: number,
  goalsB: number,
  isKnockout: boolean = true
): { newEloA: number; newEloB: number; deltaA: number; deltaB: number } {
  const K = isKnockout ? 40 : 30;

  // Expected outcome
  const expectedA = 1 / (1 + Math.pow(10, (teamBElo - teamAElo) / 400));
  const expectedB = 1 - expectedA;

  // Actual outcome (S)
  let actualA = 0.5;
  let actualB = 0.5;
  if (goalsA > goalsB) {
    actualA = 1;
    actualB = 0;
  } else if (goalsA < goalsB) {
    actualA = 0;
    actualB = 1;
  }

  // Goal margin multiplier (G)
  const diff = Math.abs(goalsA - goalsB);
  let G = 1;
  if (diff === 2) {
    G = 1.5;
  } else if (diff >= 3) {
    G = (11 + diff) / 8;
  }

  // Delta calculation
  const deltaA = Math.round(K * G * (actualA - expectedA));
  const deltaB = Math.round(K * G * (actualB - expectedB));

  return {
    newEloA: teamAElo + deltaA,
    newEloB: teamBElo + deltaB,
    deltaA,
    deltaB
  };
}

/**
 * Bayesian probability updater based on latest match evidence
 * Adjusts prior probability by likelihood ratio of observed performance
 */
export function bayesianUpdateProb(priorProb: number, observedPerformanceRatio: number): number {
  // Posterior = (Prior * Likelihood) / Marginal
  const likelihood = Math.max(0.2, Math.min(2.5, observedPerformanceRatio));
  const unnormalized = priorProb * likelihood;
  const opposite = (1 - priorProb) * (1 / likelihood);
  return parseFloat((unnormalized / (unnormalized + opposite)).toFixed(3));
}

/**
 * Calculate Brier Score for a match prediction (KPI target < 0.20)
 */
export function calculateBrierScore(
  predWin: number,
  predDraw: number,
  predLoss: number,
  actualOutcome: 'win' | 'draw' | 'loss'
): number {
  const oWin = actualOutcome === 'win' ? 1 : 0;
  const oDraw = actualOutcome === 'draw' ? 1 : 0;
  const oLoss = actualOutcome === 'loss' ? 1 : 0;

  const score = (
    Math.pow(predWin - oWin, 2) +
    Math.pow(predDraw - oDraw, 2) +
    Math.pow(predLoss - oLoss, 2)
  ) / 3;

  return parseFloat(score.toFixed(4));
}
