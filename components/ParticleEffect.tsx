'use client';
import { useEffect, useState } from 'react';
import { Effect } from '@/lib/enums';

interface Props {
  effect: Effect | null;
}

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  swayDuration: number;
  swayAmount: number;
  colorIdx: number;
}

const PARTICLE_COUNT = 22;

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const duration = Math.random() * 5 + 8;
    return {
      id: i,
      x: Math.random() * 95 + 2.5,
      size: Math.random() * 20 + 14,
      duration,
      delay: -(Math.random() * duration),  // 음수 딜레이로 이미 진행 중인 것처럼
      swayDuration: Math.random() * 2 + 2,
      swayAmount: Math.random() * 12 + 6,
      colorIdx: Math.floor(Math.random() * 4),
    };
  });
}

const HEART_COLORS = [
  { main: '#ff8fab', glow: '#ffb3c6' },
  { main: '#ff6b9d', glow: '#ffc2d1' },
  { main: '#ff4d8b', glow: '#ffb3c6' },
  { main: '#ffc2d1', glow: '#ffe5ed' },
];

const STAR_COLORS = [
  { main: '#ffd700', glow: '#fff176' },
  { main: '#ffec47', glow: '#fff9c4' },
  { main: '#fcc200', glow: '#ffe57f' },
  { main: '#ffe066', glow: '#fff9c4' },
];

const SNOW_COLORS = [
  { main: '#90e0ef', glow: '#caf0f8' },
  { main: '#48cae4', glow: '#ade8f4' },
  { main: '#a8dadc', glow: '#e0f7fa' },
  { main: '#caf0f8', glow: '#ffffff' },
];

const GlowHeart = ({ size, color }: { size: number; color: { main: string; glow: string } }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
    <defs>
      <filter id={`glow-h-${color.main.replace('#','')}`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path
      d="M50 82 C50 82 12 57 12 34 C12 20 23 12 36 12 C43 12 48 16 50 20 C52 16 57 12 64 12 C77 12 88 20 88 34 C88 57 50 82 50 82Z"
      fill={color.glow}
      opacity="0.5"
      filter={`url(#glow-h-${color.main.replace('#','')})`}
      transform="scale(1.15) translate(-7, -5)"
    />
    <path
      d="M50 82 C50 82 12 57 12 34 C12 20 23 12 36 12 C43 12 48 16 50 20 C52 16 57 12 64 12 C77 12 88 20 88 34 C88 57 50 82 50 82Z"
      fill={`url(#grad-h-${color.main.replace('#','')})`}
    />
    <ellipse cx="38" cy="30" rx="10" ry="7" fill="white" opacity="0.4" transform="rotate(-20, 38, 30)"/>
  </svg>
);

const GlowStar = ({ size, color }: { size: number; color: { main: string; glow: string } }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
    <defs>
      <filter id={`glow-s-${color.main.replace('#','')}`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <polygon
      points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
      fill={color.glow}
      opacity="0.5"
      filter={`url(#glow-s-${color.main.replace('#','')})`}
      transform="scale(1.2) translate(-8, -8)"
    />
    <polygon
      points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
      fill={`url(#grad-s-${color.main.replace('#','')})`}
    />
    <ellipse cx="38" cy="32" rx="8" ry="5" fill="white" opacity="0.5" transform="rotate(-15, 38, 32)"/>
  </svg>
);

const GlowSnow = ({ size, color }: { size: number; color: { main: string; glow: string } }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
    <defs>
      <filter id={`glow-n-${color.main.replace('#','')}`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45"
      fill={color.glow}
      opacity="0.4"
      filter={`url(#glow-n-${color.main.replace('#','')})`}
    />
    <circle cx="50" cy="50" r="40"
      fill={`url(#grad-n-${color.main.replace('#','')})`}
    />
    <ellipse cx="38" cy="38" rx="10" ry="7" fill="white" opacity="0.4"/>
  </svg>
);

export default function ParticleEffect({ effect }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!effect || effect === Effect.NONE) {
      setParticles([]);
      return;
    }
    setParticles(createParticles());
  }, [effect]);

  if (!effect || effect === Effect.NONE || particles.length === 0) return null;

  const colors = effect === Effect.HEART ? HEART_COLORS
    : effect === Effect.STAR ? STAR_COLORS
    : SNOW_COLORS;

  return (
    <>
      <style>{`
        @keyframes float-down {
          0% { transform: translateY(0); opacity: 1; }
          90% { opacity: 0.9; }
          100% { transform: translateY(120vh); opacity: 0; }
        }
        @keyframes sway {
          0%, 100% { margin-left: 0px; }
          50% { margin-left: var(--sway); }
        }
      `}</style>
      <div style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none',
        zIndex: 200,
        overflow: 'hidden',
      }}>
        {particles.map(p => {
          const color = colors[p.colorIdx];
          return (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: '-60px',
                animation: `float-down ${p.duration}s ${p.delay}s infinite linear`,
              }}
            >
              <div style={{
                animation: `sway ${p.swayDuration}s infinite ease-in-out`,
                ['--sway' as string]: `${p.swayAmount}px`,
              }}>
                {effect === Effect.HEART && <GlowHeart size={p.size} color={color} />}
                {effect === Effect.STAR && <GlowStar size={p.size} color={color} />}
                {effect === Effect.SNOW && <GlowSnow size={p.size} color={color} />}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}