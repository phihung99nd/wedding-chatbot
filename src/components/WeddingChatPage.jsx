import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { autoMessages, couple, quickReplies } from '../data/weddingData';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { QuickReplies } from './QuickReplies';

function useBackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(
      'https://cdn.pixabay.com/audio/2022/03/15/audio_5f5e9c2f37.mp3'
    );
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

function ConfettiOverlay({ active }) {
  if (!active) return null;

  const pieces = Array.from({ length: 22 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, idx) => (
        <motion.span
          key={idx}
          className="absolute w-1.5 h-3 rounded-full"
          style={{
            left: `${(idx / pieces.length) * 100}%`,
            backgroundColor:
              idx % 3 === 0
                ? '#f2d3cc'
                : idx % 3 === 1
                ? '#e7b0a8'
                : '#f8e8e4'
          }}
          initial={{ y: -40, opacity: 0, rotate: -8 }}
          animate={{
            y: ['-40%', '120%'],
            opacity: [0, 1, 0],
            rotate: [0, 22, -18, 10]
          }}
          transition={{
            duration: 3.8,
            delay: idx * 0.08,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  );
}

export function WeddingChatPage() {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [autoIndex, setAutoIndex] = useState(0);
  const [confettiActive, setConfettiActive] = useState(false);
  const scrollAnchorRef = useRef(null);
  const autoTimerRef = useRef(null);
  const quickReplyCounterRef = useRef(0);
  const { isPlaying, toggle } = useBackgroundMusic();
  const isInitialScriptRunning = autoIndex < autoMessages.length;

  const enrichedMessages = useMemo(
    () =>
      autoMessages.map((m) =>
        m.type === 'venue'
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

        if (next.type === 'dateVenue') {
          setConfettiActive(true);
          setTimeout(() => setConfettiActive(false), 4200);
        }
      }, 900);
    };

    runAutoFlow();

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }
    };
  }, [autoIndex, enrichedMessages]);

  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleMessages, isTyping]);

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

  return (
    <div className="relative min-h-screen flex items-stretch justify-center px-4 py-6 md:py-12">
      <div className="absolute inset-0 bg-romantic-gradient opacity-80" />
      <div className="absolute inset-0 bg-ivory/80 backdrop-blur-[26px]" />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <p className="text-[0.6rem] tracking-[0.26em] uppercase text-slate-500 mb-2">
            Chatbot Thiệp Cưới
          </p>
          <h2 className="font-display text-2xl tracking-tight text-ink">
            {couple.brideName} &amp; {couple.groomName}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{couple.date}</p>
        </div>

        <div className="relative">
          <ConfettiOverlay active={confettiActive} />

          <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-soft border border-white/80 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/70 bg-white/70">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 rounded-full bg-blush-100 border border-blush-200 items-center justify-center text-xs font-medium text-blush-400">
                  D&amp;L
                </span>
                <div className="text-left">
                  <p className="text-[0.8rem] font-semibold text-ink">
                    Trợ Lý Thiệp Cưới
                  </p>
                  <p className="text-[0.68rem] text-slate-400">
                    Trực tuyến
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggle}
                className="inline-flex items-center justify-center h-8 px-3 rounded-full text-[0.7rem] border border-slate-200/80 bg-white/70 text-slate-500 hover:bg-blush-50 hover:border-blush-100 transition-colors"
              >
                <span className="mr-1 text-[0.85rem]">
                  {isPlaying ? '♪' : '♬'}
                </span>
                {isPlaying ? 'Bật nhạc' : 'Tắt nhạc'}
              </button>
            </div>

            <div className="h-[58vh] md:h-[60vh] max-h-[520px] overflow-y-auto px-4 pt-4 pb-5 chat-scroll">
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

              <div ref={scrollAnchorRef} />
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
                <p className="text-[0.68rem] text-slate-400 mt-2">
                  Vui lòng chờ chatbot gửi xong phần giới thiệu...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

