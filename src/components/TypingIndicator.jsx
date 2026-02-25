import React from 'react';
import { motion } from 'framer-motion';

export function TypingIndicator() {
  const dotTransition = {
    repeat: Infinity,
    repeatType: 'mirror',
    duration: 0.6,
    ease: 'easeInOut'
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="inline-flex items-center rounded-2xl bg-white/90 px-3 py-2 shadow-soft/40 shadow border border-white/80">
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-blush-300 mx-0.5"
          animate={{ opacity: [0.3, 1] }}
          transition={dotTransition}
        />
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-blush-300 mx-0.5"
          animate={{ opacity: [0.3, 1] }}
          transition={{ ...dotTransition, delay: 0.15 }}
        />
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-blush-300 mx-0.5"
          animate={{ opacity: [0.3, 1] }}
          transition={{ ...dotTransition, delay: 0.3 }}
        />
      </div>
    </div>
  );
}

