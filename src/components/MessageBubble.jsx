import React from 'react';
import { motion } from 'framer-motion';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import { couple } from '../data/weddingData';

const bubbleVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export function MessageBubble({ message, index }) {
  const isBot = message.sender === 'bot';
  const isGuest = message.sender === 'guest';
  const [rsvpName, setRsvpName] = React.useState('');
  const [rsvpPhone, setRsvpPhone] = React.useState('');
  const [rsvpEmail, setRsvpEmail] = React.useState('');
  const [rsvpNote, setRsvpNote] = React.useState('');
  const [rsvpError, setRsvpError] = React.useState('');
  const [rsvpSubmitting, setRsvpSubmitting] = React.useState(false);
  const [rsvpSuccess, setRsvpSuccess] = React.useState(false);
  const albumViewerRef = React.useRef(null);
  const albumViewerInstanceRef = React.useRef(null);

  const albumImages = Array.isArray(message.albumImages) ? message.albumImages : [];
  const previewImages = albumImages.slice(0, 4);
  const remainingCount = Math.max(albumImages.length - previewImages.length, 0);

  const alignClass = isBot ? 'justify-start' : 'justify-end';

  const bubbleClass = isBot
    ? 'bg-white/90 text-slate-800 border border-white/80'
    : 'bg-blush-100 text-ink border border-blush-200';

  const nameLabel = isBot ? 'Bồ Câu Đưa Tin' : 'Bạn';

  const openAlbumViewer = (imageIndex) => {
    const container = albumViewerRef.current;
    if (!container || albumImages.length === 0) {
      return;
    }

    if (!albumViewerInstanceRef.current) {
      albumViewerInstanceRef.current = new Viewer(container, {
        inline: false,
        button: true,
        navbar: true,
        toolbar: true,
        title: false,
        transition: true,
        fullscreen: true
      });
    }

    albumViewerInstanceRef.current.view(imageIndex);
  };

  React.useEffect(() => {
    if (albumViewerInstanceRef.current) {
      albumViewerInstanceRef.current.update();
    }
  }, [albumImages]);

  React.useEffect(() => () => {
    if (albumViewerInstanceRef.current) {
      albumViewerInstanceRef.current.destroy();
      albumViewerInstanceRef.current = null;
    }
  }, []);

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
                    onClick={() => openAlbumViewer(idx)}
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
          {message.type === 'album' && albumImages.length > 0 && (
            <div ref={albumViewerRef} className="hidden" aria-hidden="true">
              {albumImages.map((imageUrl, idx) => (
                <img
                  key={`${imageUrl}-viewer-${idx}`}
                  src={imageUrl}
                  alt={`Ảnh cưới ${idx + 1}`}
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

