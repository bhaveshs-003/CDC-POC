import { Team, Group, Match, KnockoutMatch } from './types';

export const TEAMS: Record<string, Team> = {
  USA: { id: 'USA', name: 'USA', flag: '🇺🇸' },
  MEX: { id: 'MEX', name: 'Mexico', flag: '🇲🇽' },
  CAN: { id: 'CAN', name: 'Canada', flag: '🇨🇦' },
  ARG: { id: 'ARG', name: 'Argentina', flag: '🇦🇷' },
  BRA: { id: 'BRA', name: 'Brazil', flag: '🇧🇷' },
  FRA: { id: 'FRA', name: 'France', flag: '🇫🇷' },
  ENG: { id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  ESP: { id: 'ESP', name: 'Spain', flag: '🇪🇸' },
  GER: { id: 'GER', name: 'Germany', flag: '🇩🇪' },
  ITA: { id: 'ITA', name: 'Italy', flag: '🇮🇹' },
  POR: { id: 'POR', name: 'Portugal', flag: '🇵🇹' },
  NED: { id: 'NED', name: 'Netherlands', flag: '🇳🇱' },
  BEL: { id: 'BEL', name: 'Belgium', flag: '🇧🇪' },
  CRO: { id: 'CRO', name: 'Croatia', flag: '🇭🇷' },
  MAR: { id: 'MAR', name: 'Morocco', flag: '🇲🇦' },
  JPN: { id: 'JPN', name: 'Japan', flag: '🇯🇵' },
  KOR: { id: 'KOR', name: 'South Korea', flag: '🇰🇷' },
  SEN: { id: 'SEN', name: 'Senegal', flag: '🇸🇳' },
  URU: { id: 'URU', name: 'Uruguay', flag: '🇺🇾' },
  SUI: { id: 'SUI', name: 'Switzerland', flag: '🇨🇭' },
  DEN: { id: 'DEN', name: 'Denmark', flag: '🇩🇰' },
  COL: { id: 'COL', name: 'Colombia', flag: '🇨🇴' },
  ECU: { id: 'ECU', name: 'Ecuador', flag: '🇪🇨' },
  NGA: { id: 'NGA', name: 'Nigeria', flag: '🇳🇬' },
  EGY: { id: 'EGY', name: 'Egypt', flag: '🇪🇬' },
  TUN: { id: 'TUN', name: 'Tunisia', flag: '🇹🇳' },
  CMR: { id: 'CMR', name: 'Cameroon', flag: '🇨🇲' },
  GHA: { id: 'GHA', name: 'Ghana', flag: '🇬🇭' },
  CIV: { id: 'CIV', name: 'Ivory Coast', flag: '🇨🇮' },
  ALG: { id: 'ALG', name: 'Algeria', flag: '🇩🇿' },
  AUS: { id: 'AUS', name: 'Australia', flag: '🇦🇺' },
  KSA: { id: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦' },
  IRN: { id: 'IRN', name: 'Iran', flag: '🇮🇷' },
  IRQ: { id: 'IRQ', name: 'Iraq', flag: '🇮🇶' },
  QAT: { id: 'QAT', name: 'Qatar', flag: '🇶🇦' },
  SWE: { id: 'SWE', name: 'Sweden', flag: '🇸🇪' },
  NOR: { id: 'NOR', name: 'Norway', flag: '🇳🇴' },
  POL: { id: 'POL', name: 'Poland', flag: '🇵🇱' },
  UKR: { id: 'UKR', name: 'Ukraine', flag: '🇺🇦' },
  AUT: { id: 'AUT', name: 'Austria', flag: '🇦🇹' },
  TUR: { id: 'TUR', name: 'Turkey', flag: '🇹🇷' },
  CHI: { id: 'CHI', name: 'Chile', flag: '🇨🇱' },
  PAR: { id: 'PAR', name: 'Paraguay', flag: '🇵🇾' },
  PER: { id: 'PER', name: 'Peru', flag: '🇵🇪' },
  SCO: { id: 'SCO', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  WAL: { id: 'WAL', name: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  SRB: { id: 'SRB', name: 'Serbia', flag: '🇷🇸' },
  CZE: { id: 'CZE', name: 'Czech Republic', flag: '🇨🇿' },
};

const teamList = Object.values(TEAMS);

export const GROUPS: Group[] = Array.from({ length: 12 }, (_, i) => {
  const groupId = String.fromCharCode(65 + i); // A, B, C...
  const groupTeams = [
    teamList[(i * 4) % teamList.length],
    teamList[(i * 4 + 1) % teamList.length],
    teamList[(i * 4 + 2) % teamList.length],
    teamList[(i * 4 + 3) % teamList.length],
  ];

  const matches: Match[] = [
    { id: `g-${groupId}-1`, group: groupId, teamA: groupTeams[0], teamB: groupTeams[1] },
    { id: `g-${groupId}-2`, group: groupId, teamA: groupTeams[2], teamB: groupTeams[3] },
    { id: `g-${groupId}-3`, group: groupId, teamA: groupTeams[0], teamB: groupTeams[2] },
    { id: `g-${groupId}-4`, group: groupId, teamA: groupTeams[1], teamB: groupTeams[3] },
    { id: `g-${groupId}-5`, group: groupId, teamA: groupTeams[0], teamB: groupTeams[3] },
    { id: `g-${groupId}-6`, group: groupId, teamA: groupTeams[1], teamB: groupTeams[2] },
  ];

  return { id: groupId, name: `Group ${groupId}`, matches };
});

// Static Knockout Bracket
export const KNOCKOUT_STAGES: KnockoutMatch[] = [
  // Round of 32 (Simplified for POC)
  { id: 'r32-1', stage: 'R32', teamA: TEAMS.ARG, teamB: TEAMS.MEX, nextMatchId: 'r16-1' },
  { id: 'r32-2', stage: 'R32', teamA: TEAMS.FRA, teamB: TEAMS.SEN, nextMatchId: 'r16-1' },
  { id: 'r32-3', stage: 'R32', teamA: TEAMS.BRA, teamB: TEAMS.JPN, nextMatchId: 'r16-2' },
  { id: 'r32-4', stage: 'R32', teamA: TEAMS.ESP, teamB: TEAMS.MAR, nextMatchId: 'r16-2' },
  
  // Round of 16
  { id: 'r16-1', stage: 'R16', nextMatchId: 'qf-1' },
  { id: 'r16-2', stage: 'R16', nextMatchId: 'qf-1' },
  
  // Quarterfinals
  { id: 'qf-1', stage: 'QF', nextMatchId: 'sf-1' },
  
  // Semifinals
  { id: 'sf-1', stage: 'SF', nextMatchId: 'final' },
  
  // Final
  { id: 'final', stage: 'Final' },
];

export const MOCK_RESULTS = {
  correctCount: 78,
  totalCount: 104,
  groupResults: GROUPS.reduce((acc, group) => {
    group.matches.forEach(m => {
      acc[m.id] = Math.random() > 0.3 ? 'correct' : 'incorrect';
    });
    return acc;
  }, {} as Record<string, 'correct' | 'incorrect'>),
  knockoutResults: {
    'r32-1': 'correct',
    'r32-2': 'incorrect',
    'r32-3': 'correct',
    'r32-4': 'correct',
    'r16-1': 'correct',
    'r16-2': 'incorrect',
    'qf-1': 'correct',
    'sf-1': 'correct',
    'final': 'correct',
  } as Record<string, 'correct' | 'incorrect'>
};
