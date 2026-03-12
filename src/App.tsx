import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import GroupStage from './components/GroupStage';
import KnockoutStage from './components/KnockoutStage';
import ReviewConfirm from './components/ReviewConfirm';
import WaitingScreen from './components/WaitingScreen';
import ResultsReveal from './components/ResultsReveal';
import FinalsPrediction from './components/FinalsPrediction';
import SplashScreen from './components/SplashScreen';
import GroupSummary from './components/GroupSummary';
import TransitionSplash from './components/TransitionSplash';
import { AppState } from './types';
import { GROUPS } from './constants';
import { getAdvancingTeams, generateKnockoutBracket } from './utils/tournament';

export default function App() {
  const [state, setState] = useState<AppState>({
    screen: 'dashboard',
    groupScores: {},
    knockoutPredictions: {},
    finalDetails: {},
  });

  const handleStart = () => {
    setState(prev => ({ ...prev, screen: 'splash' }));
  };

  const handleSplashComplete = () => {
    setState(prev => ({ ...prev, screen: 'group-stage' }));
  };

  const handleGroupPredict = (matchId: string, scoreA: number, scoreB: number) => {
    if (state.groupScores[matchId]) return; // Irreversible
    setState(prev => ({
      ...prev,
      groupScores: { ...prev.groupScores, [matchId]: { scoreA, scoreB } }
    }));
  };

  const handleSkipGroups = () => {
    const allScores: Record<string, { scoreA: number; scoreB: number }> = {};
    GROUPS.forEach(group => {
      group.matches.forEach(match => {
        allScores[match.id] = { scoreA: 0, scoreB: 0 };
      });
    });
    setState(prev => ({
      ...prev,
      groupScores: allScores
    }));
  };

  const handleKnockoutPredict = (matchId: string, winner: 'A' | 'B') => {
    if (state.knockoutPredictions[matchId]) return; // Irreversible
    setState(prev => ({
      ...prev,
      knockoutPredictions: { ...prev.knockoutPredictions, [matchId]: winner }
    }));
  };

  const handleFinalDetailUpdate = (field: keyof AppState['finalDetails'], value: any) => {
    setState(prev => ({
      ...prev,
      finalDetails: { ...prev.finalDetails, [field]: value }
    }));
  };

  const getFinalTeams = () => {
    const advancing = getAdvancingTeams(GROUPS, state.groupScores);
    const bracket = generateKnockoutBracket(advancing, state.knockoutPredictions);
    const finalMatch = bracket.find(m => m.id === 'final-1');
    return { teamA: finalMatch?.teamA, teamB: finalMatch?.teamB };
  };

  const handleSubmit = () => {
    setState(prev => ({
      ...prev,
      screen: 'waiting',
      submittedAt: new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    }));
  };

  // For demo purposes, allow switching to results screen via a hidden trigger or just state change
  // In a real app, this would be server-driven
  const toggleResults = () => {
    setState(prev => ({ ...prev, screen: prev.screen === 'results' ? 'dashboard' : 'results' }));
  };

  const handleReset = () => {
    localStorage.removeItem('wc2026_prediction_state');
    setState({
      screen: 'dashboard',
      groupScores: {},
      knockoutPredictions: {},
      finalDetails: {},
    });
  };

  return (
    <div className="h-screen w-full max-w-[390px] mx-auto bg-slate-50 overflow-hidden relative shadow-2xl">
      <AnimatePresence mode="wait">
        {state.screen === 'dashboard' && (
          <Dashboard key="dashboard" onStart={handleStart} />
        )}
        {state.screen === 'splash' && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
        {state.screen === 'group-stage' && (
          <GroupStage
            key="group-stage"
            scores={state.groupScores}
            onPredict={handleGroupPredict}
            onSkip={handleSkipGroups}
            onContinue={() => setState(prev => ({ ...prev, screen: 'group-summary' }))}
          />
        )}
        {state.screen === 'group-summary' && (
          <GroupSummary
            key="group-summary"
            groupScores={state.groupScores}
            onContinue={() => setState(prev => ({ ...prev, screen: 'group-splash' }))}
          />
        )}
        {state.screen === 'group-splash' && (
          <TransitionSplash
            key="group-splash"
            title="Level 1 Completed"
            subtitle="let's wait for the 32 teams"
            onComplete={() => setState(prev => ({ ...prev, screen: 'r32' }))}
          />
        )}
        {state.screen === 'r32' && (
          <KnockoutStage
            key="r32"
            currentStage="R32"
            groupScores={state.groupScores}
            predictions={state.knockoutPredictions}
            onPredict={handleKnockoutPredict}
            onContinue={() => setState(prev => ({ ...prev, screen: 'r16' }))}
          />
        )}
        {state.screen === 'r16' && (
          <KnockoutStage
            key="r16"
            currentStage="R16"
            groupScores={state.groupScores}
            predictions={state.knockoutPredictions}
            onPredict={handleKnockoutPredict}
            onContinue={() => setState(prev => ({ ...prev, screen: 'qf' }))}
          />
        )}
        {state.screen === 'qf' && (
          <KnockoutStage
            key="qf"
            currentStage="QF"
            groupScores={state.groupScores}
            predictions={state.knockoutPredictions}
            onPredict={handleKnockoutPredict}
            onContinue={() => setState(prev => ({ ...prev, screen: 'sf' }))}
          />
        )}
        {state.screen === 'sf' && (
          <KnockoutStage
            key="sf"
            currentStage="SF"
            groupScores={state.groupScores}
            predictions={state.knockoutPredictions}
            onPredict={handleKnockoutPredict}
            onContinue={() => setState(prev => ({ ...prev, screen: 'final-winner' }))}
          />
        )}
        {state.screen === 'final-winner' && (
          <FinalsPrediction
            key="final-winner"
            teamA={getFinalTeams().teamA!}
            teamB={getFinalTeams().teamB!}
            step="winner"
            value={state.finalDetails.winner}
            onUpdate={(val) => handleFinalDetailUpdate('winner', val)}
            onNext={() => setState(prev => ({ ...prev, screen: 'final-score-a' }))}
            onBack={() => setState(prev => ({ ...prev, screen: 'sf' }))}
          />
        )}
        {state.screen === 'final-score-a' && (
          <FinalsPrediction
            key="final-score-a"
            teamA={getFinalTeams().teamA!}
            teamB={getFinalTeams().teamB!}
            step="score-a"
            value={state.finalDetails.scoreA}
            onUpdate={(val) => handleFinalDetailUpdate('scoreA', val)}
            onNext={() => setState(prev => ({ ...prev, screen: 'final-score-b' }))}
            onBack={() => setState(prev => ({ ...prev, screen: 'final-winner' }))}
          />
        )}
        {state.screen === 'final-score-b' && (
          <FinalsPrediction
            key="final-score-b"
            teamA={getFinalTeams().teamA!}
            teamB={getFinalTeams().teamB!}
            step="score-b"
            value={state.finalDetails.scoreB}
            onUpdate={(val) => handleFinalDetailUpdate('scoreB', val)}
            onNext={() => setState(prev => ({ ...prev, screen: 'final-first-goal' }))}
            onBack={() => setState(prev => ({ ...prev, screen: 'final-score-a' }))}
          />
        )}
        {state.screen === 'final-first-goal' && (
          <FinalsPrediction
            key="final-first-goal"
            teamA={getFinalTeams().teamA!}
            teamB={getFinalTeams().teamB!}
            step="first-goal"
            value={state.finalDetails.firstGoal}
            onUpdate={(val) => handleFinalDetailUpdate('firstGoal', val)}
            onNext={() => setState(prev => ({ ...prev, screen: 'final-yellow-cards' }))}
            onBack={() => setState(prev => ({ ...prev, screen: 'final-score-b' }))}
          />
        )}
        {state.screen === 'final-yellow-cards' && (
          <FinalsPrediction
            key="final-yellow-cards"
            teamA={getFinalTeams().teamA!}
            teamB={getFinalTeams().teamB!}
            step="yellow-cards"
            value={state.finalDetails.yellowCards}
            onUpdate={(val) => handleFinalDetailUpdate('yellowCards', val)}
            onNext={() => setState(prev => ({ ...prev, screen: 'review' }))}
            onBack={() => setState(prev => ({ ...prev, screen: 'final-first-goal' }))}
          />
        )}
        {state.screen === 'review' && (
          <ReviewConfirm
            key="review"
            groupScores={state.groupScores}
            knockoutPredictions={state.knockoutPredictions}
            finalDetails={state.finalDetails}
            onSubmit={handleSubmit}
          />
        )}
        {state.screen === 'waiting' && (
          <WaitingScreen key="waiting" submittedAt={state.submittedAt || ''} />
        )}
        {state.screen === 'results' && (
          <ResultsReveal 
            key="results" 
            groupScores={state.groupScores}
            knockoutPredictions={state.knockoutPredictions}
            finalDetails={state.finalDetails}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>

      {/* Hidden Dev Toggle for Results Screen */}
      <button 
        onClick={toggleResults}
        className="absolute top-0 right-0 w-10 h-10 opacity-0 z-50 cursor-default"
        title="Toggle Results (Dev Only)"
      />
    </div>
  );
}
