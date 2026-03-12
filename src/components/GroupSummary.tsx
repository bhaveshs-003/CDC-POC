import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Trophy, ChevronRight, Info } from 'lucide-react';
import { GROUPS } from '../constants';
import { calculateStandings, getAdvancingTeams } from '../utils/tournament';
import { TeamStanding } from '../types';

interface GroupSummaryProps {
  groupScores: Record<string, { scoreA: number; scoreB: number }>;
  onContinue: () => void;
  key?: React.Key;
}

export default function GroupSummary({ groupScores, onContinue }: GroupSummaryProps) {
  const allStandings = useMemo(() => {
    return GROUPS.map(group => ({
      group,
      standings: calculateStandings(group, groupScores)
    }));
  }, [groupScores]);

  const { topEightThird } = useMemo(() => {
    return getAdvancingTeams(GROUPS, groupScores);
  }, [groupScores]);

  const thirdPlacedTeams = useMemo(() => {
    return allStandings.map(s => s.standings[2]).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      if (b.goalsScored !== a.goalsScored) return b.goalsScored - a.goalsScored;
      return a.team.name.localeCompare(b.team.name);
    });
  }, [allStandings]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-slate-50"
    >
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 px-6 py-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Group Stage Summary</h2>
        <p className="text-xs text-slate-400 font-medium">Final Group Standings & Qualifiers</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Top 8 Third Place Teams */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Best 3rd Place Teams</h3>
            <div className="flex items-center space-x-1 text-[10px] font-bold text-cdc-blue bg-cdc-blue/5 px-2 py-0.5 rounded-full">
              <Info className="w-3 h-3" />
              <span>Top 8 Qualify</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-2 font-bold text-slate-400 text-[10px] uppercase">Team</th>
                  <th className="px-2 py-2 font-bold text-slate-400 text-[10px] uppercase text-center">Pts</th>
                  <th className="px-2 py-2 font-bold text-slate-400 text-[10px] uppercase text-center">GD</th>
                  <th className="px-4 py-2 font-bold text-slate-400 text-[10px] uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {thirdPlacedTeams.map((st, idx) => {
                  const isQualified = topEightThird.some(t => t.id === st.team.id);
                  return (
                    <tr key={st.team.id} className={isQualified ? 'bg-emerald-50/30' : 'opacity-60'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{st.team.flag}</span>
                          <span className="font-bold text-slate-700">{st.team.id}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-center font-black text-slate-900">{st.points}</td>
                      <td className="px-2 py-3 text-center font-medium text-slate-500">{st.goalDiff > 0 ? `+${st.goalDiff}` : st.goalDiff}</td>
                      <td className="px-4 py-3 text-right">
                        {isQualified ? (
                          <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">Qualified</span>
                        ) : (
                          <span className="text-[10px] font-black uppercase text-slate-400">Out</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* All Groups Standings */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">All Group Standings</h3>
          <div className="grid grid-cols-1 gap-6">
            {allStandings.map(({ group, standings }) => (
              <div key={group.id} className="space-y-2">
                <div className="flex items-center space-x-2 px-2">
                  <div className="w-6 h-6 bg-cdc-blue text-white rounded flex items-center justify-center font-bold text-[10px]">
                    {group.id}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{group.name}</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2 font-bold text-slate-400 uppercase">Team</th>
                        <th className="px-2 py-2 font-bold text-slate-400 uppercase text-center">P</th>
                        <th className="px-2 py-2 font-bold text-slate-400 uppercase text-center">GD</th>
                        <th className="px-2 py-2 font-bold text-slate-400 uppercase text-center">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {standings.map((st, idx) => (
                        <tr key={st.team.id} className={idx < 2 ? 'bg-indigo-50/20' : ''}>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center space-x-2">
                              <span className="text-base">{st.team.flag}</span>
                              <span className={`font-bold ${idx < 2 ? 'text-cdc-blue' : 'text-slate-600'}`}>{st.team.name}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2.5 text-center font-medium text-slate-500">{st.played}</td>
                          <td className="px-2 py-2.5 text-center font-medium text-slate-500">{st.goalDiff > 0 ? `+${st.goalDiff}` : st.goalDiff}</td>
                          <td className="px-2 py-2.5 text-center font-black text-slate-900">{st.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-24" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <button
          onClick={onContinue}
          className="w-full bg-cdc-blue text-white font-bold py-4 rounded-2xl shadow-lg shadow-cdc-blue/20 tap-target transition-all flex items-center justify-center space-x-2"
        >
          <span>Continue to Round of 32</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
