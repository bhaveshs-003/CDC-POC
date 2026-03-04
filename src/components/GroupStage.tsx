import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, CheckCircle2, Lock } from 'lucide-react';
import { GROUPS } from '../constants';
import { Group, Match } from '../types';

interface GroupStageProps {
  scores: Record<string, { scoreA: number; scoreB: number }>;
  onPredict: (matchId: string, scoreA: number, scoreB: number) => void;
  onContinue: () => void;
  key?: React.Key;
}

export default function GroupStage({ scores, onPredict, onContinue }: GroupStageProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(GROUPS[0].id);

  const completedCount = useMemo(() => {
    return Object.keys(scores).filter(id => id.startsWith('g-')).length;
  }, [scores]);

  const totalMatches = 72;
  const progress = (completedCount / totalMatches) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="flex flex-col h-full bg-slate-50"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Group Stage</h2>
            <p className="text-xs text-slate-400 font-medium">{completedCount} of {totalMatches} Matches Completed</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-indigo-600">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-indigo-600"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {GROUPS.map((group) => (
          <GroupAccordion
            key={group.id}
            group={group}
            isExpanded={expandedGroup === group.id}
            onToggle={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
            scores={scores}
            onPredict={onPredict}
          />
        ))}
        <div className="h-24" /> {/* Spacer for sticky button */}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <button
          disabled={completedCount < totalMatches}
          onClick={onContinue}
          className="w-full bg-indigo-600 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 tap-target transition-all"
        >
          Continue to Knockouts
        </button>
      </div>
    </motion.div>
  );
}

function GroupAccordion({
  group,
  isExpanded,
  onToggle,
  scores,
  onPredict
}: {
  group: Group;
  isExpanded: boolean;
  onToggle: () => void;
  scores: Record<string, { scoreA: number; scoreB: number }>;
  onPredict: (matchId: string, scoreA: number, scoreB: number) => void;
  key?: React.Key;
}) {
  const groupCompletedCount = group.matches.filter(m => scores[m.id]).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
            {group.id}
          </div>
          <span className="font-bold text-slate-700">{group.name}</span>
        </div>
        <div className="flex items-center space-x-3">
          {groupCompletedCount === 6 && (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          )}
          <span className="text-xs font-bold text-slate-400">{groupCompletedCount}/6</span>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-50"
          >
            <div className="p-4 space-y-4">
              {group.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  score={scores[match.id]}
                  onPredict={(sA, sB) => onPredict(match.id, sA, sB)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MatchCard({
  match,
  score,
  onPredict
}: {
  match: Match;
  score?: { scoreA: number; scoreB: number };
  onPredict: (scoreA: number, scoreB: number) => void;
  key?: React.Key;
}) {
  const [sA, setSA] = useState(0);
  const [sB, setSB] = useState(0);

  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col items-center space-y-2">
          <span className="text-2xl">{match.teamA.flag}</span>
          <span className="text-xs font-bold text-slate-700 text-center h-8 flex items-center">{match.teamA.name}</span>
          {score ? (
            <div className="text-2xl font-black text-slate-900">{score.scoreA}</div>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSA(Math.max(0, sA - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
              >
                -
              </button>
              <span className="text-lg font-bold text-slate-700 w-4 text-center">{sA}</span>
              <button 
                onClick={() => setSA(sA + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
              >
                +
              </button>
            </div>
          )}
        </div>

        <div className="px-4 flex flex-col items-center justify-center space-y-1">
          <span className="text-[10px] font-black text-slate-300 italic">VS</span>
          {score && <Lock className="w-3 h-3 text-slate-300" />}
        </div>

        <div className="flex-1 flex flex-col items-center space-y-2">
          <span className="text-2xl">{match.teamB.flag}</span>
          <span className="text-xs font-bold text-slate-700 text-center h-8 flex items-center">{match.teamB.name}</span>
          {score ? (
            <div className="text-2xl font-black text-slate-900">{score.scoreB}</div>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSB(Math.max(0, sB - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
              >
                -
              </button>
              <span className="text-lg font-bold text-slate-700 w-4 text-center">{sB}</span>
              <button 
                onClick={() => setSB(sB + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {!score && (
        <button
          onClick={() => onPredict(sA, sB)}
          className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-2 rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
        >
          Lock Result
        </button>
      )}
    </div>
  );
}

function PredictionButton({
  label,
  isSelected,
  isDisabled,
  onClick
}: {
  label: string;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={isDisabled || isSelected}
      onClick={onClick}
      className={`
        tap-target rounded-xl text-xs font-bold uppercase tracking-wider transition-all border
        ${isSelected 
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' 
          : isDisabled 
            ? 'bg-slate-50 border-slate-100 text-slate-300 opacity-50' 
            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50'}
      `}
    >
      {isSelected && <Lock className="w-3 h-3 mr-1.5" />}
      {label}
    </button>
  );
}
