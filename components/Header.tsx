'use client';
import { useRouter } from 'next/navigation';

interface Props {
  title?: string;
  showBack?: boolean;
  hidden?: boolean;
}

export default function Header({ title = '홈', showBack = false, hidden = false }: Props) {
    const router = useRouter();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: '#f4f4f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
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