import { useCallback, useEffect, useRef, useState } from 'react';
import type { MemorialConfig } from '../config/memorial';
import { asset } from '../lib/assets';
import { toPersianDigits } from '../lib/format';
import { Reveal } from './Reveal';

interface GalleryProps {
  config: MemorialConfig;
}

const SWIPE_THRESHOLD = 45;

export function Gallery({ config }: GalleryProps) {
  const photos = config.gallery ?? [];
  // Track which images failed to load so they can be dropped without a gap.
  const [broken, setBroken] = useState<Set<number>>(() => new Set());
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);

  const visible = photos
    .map((photo, index) => ({ photo, index }))
    .filter(({ index }) => !broken.has(index));

  const isOpen = openIndex !== null;
  const order = visible.map(({ index }) => index);
  const activePos = openIndex === null ? -1 : order.indexOf(openIndex);

  const markBroken = useCallback((index: number) => {
    setBroken((prev) => new Set(prev).add(index));
  }, []);
  const markLoaded = useCallback((index: number) => {
    setLoaded((prev) => new Set(prev).add(index));
  }, []);

  const open = useCallback((index: number, trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    setOpenIndex(index);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    // Return focus to the thumbnail that opened the viewer.
    openerRef.current?.focus();
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        const list = photos.map((_, i) => i).filter((i) => !broken.has(i));
        if (list.length < 2) return current;
        const pos = list.indexOf(current);
        return list[(pos + dir + list.length) % list.length];
      });
    },
    [photos, broken],
  );

  // Lock body scroll while the viewer is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  // Keyboard: Escape closes; arrows move (reversed for right-to-left reading);
  // Tab is kept within the dialog.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight') {
        step(-1);
      } else if (e.key === 'ArrowLeft') {
        step(1);
      } else if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close, step]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      // A drag, not a tap — don't let it also count as a backdrop-close click.
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);
    }
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // RTL: a leftward swipe advances, a rightward swipe goes back.
      step(dx < 0 ? 1 : -1);
    }
  };

  const onBackdropClick = (e: React.MouseEvent) => {
    if (suppressClick.current) return;
    if (e.target === e.currentTarget) close();
  };

  if (visible.length === 0) return null;

  const active = openIndex !== null ? photos[openIndex] : null;
  const total = order.length;

  return (
    <section id="gallery" className="section section--gallery" aria-labelledby="gallery-title">
      <Reveal as="h2" className="section__title">
        <span id="gallery-title">{config.headings.gallery}</span>
      </Reveal>

      <Reveal className="gallery__grid" delay={80}>
        {visible.map(({ photo, index }) => (
          <figure className="gallery__item" key={index}>
            <button
              type="button"
              className="gallery__button"
              onClick={(e) => open(index, e.currentTarget)}
              aria-label={`بزرگ‌نمایی عکس: ${photo.alt}`}
            >
              <img
                className={loaded.has(index) ? 'is-loaded' : undefined}
                src={asset(photo.src)}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                onLoad={() => markLoaded(index)}
                onError={() => markBroken(index)}
              />
            </button>
            {photo.caption ? (
              <figcaption className="gallery__caption">{photo.caption}</figcaption>
            ) : null}
          </figure>
        ))}
      </Reveal>

      {active ? (
        <div
          className="lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={
            total > 1
              ? `${active.alt} — عکس ${toPersianDigits(activePos + 1)} از ${toPersianDigits(total)}`
              : active.alt
          }
          onClick={onBackdropClick}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="lightbox__stage">
            <img
              key={openIndex}
              className="lightbox__img"
              src={asset(active.src)}
              alt={active.alt}
              draggable={false}
            />
            {active.caption ? <p className="lightbox__caption">{active.caption}</p> : null}
            {total > 1 ? (
              <p className="lightbox__counter" aria-hidden="true">
                {toPersianDigits(activePos + 1)}
                <span> / </span>
                {toPersianDigits(total)}
              </p>
            ) : null}
          </div>

          <p className="sr-only" aria-live="polite">
            {total > 1
              ? `عکس ${toPersianDigits(activePos + 1)} از ${toPersianDigits(total)}`
              : ''}
          </p>

          <button
            type="button"
            className="lightbox__close"
            ref={closeRef}
            onClick={close}
            aria-label="بستن نمایشگر"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {total > 1 ? (
            <>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                onClick={() => step(-1)}
                aria-label="عکس قبلی"
              >
                <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                  <path
                    d="M9 5l7 7-7 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                onClick={() => step(1)}
                aria-label="عکس بعدی"
              >
                <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                  <path
                    d="M15 5l-7 7 7 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default Gallery;
