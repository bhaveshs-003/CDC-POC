import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users } from 'lucide-react';

interface TransitionSplashProps {
  title: string;
  subtitle: string;
  onComplete: () => void;
  key?: React.Key;
}

export default function TransitionSplash({ title, subtitle, onComplete }: TransitionSplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cdc-blue text-white"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut",
          type: "spring",
          stiffness: 100
        }}
        className="relative mb-8"
      >
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <Users className="w-16 h-16 text-cdc-blue" />
        </div>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -inset-4 border-4 border-cdc-red rounded-full opacity-50"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center px-6"
      >
        <h1 className="text-3xl font-black tracking-tighter mb-4 uppercase">{title}</h1>
        <p className="text-cdc-red font-bold uppercase tracking-widest text-sm leading-relaxed">{subtitle}</p>
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
                backgroundColor: ["#ffffff", "#D22027", "#ffffff"]
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1
              }}
              className="w-3 h-3 rounded-full bg-white"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
