import type { MemorialConfig } from '../config/memorial';
import { Reveal } from './Reveal';

interface FinalSectionProps {
  config: MemorialConfig;
}

export function FinalSection({ config }: FinalSectionProps) {
  return (
    <footer className="closing" role="contentinfo">
      <Reveal className="closing__inner">
        <p className="closing__message">{config.finalMessage}</p>
        <p className="closing__symbol" aria-hidden="true">
          {config.finalSymbol}
        </p>
      </Reveal>
    </footer>
  );
}

export default FinalSection;
