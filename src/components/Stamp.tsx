/** Rotating circular text stamp — pure SVG, CSS animation. */
export default function Stamp({
  text = 'ABDERRAHMANE CHARAK — SOFTWARE ENGINEER — MARRAKECH — ',
  size = 150,
  className,
}: {
  text?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="spin-slow"
        style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <path id="stamp-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '8.1px',
            letterSpacing: '0.16em',
            fill: 'currentColor',
          }}>
          <textPath href="#stamp-circle">{text}</textPath>
        </text>
        {/* centre asterisk */}
        <g transform="translate(50 50)" style={{ fill: 'var(--verm)' }}>
          {[0, 45, 90, 135].map(a => (
            <rect key={a} x={-1.1} y={-9} width={2.2} height={18} transform={`rotate(${a})`} />
          ))}
        </g>
      </svg>
    </div>
  );
}
