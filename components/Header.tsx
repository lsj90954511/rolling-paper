'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Props {
  title?: string;
  showBack?: boolean;
}

export default function Header({ title = '홈', showBack = false }: Props) {
  const router = useRouter();
  const lastY = useRef(0);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const down = y > lastY.current && y > 10;
      if (down) setHidden(true);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setHidden(false), 1000);
      lastY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: '50%', zIndex: 50,
      transform: hidden ? 'translateY(-100%) translateX(-50%)' : 'translateY(0) translateX(-50%)',
      width: '100%', maxWidth: 620,
      background: 'rgba(250,252,255,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0px',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      opacity: hidden ? 0 : 1,
      pointerEvents: hidden ? 'none' : 'auto',
    }}>
      {showBack ? (
        <button style={btnStyle} onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}
      <span style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>{title}</span>
      <div style={{ width: 36 }} />
    </header>
  );
}

const btnStyle = {
  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: '#888', border: 'none', background: 'transparent', borderRadius: 10,
} as React.CSSProperties;