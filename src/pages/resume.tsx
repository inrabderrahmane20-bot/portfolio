import Head from 'next/head';

export default function Resume() {
  return (
    <>
      <Head>
        <title>Résumé — AC</title>
      </Head>
      {/* Full-screen iframe below the fixed navbar (~68px tall) */}
      <div
        style={{
          position:   'fixed',
          inset:      0,
          top:        68,
          background: '#04071a',
        }}
      >
        <iframe
          src="/resume-card.html"
          title="Résumé — Abderrahmane Charak"
          style={{
            width:  '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
        />
      </div>
      {/* Spacer so Next.js layout doesn't collapse */}
      <div style={{ height: '100vh' }} aria-hidden />
    </>
  );
}
