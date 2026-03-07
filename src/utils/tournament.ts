import { Group, TeamStanding, Team, Match, KnockoutMatch } from '../types';

export function calculateStandings(group: Group, scores: Record<string, { scoreA: number; scoreB: number }>): TeamStanding[] {
  const standings: Record<string, TeamStanding> = {};

  group.matches.forEach(m => {
    if (!standings[m.teamA.id]) {
        standings[m.teamA.id] = { team: m.teamA, played: 0, won: 0, drawn: 0, lost: 0, points: 0, goalDiff: 0, goalsScored: 0, fairPlayPoints: 0 };
    }
    if (!standings[m.teamB.id]) {
        standings[m.teamB.id] = { team: m.teamB, played: 0, won: 0, drawn: 0, lost: 0, points: 0, goalDiff: 0, goalsScored: 0, fairPlayPoints: 0 };
    }
  });

  group.matches.forEach(match => {
    const score = scores[match.id];
    if (!score) return;

    const sA = standings[match.teamA.id];
    const sB = standings[match.teamB.id];

    sA.played++;
    sB.played++;
    sA.goalsScored += score.scoreA;
    sB.goalsScored += score.scoreB;
    sA.goalDiff += (score.scoreA - score.scoreB);
    sB.goalDiff += (score.scoreB - score.scoreA);

    if (score.scoreA > score.scoreB) {
      sA.won++;
      sA.points += 3;
      sB.lost++;
    } else if (score.scoreB > score.scoreA) {
      sB.won++;
      sB.points += 3;
      sA.lost++;
    } else {
      sA.drawn++;
      sB.drawn++;
      sA.points += 1;
      sB.points += 1;
    }
  });

  return Object.values(standings).sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) return b.points - a.points;
    // 2. Goal Difference
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    // 3. Goals Scored
    if (b.goalsScored !== a.goalsScored) return b.goalsScored - a.goalsScored;
    
    // 4. Head-to-head (Simplified for POC: just use team name as fallback for determinism)
    return a.team.name.localeCompare(b.team.name);
  });
}

export function getAdvancingTeams(groups: Group[], scores: Record<string, { scoreA: number; scoreB: number }>) {
  const groupStandings = groups.map(g => calculateStandings(g, scores));
  
  const firsts = groupStandings.map(s => s[0].team);
  const seconds = groupStandings.map(s => s[1].team);
  const thirds = groupStandings.map(s => s[2]);

  const topEightThird = thirds
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      if (b.goalsScored !== a.goalsScored) return b.goalsScored - a.goalsScored;
      return a.team.name.localeCompare(b.team.name);
    })
    .slice(0, 8)
    .map(st => st.team);

  return { firsts, seconds, topEightThird };
}

