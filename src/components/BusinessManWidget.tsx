import { useMotionValue, animate, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

/*
 * Business card peek widget — right edge of screen.
 * Fix: touch-action:pan-y on the drag element so horizontal drags are
 * captured by framer-motion instead of being stolen by the browser's
 * edge-swipe / back-navigation gesture (iOS & Android).
 * Tap anywhere on the card also navigates directly as a fallback.
 */
export default function BusinessManWidget() {
  const router = useRouter();
  const hidden = router.pathname === '/business-cards';

  /* card 84 px wide:
     ~28% visible → left: 84 * 0.72 = 61 px off screen → x = 0 (base)
     ~10% visible → x = -14 px  */
  const cardX = useMotionValue(0);

  useEffect(() => {
    if (hidden) return;
    let running = true;
    const loop = async () => {
      while (running) {
        await animate(cardX, -14, { duration: 1.4, ease: [0.4, 0, 0.6, 1] });
        await animate(cardX,   0, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
      }
    };
    loop();
    return () => { running = false; };
  }, [hidden, cardX]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -70) {
      router.push('/business-cards');
    } else {
      animate(cardX, 0, { type: 'spring', stiffness: 300, damping: 26 });
    }
  };

  const handleTap = () => {
    router.push('/business-cards');
  };

  if (hidden) return null;

  return (
    /* Wrapper: overscroll-behavior-x prevents page-level horizontal scroll
       from fighting with the drag gesture */
    <div style={{
      position:             'fixed',
      bottom:               72,
      right:                -61,          /* 61 px off → ~23 px visible */
      zIndex:               40,
      pointerEvents:        'auto',
      userSelect:           'none',
      overscrollBehaviorX:  'contain' as any,
    }}>
      <motion.div
        drag="x"
        dragConstraints={{ left: -230, right: 14 }}
        dragElastic={{ left: 0.07, right: 0.04 }}
        style={{
          x:           cardX,
          cursor:      'grab',
          /* KEY FIX: tell browser to own vertical pan (scroll), let us own horizontal */
          touchAction: 'pan-y',
        }}
        whileDrag={{ cursor: 'grabbing' }}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
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
