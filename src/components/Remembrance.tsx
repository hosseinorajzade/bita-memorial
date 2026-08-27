import type { MemorialConfig } from '../config/memorial';
import { Reveal } from './Reveal';

interface RemembranceProps {
  config: MemorialConfig;
}

/**
 * The personal remembrance message. Blank lines in the config become separate
 * paragraphs; single newlines become soft line breaks within a paragraph.
 */
export function Remembrance({ config }: RemembranceProps) {
  const paragraphs = config.remembranceMessage
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <section id="remembrance" className="section section--remembrance" aria-labelledby="remembrance-title">
      <Reveal as="h2" className="section__title" >
        <span id="remembrance-title">{config.headings.remembrance}</span>
      </Reveal>

      <Reveal className="remembrance__body" delay={120}>
        {paragraphs.map((para, i) => (
          <p key={i} className="remembrance__para">
            {para.split('\n').map((line, j, arr) => (
              <span key={j}>
                {line}
                {j < arr.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        ))}
      </Reveal>

      <Reveal className="section__ornament" delay={200}>
        <span aria-hidden="true">✦</span>
      </Reveal>
    </section>
  );
}

export default Remembrance;
