/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MEMORIAL CONTENT — edit this file only.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Everything a visitor reads or hears is defined here. You should never need
 *  to touch the components in `src/` to change names, dates, text, the photo,
 *  the song, or the gallery.
 *
 *  Asset paths are written relative to the site root, e.g. "/assets/photo.jpg".
 *  Put the files in the `public/assets/` folder with matching names and they
 *  will be served correctly both locally and on GitHub Pages.
 *
 *    public/assets/memorial-photo.jpg     → the main portrait
 *    public/assets/memorial-song.mp3      → the remembrance song
 *    public/assets/gallery/*.jpg          → gallery photos
 *
 *  If a photo or the song is missing, the page still works — a gentle
 *  placeholder is shown instead of a broken image, and the music button
 *  simply stays quiet.
 */

export interface GalleryPhoto {
  /** Path under /assets, e.g. "/assets/gallery/summer.jpg" */
  src: string;
  /** Short description for screen readers and as a fallback if the image fails. */
  alt: string;
  /** Optional short caption shown beneath the photo. */
  caption?: string;
}

export interface MemorialConfig {
  /** Text direction for the whole page. Persian content → "rtl". */
  dir: 'rtl' | 'ltr';
  /** BCP-47 language tag, used on <html lang> and for number formatting. */
  lang: string;

  /** Full name, shown as the main heading of the page. */
  name: string;
  /**
   * Dates shown under the name as:  «birth — passing».
   * Plain strings so you can use any calendar (Persian, Gregorian, …) and any
   * digits you like. Persian (۱۲۳) and English (123) numerals both render.
   */
  birthDate: string;
  passingDate: string;

  /** One short line under the name — the heart of the hero. */
  heroQuote: string;

  /**
   * The personal remembrance message. Use blank lines to separate paragraphs;
   * single line breaks inside a paragraph are preserved.
   */
  remembranceMessage: string;

  /** Main portrait. */
  photo: string;
  /** Descriptive alt text for the portrait. */
  photoAlt: string;

  /**
   * Optional soft background image for the hero. Leave as an empty string to
   * use the built-in hand-drawn light-and-petals background (recommended —
   * it is a few kilobytes and always looks right).
   */
  heroBackground: string;

  /** Remembrance song. */
  music: {
    src: string;
    /** Shown next to the player, e.g. song name or "موسیقی یادبود". */
    title: string;
  };

  /** Gallery photos. Add or remove freely; an empty list hides the section. */
  gallery: GalleryPhoto[];

  /** Small closing line at the very bottom of the page. */
  finalMessage: string;
  /** A single elegant glyph shown beneath the closing line. */
  finalSymbol: string;

  /** Section headings. */
  headings: {
    remembrance: string;
    gallery: string;
    music: string;
  };

  /** Decorative floating light particles in the hero. */
  showParticles: boolean;
}

export const memorial: MemorialConfig = {
  dir: 'rtl',
  lang: 'fa-IR',

  name: 'بیتا',
  birthDate: '۱۳۸۰',
  passingDate: '۱۴۰۵',

  heroQuote: 'یادت همیشه در قلب ما زنده خواهد ماند',

  remembranceMessage: `گاهی نبودن یک نفر، تمام جهان را برای ما تغییر می‌دهد.
اما خاطره‌ها، لبخندها و لحظه‌هایی که با او داشتیم،
همیشه در قلب ما باقی خواهند ماند.`,

  photo: '/assets/memorial-photo.jpg',
  photoAlt: 'پرتره‌ای از او',

  heroBackground: '',

  music: {
    src: '/assets/memorial-song.mp3',
    title: 'موسیقی یادبود',
  },

  gallery: [
    // Drop photos into public/assets/gallery/ and list them here. Order is kept.
    // Any file that fails to load is skipped; an empty list hides the section.
    // { src: '/assets/gallery/photo-1.jpg', alt: 'در یک روز آفتابی', caption: 'تابستان' },
    // { src: '/assets/gallery/photo-2.jpg', alt: 'کنار خانواده' },
    // { src: '/assets/gallery/photo-3.jpg', alt: 'لبخند همیشگی‌اش' },
  ],

  finalMessage: 'تا همیشه در یاد ما زنده‌ای',
  finalSymbol: '✦',

  headings: {
    remembrance: 'به یاد او',
    gallery: 'گالری خاطرات',
    music: 'یک آهنگ برای او',
  },

  showParticles: true,
};

export default memorial;
