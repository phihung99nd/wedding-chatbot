import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WeddingIntro } from './components/WeddingIntro';
import { WeddingChatPage } from './components/WeddingChatPage';

export default function App() {
  const [introVisible, setIntroVisible] = useState(true);

  const handleEnter = () => {
    setIntroVisible(false);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <WeddingIntro isVisible={introVisible} onEnter={handleEnter} />

      <AnimatePresence>
        {!introVisible && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <WeddingChatPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

