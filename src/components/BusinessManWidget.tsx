import { useMotionValue, animate, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

/*
 * A business card that peeks 20% from the right screen edge,
 * softly teasing between 5% and 20% visible in a looping pulse.
 * Dragging it left past 80 px navigates to /business-cards.
 */
export default function BusinessManWidget() {
  const router = useRouter();
  const hidden = router.pathname === '/business-cards';

  /* card is 84 px wide:
     20% visible → left: 84 * 0.80 = 67 px off screen  →  x = 0  (base)
      5% visible → left: 84 * 0.95 = 80 px off screen  →  x = -13 px  */
  const cardX = useMotionValue(0);

  /* pulse animation: ease out to -13 (mostly hidden), ease back to 0 (20% shown) */
  useEffect(() => {
    if (hidden) return;
    let running = true;
    const loop = async () => {
      while (running) {
        await animate(cardX, -13, { duration: 1.4, ease: [0.4, 0, 0.6, 1] });
        await animate(cardX,   0, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
      }
    };
    loop();
    return () => { running = false; };
  }, [hidden, cardX]);

  const onDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -80) {
      router.push('/business-cards');
    } else {
      animate(cardX, 0, { type: 'spring', stiffness: 300, damping: 26 });
    }
  };

  if (hidden) return null;

  return (
    <div style={{
      position:      'fixed',
      bottom:        72,
      right:         -67,          /* 67 px off screen → 17 px (≈20%) visible */
      zIndex:        40,
      pointerEvents: 'auto',
      userSelect:    'none',
    }}>
      <motion.div
        drag="x"
        dragConstraints={{ left: -230, right: 13 }}
        dragElastic={{ left: 0.07, right: 0.04 }}
        style={{ x: cardX, cursor: 'grab' }}
        whileDrag={{ cursor: 'grabbing' }}
        onDragEnd={onDragEnd}
      >
        <div style={{
          width:          84,
          height:         52,
          borderRadius:   7,
          background:     'linear-gradient(135deg,#0c1226 0%,#1a1f3c 60%,#0f172a 100%)',
          border:         '1px solid rgba(129,140,248,0.44)',
          boxShadow:      '-4px 0 24px rgba(0,0,0,0.5), 0 0 18px rgba(129,140,248,0.18), inset 0 1px 0 rgba(255,255,255,0.07)',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            4,
          overflow:       'hidden',
          position:       'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
            background: 'linear-gradient(to bottom,rgba(255,255,255,0.06),transparent)',
            borderRadius: '7px 7px 0 0', pointerEvents: 'none',
          }}/>
          <span style={{
            fontFamily:           "'Space Grotesk','Segoe UI',sans-serif",
            fontSize:             17,
            fontWeight:           900,
            background:           'linear-gradient(135deg,#818cf8,#38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            letterSpacing:        '-0.02em',
            lineHeight:           1,
          }}>AC</span>
          <span style={{
            fontFamily:    "'JetBrains Mono','Courier New',monospace",
            fontSize:      5.5,
            color:         'rgba(255,255,255,0.35)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}>Business Card</span>
        </div>
      </motion.div>
    </div>
  );
}
