import { describe, it, expect } from 'vitest';
import { calculateCombinedProbability } from '@/lib/engine/parlay';
import { ParlayLeg } from '@/types';

describe('Parlay Combined Probability & Correlation Engine', () => {
  const dummyLegs: ParlayLeg[] = [
    { leg: 'Leg 1', market: 'Total Gol', pick: 'Over 2.5 Gol', prob: '68.0%' },
    { leg: 'Leg 2', market: 'Total Corner', pick: 'Over 8.5 Corners', prob: '61.0%' },
    { leg: 'Leg 3', market: 'Total Kartu', pick: 'Over 4.5 Kartu Kuning', prob: '66.5%' },
    { leg: 'Leg 4', market: 'Handicap', pick: 'Spanyol +0.25', prob: '72.0%' }
  ];

  it('should correctly calculate independent probability (~19.86%)', () => {
    const res = calculateCombinedProbability(dummyLegs, 0); // No discount
    expect(res.independentProb).toBeCloseTo(0.1986, 3);
    expect(res.adjustedProb).toBeCloseTo(0.1986, 3);
  });

  it('should correctly apply correlation discount (-3.7pp)', () => {
    const res = calculateCombinedProbability(dummyLegs, -3.7);
    expect(res.adjustedProb).toBeCloseTo(0.1616, 3);
    expect(res.formattedString).toContain('16.2%');
    expect(res.formattedString).toContain('Disesuaikan -3.7pp');
  });

  it('should handle empty or invalid legs gracefully', () => {
    const res = calculateCombinedProbability([], -3.7);
    expect(res.adjustedProb).toBe(0);
    expect(res.formattedString).toContain('0%');
  });
});
