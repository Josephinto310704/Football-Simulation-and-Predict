import { Team } from '@/types';
import { enrichTeamsWithMoneyball } from '../engine/moneyball';
import { getDynamicTeamStats } from '../engine/stats-sync';

// Raw analytical data for the 16 active knockout stage teams of World Cup 2026
const rawTeams: Team[] = [
  {
    id: 'esp',
    name: 'Spanyol',
    code: 'ESP',
    flag: '🇪🇸',
    elo: 2041,
    xgAttack: 2.10,
    xgDefense: 0.75,
    ppda: 8.2, // Elite pressing
    progPasses: 64, // Superior build-up
    setPieceEfficiency: 82,
    shotQuality: 0.14,
    marketReputation: 85,
    fifaRank: 2,
    group: 'B',
    status: 'active'
  },
  {
    id: 'por',
    name: 'Portugal',
    code: 'POR',
    flag: '🇵🇹',
    elo: 1978,
    xgAttack: 1.80,
    xgDefense: 0.95,
    ppda: 11.5,
    progPasses: 52,
    setPieceEfficiency: 74,
    shotQuality: 0.12,
    marketReputation: 78,
    fifaRank: 6,
    group: 'F',
    status: 'active'
  },
  {
    id: 'arg',
    name: 'Argentina',
    code: 'ARG',
    flag: '🇦🇷',
    elo: 2085,
    xgAttack: 2.15,
    xgDefense: 0.65,
    ppda: 9.0,
    progPasses: 58,
    setPieceEfficiency: 80,
    shotQuality: 0.15,
    marketReputation: 92,
    fifaRank: 1,
    group: 'A',
    status: 'active'
  },
  {
    id: 'fra',
    name: 'Prancis',
    code: 'FRA',
    flag: '🇫🇷',
    elo: 2050,
    xgAttack: 2.05,
    xgDefense: 0.80,
    ppda: 10.2,
    progPasses: 60,
    setPieceEfficiency: 78,
    shotQuality: 0.14,
    marketReputation: 90,
    fifaRank: 3,
    group: 'D',
    status: 'active'
  },
  {
    id: 'bra',
    name: 'Brasil',
    code: 'BRA',
    flag: '🇧🇷',
    elo: 2010,
    xgAttack: 1.95,
    xgDefense: 0.85,
    ppda: 9.8,
    progPasses: 55,
    setPieceEfficiency: 76,
    shotQuality: 0.13,
    marketReputation: 88,
    fifaRank: 5,
    group: 'G',
    status: 'active'
  },
  {
    id: 'eng',
    name: 'Inggris',
    code: 'ENG',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    elo: 2025,
    xgAttack: 1.85,
    xgDefense: 0.70,
    ppda: 10.5,
    progPasses: 56,
    setPieceEfficiency: 84, // Strong set pieces
    shotQuality: 0.12,
    marketReputation: 86,
    fifaRank: 4,
    group: 'C',
    status: 'active'
  },
  {
    id: 'usa',
    name: 'Amerika Serikat',
    code: 'USA',
    flag: '🇺🇸',
    elo: 1880,
    xgAttack: 1.65,
    xgDefense: 1.05,
    ppda: 9.5, // High work rate
    progPasses: 48,
    setPieceEfficiency: 79,
    shotQuality: 0.12,
    marketReputation: 68, // Undervalued host!
    fifaRank: 11,
    group: 'E',
    status: 'active'
  },
  {
    id: 'ita',
    name: 'Italia',
    code: 'ITA',
    flag: '🇮🇹',
    elo: 1940,
    xgAttack: 1.55,
    xgDefense: 0.80,
    ppda: 11.0,
    progPasses: 49,
    setPieceEfficiency: 75,
    shotQuality: 0.11,
    marketReputation: 76,
    fifaRank: 9,
    group: 'H',
    status: 'active'
  },
  {
    id: 'uru',
    name: 'Uruguay',
    code: 'URU',
    flag: '🇺🇾',
    elo: 1990,
    xgAttack: 1.80,
    xgDefense: 0.85,
    ppda: 8.5, // Bielsa high-intensity pressing
    progPasses: 53,
    setPieceEfficiency: 83,
    shotQuality: 0.13,
    marketReputation: 77, // Undervalued!
    fifaRank: 8,
    group: 'I',
    status: 'active'
  },
  {
    id: 'col',
    name: 'Kolombia',
    code: 'COL',
    flag: '🇨🇴',
    elo: 1960,
    xgAttack: 1.75,
    xgDefense: 0.90,
    ppda: 9.8,
    progPasses: 51,
    setPieceEfficiency: 81,
    shotQuality: 0.13,
    marketReputation: 74, // Undervalued
    fifaRank: 10,
    group: 'J',
    status: 'active'
  },
  {
    id: 'jpn',
    name: 'Jepang',
    code: 'JPN',
    flag: '🇯🇵',
    elo: 1910,
    xgAttack: 1.70,
    xgDefense: 0.95,
    ppda: 8.8, // Relentless pressing
    progPasses: 50,
    setPieceEfficiency: 74,
    shotQuality: 0.12,
    marketReputation: 69, // Undervalued gem
    fifaRank: 15,
    group: 'K',
    status: 'active'
  },
  {
    id: 'sui',
    name: 'Swiss',
    code: 'SUI',
    flag: '🇨🇭',
    elo: 1890,
    xgAttack: 1.55,
    xgDefense: 0.90,
    ppda: 11.2,
    progPasses: 48,
    setPieceEfficiency: 76,
    shotQuality: 0.11,
    marketReputation: 71,
    fifaRank: 16,
    group: 'L',
    status: 'active'
  },
  {
    id: 'can',
    name: 'Kanada',
    code: 'CAN',
    flag: '🇨🇦',
    elo: 1820,
    xgAttack: 1.50,
    xgDefense: 1.15,
    ppda: 9.2, // Athletic host pressing
    progPasses: 45,
    setPieceEfficiency: 77,
    shotQuality: 0.11,
    marketReputation: 60, // Undervalued surprise host
    fifaRank: 24,
    group: 'A',
    status: 'active'
  },
  {
    id: 'mex',
    name: 'Meksiko',
    code: 'MEX',
    flag: '🇲🇽',
    elo: 1870,
    xgAttack: 1.60,
    xgDefense: 1.10,
    ppda: 10.0,
    progPasses: 47,
    setPieceEfficiency: 78,
    shotQuality: 0.12,
    marketReputation: 67, // Undervalued host
    fifaRank: 14,
    group: 'B',
    status: 'active'
  },
  {
    id: 'mar',
    name: 'Maroko',
    code: 'MAR',
    flag: '🇲🇦',
    elo: 1930,
    xgAttack: 1.50,
    xgDefense: 0.65, // Ironclad defense
    ppda: 12.0,
    progPasses: 44,
    setPieceEfficiency: 72,
    shotQuality: 0.11,
    marketReputation: 73,
    fifaRank: 12,
    group: 'C',
    status: 'active'
  },
  {
    id: 'sen',
    name: 'Senegal',
    code: 'SEN',
    flag: '🇸🇳',
    elo: 1860,
    xgAttack: 1.55,
    xgDefense: 1.00,
    ppda: 10.8,
    progPasses: 46,
    setPieceEfficiency: 75,
    shotQuality: 0.12,
    marketReputation: 66,
    fifaRank: 18,
    group: 'D',
    status: 'active'
  },
  {
    id: 'bel',
    name: 'Belgia',
    code: 'BEL',
    flag: '🇧🇪',
    elo: 1980,
    xgAttack: 1.85,
    xgDefense: 0.90,
    ppda: 9.6,
    progPasses: 54,
    setPieceEfficiency: 80,
    shotQuality: 0.13,
    marketReputation: 82,
    fifaRank: 7,
    group: 'E',
    status: 'active'
  },
  {
    id: 'nor',
    name: 'Norwegia',
    code: 'NOR',
    flag: '🇳🇴',
    elo: 1950,
    xgAttack: 1.90,
    xgDefense: 1.00,
    ppda: 10.2,
    progPasses: 50,
    setPieceEfficiency: 85,
    shotQuality: 0.14,
    marketReputation: 75,
    fifaRank: 13,
    group: 'G',
    status: 'active'
  },
  {
    id: 'par',
    name: 'Paraguay',
    code: 'PAR',
    flag: '🇵🇾',
    elo: 1850,
    xgAttack: 1.40,
    xgDefense: 0.85,
    ppda: 11.5,
    progPasses: 42,
    setPieceEfficiency: 78,
    shotQuality: 0.11,
    marketReputation: 65,
    fifaRank: 28,
    group: 'D',
    status: 'active'
  },
  {
    id: 'egy',
    name: 'Mesir',
    code: 'EGY',
    flag: '🇪🇬',
    elo: 1880,
    xgAttack: 1.60,
    xgDefense: 0.80,
    ppda: 11.0,
    progPasses: 45,
    setPieceEfficiency: 79,
    shotQuality: 0.12,
    marketReputation: 70,
    fifaRank: 20,
    group: 'A',
    status: 'active'
  }
];

