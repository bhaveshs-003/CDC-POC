import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, ChevronRight, ChevronLeft, CreditCard as Cards } from 'lucide-react';
import { Team } from '../types';

interface FinalsPredictionProps {
  teamA: Team;
  teamB: Team;
  step: 'winner' | 'score-a' | 'score-b' | 'first-goal' | 'yellow-cards';
  value: any;
  onUpdate: (value: any) => void;
  onNext: () => void;
  onBack: () => void;
  key?: React.Key;
}

export default function FinalsPrediction({
  teamA,
  teamB,
  step,
  value,
  onUpdate,
  onNext,
  onBack
}: FinalsPredictionProps) {
  const renderQuestion = () => {
    switch (step) {
      case 'winner':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 text-center">Who will win this match?</h3>
            <div className="grid grid-cols-2 gap-4">
              <TeamOption
                team={teamA}
                isSelected={value === 'A'}
                onClick={() => onUpdate('A')}
              />
              <TeamOption
                team={teamB}
                isSelected={value === 'B'}
                onClick={() => onUpdate('B')}
              />
            </div>
          </div>
        );
      case 'score-a':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-900">What will be the final score for {teamA.name}?</h3>
              <p className="text-4xl font-black text-cdc-blue">{value ?? 0}</p>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={value ?? 0}
              onChange={(e) => onUpdate(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cdc-blue"
            />
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>0 Goals</span>
              <span>10 Goals</span>
            </div>
          </div>
        );
      case 'score-b':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-900">What will be the final score for {teamB.name}?</h3>
              <p className="text-4xl font-black text-cdc-blue">{value ?? 0}</p>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={value ?? 0}
              onChange={(e) => onUpdate(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cdc-blue"
            />
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>0 Goals</span>
              <span>10 Goals</span>
            </div>
          </div>
        );
      case 'first-goal':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 text-center">Which team will score the FIRST goal?</h3>
            <div className="grid grid-cols-1 gap-3">
              <TeamOptionHorizontal
                team={teamA}
                isSelected={value === 'A'}
                onClick={() => onUpdate('A')}
              />
              <TeamOptionHorizontal
                team={teamB}
                isSelected={value === 'B'}
                onClick={() => onUpdate('B')}
              />
              <button
                onClick={() => onUpdate('None')}
                className={`w-full p-4 rounded-2xl border-2 transition-all font-bold ${
                  value === 'None'
                    ? 'border-cdc-blue bg-cdc-blue/5 text-cdc-blue'
                    : 'border-slate-100 bg-white text-slate-600'
                }`}
              >
                No Goals (0-0)
              </button>
            </div>
          </div>
        );
      case 'yellow-cards':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-900">How many yellow cards will be given in the match?</h3>
              <div className="flex items-center justify-center space-x-3">
                <Cards className="w-8 h-8 text-amber-400" />
                <p className="text-4xl font-black text-cdc-blue">{value ?? 0}</p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={value ?? 0}
              onChange={(e) => onUpdate(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cdc-blue"
            />
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>0 Cards</span>
              <span>15 Cards</span>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-slate-50"
    >
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold text-slate-900">The Final</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center">
        {renderQuestion()}
      </div>

      <div className="p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <button
          disabled={value === undefined}
          onClick={onNext}
          className="w-full bg-cdc-blue disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-lg shadow-cdc-blue/20 tap-target transition-all flex items-center justify-center space-x-2"
        >
          <span>Continue</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

function TeamOption({ team, isSelected, onClick }: { team: Team; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-6 rounded-3xl border-2 transition-all space-y-3 ${
        isSelected ? 'border-cdc-blue bg-cdc-blue/5' : 'border-white bg-white shadow-sm'
      }`}
    >
      <span className="text-5xl">{team.flag}</span>
      <span className={`font-bold text-center ${isSelected ? 'text-cdc-blue' : 'text-slate-700'}`}>
        {team.name}
      </span>
    </button>
  );
}

function TeamOptionHorizontal({ team, isSelected, onClick }: { team: Team; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center p-4 rounded-2xl border-2 transition-all space-x-4 ${
        isSelected ? 'border-cdc-blue bg-cdc-blue/5' : 'border-slate-100 bg-white'
      }`}
    >
      <span className="text-2xl">{team.flag}</span>
      <span className={`font-bold ${isSelected ? 'text-cdc-blue' : 'text-slate-700'}`}>
        {team.name}
      </span>
    </button>
  );
}
