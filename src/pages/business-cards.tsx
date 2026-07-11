import Head from 'next/head';

export default function BusinessCards() {
  return (
    <>
      <Head>
        <title>Business Card — AC</title>
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
          title="Carte de visite — Abderrahmane Charak"
          style={{
            width:  '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            background: 'transparent',
          }}
        />
      </div>
      {/* Spacer so Next.js layout doesn't collapse */}
      <div style={{ height: '100vh' }} aria-hidden />
    </>
  );
}
