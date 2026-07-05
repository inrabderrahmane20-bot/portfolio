import { useEffect, useState } from 'react';
import { identity } from '@/lib/content';

/** Live clock, pinned to Marrakech time. Renders a placeholder until mounted. */
export default function LocalTime({ className, suffix = ' — MRK' }: { className?: string; suffix?: string }) {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: identity.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning style={{ fontVariantNumeric: 'tabular-nums' }}>
      {time}{suffix}
    </span>
  );
}
