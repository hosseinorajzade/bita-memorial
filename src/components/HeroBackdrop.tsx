import { asset } from '../lib/assets';

interface HeroBackdropProps {
  /** Optional custom background image path from config. Empty → built-in art. */
  image?: string;
}

/**
 * The soft atmosphere behind the hero: warm ivory light, faint drifting light,
 * and a few out-of-focus petals near the base. Drawn as a tiny inline SVG so it
 * weighs almost nothing and always sits well under light or dark text.
 *
 * If `image` is provided it is layered on top of the same warm base, so even a
 * missing custom image degrades to something calm rather than blank.
 */
export function HeroBackdrop({ image }: HeroBackdropProps) {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <svg
        className="hero-backdrop__art"
        viewBox="0 0 1080 1600"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="14%" r="75%">
            <stop offset="0%" stopColor="#fffaf0" />
            <stop offset="42%" stopColor="#f7efe0" />
            <stop offset="100%" stopColor="#ece0ca" />
          </radialGradient>
          <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="70%" stopColor="#efe4d0" stopOpacity="0" />
            <stop offset="100%" stopColor="#e7dabf" stopOpacity="0.55" />
          </linearGradient>
          <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <filter id="softer" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="52" />
          </filter>
        </defs>

        <rect width="1080" height="1600" fill="url(#glow)" />

        {/* faint diagonal light rays reaching down from the top */}
        <g fill="#fffdf7">
          <polygon points="240,-120 500,-120 250,900 40,800" opacity="0.5" filter="url(#softer)" />
          <polygon points="600,-120 780,-120 660,760 500,700" opacity="0.4" filter="url(#softer)" />
        </g>

        {/* out-of-focus petals gathering toward the lower third */}
        <g filter="url(#soft)">
          <ellipse cx="150" cy="1180" rx="130" ry="76" fill="#ecdcbd" opacity="0.7" transform="rotate(-18 150 1180)" />
          <ellipse cx="430" cy="1320" rx="165" ry="92" fill="#e6d3ac" opacity="0.72" transform="rotate(12 430 1320)" />
          <ellipse cx="720" cy="1230" rx="140" ry="82" fill="#efe1c6" opacity="0.66" transform="rotate(-8 720 1230)" />
          <ellipse cx="960" cy="1360" rx="175" ry="100" fill="#e4d0a6" opacity="0.72" transform="rotate(16 960 1360)" />
          <ellipse cx="540" cy="1460" rx="230" ry="126" fill="#dfc99e" opacity="0.6" />
        </g>

        {/* a few high, soft motes of light */}
        <g filter="url(#soft)" fill="#fffef9">
          <circle cx="300" cy="360" r="11" opacity="0.8" />
          <circle cx="820" cy="250" r="8" opacity="0.7" />
          <circle cx="640" cy="470" r="6" opacity="0.55" />
          <circle cx="170" cy="620" r="5" opacity="0.5" />
        </g>

        <rect width="1080" height="1600" fill="url(#veil)" />
      </svg>

      {image ? (
        <div
          className="hero-backdrop__photo"
          style={{ backgroundImage: `url(${asset(image)})` }}
        />
      ) : null}
    </div>
  );
}

export default HeroBackdrop;
