/** Infinite marquee — duplicates children twice for a seamless loop. */
export default function Marquee({
  children,
  duration = 38,
  className,
  reverse = false,
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={className} style={{ overflow: 'hidden', width: '100%' }} aria-hidden>
      <div
        className="marquee-track"
        style={{
          ['--marquee-t' as string]: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}>
        {[0, 1].map(i => (
          <div key={i} style={{ display: 'flex', flexShrink: 0, alignItems: 'center' }}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