const ISO_MAP: Record<string, string> = {
  esp: 'es',
  por: 'pt',
  arg: 'ar',
  fra: 'fr',
  bra: 'br',
  eng: 'gb-eng',
  usa: 'us',
  ita: 'it',
  uru: 'uy',
  col: 'co',
  jpn: 'jp',
  sui: 'ch',
  can: 'ca',
  mex: 'mx',
  mar: 'ma',
  sen: 'sn',
  bel: 'be',
  nor: 'no',
  par: 'py',
  egy: 'eg'
};

// Automatically enrich teams with Moneyball calculation, dynamic statistical sync override, and Flagpedia API URLs
export const TEAMS: Team[] = enrichTeamsWithMoneyball(rawTeams).map(t => {
  const iso = ISO_MAP[t.id] || t.id;
  const dyn = getDynamicTeamStats(t);
  return {
    ...dyn,
    isoCode: iso,
    flagUrl: `https://flagcdn.com/w80/${iso}.png`
  };
});

// Helper function to get team by ID or Code with live statistical overrides
export function getTeam(idOrCode: string): Team | undefined {
  const lower = idOrCode.toLowerCase();
  const found = TEAMS.find(t => t.id === lower || t.code.toLowerCase() === lower);
  return found ? getDynamicTeamStats(found) : undefined;
}
