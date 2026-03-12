import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Trophy } from 'lucide-react';

interface DashboardProps {
  onStart: () => void;
  key?: React.Key;
}

export default function Dashboard({ onStart }: DashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col h-full p-6 max-w-md mx-auto"
    >
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="space-y-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-cdc-blue rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cdc-blue/20"
          >
            <Trophy className="text-white w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
            CDC Match Prediction Game
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Club Development Circle</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
              <Calendar className="text-slate-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-black">Submission Deadline</p>
              <p className="text-sm font-bold text-slate-700">March 1, 2026 – 18:00 UTC</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
            <span className="px-3 py-1 bg-cdc-red/10 text-cdc-red text-[10px] font-black rounded-full uppercase tracking-widest">
              Predictions Open
            </span>
          </div>
        </div>

        <div className="bg-cdc-blue/5 rounded-2xl p-6 border border-cdc-blue/10">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Users className="text-cdc-blue w-5 h-5" />
            </div>
            <p className="text-sm text-cdc-blue/80 leading-relaxed font-medium">
              Predict every match from the group stage to the final. Once you make a choice, it's locked forever.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <button
          onClick={onStart}
          className="w-full bg-cdc-blue text-white font-black py-4 rounded-2xl shadow-lg shadow-cdc-blue/20 tap-target hover:bg-cdc-blue/90 uppercase tracking-widest"
        >
          Start Prediction
        </button>
      </div>
    </motion.div>
  );
}
