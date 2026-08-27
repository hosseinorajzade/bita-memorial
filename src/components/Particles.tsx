import { useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ParticlesProps {
  /** Master switch from config. */
  enabled: boolean;
  count?: number;
}

interface Mote {
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  opacity: number;
}

/**
 * A handful of slow, faint motes of light drifting upward in the hero.
 * Pure CSS animation, no canvas, no library. Rendered as nothing at all when
 * the visitor prefers reduced motion or the effect is disabled in config.
 */
export function Particles({ enabled, count = 14 }: ParticlesProps) {
  const reduced = useReducedMotion();

  const motes = useMemo<Mote[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = (i + 1) / (count + 1);
      return {
        left: seed * 100,
        size: 2 + ((i * 37) % 5),
        delay: -((i * 3.1) % 18),
        duration: 16 + ((i * 5) % 12),
        drift: ((i % 2 === 0 ? 1 : -1) * (6 + (i % 5) * 4)),
        opacity: 0.18 + ((i * 13) % 22) / 100,
      };
    });
  }, [count]);

  if (!enabled || reduced) return null;

  return (
    <div className="particles" aria-hidden="true">
      {motes.map((m, i) => (
        <span
          key={i}
          className="particles__mote"
          style={{
            left: `${m.left}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            opacity: m.opacity,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
            ['--drift' as string]: `${m.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export default Particles;
