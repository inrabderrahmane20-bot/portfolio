import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900;
    if (isTouch) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const moveCursor = (event: MouseEvent) => {
      const { clientX: x, clientY: y } = event;
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.left = `${x}px`;
        cursorRef.current.style.top = `${y}px`;
        ringRef.current.style.left = `${x}px`;
        ringRef.current.style.top = `${y}px`;
      }

      if (labelRef.current) {
        labelRef.current.style.left = `${x}px`;
        labelRef.current.style.top = `${y + 44}px`;
      }

      setVisible(true);
    };

    const handleHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const element = target.closest('a, button, [role="button"], input, textarea, label') as HTMLElement | null;
      if (element) {
        setActive(true);
        setLabel(element.tagName === 'A' ? 'View' : 'Open');
      } else {
        setActive(false);
        setLabel('');
      }
    };

    const hide = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        setVisible(false);
      }
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleHover, true);
    document.addEventListener('mouseout', hide);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleHover, true);
      document.removeEventListener('mouseout', hide);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div className={`custom-cursor ${active ? 'cursor-active' : ''}`}>
      <div ref={ringRef} className="cursor-ring" style={{ opacity: visible ? 1 : 0 }} />
      <div ref={cursorRef} className="cursor-dot" style={{ opacity: visible ? 1 : 0 }} />
      {active && label ? (
        <div ref={labelRef} className="cursor-label">
          {label}
        </div>
      ) : null}
    </div>
  );
}
