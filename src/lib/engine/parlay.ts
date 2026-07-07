import { ParlayLeg } from '@/types';

export interface ParlayCalculationResult {
  independentProb: number; // e.g. 0.1986 (19.9%)
  independentOdds: number; // e.g. 5.04
  adjustedProb: number; // e.g. 0.1616 (16.2%)
  adjustedOdds: number; // e.g. 6.19
  discountPp: number; // e.g. -3.7
  formattedString: string; // "16.2% (~6.19 Odds | Disesuaikan -3.7pp untuk korelasi antar-pasar)"
}

/**
 * Calculate combined parlay probability and estimated odds with correlation adjustment.
 * Makes parlay calculations fully quantitative, explainable, and auditable.
 * 
 * @param legs Array of parlay legs with probability strings (e.g. "68.0%") or decimal numbers
 * @param correlationAdjustmentPp Percentage points discount due to inter-market correlation (default -3.7pp)
 */
export function calculateCombinedProbability(
  legs: ParlayLeg[],
  correlationAdjustmentPp: number = -3.7
): ParlayCalculationResult {
  if (!legs || legs.length === 0) {
    return {
      independentProb: 0,
      independentOdds: 0,
      adjustedProb: 0,
      adjustedOdds: 0,
      discountPp: 0,
      formattedString: '0% (~0 Odds)'
    };
  }

  // 1. Calculate independent joint probability by multiplying individual probabilities
  let independentProb = 1;
  for (const leg of legs) {
    let p = 0;
    if (typeof leg.prob === 'string') {
      const clean = leg.prob.replace('%', '').trim();
      p = parseFloat(clean) / 100;
    } else if (typeof leg.prob === 'number') {
      p = (leg.prob as number) > 1 ? (leg.prob as number) / 100 : (leg.prob as number);
    }
    if (!isNaN(p) && p > 0) {
      independentProb *= p;
    }
  }

  // 2. Apply correlation adjustment (in percentage points, e.g. -3.7pp means subtract 0.037)
  const discountDecimal = correlationAdjustmentPp / 100;
  let adjustedProb = independentProb + discountDecimal;

  // Ensure probability stays within sane logical bounds [0.01, 0.99]
  if (adjustedProb <= 0.01) adjustedProb = 0.01;
  if (adjustedProb >= 0.99) adjustedProb = 0.99;

  // 3. Calculate decimal odds (1 / probability)
  const independentOdds = independentProb > 0 ? parseFloat((1 / independentProb).toFixed(2)) : 0;
  const adjustedOdds = parseFloat((1 / adjustedProb).toFixed(2));

  const adjProbPercent = (adjustedProb * 100).toFixed(1);
  const formattedString = `${adjProbPercent}% (~${adjustedOdds} Odds | Disesuaikan ${correlationAdjustmentPp}pp untuk korelasi antar-pasar)`;

  return {
    independentProb: parseFloat(independentProb.toFixed(4)),
    independentOdds,
    adjustedProb: parseFloat(adjustedProb.toFixed(4)),
    adjustedOdds,
    discountPp: correlationAdjustmentPp,
    formattedString
  };
}
