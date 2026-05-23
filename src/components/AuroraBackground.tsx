/*
 * CSS-only aurora — replaces the Three.js WebGL shader.
 * Two soft radial-gradient blobs animated with CSS keyframes.
 * Zero JavaScript, zero GPU shader, zero Three.js bundle cost.
 */
export default function AuroraBackground() {
  return (
    <div
      aria-hidden
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        0,
        pointerEvents: 'none',
        overflow:      'hidden',
      }}
    >
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
    </div>
  );
}
