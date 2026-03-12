import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, ChevronRight, Trophy, CreditCard as Cards } from 'lucide-react';
import { GROUPS } from '../constants';
import { getAdvancingTeams, generateKnockoutBracket } from '../utils/tournament';
import { AppState } from '../types';

interface ReviewConfirmProps {
  groupScores: Record<string, { scoreA: number; scoreB: number }>;
  knockoutPredictions: Record<string, 'A' | 'B'>;
  finalDetails: AppState['finalDetails'];
  onSubmit: () => void;
  key?: React.Key;
}

export default function ReviewConfirm({ groupScores, knockoutPredictions, finalDetails, onSubmit }: ReviewConfirmProps) {
  const knockoutMatches = useMemo(() => {
    const advancing = getAdvancingTeams(GROUPS, groupScores);
    return generateKnockoutBracket(advancing, knockoutPredictions);
  }, [groupScores, knockoutPredictions]);

  const knockoutWinners = useMemo(() => {
    // Filter out the final match as we'll handle it separately
    return knockoutMatches.filter(m => knockoutPredictions[m.id] && m.stage !== 'Final').map(match => {
        const pred = knockoutPredictions[match.id];
        const winner = pred === 'A' ? match.teamA : match.teamB;
        return { ...match, winner };
    });
  }, [knockoutMatches, knockoutPredictions]);

  const finalMatch = useMemo(() => {
    return knockoutMatches.find(m => m.stage === 'Final');
  }, [knockoutMatches]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-slate-50"
    >
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 px-6 py-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Review Predictions</h2>
        <p className="text-xs text-slate-400 font-medium">Final check before locking</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Group Stage Summary */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Group Stage</h3>
          <div className="space-y-2">
            {GROUPS.map(group => (
              <div key={group.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-600 text-sm">
                    {group.id}
                  </div>
                  <span className="font-bold text-slate-700">{group.name}</span>
                </div>
                <div className="flex items-center text-cdc-red space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold">Complete</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Knockout Summary */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Knockout Path</h3>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            {knockoutWinners.map(match => {
              return (
                <div key={match.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-300 mb-1">{match.stage}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{match.winner?.flag}</span>
                      <span className="text-sm font-bold text-slate-700">{match.winner?.name}</span>
                    </div>
                  </div>
                  <div className="text-cdc-blue">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final Details Summary */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">The Grand Final</h3>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-cdc-blue p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <span className="text-3xl">{finalMatch?.teamA?.flag}</span>
                  <span className="text-[10px] font-bold uppercase mt-1">{finalMatch?.teamA?.name}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black">{finalDetails.scoreA} - {finalDetails.scoreB}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Final Score</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl">{finalMatch?.teamB?.flag}</span>
                  <span className="text-[10px] font-bold uppercase mt-1">{finalMatch?.teamB?.name}</span>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4 divide-y divide-slate-50">
              <div className="flex justify-between items-center pt-0">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Champion</span>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-cdc-red" />
                  <span className="text-sm font-black text-slate-900">
                    {finalDetails.winner === 'A' ? finalMatch?.teamA?.name : finalMatch?.teamB?.name}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">First Goal</span>
                <span className="text-sm font-black text-slate-900">
                  {finalDetails.firstGoal === 'A' ? finalMatch?.teamA?.name : 
                   finalDetails.firstGoal === 'B' ? finalMatch?.teamB?.name : 'No Goals'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Yellow Cards</span>
                <div className="flex items-center space-x-2">
                  <Cards className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-black text-slate-900">{finalDetails.yellowCards}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Warning */}
        <div className="bg-cdc-red/5 rounded-2xl p-5 border border-cdc-red/10 flex items-start space-x-4">
          <AlertTriangle className="text-cdc-red w-5 h-5 shrink-0" />
          <p className="text-sm text-cdc-red/80 font-medium leading-relaxed">
            Once submitted, your predictions cannot be edited. Results will be revealed after the tournament concludes.
          </p>
        </div>

        <div className="h-24" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <button
          onClick={onSubmit}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-200 tap-target transition-all flex items-center justify-center space-x-2"
        >
          <span>Confirm & Submit</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
