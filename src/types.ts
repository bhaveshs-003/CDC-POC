export type Team = {
  id: string;
  name: string;
  flag: string;
};

export type Match = {
  id: string;
  group: string;
  teamA: Team;
  teamB: Team;
  result?: 'A' | 'B' | 'Draw';
};

export type Group = {
  id: string;
  name: string;
  matches: Match[];
};

export type KnockoutMatch = {
  id: string;
  stage: 'R32' | 'R16' | 'QF' | 'SF' | 'Final';
  teamA?: Team;
  teamB?: Team;
  winner?: 'A' | 'B';
  nextMatchId?: string;
};

export type AppState = {
  screen: 'dashboard' | 'group-stage' | 'r32' | 'r16' | 'qf' | 'sf' | 'final-winner' | 'final-score-a' | 'final-score-b' | 'final-first-goal' | 'final-yellow-cards' | 'review' | 'waiting' | 'results';
  groupScores: Record<string, { scoreA: number; scoreB: number }>;
  knockoutPredictions: Record<string, 'A' | 'B'>;
  finalDetails: {
    winner?: 'A' | 'B';
    scoreA?: number;
    scoreB?: number;
    firstGoal?: 'A' | 'B' | 'None';
    yellowCards?: number;
  };
  submittedAt?: string;
};

export type TeamStanding = {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalDiff: number;
  goalsScored: number;
  fairPlayPoints: number;
};
