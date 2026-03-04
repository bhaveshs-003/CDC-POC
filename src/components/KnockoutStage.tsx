import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Trophy, Lock, CheckCircle2, Info } from 'lucide-react';
import { GROUPS } from '../constants';
import { Team, KnockoutMatch, Group } from '../types';
import { getAdvancingTeams, generateKnockoutBracket } from '../utils/tournament';

interface KnockoutStageProps {
  currentStage: 'R32' | 'R16' | 'QF' | 'SF' | 'Final';
  groupScores: Record<string, { scoreA: number; scoreB: number }>;
  predictions: Record<string, 'A' | 'B'>;
  onPredict: (matchId: string, winner: 'A' | 'B') => void;
  onContinue: () => void;
  key?: React.Key;
}

export default function KnockoutStage({ 
  currentStage,
  groupScores, 
  predictions, 
  onPredict, 
  onContinue 
}: KnockoutStageProps) {
  const advancingTeams = useMemo(() => {
    return getAdvancingTeams(GROUPS, groupScores);
  }, [groupScores]);

  const matchesWithTeams = useMemo(() => {
    return generateKnockoutBracket(advancingTeams, predictions);
  }, [advancingTeams, predictions]);

  const stageInfo = useMemo(() => {
    const stages = [
      { id: 'R32', name: 'Round of 32', matches: matchesWithTeams.filter(m => m.stage === 'R32') },
      { id: 'R16', name: 'Round of 16', matches: matchesWithTeams.filter(m => m.stage === 'R16') },
      { id: 'QF', name: 'Quarterfinals', matches: matchesWithTeams.filter(m => m.stage === 'QF') },
      { id: 'SF', name: 'Semifinals', matches: matchesWithTeams.filter(m => m.stage === 'SF') },
      { id: 'Final', name: 'The Final', matches: matchesWithTeams.filter(m => m.stage === 'Final') },
    ];
    return stages.find(s => s.id === currentStage);
  }, [matchesWithTeams, currentStage]);

  const isCompleted = useMemo(() => {
    return stageInfo?.matches.every(m => predictions[m.id]) ?? false;
  }, [stageInfo, predictions]);

  if (!stageInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-slate-50"
    >
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 px-6 py-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">{stageInfo.name}</h2>
        <p className="text-xs text-slate-400 font-medium italic">Select winners to advance them</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-3">
          {stageInfo.matches.map((match) => (
            <KnockoutMatchCard
              key={match.id}
              match={match}
              prediction={predictions[match.id]}
              onPredict={(winner) => onPredict(match.id, winner)}
              disabled={!match.teamA || !match.teamB || match.teamA.id === 'TBD' || match.teamB.id === 'TBD'}
            />
          ))}
        </div>
        <div className="h-24" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <button
          disabled={!isCompleted}
          onClick={onContinue}
          className="w-full bg-indigo-600 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 tap-target transition-all"
        >
          {currentStage === 'Final' ? 'Review & Submit' : `Continue to ${
            currentStage === 'R32' ? 'Round of 16' : 
            currentStage === 'R16' ? 'Quarterfinals' : 
            currentStage === 'QF' ? 'Semifinals' : 'Final'
          }`}
        </button>
      </div>
    </motion.div>
  );
}

function KnockoutMatchCard({
  match,
  prediction,
  onPredict,
  disabled
}: {
  match: KnockoutMatch;
  prediction?: 'A' | 'B';
  onPredict: (winner: 'A' | 'B') => void;
  disabled: boolean;
  key?: React.Key;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-1 shadow-sm overflow-hidden ${disabled ? 'grayscale opacity-50' : ''}`}>
      <div className="flex flex-col">
        <KnockoutTeamButton
          team={match.teamA}
          isSelected={prediction === 'A'}
          isOpponentSelected={prediction === 'B'}
          onClick={() => onPredict('A')}
          disabled={disabled}
        />
        <div className="h-px bg-slate-50 mx-4" />
        <KnockoutTeamButton
          team={match.teamB}
          isSelected={prediction === 'B'}
          isOpponentSelected={prediction === 'A'}
          onClick={() => onPredict('B')}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function KnockoutTeamButton({
  team,
  isSelected,
  isOpponentSelected,
  onClick,
  disabled
}: {
  team?: Team;
  isSelected: boolean;
  isOpponentSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  const isLocked = isSelected || isOpponentSelected;

  return (
    <button
      disabled={disabled || isLocked}
      onClick={onClick}
      className={`
        w-full px-4 py-4 flex items-center justify-between transition-all rounded-xl
        ${isSelected ? 'bg-indigo-50' : 'bg-transparent'}
      `}
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{team?.flag || '🏳️'}</span>
        <span className={`font-bold transition-colors ${isSelected ? 'text-indigo-600' : isOpponentSelected ? 'text-slate-300' : 'text-slate-700'}`}>
          {team?.name || 'TBD'}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-1 bg-indigo-600 text-white px-2 py-1 rounded-lg"
          >
            <Lock className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Winner</span>
          </motion.div>
        )}
        {!isLocked && !disabled && team && team.id !== 'TBD' && (
          <div className="w-6 h-6 rounded-full border-2 border-slate-100 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-100" />
          </div>
        )}
      </div>
    </button>
  );
}
