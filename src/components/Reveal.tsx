import type { ElementType, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface RevealProps {
  children: ReactNode;
  /** Element to render as. Defaults to a <div>. */
  as?: ElementType;
  /** Delay in milliseconds before the fade begins once in view. */
  delay?: number;
  className?: string;
}

/**
 * Wraps content so it gently fades and rises into place the first time it
 * scrolls into view. With "reduce motion" enabled it renders fully visible with
 * no transition.
 */
export function Reveal({ children, as, delay = 0, className }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLElement>();

  const shown = reduced || inView;

  return (
    <Tag
      ref={ref}
      className={['reveal', shown ? 'reveal--in' : '', className].filter(Boolean).join(' ')}
      style={delay && !reduced ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
