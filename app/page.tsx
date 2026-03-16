'use client';
import Header from '@/components/Header';
import PostitGrid from '@/components/PostitGrid';
import { useState } from 'react';
import CreateRollingPaperModal from '@/components/CreateRollingPaperModal';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f4f0' }}>
      {modalOpen && <CreateRollingPaperModal onClose={() => setModalOpen(false)} />}

      <Header title="홈" />

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 620, padding: '0 16px 80px', paddingTop: 52 }}>

          {/* 히어로 */}
          <div style={{ background: '#fff', borderRadius: 18, padding: 20, marginBottom: 16, border: '1px solid #e8e8e8' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>마음을 전하는 공간</h2>
                <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>소중한 사람들과 마음을 나누어보세요</p>
              </div>
              <button 
                onClick={() => setModalOpen(true)}
                style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, padding: '10px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Noto Sans KR, sans-serif' }}>
                롤링페이퍼 만들기
              </button>
            </div>
          </div>

          {/* 검색창 */}
          <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="검색" style={{ border: 'none', outline: 'none', fontSize: 14, background: 'transparent', width: '100%', fontFamily: 'Noto Sans KR, sans-serif' }} />
          </div>

          {/* 포스트잇 */}
          <PostitGrid />
        </div>
      </main>

      {/* FAB */}
      <button 
        onClick={() => setModalOpen(true)}
        style={{
          position: 'fixed', bottom: 28, right: 28, width: 52, height: 52,
          background: '#1a1a1a', color: 'white', border: 'none', borderRadius: 16,
          fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 200
        }}>+</button>
    </div>
  );
}