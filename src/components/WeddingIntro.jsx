import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { couple } from '../data/weddingData';

export function WeddingIntro({ isVisible, onEnter }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-20 flex items-center justify-center bg-romantic-gradient"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-ivory/40 backdrop-blur-[18px]" />

          <motion.div
            className="relative z-10 px-6 py-10 md:py-16 max-w-xl mx-auto text-center"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p className="text-xs tracking-[0.35em] uppercase text-slate-500 mb-4">
              Trân trọng kính mời bạn đến dự lễ cưới của
            </p>
            <motion.h1
              className="font-display text-[clamp(2rem,8vw,3.25rem)] leading-[1.05] text-ink mb-3 flex flex-col items-center gap-1"
              initial={{ letterSpacing: '0.16em' }}
              animate={{ letterSpacing: '0.02em' }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            >
              <span className="whitespace-nowrap">{couple.groomName}</span>
              <span className="text-[0.62em] leading-none text-blush-300">&amp;</span>
              <span className="whitespace-nowrap">{couple.brideName}</span>
            </motion.h1>

            <p className="text-sm md:text-base text-slate-600 mb-3">
              {couple.date}
            </p>
            <p className="text-sm text-slate-500 mb-3">
              Tại
            </p>
            <p className="text-xs tracking-[0.28em] uppercase text-slate-500 mb-8">
              {couple.venueName}
            </p>

            <p className="text-sm md:text-base text-slate-600 max-w-md mx-auto mb-10">
              Một câu chuyện tình yêu nhẹ nhàng, được kể qua những tin nhắn,
              dẫn bạn đi qua mọi thông tin trong ngày trọng đại.
            </p>

            <motion.button
              type="button"
              onClick={onEnter}
              whileHover={{ y: -2, boxShadow: '0 22px 55px rgba(15,23,42,0.22)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-ink text-ivory text-sm md:text-[0.95rem] tracking-[0.18em] uppercase font-semibold shadow-soft"
            >
              Bước Vào Thiệp Cưới
            </motion.button>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div className="flex items-center gap-2 text-[0.65rem] tracking-[0.24em] uppercase text-slate-400">
              <span className="w-20 h-px bg-slate-300/80" />
              By Hung tran
              <span className="w-20 h-px bg-slate-300/80" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

