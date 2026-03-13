'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
 
interface Props {
  onClose: () => void;
}

const banners = [
  { id: 0, src: null, label: '선택 안함' },
  { id: 1, src: '/banners/banner1.png', label: '생일축하1', namePosition: {bottom: '2%', left: '50%', transform: 'translateX(-50%)'} },
  { id: 2, src: '/banners/banner2.png', label: '생일축하2', namePosition: {bottom: '19%', left: '50%', transform: 'translateX(-50%)'} },
  { id: 3, src: '/banners/banner3.png', label: '생일축하3', namePosition: {bottom: '19%', left: '50%', transform: 'translateX(-50%)'} },
  { id: 4, src: '/banners/banner4.png', label: '생일축하4', namePosition: {bottom: '32%', left: '50%', transform: 'translateX(-50%)'} }
];
 
export default function CreateRollingPaperModal({ onClose }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [comment, setComment] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
 
  const prevBanner = () => setBannerIndex(i => (i - 1 + banners.length) % banners.length);
  const nextBanner = () => setBannerIndex(i => (i + 1) % banners.length);
 
  const handleSubmit = async () => {
    if (!title.trim()) return alert('제목을 입력해주세요!');
    if (!password.trim()) return alert('비밀번호를 입력해주세요!');

    const res = await fetch('/api/rolling-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        title,
        password,
        comment,
        bannerId: banners[bannerIndex].id,
        bannerSrc: banners[bannerIndex].src,
        }),
    });

    const { id } = await res.json();
    onClose();
    router.push(`/${id}`);
  };
 
  return (
    <>
      {/* 오버레이 */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 300,
          backdropFilter: 'blur(2px)',
        }}
      />
 
      {/* 모달 */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%', maxWidth: 480,
        background: '#fff',
        borderRadius: 24,
        padding: '28px 24px',
        zIndex: 400,
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>새 롤링페이퍼 작성</span>
          <div style={{ width: 28 }} />
        </div>
 
        {/* 제목 입력 */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>제목 입력</label>
          <div style={inputWrapStyle}>
            <input
              type="text"
              placeholder="롤링페이퍼 제목을 적어주세요."
              maxLength={20}
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={inputStyle}
            />
            <span style={{ fontSize: 12, color: '#bbb', alignSelf: 'flex-end' }}>{title.length}/20</span>
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div style={{ marginBottom: 32 }}>
          <label style={labelStyle}>비밀번호</label>
          <p style={{ fontSize: 12, color: '#aaa', marginBottom: 8 }}>롤링페이퍼를 삭제할 때 필요해요.</p>
          <div style={inputWrapStyle}>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              maxLength={500}
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
 
        {/* 생일자 입력 */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>생일자 <span style={{ color: '#bbb', fontWeight: 400, fontSize: 12 }}>(선택)</span></label>
          <div style={inputWrapStyle}>
            <input
              type="text"
              placeholder="이번달 생일자의 이름을 적어요."
              maxLength={20}
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={inputStyle}
            />
            <span style={{ fontSize: 12, color: '#bbb', alignSelf: 'flex-end' }}>{title.length}/500</span>
          </div>
        </div>

        {/* 배너 선택 */}
        <div style={{ marginBottom: 32 }}>
          <label style={labelStyle}>배너 선택</label>
 
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* 이전 버튼 */}
            <button onClick={prevBanner} style={arrowBtnStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
 
            {/* 배너 미리보기 */}
            <div style={{
              flex: 1, height: 160,
              borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              position: 'relative',
              background: banners[bannerIndex].src ? 'transparent' : '#f4f4f0',  // 추가
            }}>
              {/* 배경 이미지 */}
              {banners[bannerIndex].src ? (
                  <>
                  <Image src={banners[bannerIndex].src} alt={banners[bannerIndex].label} fill style={{ objectFit: 'cover' }} />
                  {/* 이름 오버레이 */}
                  {comment && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      ...banners[bannerIndex].namePosition,
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    }}>
                    <span style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: '#111',
                        letterSpacing: 1,
                        padding: '4px 16px',
                        borderRadius: 20,
                    }}>
                      {comment}
                    </span>
                    </div>
                  )}
    
                  {/* 이름 미입력시 안내 */}
                  {!comment && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      ...banners[bannerIndex].namePosition,
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    }}>
                    <span style={{
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.7)',
                      background: 'rgba(0,0,0,0.2)',
                      padding: '4px 14px',
                      borderRadius: 20,
                      backdropFilter: 'blur(2px)',
                      whiteSpace: 'nowrap',
                    }}>
                      생일자 이름이 여기에 표시돼요
                    </span>
                    </div>
                )}
                  
                  </>
              ) : (
                  // 선택 안함일 때
                  <div style={{ textAlign: 'center', color: '#bbb', marginTop: 40 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🚫</div>
                  <div style={{ fontSize: 13 }}>배너 없음</div>
                </div>
            )}
            </div>
 
            {/* 다음 버튼 */}
            <button onClick={nextBanner} style={arrowBtnStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
 
          {/* 인디케이터 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
            {banners.map((_, i) => (
              <div key={i} onClick={() => setBannerIndex(i)} style={{
                width: i === bannerIndex ? 20 : 6, height: 6,
                borderRadius: 3,
                background: i === bannerIndex ? '#1a1a1a' : '#ddd',
                cursor: 'pointer', transition: 'all 0.2s',
              }} />
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 8 }}>
            {banners[bannerIndex].label} ({bannerIndex + 1}/{banners.length})
          </div>
        </div>
 
        {/* 만들기 버튼 */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '16px',
            background: title.trim() && password.trim() ? '#1a1a1a' : '#e8e8e8',
            color: title.trim() && password.trim() ? '#fff' : '#aaa',
            border: 'none',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: title.trim() && password.trim() ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-noto), sans-serif',
            transition: 'background 0.2s',
          }}
        >
          롤링페이퍼 만들기
        </button>
      </div>
    </>
  );
}
 
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 14,
  fontWeight: 700,
  color: '#1a1a1a',
  marginBottom: 10,
};
 
const inputWrapStyle: React.CSSProperties = {
  background: '#f7f7f5',
  borderRadius: 12,
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  border: '1.5px solid transparent',
  transition: 'border-color 0.15s',
};
 
const inputStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  fontSize: 14,
  color: '#1a1a1a',
  fontFamily: 'var(--font-noto), sans-serif',
  width: '100%',
};

const arrowBtnStyle: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 12,
  background: '#f4f4f0', border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: '#555', flexShrink: 0,
};