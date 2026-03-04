import { Group, TeamStanding, Team, Match } from '../types';

export function calculateStandings(group: Group, scores: Record<string, { scoreA: number; scoreB: number }>): TeamStanding[] {
  const standings: Record<string, TeamStanding> = {};

  group.matches.forEach(m => {
    if (!standings[m.teamA.id]) {
        standings[m.teamA.id] = { team: m.teamA, played: 0, won: 0, drawn: 0, lost: 0, points: 0, goalDiff: 0 };
    }
    if (!standings[m.teamB.id]) {
        standings[m.teamB.id] = { team: m.teamB, played: 0, won: 0, drawn: 0, lost: 0, points: 0, goalDiff: 0 };
    }
  });

  group.matches.forEach(match => {
    const score = scores[match.id];
    if (!score) return;

    const sA = standings[match.teamA.id];
    const sB = standings[match.teamB.id];

    sA.played++;
    sB.played++;

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
    if (b.points !== a.points) return b.points - a.points;
    return b.goalDiff - a.goalDiff;
  });
}

export function getAdvancingTeams(groups: Group[], scores: Record<string, { scoreA: number; scoreB: number }>) {
  const groupStandings = groups.map(g => calculateStandings(g, scores));
  
  const topTwo = groupStandings.flatMap(s => s.slice(0, 2).map(st => st.team));
  const thirdPlaced = groupStandings.map(s => s[2]).filter(Boolean);

  const topEightThird = thirdPlaced
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.goalDiff - a.goalDiff;
    })
    .slice(0, 8)
    .map(st => st.team);

  return [...topTwo, ...topEightThird];
}

export function generateKnockoutBracket(
    advancingTeams: Team[], 
    predictions: Record<string, 'A' | 'B'>
) {
    const allMatches: any[] = [];
    
    // R32
    const r32Matches: any[] = [];
    for (let i = 0; i < 16; i++) {
      const match = {
        id: `r32-${i + 1}`,
        stage: 'R32',
        teamA: advancingTeams[i * 2],
        teamB: advancingTeams[i * 2 + 1],
      };
      r32Matches.push(match);
      allMatches.push(match);
    }

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
