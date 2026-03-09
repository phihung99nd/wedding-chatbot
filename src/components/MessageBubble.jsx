import React from 'react';
import { motion } from 'framer-motion';
import { couple } from '../data/weddingData';

const bubbleVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export function MessageBubble({ message, index }) {
  const isBot = message.sender === 'bot';
  const isGuest = message.sender === 'guest';
  const [isAlbumModalOpen, setIsAlbumModalOpen] = React.useState(false);
  const [activeAlbumIndex, setActiveAlbumIndex] = React.useState(0);
  const [rsvpName, setRsvpName] = React.useState('');
  const [rsvpPhone, setRsvpPhone] = React.useState('');
  const [rsvpEmail, setRsvpEmail] = React.useState('');
  const [rsvpNote, setRsvpNote] = React.useState('');
  const [rsvpError, setRsvpError] = React.useState('');
  const [rsvpSubmitting, setRsvpSubmitting] = React.useState(false);
  const [rsvpSuccess, setRsvpSuccess] = React.useState(false);

  const albumImages = Array.isArray(message.albumImages) ? message.albumImages : [];
  const previewImages = albumImages.slice(0, 4);
  const remainingCount = Math.max(albumImages.length - previewImages.length, 0);

  const alignClass = isBot ? 'justify-start' : 'justify-end';

  const bubbleClass = isBot
    ? 'bg-white/90 text-slate-800 border border-white/80'
    : 'bg-blush-100 text-ink border border-blush-200';

  const nameLabel = isBot ? 'Bồ Câu Đưa Tin' : 'Bạn';

  const openAlbumModal = (imageIndex) => {
    setActiveAlbumIndex(imageIndex);
    setIsAlbumModalOpen(true);
  };

  const closeAlbumModal = () => {
    setIsAlbumModalOpen(false);
  };

  const goToPrevImage = () => {
    setActiveAlbumIndex((prev) =>
      prev === 0 ? albumImages.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setActiveAlbumIndex((prev) =>
      prev === albumImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleRsvpSubmit = async (event) => {
    event.preventDefault();
    setRsvpError('');

    if (!rsvpName.trim()) {
      setRsvpError('Vui lòng nhập tên của bạn.');
      return;
    }

    if (!rsvpPhone.trim() && !rsvpEmail.trim()) {
      setRsvpError('Vui lòng nhập số điện thoại hoặc email.');
      return;
    }

    try {
      setRsvpSubmitting(true);

      if (couple.rsvpFormEndpoint) {
        const response = await fetch(couple.rsvpFormEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            name: rsvpName.trim(),
            phone: rsvpPhone.trim(),
            email: rsvpEmail.trim(),
            note: rsvpNote.trim()
          }),
          redirect: 'follow'
        });

        if (!response.ok && response.type !== 'opaque') {
          throw new Error('submit_failed');
        }
      }

      setRsvpSuccess(true);
      setRsvpName('');
      setRsvpPhone('');
      setRsvpEmail('');
      setRsvpNote('');
    } catch (error) {
      setRsvpError(
        'Chưa thể gửi xác nhận tham dự lúc này. Vui lòng thử lại sau hoặc liên hệ cô dâu chú rể.'
      );
    } finally {
      setRsvpSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={bubbleVariants}
      transition={{ duration: 0.45, delay: index * 0.03, ease: 'easeOut' }}
      className={`flex w-full ${alignClass} mb-3`}
      id={message.domId || message.id}
    >
      <div
        className={`flex flex-col max-w-[88%] ${
          isBot ? 'items-start' : 'items-end'
        }`}
      >
        {(isBot || isGuest) && (
          <p className="mb-1 text-[0.65rem] uppercase tracking-[0.18em] text-slate-400">
            {nameLabel}
          </p>
        )}
        <div
          className={`w-full rounded-3xl px-4 py-3 text-sm md:text-[0.95rem] leading-relaxed shadow-soft/40 shadow ${bubbleClass}`}
        >
          {message.type === 'dateVenue' && (
            <p className="text-xs uppercase tracking-[0.18em] text-blush-400 mb-1 font-semibold">
              Ngày Cưới
            </p>
          )}
          {message.type === 'dresscode' && (
            <p className="text-[0.68rem] uppercase tracking-[0.16em] text-slate-400 mb-1 font-semibold">
              Trang Phục
            </p>
          )}
          {message.type === 'rsvp' && (
            <p className="text-[0.68rem] uppercase tracking-[0.16em] text-slate-400 mb-1 font-semibold">
              Xác Nhận Tham Dự
            </p>
          )}
          {message.type === 'gifts' && (
            <p className="text-[0.68rem] uppercase tracking-[0.16em] text-slate-400 mb-1 font-semibold">
              Mừng Cưới
            </p>
          )}
          <p className="whitespace-pre-line">{message.text}</p>
          {(message.type === 'venue' || message.type === 'dateVenue') && message.venueMapsUrl && (
            <a
              href={message.venueMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center mt-3 text-xs font-medium text-blush-400 hover:text-blush-300 transition-colors"
            >
              Mở Google Maps
              <span className="ml-1 text-[0.7rem]">↗</span>
            </a>
          )}
          {message.type === 'rsvpForm' && (
            <form onSubmit={handleRsvpSubmit} className="mt-3 space-y-2.5">
              <input
                type="text"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="Họ và tên"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blush-200"
                disabled={rsvpSubmitting || rsvpSuccess}
              />
              <input
                type="text"
                value={rsvpPhone}
                onChange={(e) => setRsvpPhone(e.target.value)}
                placeholder="Số điện thoại"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blush-200"
                disabled={rsvpSubmitting || rsvpSuccess}
              />
              <input
                type="email"
                value={rsvpEmail}
                onChange={(e) => setRsvpEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blush-200"
                disabled={rsvpSubmitting || rsvpSuccess}
              />
              <textarea
                value={rsvpNote}
                onChange={(e) => setRsvpNote(e.target.value)}
                placeholder="Lời nhắn (không bắt buộc)"
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blush-200 resize-none"
                disabled={rsvpSubmitting || rsvpSuccess}
              />

              {rsvpError && (
                <p className="text-xs text-rose-500">{rsvpError}</p>
              )}
              {rsvpSuccess && (
                <p className="text-xs text-emerald-600">
                  Đã nhận xác nhận tham dự của bạn. Cảm ơn bạn rất nhiều!
                </p>
              )}

              <button
                type="submit"
                disabled={rsvpSubmitting || rsvpSuccess}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  rsvpSubmitting || rsvpSuccess
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-blush-100 border border-blush-200 text-ink hover:bg-blush-50'
                }`}
              >
                {rsvpSubmitting ? 'Đang gửi...' : rsvpSuccess ? 'Đã gửi' : 'Xác nhận tham dự'}
              </button>
            </form>
          )}
          {(message.type === 'gifts-qr' ||
            (message.type === 'gifts' && message.showGiftQr)) &&
            couple.giftQrUrl && (
            <div className="mt-3 flex flex-col items-center">
              <img
                src={couple.giftQrUrl}
                alt="Mã QR mừng cưới"
                className="w-32 h-32 md:w-40 md:h-40 rounded-xl border border-blush-100 shadow-sm bg-white"
              />
              <p className="mt-2 text-[0.7rem] text-slate-400 text-center">
                Quét mã để gửi mừng cưới yêu thương.
              </p>
            </div>
          )}
          {message.type === 'album' && previewImages.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {previewImages.map((imageUrl, idx) => (
                  <button
                    key={`${imageUrl}-${idx}`}
                    type="button"
                    onClick={() => openAlbumModal(idx)}
                    className="relative rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-blush-300"
                  >
                    <img
                      src={imageUrl}
                      alt={`Ảnh cưới tiêu biểu ${idx + 1}`}
                      className="w-full h-24 md:h-28 object-cover border border-blush-100"
                      loading="lazy"
                    />
                    {idx === previewImages.length - 1 && remainingCount > 0 && (
                      <span className="absolute inset-0 bg-black/45 flex items-center justify-center text-white font-semibold text-lg">
                        +{remainingCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
        </div>
      </div>

      {message.type === 'album' && isAlbumModalOpen && albumImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white/95 rounded-2xl overflow-hidden shadow-soft">
            <button
              type="button"
              onClick={closeAlbumModal}
              className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full bg-white/90 text-slate-700 border border-slate-200 hover:bg-white"
            >
              ×
            </button>

            <div className="relative bg-slate-900">
              <img
                src={albumImages[activeAlbumIndex]}
                alt={`Ảnh cưới ${activeAlbumIndex + 1}`}
                className="w-full max-h-[65vh] object-contain"
              />

              {albumImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/45 text-white hover:bg-black/60"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goToNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/45 text-white hover:bg-black/60"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-white">
              <div className="flex gap-2 overflow-x-auto">
                {albumImages.map((thumb, idx) => (
                  <button
                    key={`${thumb}-thumb-${idx}`}
                    type="button"
                    onClick={() => setActiveAlbumIndex(idx)}
                    className={`rounded-lg overflow-hidden border ${
                      idx === activeAlbumIndex
                        ? 'border-blush-300'
                        : 'border-slate-200'
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`Ảnh thu nhỏ ${idx + 1}`}
                      className="w-16 h-16 object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

