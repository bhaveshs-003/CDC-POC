import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { GROUPS, MOCK_RESULTS } from '../constants';
import { AppState } from '../types';
import { getAdvancingTeams, generateKnockoutBracket } from '../utils/tournament';

interface ResultsRevealProps {
  groupScores: Record<string, { scoreA: number; scoreB: number }>;
  knockoutPredictions: Record<string, 'A' | 'B'>;
  finalDetails: AppState['finalDetails'];
  key?: React.Key;
}

export default function ResultsReveal({ groupScores, knockoutPredictions, finalDetails }: ResultsRevealProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const knockoutMatches = useMemo(() => {
    const advancing = getAdvancingTeams(GROUPS, groupScores);
    return generateKnockoutBracket(advancing, knockoutPredictions); 
  }, [groupScores, knockoutPredictions]);

  const finalMatch = useMemo(() => {
    return knockoutMatches.find(m => m.stage === 'Final');
  }, [knockoutMatches]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-slate-50"
    >
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 px-6 py-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Tournament Results</h2>
        <p className="text-xs text-slate-400 font-medium italic">Final Standings</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Summary Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden"
        >
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-black tracking-tight leading-tight">
                {MOCK_RESULTS.correctCount} out of {MOCK_RESULTS.totalCount}
              </h3>
              <p className="text-indigo-100 font-medium">Matches predicted correctly</p>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Group Stage Results */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Group Stage Results</h3>
          <div className="space-y-2">
            {GROUPS.map(group => (
              <div key={group.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                  className="w-full px-5 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-600 text-sm">
                      {group.id}
                    </div>
                    <span className="font-bold text-slate-700">{group.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-slate-400">View Matches</span>
                    {expandedGroup === group.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>
                {expandedGroup === group.id && (
                  <div className="px-5 pb-5 space-y-3 border-t border-slate-50 pt-4">
                    {group.matches.map(match => {
                      const isCorrect = MOCK_RESULTS.groupResults[match.id] === 'correct';
                      return (
                        <div key={match.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{match.teamA.flag}</span>
                            <span className="font-medium text-slate-600">{match.teamA.id}</span>
                            <span className="text-[10px] font-black text-slate-300 italic">VS</span>
                            <span className="font-medium text-slate-600">{match.teamB.id}</span>
                            <span className="text-lg">{match.teamB.flag}</span>
                          </div>
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Knockout Results */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Knockout Path Results</h3>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            {knockoutMatches.filter(m => m.stage !== 'Final').map(match => {
              const isCorrect = MOCK_RESULTS.knockoutResults[match.id] === 'correct';
              return (
                <div key={match.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-300 mb-1">{match.stage}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{match.teamA?.flag || '🏳️'}</span>
                      <span className="text-sm font-bold text-slate-700">{match.teamA?.name || 'TBD'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {isCorrect ? (
                      <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Correct</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 bg-rose-50 text-rose-600 px-2 py-1 rounded-lg">
                        <XCircle className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Incorrect</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final Results Details */}
        <section className="space-y-3 pb-8">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">The Grand Final Result</h3>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-indigo-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <span className="text-3xl">{finalMatch?.teamA?.flag}</span>
                  <span className="text-[10px] font-bold uppercase mt-1">{finalMatch?.teamA?.name}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black">{finalDetails.scoreA} - {finalDetails.scoreB}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Your Prediction</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl">{finalMatch?.teamB?.flag}</span>
                  <span className="text-[10px] font-bold uppercase mt-1">{finalMatch?.teamB?.name}</span>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-700">Champion Prediction</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-slate-700">First Goal Scorer</span>
                </div>
                <XCircle className="w-5 h-5 text-rose-500" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
