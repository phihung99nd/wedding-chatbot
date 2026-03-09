import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { autoMessages, couple, quickReplies } from '../data/weddingData';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { QuickReplies } from './QuickReplies';

const backgroundAudioFiles = Object.values(
  import.meta.glob('../assets/audio/*.{mp3,wav,ogg,m4a}', {
    eager: true,
    import: 'default'
  })
);

function useBackgroundMusic(audioSources = []) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioSources.length === 0) return undefined;

    audioRef.current = new Audio(audioSources[0]);
    audioRef.current.loop = true;
    let isDisposed = false;
    let hasInteractionFallback = false;

    const attemptPlay = async () => {
      if (!audioRef.current || isDisposed) return false;

      try {
        await audioRef.current.play();
        if (!isDisposed) {
          setIsPlaying(true);
        }
        return true;
      } catch {
        return false;
      }
    };

    const handleFirstInteraction = () => {
      void attemptPlay();
    };

    const clearInteractionFallback = () => {
      if (!hasInteractionFallback) return;
      hasInteractionFallback = false;
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    void attemptPlay().then((didAutoPlay) => {
      if (didAutoPlay || isDisposed) return;
      hasInteractionFallback = true;
      window.addEventListener('click', handleFirstInteraction, { once: true });
      window.addEventListener('touchstart', handleFirstInteraction, {
        once: true
      });
      window.addEventListener('keydown', handleFirstInteraction, { once: true });
    });

    return () => {
      isDisposed = true;
      clearInteractionFallback();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioSources]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return { isPlaying, toggle };
}