export function generateKnockoutBracket(
    groupResults: { firsts: Team[], seconds: Team[], topEightThird: Team[] },
    predictions: Record<string, 'A' | 'B'>
) {
    const { firsts, seconds, topEightThird } = groupResults;
    const allMatches: any[] = [];
    
    // Deterministic Pairing for R32
    // 1A vs 2C, 1B vs 2D, 1C vs 2A, 1D vs 2B
    // 1E vs 3rd(1), 1F vs 3rd(2), 1G vs 3rd(3), 1H vs 3rd(4)
    // 1I vs 3rd(5), 1J vs 3rd(6), 1K vs 3rd(7), 1L vs 3rd(8)
    // 2E vs 2G, 2F vs 2H, 2I vs 2K, 2J vs 2L
    
    const r32Matches: any[] = [
        { id: 'r32-1', stage: 'R32', teamA: firsts[0], teamB: seconds[2] }, // 1A vs 2C
        { id: 'r32-2', stage: 'R32', teamA: firsts[1], teamB: seconds[3] }, // 1B vs 2D
        { id: 'r32-3', stage: 'R32', teamA: firsts[2], teamB: seconds[0] }, // 1C vs 2A
        { id: 'r32-4', stage: 'R32', teamA: firsts[3], teamB: seconds[1] }, // 1D vs 2B
        { id: 'r32-5', stage: 'R32', teamA: firsts[4], teamB: topEightThird[0] }, // 1E vs 3rd(1)
        { id: 'r32-6', stage: 'R32', teamA: firsts[5], teamB: topEightThird[1] }, // 1F vs 3rd(2)
        { id: 'r32-7', stage: 'R32', teamA: firsts[6], teamB: topEightThird[2] }, // 1G vs 3rd(3)
        { id: 'r32-8', stage: 'R32', teamA: firsts[7], teamB: topEightThird[3] }, // 1H vs 3rd(4)
        { id: 'r32-9', stage: 'R32', teamA: firsts[8], teamB: topEightThird[4] }, // 1I vs 3rd(5)
        { id: 'r32-10', stage: 'R32', teamA: firsts[9], teamB: topEightThird[5] }, // 1J vs 3rd(6)
        { id: 'r32-11', stage: 'R32', teamA: firsts[10], teamB: topEightThird[6] }, // 1K vs 3rd(7)
        { id: 'r32-12', stage: 'R32', teamA: firsts[11], teamB: topEightThird[7] }, // 1L vs 3rd(8)
        { id: 'r32-13', stage: 'R32', teamA: seconds[4], teamB: seconds[6] }, // 2E vs 2G
        { id: 'r32-14', stage: 'R32', teamA: seconds[5], teamB: seconds[7] }, // 2F vs 2H
        { id: 'r32-15', stage: 'R32', teamA: seconds[8], teamB: seconds[10] }, // 2I vs 2K
        { id: 'r32-16', stage: 'R32', teamA: seconds[9], teamB: seconds[11] }, // 2J vs 2L
    ];

    allMatches.push(...r32Matches);

    const getWinner = (matchId: string, teamA?: Team, teamB?: Team) => {
        const pred = predictions[matchId];
        if (pred === 'A') return teamA;
        if (pred === 'B') return teamB;
        return undefined;
    };

    // R16
    const r16Matches: any[] = [];
    for (let i = 1; i <= 8; i++) {
        const id = `r16-${i}`;
        const teamA = getWinner(`r32-${(i * 2) - 1}`, r32Matches[(i * 2) - 2].teamA, r32Matches[(i * 2) - 2].teamB);
        const teamB = getWinner(`r32-${i * 2}`, r32Matches[(i * 2) - 1].teamA, r32Matches[(i * 2) - 1].teamB);
        const match = { id, stage: 'R16', teamA, teamB };
        r16Matches.push(match);
        allMatches.push(match);
    }

    // QF
    const qfMatches: any[] = [];
    for (let i = 1; i <= 4; i++) {
        const id = `qf-${i}`;
        const teamA = getWinner(`r16-${(i * 2) - 1}`, r16Matches[(i * 2) - 2].teamA, r16Matches[(i * 2) - 2].teamB);
        const teamB = getWinner(`r16-${i * 2}`, r16Matches[(i * 2) - 1].teamA, r16Matches[(i * 2) - 1].teamB);
        const match = { id, stage: 'QF', teamA, teamB };
        qfMatches.push(match);
        allMatches.push(match);
    }

    // SF
    const sfMatches: any[] = [];
    for (let i = 1; i <= 2; i++) {
        const id = `sf-${i}`;
        const teamA = getWinner(`qf-${(i * 2) - 1}`, qfMatches[(i * 2) - 2].teamA, qfMatches[(i * 2) - 2].teamB);
        const teamB = getWinner(`qf-${i * 2}`, qfMatches[(i * 2) - 1].teamA, qfMatches[(i * 2) - 1].teamB);
        const match = { id, stage: 'SF', teamA, teamB };
        sfMatches.push(match);
        allMatches.push(match);
    }

    // Final
    const teamA = getWinner('sf-1', sfMatches[0].teamA, sfMatches[0].teamB);
    const teamB = getWinner('sf-2', sfMatches[1].teamA, sfMatches[1].teamB);
    const finalMatch = { id: 'final-1', stage: 'Final', teamA, teamB };
    allMatches.push(finalMatch);

    return allMatches;
}
