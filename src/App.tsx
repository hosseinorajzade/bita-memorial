import { useEffect } from 'react';
import { memorial } from './config/memorial';
import { Hero } from './components/Hero';
import { Remembrance } from './components/Remembrance';
import { Gallery } from './components/Gallery';
import { MusicPlayer } from './components/MusicPlayer';
import { FinalSection } from './components/FinalSection';

export function App() {
  // Keep <html> in sync with the configured language and direction.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = memorial.lang;
    root.dir = memorial.dir;
    if (memorial.name && memorial.name !== 'نام او') {
      document.title = memorial.name;
    }
  }, []);

  return (
    <>
      <a className="skip-link" href="#remembrance">
        رفتن به محتوای اصلی
      </a>

      <Hero config={memorial} />

      <main id="content">
        <Remembrance config={memorial} />
        <Gallery config={memorial} />
        <MusicPlayer config={memorial} />
      </main>

      <FinalSection config={memorial} />
    </>
  );
}

export default App;
