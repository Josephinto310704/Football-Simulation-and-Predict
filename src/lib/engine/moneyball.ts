import { Team } from '@/types';

/**
 * Calculate Moneyball Sabermetrics Score (0-100) and identify undervalued teams
 */
export function calculateMoneyballMetrics(team: Team): {
  score: number;
  status: 'undervalued' | 'fair' | 'overvalued';
  breakdown: {
    pressingScore: number;
    buildupScore: number;
    shotQualityScore: number;
    setPieceScore: number;
  };
} {
  // 1. Pressing Score (PPDA inverted: range ~7.0 to 18.0)
  // Lower PPDA = more aggressive pressing = higher score
  const ppdaClamped = Math.max(7.0, Math.min(18.0, team.ppda));
  const pressingScore = Math.round(((18.0 - ppdaClamped) / (18.0 - 7.0)) * 100);

  // 2. Build-up Score (Progressive Passes per 90: range ~25 to 75)
  const progClamped = Math.max(25, Math.min(75, team.progPasses));
  const buildupScore = Math.round(((progClamped - 25) / (75 - 25)) * 100);

  // 3. Shot Quality Score (xG per shot: range ~0.08 to 0.16)
  const sqClamped = Math.max(0.08, Math.min(0.16, team.shotQuality));
  const shotQualityScore = Math.round(((sqClamped - 0.08) / (0.16 - 0.08)) * 100);

  // 4. Set-Piece Score (already 0-100 rating)
  const setPieceScore = Math.round(team.setPieceEfficiency);

  // Composite Moneyball Score (equal 25% weight across the 4 key undervalued pillars)
  const compositeScore = Math.round(
    0.25 * pressingScore +
    0.25 * buildupScore +
    0.25 * shotQualityScore +
    0.25 * setPieceScore
  );

  // Determine Valuation Status vs Market Perception / Bandar Odds
  const diff = compositeScore - team.marketReputation;
  let status: 'undervalued' | 'fair' | 'overvalued' = 'fair';
  if (diff >= 7) {
    status = 'undervalued';
  } else if (diff <= -7) {
    status = 'overvalued';
  }

  return {
    score: compositeScore,
    status,
    breakdown: {
      pressingScore,
      buildupScore,
      shotQualityScore,
      setPieceScore
    }
  };
}

/**
 * Enrich a list of teams with calculated Moneyball scores and status
 */
export function enrichTeamsWithMoneyball(teams: Team[]): Team[] {
  return teams.map(team => {
    const mb = calculateMoneyballMetrics(team);
    return {
      ...team,
      moneyballScore: mb.score,
      valuationStatus: mb.status
    };
  });
}
