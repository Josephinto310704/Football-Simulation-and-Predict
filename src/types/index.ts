export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  isoCode?: string;
  flagUrl?: string;
  elo: number;
  xgAttack: number; // Avg xG last 5 matches
  xgDefense: number; // Avg xGA last 5 matches
  ppda: number; // Passes Per Defensive Action (lower = higher pressing)
  progPasses: number; // Progressive passes & carries per 90
  setPieceEfficiency: number; // 0-100 score
  shotQuality: number; // xG per shot
  marketReputation: number; // 0-100 rating based on betting odds / FIFA ranking
  fifaRank: number;
  group: string;
  status: 'active' | 'eliminated';
  moneyballScore?: number;
  valuationStatus?: 'undervalued' | 'fair' | 'overvalued';
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  stage: 'round_16' | 'quarter_final' | 'semi_final' | 'final' | 'group';
  date: string;
  time: string;
  venue: string;
  status: 'scheduled' | 'completed' | 'live';
  homeScore?: number;
  awayScore?: number;
  homePenalty?: number;
  awayPenalty?: number;
  xGHome?: number;
  xGAway?: number;
}

export interface ScorelineProb {
  home: number;
  away: number;
  prob: number;
}

export interface ExplainabilityFactor {
  id: string;
  label: string;
  value: string;
  favor: 'home' | 'away' | 'neutral';
  detail: string;
  weight: number; // percentage 0-100
}

export interface PredictionResult {
  homeTeamId: string;
  awayTeamId: string;
  homeWinProb: number; // 0.0 to 1.0
  drawProb: number; // 0.0 to 1.0
  awayWinProb: number; // 0.0 to 1.0
  expectedScore: { home: number; away: number };
  scoreMatrix: number[][]; // [homeGoals][awayGoals] up to 7x7
  topScorelines: ScorelineProb[];
  explanation: {
    summary: string;
    keyFactors: ExplainabilityFactor[];
    tacticalNote: string;
    varianceLevel: 'Low' | 'Medium' | 'High';
  };
}

export interface SimulationStats {
  teamId: string;
  quarterFinalProb: number; // % chance to reach QF (8 Besar)
  semiFinalProb: number; // % chance to reach SF
  finalProb: number; // % chance to reach Final
  championProb: number; // % chance to win Trophy
  impliedMarketProb?: number; // % implied from bandar odds
  valueDiff?: number; // model prob - market prob
}

export interface BracketMatch {
  id: string; // e.g. 'r16_1', 'qf_1', 'sf_1', 'final_1'
  round: '16_besar' | 'quarter_final' | 'semi_final' | 'final';
  matchNumber: number;
  teamAId: string | null;
  teamBId: string | null;
  teamAName?: string; // e.g. "Spanyol" atau "[?] Pemenang M4"
  teamBName?: string; // e.g. "Maroko" atau "[?] Pemenang M5"
  probA?: number;
  probB?: number;
  winnerId?: string | null;
  projectedWinnerId?: string | null;
  status?: 'completed' | 'scheduled' | 'placeholder';
  score?: string; // e.g. "0 - 1"
  parentLabelA?: string; // e.g. "Pemenang M1"
  parentLabelB?: string; // e.g. "Pemenang M2"
}

export interface MarketDetail {
  market: string;
  prediction: string;
  probability: string;
  odds: string;
  reasoning: string;
}

export interface ParlayLeg {
  leg: string;
  market: string;
  pick: string;
  prob: string;
}

export interface PreMatchReport {
  matchId: string;
  title: string;
  dateStr: string;
  competition?: string;
  context?: string;
  homeTeam: Team;
  awayTeam: Team;
  prediction: PredictionResult;
  refereeInfo?: { name: string; avgYellows: string; detail: string };
  h2hSummary?: { totalMeetings: number; homeWins: number; awayWins: number; draws: number; avgGoals: string; bttsRate: string; avgCorners: string; avgCards: string };
  marketsAnalysis?: {
    hdp: MarketDetail;
    overUnder: MarketDetail;
    btts: MarketDetail;
    totalCorners: MarketDetail;
    teamCorners: MarketDetail;
    totalCards: MarketDetail;
  };
  bettingAnalysis: {
    primaryTier: { label: string; value: string; confidence: number; rationale: string };
    secondaryTier: { label: string; value: string; confidence: number; rationale: string };
    parlayPick: { label: string; value: string; risk: 'Safe' | 'Moderate' | 'High'; rationale: string; legs?: ParlayLeg[]; combinedProb?: string };
  };
  squadNews: {
    home: string[];
    away: string[];
  };
  neuralAnalysis?: {
    model: string;
    fnnProb: string;
    lstmProb: string;
    ensembleProb: string;
    pythagoreanHome: string;
    pythagoreanAway: string;
    tacticalAdvice: string;
    sourceReference: string;
  };
  sources?: string[];
  riskNotes?: string[];
}

export interface AccuracyLog {
  matchId: string;
  stage: string;
  homeTeam: string;
  awayTeam: string;
  predictedProb: { win: number; draw: number; loss: number };
  actualResult: 'win' | 'draw' | 'loss'; // relative to home team
  actualScore: string;
  brierScore: number;
  isCorrectPick: boolean;
}

export type { LiveMatchData } from '@/app/api/live-data/route';
