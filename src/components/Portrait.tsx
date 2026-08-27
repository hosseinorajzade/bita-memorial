import { useState } from 'react';
import { asset } from '../lib/assets';

interface PortraitProps {
  src: string;
  alt: string;
  /** Hint the browser to load the above-the-fold hero image first. */
  priority?: boolean;
  className?: string;
}

/**
 * The main portrait. If the image is missing or fails to load, a soft,
 * hand-drawn silhouette is shown in its place so the layout never breaks.
 */
export function Portrait({ src, alt, priority = false, className }: PortraitProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={['portrait-fallback', className].filter(Boolean).join(' ')}
        role="img"
        aria-label={alt}
      >
        <svg viewBox="0 0 240 300" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="pf-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#efe7d7" />
              <stop offset="1" stopColor="#e3d7c2" />
            </linearGradient>
          </defs>
          <rect width="240" height="300" fill="url(#pf-bg)" />
          <g fill="#c8b596">
            <circle cx="120" cy="118" r="46" />
            <path d="M40 300c0-49 36-84 80-84s80 35 80 84z" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <img
      className={['portrait-img', className].filter(Boolean).join(' ')}
      src={asset(src)}
      alt={alt}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      loading={priority ? 'eager' : 'lazy'}
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

export default Portrait;
