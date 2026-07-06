import { Team, SimulationStats, BracketMatch } from '@/types';
import { MATCHES } from '@/lib/data/matches';
import { predictMatch } from './poisson';

export interface SimulationOptions {
  useRealLifeCompleted?: boolean;
}

/**
 * Calculate advancement probability (including extra time & penalty shootouts)
 */
export function getAdvancementProb(teamA: Team, teamB: Team): number {
  const pred = predictMatch(teamA, teamB, true);
  // In knockout stage, draws are resolved by penalties/extra time (~50% split with slight edge to higher Elo)
  const eloEdge = (teamA.elo - teamB.elo) / 4000; // max around ±0.05
  const penaltyProbA = 0.5 + Math.max(-0.08, Math.min(0.08, eloEdge));
  
  return pred.homeWinProb + pred.drawProb * penaltyProbA;
}

/**
 * Run Monte Carlo Tournament Simulation for World Cup 2026 Knockout Bracket
 * @param teams List of 16 active knockout teams
 * @param initialFixtures Array of pairs [teamAId, teamBId] representing Round of 16 matchups
 * @param iterations Number of simulations (default 10,000)
 */
export function runTournamentSimulation(
  teams: Team[],
  initialFixtures: [string, string][],
  iterations: number = 10000,
  options: SimulationOptions = { useRealLifeCompleted: true }
): { stats: SimulationStats[]; bracketPreview: BracketMatch[] } {
  const teamMap = new Map<string, Team>();
  teams.forEach(t => teamMap.set(t.id, t));

  // Precompute advancement probabilities for all possible matchups to make 10,000 runs lightning fast (<30ms)
  const advProbCache = new Map<string, number>();
  
  function getCachedProb(idA: string, idB: string): number {
    const key = `${idA}_${idB}`;
    if (advProbCache.has(key)) return advProbCache.get(key)!;
    
    const teamA = teamMap.get(idA);
    const teamB = teamMap.get(idB);
    if (!teamA || !teamB) return 0.5;

    const prob = getAdvancementProb(teamA, teamB);
    advProbCache.set(key, prob);
    advProbCache.set(`${idB}_${idA}`, 1 - prob);
    return prob;
  }

  // Counters for statistics
  const qfCounts = new Map<string, number>();
  const sfCounts = new Map<string, number>();
  const finalCounts = new Map<string, number>();
  const champCounts = new Map<string, number>();

  teams.forEach(t => {
    qfCounts.set(t.id, 0);
    sfCounts.set(t.id, 0);
    finalCounts.set(t.id, 0);
    champCounts.set(t.id, 0);
  });

  // Execute iterations
  for (let iter = 0; iter < iterations; iter++) {
    // 1. Round of 16 -> 8 Quarterfinalists
    const qfTeams: string[] = [];
    for (let i = 0; i < initialFixtures.length; i++) {
      const [idA, idB] = initialFixtures[i];
      let winner: string | null = null;
      if (options?.useRealLifeCompleted) {
        const match = MATCHES.find(m => 
          m.stage === 'round_16' && m.status === 'completed' &&
          ((m.homeTeamId === idA && m.awayTeamId === idB) || (m.homeTeamId === idB && m.awayTeamId === idA))
        );
        if (match && match.homeScore !== undefined && match.awayScore !== undefined) {
          winner = match.homeScore > match.awayScore ? match.homeTeamId : match.awayTeamId;
        }
      }
      if (!winner) {
        const probA = getCachedProb(idA, idB);
        winner = Math.random() < probA ? idA : idB;
      }
      qfTeams.push(winner);
      qfCounts.set(winner, (qfCounts.get(winner) || 0) + 1);
    }

    // 2. Quarterfinals -> 4 Semifinalists
    // Matchups: QF1 (winner R16-1 vs R16-2), QF2 (R16-3 vs R16-4), etc.
    const sfTeams: string[] = [];
    for (let i = 0; i < 4; i++) {
      const idA = qfTeams[i * 2];
      const idB = qfTeams[i * 2 + 1];
      const probA = getCachedProb(idA, idB);
      const winner = Math.random() < probA ? idA : idB;
      sfTeams.push(winner);
      sfCounts.set(winner, (sfCounts.get(winner) || 0) + 1);
    }

    // 3. Semifinals -> 2 Finalists
    // SF1 (winner QF1 vs QF2), SF2 (winner QF3 vs QF4)
    const finalTeams: string[] = [];
    for (let i = 0; i < 2; i++) {
      const idA = sfTeams[i * 2];
      const idB = sfTeams[i * 2 + 1];
      const probA = getCachedProb(idA, idB);
      const winner = Math.random() < probA ? idA : idB;
      finalTeams.push(winner);
      finalCounts.set(winner, (finalCounts.get(winner) || 0) + 1);
    }

    // 4. Final -> 1 Champion
    const idA = finalTeams[0];
    const idB = finalTeams[1];
    const probA = getCachedProb(idA, idB);
    const champion = Math.random() < probA ? idA : idB;
    champCounts.set(champion, (champCounts.get(champion) || 0) + 1);
  }

  // Compile stats
  const stats: SimulationStats[] = teams.map(t => {
    const qfProb = parseFloat(((qfCounts.get(t.id) || 0) / iterations * 100).toFixed(1));
    const sfProb = parseFloat(((sfCounts.get(t.id) || 0) / iterations * 100).toFixed(1));
    const finalProb = parseFloat(((finalCounts.get(t.id) || 0) / iterations * 100).toFixed(1));
    const championProb = parseFloat(((champCounts.get(t.id) || 0) / iterations * 100).toFixed(1));

    // Implied market odds benchmark comparison (estimated from reputation/Elo)
    const impliedMarketProb = parseFloat(Math.max(0.5, (t.marketReputation / 350) * 15).toFixed(1));
    const valueDiff = parseFloat((championProb - impliedMarketProb).toFixed(1));

    return {
      teamId: t.id,
      quarterFinalProb: qfProb,
      semiFinalProb: sfProb,
      finalProb: finalProb,
      championProb: championProb,
      impliedMarketProb,
      valueDiff
    };
  });

  // Sort stats by highest champion probability
  stats.sort((a, b) => b.championProb - a.championProb);

  // Generate the Full 15-Match Knockout Data Tree (R16 -> 8 Besar -> Semifinal -> Final)
  const getTeamObj = (id: string | null) => id ? teams.find(t => t.id === id) : undefined;
  const bracketPreview: BracketMatch[] = [];

  // 1. Round of 16 (Matches 1 - 8)
  initialFixtures.forEach(([idA, idB], index) => {
    let probA = getCachedProb(idA, idB);
    const projectedWinnerId = probA >= 0.5 ? idA : idB;
    let winnerId: string | null = options?.useRealLifeCompleted ? null : projectedWinnerId;
    let status: 'completed' | 'scheduled' | 'placeholder' = 'scheduled';
    let score: string | undefined = undefined;

    if (options?.useRealLifeCompleted) {
      const match = MATCHES.find(m => 
        m.stage === 'round_16' && m.status === 'completed' &&
        ((m.homeTeamId === idA && m.awayTeamId === idB) || (m.homeTeamId === idB && m.awayTeamId === idA))
      );
      if (match && match.homeScore !== undefined && match.awayScore !== undefined) {
        const actualWinner = match.homeScore > match.awayScore ? match.homeTeamId : match.awayTeamId;
        winnerId = actualWinner;
        probA = actualWinner === idA ? 1.0 : 0.0;
        status = 'completed';
        score = `${match.homeScore} - ${match.awayScore}`;
      }
    }

    const teamA = getTeamObj(idA);
    const teamB = getTeamObj(idB);

    bracketPreview.push({
      id: `r16_${index + 1}`,
      round: '16_besar',
      matchNumber: index + 1,
      teamAId: idA,
      teamBId: idB,
      teamAName: teamA?.name || idA,
      teamBName: teamB?.name || idB,
      probA: parseFloat((probA * 100).toFixed(1)),
      probB: parseFloat(((1 - probA) * 100).toFixed(1)),
      winnerId,
      projectedWinnerId,
      status,
      score
    });
  });

  // Helper to process subsequent knockout rounds (8 Besar, Semifinal, Final)
  const buildNextRound = (
    roundName: 'quarter_final' | 'semi_final' | 'final',
    startMatchNum: number,
    matchCount: number
  ) => {
    for (let i = 0; i < matchCount; i++) {
      const matchNum = startMatchNum + i;
      const parentA = bracketPreview.find(m => m.matchNumber === (startMatchNum - matchCount * 2 + i * 2));
      const parentB = bracketPreview.find(m => m.matchNumber === (startMatchNum - matchCount * 2 + i * 2 + 1));
      
      const teamAId = parentA?.winnerId || null;
      const teamBId = parentB?.winnerId || null;
      const projAId = parentA?.projectedWinnerId || parentA?.teamAId || null;
      const projBId = parentB?.projectedWinnerId || parentB?.teamBId || null;

      const teamA = getTeamObj(teamAId);
      const teamB = getTeamObj(teamBId);
      const projA = getTeamObj(projAId);
      const projB = getTeamObj(projBId);

      const teamAName = teamA ? teamA.name : `[?] Pemenang M${parentA?.matchNumber} (${projA?.name || '---'})`;
      const teamBName = teamB ? teamB.name : `[?] Pemenang M${parentB?.matchNumber} (${projB?.name || '---'})`;

      let probA = 0.5;
      if (projAId && projBId) {
        probA = getCachedProb(projAId, projBId);
      }
      const projectedWinnerId = probA >= 0.5 ? projAId : projBId;
      let winnerId: string | null = null;
      let status: 'completed' | 'scheduled' | 'placeholder' = (teamAId && teamBId) ? 'scheduled' : 'placeholder';
      let score: string | undefined = undefined;

      // Check if real match completed in MATCHES
      if (options?.useRealLifeCompleted && teamAId && teamBId) {
        const stageStr = roundName === 'quarter_final' ? 'quarter_final' : roundName === 'semi_final' ? 'semi_final' : 'final';
        const match = MATCHES.find(m => 
          m.stage === stageStr && m.status === 'completed' &&
          ((m.homeTeamId === teamAId && m.awayTeamId === teamBId) || (m.homeTeamId === teamBId && m.awayTeamId === teamAId))
        );
        if (match && match.homeScore !== undefined && match.awayScore !== undefined) {
          const actualWinner = match.homeScore > match.awayScore ? match.homeTeamId : match.awayTeamId;
          winnerId = actualWinner;
          probA = actualWinner === teamAId ? 1.0 : 0.0;
          status = 'completed';
          score = `${match.homeScore} - ${match.awayScore}`;
        }
      } else if (!options?.useRealLifeCompleted && teamAId && teamBId) {
        winnerId = projectedWinnerId;
      }

      const idPrefix = roundName === 'quarter_final' ? 'qf' : roundName === 'semi_final' ? 'sf' : 'final';
      bracketPreview.push({
        id: `${idPrefix}_${i + 1}`,
        round: roundName,
        matchNumber: matchNum,
        teamAId,
        teamBId,
        teamAName,
        teamBName,
        probA: parseFloat((probA * 100).toFixed(1)),
        probB: parseFloat(((1 - probA) * 100).toFixed(1)),
        winnerId,
        projectedWinnerId,
        status,
        score,
        parentLabelA: `Pemenang M${parentA?.matchNumber}`,
        parentLabelB: `Pemenang M${parentB?.matchNumber}`
      });
    }
  };

  // 2. Quarter-Finals (Matches 9 - 12, parents are 1..8)
  buildNextRound('quarter_final', 9, 4);

  // 3. Semi-Finals (Matches 13 - 14, parents are 9..12)
  buildNextRound('semi_final', 13, 2);

  // 4. Final (Match 15, parents are 13..14)
  buildNextRound('final', 15, 1);

  return { stats, bracketPreview };
}
