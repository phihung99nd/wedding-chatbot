import React from 'react';
import { motion } from 'framer-motion';

export function QuickReplies({ options, onSelect, disabled = false }) {
  return (
    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/40">
      {options.map((option) => (
        <motion.button
          key={option.id}
          type="button"
          whileHover={disabled ? undefined : { y: -1, boxShadow: '0 14px 32px rgba(15,23,42,0.14)' }}
          whileTap={disabled ? undefined : { scale: 0.97 }}
          onClick={() => onSelect(option)}
          disabled={disabled}
          className={`px-3.5 py-2 rounded-full text-xs md:text-sm border shadow-sm transition-colors ${
            disabled
              ? 'bg-slate-100/90 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-white/90 text-slate-700 border-white/80 hover:bg-blush-50 hover:border-blush-100'
          }`}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}

