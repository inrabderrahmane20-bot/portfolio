import Head from 'next/head';
import { useEffect } from 'react';

export default function BusinessCards() {
  /* Full-screen card viewer: hide the global footer so nothing but the site's
     fixed space backdrop sits behind the transparent iframe. With the footer
     hidden (and no spacer) the page content fits the viewport, so there is
     nothing to scroll — no scrollbar, and no footer sliding in behind the card.
     (We deliberately avoid `overflow:hidden` on <html>, which forces the iframe
     onto its own compositing layer and can break the see-through backdrop.) */
  useEffect(() => {
    const footer = document.querySelector<HTMLElement>('footer');
    if (!footer) return;
    const prev = footer.style.display;
    footer.style.display = 'none';
    return () => { footer.style.display = prev; };
  }, []);

  return (
    <>
      <Head>
        <title>Business Card - AC</title>
      </Head>
      {/* Full-screen iframe below the fixed navbar (~68px tall) */}
      <div
        style={{
          position:   'fixed',
          inset:      0,
          top:        68,
          background: 'transparent',
          zIndex:     150,
        }}
      >
        <iframe
          src="/business-card.html"
          title="Carte de visite - Abderrahmane Charak"
          style={{
            width:  '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            background: 'transparent',
          }}
        />
      </div>
    </>
  );
}
