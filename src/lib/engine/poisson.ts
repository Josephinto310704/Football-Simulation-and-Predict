import { Team, PredictionResult, ScorelineProb, ExplainabilityFactor } from '@/types';

// Helper: Calculate factorial
function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// Helper: Standard Poisson Probability P(X=k; lambda)
function poissonProb(k: number, lambda: number): number {
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
}

// Dixon-Coles adjustment factor tau
function dixonColesTau(x: number, y: number, lambda: number, mu: number, rho: number): number {
  if (x === 0 && y === 0) {
    return 1 - lambda * mu * rho;
  } else if (x === 1 && y === 0) {
    return 1 + mu * rho;
  } else if (x === 0 && y === 1) {
    return 1 + lambda * rho;
  } else if (x === 1 && y === 1) {
    return 1 - rho;
  }
  return 1;
}

/**
 * Predict match outcome using Dixon-Coles adjusted Poisson distribution
 * @param homeTeam Home team (or Team A in knockout venue)
 * @param awayTeam Away team (or Team B in knockout venue)
 * @param isNeutralVenue Whether venue is neutral (default true for World Cup knockout)
 */
export function predictMatch(
  homeTeam: Team,
  awayTeam: Team,
  isNeutralVenue: boolean = true
): PredictionResult {
  // 1. Calculate Expected Goals (lambda for home/team A, mu for away/team B)
  // Base international football average goals per team per match ~ 1.35
  const avgGoals = 1.35;
  
  // Home advantage factor (neutral ground in USA/Canada/Mexico unless host plays)
  const isHomeHost = ['USA', 'CAN', 'MEX'].includes(homeTeam.code);
  const isAwayHost = ['USA', 'CAN', 'MEX'].includes(awayTeam.code);
  let homeAdvantage = 1.0;
  if (!isNeutralVenue || (isHomeHost && !isAwayHost)) {
    homeAdvantage = 1.12; // 12% boost for home/host
  } else if (isAwayHost && !isHomeHost) {
    homeAdvantage = 0.89; // Away team gets host boost
  }

  // Elo rating adjustment factor (200 pts difference roughly 15% edge)
  const eloDiff = homeTeam.elo - awayTeam.elo;
  const eloFactorHome = 1 + eloDiff / 2200;
  const eloFactorAway = 1 - eloDiff / 2200;

  // Expected goals calculation
  let lambda = (homeTeam.xgAttack * (awayTeam.xgDefense / avgGoals)) * eloFactorHome * homeAdvantage;
  let mu = (awayTeam.xgAttack * (homeTeam.xgDefense / avgGoals)) * eloFactorAway * (1 / homeAdvantage);

  // Clamp values to realistic bounds
  lambda = Math.max(0.25, Math.min(4.2, lambda));
  mu = Math.max(0.25, Math.min(4.2, mu));

  // Dixon-Coles correlation coefficient rho for international matches (~ -0.13)
  const rho = -0.13;

  // 2. Build 8x8 Score Probability Matrix (0 to 7 goals)
  const maxGoals = 7;
  const matrix: number[][] = Array.from({ length: maxGoals + 1 }, () => Array(maxGoals + 1).fill(0));
  let totalProb = 0;

  for (let x = 0; x <= maxGoals; x++) {
    for (let y = 0; y <= maxGoals; y++) {
      const pX = poissonProb(x, lambda);
      const pY = poissonProb(y, mu);
      const tau = dixonColesTau(x, y, lambda, mu, rho);
      const prob = Math.max(0, tau * pX * pY);
      matrix[x][y] = prob;
      totalProb += prob;
    }
  }

  // Normalize matrix so sum equals 1.0
  let homeWinProb = 0;
  let drawProb = 0;
  let awayWinProb = 0;
  const allScorelines: ScorelineProb[] = [];

  for (let x = 0; x <= maxGoals; x++) {
    for (let y = 0; y <= maxGoals; y++) {
      matrix[x][y] = matrix[x][y] / totalProb;
      const p = matrix[x][y];

      if (x > y) homeWinProb += p;
      else if (x === y) drawProb += p;
      else awayWinProb += p;

      allScorelines.push({ home: x, away: y, prob: p });
    }
  }

  // Sort scorelines by highest probability
  allScorelines.sort((a, b) => b.prob - a.prob);
  const topScorelines = allScorelines.slice(0, 5);

  // 3. Generate Explainable AI Factors
  const keyFactors: ExplainabilityFactor[] = [];

  // Factor 1: xG Differential & Finishing Quality
  const xgDiff = (homeTeam.xgAttack - awayTeam.xgAttack).toFixed(2);
  const xgFavor = parseFloat(xgDiff) > 0.2 ? 'home' : parseFloat(xgDiff) < -0.2 ? 'away' : 'neutral';
  keyFactors.push({
    id: 'xg_quality',
    label: 'Kualitas xG & Peluang Menyerang',
    value: `${homeTeam.xgAttack} vs ${awayTeam.xgAttack} xG/laga`,
    favor: xgFavor,
    detail: xgFavor === 'home'
      ? `${homeTeam.name} memiliki rata-rata kreasi peluang murni lebih dominan (+${xgDiff} xG/laga).`
      : xgFavor === 'away'
      ? `${awayTeam.name} unggul dalam penetrasi pertahanan musuh dengan rata-rata +${Math.abs(parseFloat(xgDiff))} xG lebih tinggi.`
      : `Kedua tim memiliki ketajaman kreasi peluang yang sangat seimbang.`,
    weight: 35
  });

  // Factor 2: Pressing Intensity (PPDA - lower is better)
  const ppdaDiff = awayTeam.ppda - homeTeam.ppda; // positive means home presses harder
  const pressFavor = ppdaDiff > 1.5 ? 'home' : ppdaDiff < -1.5 ? 'away' : 'neutral';
  keyFactors.push({
    id: 'pressing_ppda',
    label: 'Intensitas Pressing (PPDA)',
    value: `${homeTeam.ppda} vs ${awayTeam.ppda} PPDA`,
    favor: pressFavor,
    detail: pressFavor === 'home'
      ? `${homeTeam.name} melakukan high-pressing lebih agresif (angka PPDA ${homeTeam.ppda} lebih rendah), memaksa lawan sering melakukan turnover.`
      : pressFavor === 'away'
      ? `${awayTeam.name} lebih aktif menekan garis depan dengan angka PPDA ${awayTeam.ppda}, berpotensi merepotkan build-up lawan.`
      : `Intensitas tekanan defensif kedua kesebelasan setara di lini tengah.`,
    weight: 25
  });

  // Factor 3: Progressive Passes & Build-up
  const progDiff = homeTeam.progPasses - awayTeam.progPasses;
  const buildFavor = progDiff > 5 ? 'home' : progDiff < -5 ? 'away' : 'neutral';
  keyFactors.push({
    id: 'buildup_prog',
    label: 'Dominasi Build-up & Progressive Passes',
    value: `${homeTeam.progPasses} vs ${awayTeam.progPasses} operan progresif`,
    favor: buildFavor,
    detail: buildFavor === 'home'
      ? `${homeTeam.name} memiliki keunggulan progresi bola melewati lini tengah musuh (+${progDiff} operan/laga).`
      : buildFavor === 'away'
      ? `${awayTeam.name} lebih lancar mengalirkan bola ke pertahanan sepertiga akhir lawan.`
      : `Kapasitas build-up dari lini belakang kedua tim relatif setara.`,
    weight: 25
  });

  // Factor 4: Set-Piece Efficiency
  const spDiff = homeTeam.setPieceEfficiency - awayTeam.setPieceEfficiency;
  const spFavor = spDiff > 8 ? 'home' : spDiff < -8 ? 'away' : 'neutral';
  keyFactors.push({
    id: 'set_piece',
    label: 'Efisiensi Konversi Bola Mati',
    value: `${homeTeam.setPieceEfficiency}% vs ${awayTeam.setPieceEfficiency}%`,
    favor: spFavor,
    detail: spFavor === 'home'
      ? `${homeTeam.name} berpotensi menjadi ancaman serius dari situasi corner dan tendangan bebas.`
      : spFavor === 'away'
      ? `${awayTeam.name} memiliki statistik set-piece atas rata-rata yang bisa memecah kebuntuan laga ketat.`
      : `Kedua tim memiliki efektivitas standar dalam memanfaatkan skema bola mati.`,
    weight: 15
  });

  // Determine tactical note and variance
  let varianceLevel: 'Low' | 'Medium' | 'High' = 'Medium';
  if (Math.abs(homeWinProb - awayWinProb) < 0.1) {
    varianceLevel = 'High';
  } else if (Math.abs(homeWinProb - awayWinProb) > 0.35) {
    varianceLevel = 'Low';
  }

  const favoriteName = homeWinProb >= awayWinProb ? homeTeam.name : awayTeam.name;
  const underdogName = homeWinProb >= awayWinProb ? awayTeam.name : homeTeam.name;
  const favProb = Math.round(Math.max(homeWinProb, awayWinProb) * 100);
  
  const summary = `${favoriteName} sedikit diunggulkan dengan probabilitas kemenangan ${favProb}% berdasarkan dominasi model Dixon-Coles dan Elo Rating, sementara peluang berlanjut ke perpanjangan waktu (seri 90 menit) mencapai ${Math.round(drawProb * 100)}%.`;
  
  const tacticalNote = varianceLevel === 'High'
    ? `Pertandingan berpotensi sangat ketat dengan variansi tinggi. ${underdogName} mengandalkan transisi cepat dan efisiensi peluang, sehingga selisih 1 gol atau babak adu penalti menjadi skenario yang sangat mungkin terjadi.`
    : `Model mendeteksi keunggulan struktural yang cukup signifikan bagi ${favoriteName}, namun disiplin pertahanan dalam situasi bola mati akan menjadi penentu apakah ${underdogName} mampu mencuri gol kejutan.`;

  return {
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    homeWinProb,
    drawProb,
    awayWinProb,
    expectedScore: {
      home: parseFloat(lambda.toFixed(2)),
      away: parseFloat(mu.toFixed(2))
    },
    scoreMatrix: matrix,
    topScorelines,
    explanation: {
      summary,
      keyFactors,
      tacticalNote,
      varianceLevel
    }
  };
}
