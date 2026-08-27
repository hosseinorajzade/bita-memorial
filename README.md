# A digital memorial page

A quiet, mobile-first remembrance page meant to be opened by scanning a QR code
engraved on a gravestone. It is a fully static site — no backend, no database,
no cookies, no analytics, no third-party trackers.

Built with **React + Vite + TypeScript** and a small amount of hand-written CSS.
The whole runtime is React plus a self-hosted Persian font; there is no UI
framework, animation library, or icon package.

---

## Everything you need to change is in one file

Open **`src/config/memorial.ts`** and edit the text, dates, and file paths.
You never need to touch the components.

| What | Where |
| --- | --- |
| Name, dates, quote | `name`, `birthDate`, `passingDate`, `heroQuote` |
| Remembrance message | `remembranceMessage` (blank line = new paragraph) |
| Section headings | `headings` |
| Closing line + symbol | `finalMessage`, `finalSymbol` |
| Main photo | `photo` → put the file at `public/assets/memorial-photo.jpg` |
| Song | `music.src` → put the file at `public/assets/memorial-song.mp3` |
| Gallery | `gallery` array → put files in `public/assets/gallery/` |
| Floating light particles | `showParticles: true \| false` |
| Custom hero background image | `heroBackground` (leave `''` for the built-in art) |

Persian (`۱۲۳`) and English (`123`) digits both render correctly, and the page
is right-to-left throughout.

### Replacing the photo and song

The files already in `public/assets/` are placeholders. Replace them with the
real ones, keeping the **same file names**:

```
public/assets/memorial-photo.jpg     ← the portrait
public/assets/memorial-song.mp3      ← the remembrance song
public/assets/gallery/your-photo.jpg ← any gallery photos
```

If the photo or song is missing, the page still works: a soft placeholder
silhouette is shown instead of a broken image, and the music button politely
reports that audio is unavailable.

**Please compress the song.** The included `memorial-song.mp3` is ~11 MB. The
page never downloads it until a visitor taps play (`preload="none"`), but on a
weak signal that is still a long wait. Re-encoding to 128 kbps roughly halves
the size with no audible loss on a phone speaker, e.g. with ffmpeg:

```bash
ffmpeg -i memorial-song.mp3 -b:a 128k -ac 2 -map_metadata -1 memorial-song-128.mp3
```

Then replace `public/assets/memorial-song.mp3` with the smaller file.

Similarly, save the portrait at roughly the size it is shown (about 720×900)
and compress it to well under ~200 KB.

### Adding gallery photos

1. Drop the images into `public/assets/gallery/`.
2. Add an entry for each one in `src/config/memorial.ts`:

   ```ts
   gallery: [
     { src: '/assets/gallery/photo-1.jpg', alt: 'در یک روز آفتابی', caption: 'تابستان' },
     { src: '/assets/gallery/photo-2.jpg', alt: 'کنار خانواده' },
   ],
   ```

An empty `gallery` array hides the gallery section entirely. Gallery images are
lazy-loaded, so extra photos do not slow down the first screen.

---

## Local development

```bash
npm install
npm run dev      # start a local server (prints a http://localhost address)
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally to check it
```

Requires Node 18 or newer.

---

## Deploying with GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and publishes the site on
every push to `main`.

1. Create a repository on GitHub and push this project to the `main` branch.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push a commit (or run the workflow manually from the **Actions** tab). When it
   finishes, the page is live at the URL shown on the Pages settings screen —
   typically `https://<username>.github.io/<repository>/`.

The build uses a **relative base path** (`base: './'` in `vite.config.ts`), so it
works without any changes whether it is served from:

- a project site — `https://<username>.github.io/<repository>/`
- a user/organization site — `https://<username>.github.io/`
- a custom domain (add a `CNAME` file in `public/` if you use one)

No server, VPS, or container is required. `public/.nojekyll` is included so
GitHub Pages serves the built files as-is.

### Pointing the QR code at the page

Generate the QR code from the final Pages URL (or your custom domain). Test it
by scanning with both an iPhone and an Android phone before engraving.

---

## The hero background

By default the hero uses a tiny hand-drawn SVG — warm ivory light, faint rays,
and a few out-of-focus petals near the base. It weighs only a few kilobytes,
looks right at any screen size, and needs no image file.

If you would rather use a photographic background, generate one with the prompt
below, save it as `public/assets/hero-bg.jpg` (a vertical/portrait image,
roughly 1080×1600, compressed to well under ~300 KB), and set
`heroBackground: '/assets/hero-bg.jpg'` in the config. It is layered over the
same warm base and dimmed, so text stays readable.

> An elegant and deeply peaceful memorial atmosphere, soft ivory and warm beige
> tones, delicate white flowers gently illuminated by soft morning light, subtle
> floating dust particles in the air, dreamy cinematic photography, extremely
> soft depth of field, delicate natural light rays, calm and timeless
> atmosphere, minimal composition, sophisticated editorial photography,
> emotional but peaceful, no people, no text, no objects associated with death,
> no graveyard, no dark horror elements, no religious symbols, premium fine-art
> photography, soft film grain, muted colours, vertical composition suitable for
> a mobile memorial webpage hero background, 4K.

---

## Typography

The Persian typeface is **Doran FaNum** (the project's own font — the variable
"FaNum" cut, which renders digits as Persian numerals). It is self-hosted from
`public/assets/fonts/DoranFaNum-VF.woff2` (with a `.woff` fallback) and declared
with a single `@font-face` in `src/styles/global.css`. The page makes **no request
to Google Fonts or any other outside server** — the only network requests are for
the page's own files. The CSS fallback stack is Tahoma / Segoe UI / the system
sans-serif (all of which also render Persian).

Doran is a proprietary font from fontiran.com; see
`public/assets/fonts/Doran-Fonts-NOTICE.txt`. The full family (static weights and
the other cuts) is kept, undeployed, in the `WebFont/` folder. To switch cut
(e.g. to `Doran` with Latin numerals, or `Doran NoEn`), copy that variable file
into `public/assets/fonts/` and update the `@font-face` `src`, the `--font`
value, and the preload `href` in `index.html`.

---

## Accessibility & motion

- Semantic landmarks (`header`, `main`, `section`, `figure`, `footer`), a skip
  link, and a sensible heading order.
- All images have alt text (from the config); controls have labels.
- The music button, progress slider, and gallery lightbox are keyboard operable
  (`Tab`, `Enter`/`Space`, arrow keys, `Esc`).
- Every decorative animation — fades, the drifting particles, the equaliser, the
  scroll hint — is disabled when the visitor has **“reduce motion”** enabled in
  their operating system.

---

## Privacy

This page contains no analytics, tracking pixels, advertising, social embeds, or
third-party scripts of any kind. It sets no cookies and requires no accounts.
The only network requests are for the page's own files.
