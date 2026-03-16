'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RollingPaper {
  rollingPaperId: number;
  title: string;
  createdAt: string;
}

const POSTIT_COLORS = ['#fef08a','#bfdbfe','#fca5a5','#bbf7d0','#f9a8d4','#fef9c3','#a5f3fc','#d9f99d','#fed7aa'];
const ROTATIONS = [-2, 1.5, 2, -1.5, 1, -2, 2.5, -1, 1.5];

export default function PostitGrid() {
  const [papers, setPapers] = useState<RollingPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/rolling-paper')
      .then(res => res.json())
      .then(data => {
        setPapers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ color: '#aaa', fontSize: 14, textAlign: 'center', padding: 40 }}>불러오는 중...</div>
  );

  if (!papers.length) return (
    <div style={{ color: '#aaa', fontSize: 14, textAlign: 'center', padding: 40 }}>아직 롤링페이퍼가 없어요 🥲</div>
  );

  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 20, padding: '0 2px' }}>
        롤링페이퍼 ✨
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, padding: '0 4px' }}>
        {papers.map((paper, i) => (
          <div key={paper.rollingPaperId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6 }}>
            <div
              className="postit"
              onClick={() => router.push(`/${paper.rollingPaperId}`)}
              style={{
                width: '100%', aspectRatio: '1', borderRadius: 4,
                padding: '14px 12px 10px', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', cursor: 'pointer',
                alignItems: 'center',
                background: POSTIT_COLORS[i % POSTIT_COLORS.length],
                transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`,
                boxShadow: '2px 3px 10px rgba(0,0,0,0.10)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.75)', lineHeight: 1.4, textAlign: 'center' }}>
                {paper.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}