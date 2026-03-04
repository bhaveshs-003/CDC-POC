import React from 'react';
import { motion } from 'motion/react';
import { Lock, Clock, ShieldCheck } from 'lucide-react';

interface WaitingScreenProps {
  submittedAt: string;
  key?: React.Key;
}

export default function WaitingScreen({ submittedAt }: WaitingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col h-full bg-slate-50 p-6 max-w-md mx-auto"
    >
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200"
          >
            <Lock className="text-white w-10 h-10" />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-50 flex items-center justify-center"
          >
            <ShieldCheck className="text-white w-4 h-4" />
          </motion.div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            Let’s Wait for the Results
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            Your predictions are locked. Results will be revealed after the tournament concludes.
          </p>
        </div>

        <div className="w-full space-y-3">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                <Clock className="text-slate-400 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Submitted At</p>
                <p className="text-sm font-bold text-slate-700">{submittedAt}</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
              Locked
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 text-center">
        <p className="text-xs text-slate-400 font-medium">
          FIFA World Cup 2026 Prediction Challenge POC
        </p>
      </div>
    </motion.div>
  );
}
