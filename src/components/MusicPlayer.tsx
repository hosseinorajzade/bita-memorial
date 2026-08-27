import { useCallback, useEffect, useRef, useState } from 'react';
import type { MemorialConfig } from '../config/memorial';
import { asset } from '../lib/assets';
import { formatTime, toPersianDigits } from '../lib/format';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Reveal } from './Reveal';

interface MusicPlayerProps {
  config: MemorialConfig;
}

type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'unavailable';

const EQ_BARS = 5;

export function MusicPlayer({ config }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // True between calling play() and the audio actually starting, so a second
  // tap can't kick off an overlapping play() (whose promise then rejects).
  const startingRef = useRef(false);
  // Safety net: if playback is asked for but nothing loads for a long time
  // (e.g. the connection dropped mid-tap), quietly return to the resting state
  // so the visitor can simply tap again.
  const watchdogRef = useRef<number | undefined>(undefined);
  const reduced = useReducedMotion();

  const [status, setStatus] = useState<Status>('idle');
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  const playing = status === 'playing';
  const loading = status === 'loading';
  const unavailable = status === 'unavailable';

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current !== undefined) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMeta = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrent(audio.currentTime || 0);
    const onEnded = () => {
      startingRef.current = false;
      clearWatchdog();
      setCurrent(0);
      audio.currentTime = 0;
      setStatus('paused');
    };
    // A real media failure (missing file, unsupported codec) is the *only*
    // thing that makes the player "unavailable".
    const onError = () => {
      startingRef.current = false;
      clearWatchdog();
      setStatus('unavailable');
    };
    const onPlaying = () => {
      startingRef.current = false;
      clearWatchdog();
      setStatus('playing');
    };
    const onPause = () => {
      if (audio.ended) return;
      startingRef.current = false;
      clearWatchdog();
      setStatus((s) => (s === 'unavailable' ? s : 'paused'));
    };
    const onWaiting = () => setStatus((s) => (s === 'playing' ? 'loading' : s));

    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('durationchange', onLoadedMeta);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);

    return () => {
      clearWatchdog();
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('durationchange', onLoadedMeta);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
    };
  }, [clearWatchdog]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || unavailable) return;

    if (!audio.paused || startingRef.current) {
      startingRef.current = false;
      clearWatchdog();
      audio.pause();
      return;
    }

    setStatus('loading');
    startingRef.current = true;

    clearWatchdog();
    watchdogRef.current = window.setTimeout(() => {
      if (audio.readyState < 2 && audio.buffered.length === 0) {
        startingRef.current = false;
        audio.pause();
        setStatus('idle');
      }
    }, 25000);

    const played = audio.play();
    if (played && typeof played.then === 'function') {
      played
        .then(() => {
          startingRef.current = false;
        })
        .catch((err: DOMException) => {
          startingRef.current = false;
          clearWatchdog();
          // If the media element itself errored, it's genuinely unavailable.
          // Otherwise the play was just interrupted or needs another tap —
          // fall back to a plain paused state rather than crying "broken".
          if (audio.error) setStatus('unavailable');
          else setStatus(err?.name === 'NotAllowedError' ? 'paused' : 'idle');
        });
    }
  }, [unavailable, clearWatchdog]);

  const seek = useCallback((value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration === 0) return;
    audio.currentTime = value;
    setCurrent(value);
  }, []);

  const progress = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  const label = unavailable
    ? 'موسیقی در دسترس نیست'
    : loading
      ? 'در حال آماده‌سازی…'
      : playing
        ? 'توقف موسیقی'
        : 'پخش موسیقی یادبود';

  return (
    <section id="music" className="section section--music" aria-labelledby="music-title">
      <Reveal as="h2" className="section__title">
        <span id="music-title">{config.headings.music}</span>
      </Reveal>

      <Reveal className="player" delay={80}>
        <audio ref={audioRef} src={asset(config.music.src)} preload="none" />

        <button
          type="button"
          className={['player__toggle', loading ? 'player__toggle--loading' : '']
            .filter(Boolean)
            .join(' ')}
          onClick={toggle}
          disabled={unavailable}
          aria-pressed={playing}
          aria-label={label}
        >
          <span className="player__icon" aria-hidden="true">
            {playing ? (
              <svg viewBox="0 0 24 24" width="22" height="22">
                <rect x="6" y="5" width="4" height="14" rx="1.2" />
                <rect x="14" y="5" width="4" height="14" rx="1.2" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />
              </svg>
            )}
          </span>
          <span className="player__label">{label}</span>
        </button>

        <div className="player__meta">
          <p className="player__title">{config.music.title}</p>

          <div
            className={[
              'player__eq',
              playing && !reduced ? 'player__eq--live' : '',
              playing ? 'player__eq--on' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          >
            {Array.from({ length: EQ_BARS }, (_, i) => (
              <span key={i} style={{ ['--i' as string]: String(i) }} />
            ))}
          </div>

          <label className="player__progress">
            <span className="sr-only">جای‌نما در آهنگ</span>
            <input
              type="range"
              min={0}
              max={Math.max(duration, 0.001)}
              step={0.1}
              value={current}
              onChange={(e) => seek(Number(e.target.value))}
              disabled={unavailable || duration === 0}
              style={{ ['--played' as string]: `${progress}%` }}
              aria-valuetext={formatTime(current)}
            />
          </label>

          <p className="player__time">
            {unavailable ? (
              <span>می‌توانید بعداً دوباره امتحان کنید</span>
            ) : (
              <>
                <span>{formatTime(current)}</span>
                <span className="player__time-sep" aria-hidden="true" />
                <span>{duration ? formatTime(duration) : toPersianDigits('0:00')}</span>
              </>
            )}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export default MusicPlayer;
