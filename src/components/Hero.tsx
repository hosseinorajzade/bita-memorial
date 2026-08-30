import type { MemorialConfig } from '../config/memorial';
import { HeroBackdrop } from './HeroBackdrop';
import { Particles } from './Particles';

interface HeroProps {
  config: MemorialConfig;
}

export function Hero({ config }: HeroProps) {
  return (
    <header className="hero" role="banner">
      <HeroBackdrop image={config.heroBackground || undefined} />
      <Particles enabled={config.showParticles} />

      <div className="hero__inner">
        <h1 className="hero__name">{config.name}</h1>

        <p className="hero__dates" dir="rtl">
          <span>{config.birthDate}</span>
          <span className="hero__dates-dash" aria-hidden="true" />
          <span>{config.passingDate}</span>
        </p>

        <p className="hero__quote">{config.heroQuote}</p>
      </div>

      <a className="hero__scroll" href="#remembrance" aria-label="رفتن به متن یادبود">
        <span className="hero__scroll-chevron" aria-hidden="true" />
      </a>
    </header>
  );
}

export default Hero;