function FloatingHeartsBackground() {
  const hearts = [
    { left: '8%', delay: 0, duration: 18, size: 'w-3.5 h-5', opacity: 'opacity-40' },
    { left: '18%', delay: 2, duration: 22, size: 'w-3 h-4.5', opacity: 'opacity-30' },
    { left: '31%', delay: 1, duration: 20, size: 'w-3.5 h-5', opacity: 'opacity-40' },
    { left: '46%', delay: 4, duration: 24, size: 'w-3 h-4.5', opacity: 'opacity-30' },
    { left: '59%', delay: 0.5, duration: 19, size: 'w-3.5 h-5', opacity: 'opacity-40' },
    { left: '72%', delay: 3, duration: 23, size: 'w-3 h-4.5', opacity: 'opacity-30' },
    { left: '84%', delay: 1.5, duration: 21, size: 'w-3.5 h-5', opacity: 'opacity-40' }
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {hearts.map((heart, idx) => (
        <motion.div
          key={idx}
          className={`absolute -top-12 flex items-center justify-center ${heart.size} ${heart.opacity}`}
          style={{
            left: heart.left
          }}
          animate={{
            y: ['-12vh', '112vh'],
            x: [0, 12, -10, 14, -6],
            rotate: [0, 20, -12, 26, -8]
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <span
            className="text-[1.15rem] leading-none"
            style={{
              color: idx % 2 === 0 ? 'rgba(231, 176, 168, 0.92)' : 'rgba(243, 196, 186, 0.9)',
              filter: 'drop-shadow(0 1px 1px rgba(120,60,50,0.15))'
            }}
          >
            ♥
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export function WeddingChatPage() {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [autoIndex, setAutoIndex] = useState(0);
  const chatScrollRef = useRef(null);
  const autoTimerRef = useRef(null);
  const quickReplyCounterRef = useRef(0);
  const { isPlaying, toggle } = useBackgroundMusic(backgroundAudioFiles);
  const isInitialScriptRunning = autoIndex < autoMessages.length;

  const enrichedMessages = useMemo(
    () =>
      autoMessages.map((m) =>
        m.type === 'venue' || m.type === 'dateVenue'
          ? { ...m, venueMapsUrl: couple.venueMapsUrl }
          : m
      ),
    []
  );

  useEffect(() => {
    const runAutoFlow = () => {
      if (autoIndex >= enrichedMessages.length) return;

      setIsTyping(true);
      autoTimerRef.current = setTimeout(() => {
        const next = enrichedMessages[autoIndex];
        setVisibleMessages((prev) => [...prev, next]);
        setIsTyping(false);
        setAutoIndex((idx) => idx + 1);
      }, 2000);
    };

    runAutoFlow();

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }
    };
  }, [autoIndex, enrichedMessages]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [visibleMessages, isTyping]);

  const handleSkip = () => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    setIsTyping(false);
    setVisibleMessages(enrichedMessages);
    setAutoIndex(enrichedMessages.length);
  };

  const handleQuickReply = (option) => {
    if (isInitialScriptRunning) return;

    quickReplyCounterRef.current += 1;
    const clickId = `${option.id}-${quickReplyCounterRef.current}`;

    const questionId = `quick-question-${clickId}`;
    const answerId = `quick-answer-${clickId}`;

    const questionMessage = {
      id: questionId,
      domId: questionId,
      sender: 'guest',
      text: option.question || option.label,
      type: 'quick-question'
    };

    const answerMessage = {
      id: answerId,
      domId: answerId,
      sender: 'bot',
      text: option.answer,
      type: option.type || 'quick-answer',
      albumImages:
        option.type === 'album' ? couple.albumImages : undefined,
      venueMapsUrl:
        option.type === 'venue' ? couple.venueMapsUrl : undefined,
      showGiftQr: Boolean(option.showGiftQr)
    };

    setVisibleMessages((prev) => [...prev, questionMessage]);
    setIsTyping(true);

    setTimeout(() => {
      setVisibleMessages((prev) => [...prev, answerMessage]);
      setIsTyping(false);
    }, 650);
  };

  const hasBackgroundAudio = backgroundAudioFiles.length > 0;
  const handleToggleSound = () => {
    if (!hasBackgroundAudio) return;
    toggle();
  };

  return (
    <div className="relative min-h-screen flex items-stretch justify-center px-4 py-6 md:py-12">
      <div className="absolute inset-0 bg-romantic-gradient opacity-80" />
      <div className="absolute inset-0 bg-ivory/80 backdrop-blur-[26px]" />
      <FloatingHeartsBackground />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <p className="text-[0.6rem] tracking-[0.26em] uppercase text-slate-500 mb-2">
            Thiệp Cưới
          </p>
          <h2 className="font-display text-2xl tracking-tight text-ink">
            {couple.brideName} &amp; {couple.groomName}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{couple.date}</p>
        </div>

        <div className="relative">
          <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-soft border border-white/80 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/70 bg-white/70">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 rounded-full bg-blush-100 border border-blush-200 items-center justify-center text-xs font-medium text-blush-400">
                  D&amp;L
                </span>
                <div className="text-left">
                  <p className="text-[0.8rem] font-semibold text-ink">
                    Bồ Câu Đưa Tin
                  </p>
                  <p className="text-[0.68rem] text-slate-400">
                    Trực tuyến
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleSound}
                disabled={!hasBackgroundAudio}
                className="inline-flex items-center justify-center h-8 px-3 rounded-full text-[0.7rem] border border-slate-200/80 bg-white/70 text-slate-500 hover:bg-blush-50 hover:border-blush-100 transition-colors"
              >
                <span className="mr-1 text-[0.85rem]">
                  {isPlaying ? '♪' : '♬'}
                </span>
                {!hasBackgroundAudio
                  ? 'Không có nhạc'
                  : isPlaying
                  ? 'Tắt nhạc'
                  : 'Bật nhạc'}
              </button>
            </div>

            <div
              ref={chatScrollRef}
              className="h-[58vh] md:h-[60vh] max-h-[520px] overflow-y-auto px-4 pt-4 pb-5 chat-scroll"
            >
              {visibleMessages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  index={index}
                />
              ))}

              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <TypingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            <div className="px-4 pb-4 pt-3 bg-white/80 border-t border-white/70">
              <p className="text-[0.7rem] text-slate-400 mb-2">
                Chọn câu hỏi để xem nhanh thông tin:
              </p>
              <QuickReplies
                options={quickReplies}
                onSelect={handleQuickReply}
                disabled={isInitialScriptRunning || isTyping}
              />
              {isInitialScriptRunning && (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[0.68rem] text-slate-400">
                    Bồ câu đang đưa tin...
                  </p>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-[0.68rem] font-medium text-blush-400 hover:text-blush-300 transition-colors px-2.5 py-1 rounded-full border border-blush-200/60 hover:border-blush-200 bg-white/60"
                  >
                    Bỏ qua »
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

