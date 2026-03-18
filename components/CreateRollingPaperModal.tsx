'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BANNERS } from '@/lib/banners';
import { Effect } from '@/lib/enums';

interface Props {
  onClose: () => void;
}

const EFFECTS = [
  { value: Effect.NONE, label: '없음', emoji: '🚫' },
  { value: Effect.SNOW, label: '눈', emoji: '❄️' },
  { value: Effect.STAR, label: '별', emoji: '⭐' },
  { value: Effect.HEART, label: '하트', emoji: '❤️' },
];

export default function CreateRollingPaperModal({ onClose }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [comment, setComment] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImgFile, setBgImgFile] = useState<File | null>(null);
  const [bgImgPreview, setBgImgPreview] = useState<string | null>(null);
  const [effect, setEffect] = useState<Effect>(Effect.NONE);

  const prevBanner = () => setBannerIndex(i => (i - 1 + BANNERS.length) % BANNERS.length);
  const nextBanner = () => setBannerIndex(i => (i + 1) % BANNERS.length);

  const handleBgImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBgImgFile(file);
    setBgImgPreview(URL.createObjectURL(file));
    setBgColor('#ffffff');
  };

  const removeBgImg = () => {
    setBgImgFile(null);
    setBgImgPreview(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert('제목을 입력해주세요!');
    if (!password.trim()) return alert('비밀번호를 입력해주세요!');

    let bgImgUrl = null;
    if (bgImgFile) {
      const formData = new FormData();
      formData.append('file', bgImgFile);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      bgImgUrl = data.url;
    }

    const res = await fetch('/api/rolling-paper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        password,
        comment,
        bannerId: BANNERS[bannerIndex].id,
        bannerSrc: BANNERS[bannerIndex].src,
        bgColor,
        bgImgUrl,
        effect,
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
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}>
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
              maxLength={500}
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={inputStyle}
            />
            <span style={{ fontSize: 12, color: '#bbb', alignSelf: 'flex-end' }}>{comment.length}/500</span>
          </div>
        </div>

        {/* 배너 선택 */}
        <div style={{ marginBottom: 32 }}>
          <label style={labelStyle}>배너 선택</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={prevBanner} style={arrowBtnStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div style={{
              flex: 1, height: 160,
              borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              position: 'relative',
              background: BANNERS[bannerIndex].src ? 'transparent' : '#f4f4f0',
            }}>
              {BANNERS[bannerIndex].src ? (
                <>
                  <Image src={BANNERS[bannerIndex].src} alt={BANNERS[bannerIndex].label} fill style={{ objectFit: 'cover' }} />
                  {comment && (
                    <div style={{ position: 'absolute', inset: 0, ...BANNERS[bannerIndex].namePosition, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <span style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', fontWeight: 800, color: '#111', letterSpacing: 1, padding: '4px 16px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                        {comment}
                      </span>
                    </div>
                  )}
                  {!comment && (
                    <div style={{ position: 'absolute', inset: 0, ...BANNERS[bannerIndex].namePosition, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <span style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.2)', padding: '4px 14px', borderRadius: 20, backdropFilter: 'blur(2px)', whiteSpace: 'nowrap' }}>
                        생일자 이름이 여기에 표시돼요
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#bbb', marginTop: 40 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🚫</div>
                  <div style={{ fontSize: 13 }}>배너 없음</div>
                </div>
              )}
            </div>
            <button onClick={nextBanner} style={arrowBtnStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
            {BANNERS.map((_, i) => (
              <div key={i} onClick={() => setBannerIndex(i)} style={{
                width: i === bannerIndex ? 20 : 6, height: 6,
                borderRadius: 3,
                background: i === bannerIndex ? '#1a1a1a' : '#ddd',
                cursor: 'pointer', transition: 'all 0.2s',
              }} />
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 8 }}>
            {BANNERS[bannerIndex].label} ({bannerIndex + 1}/{BANNERS.length})
          </div>
        </div>

        {/* 배경 설정 */}
        <div style={{ marginBottom: 32 }}>
          <label style={labelStyle}>배경 설정</label>

          {/* 배경색 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#555', width: 80 }}>배경색</span>
            <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 10, overflow: 'hidden', border: '1.5px solid #e8e8e8', cursor: 'pointer' }}>
              <input
                type="color"
                value={bgColor}
                onChange={e => {setBgColor(e.target.value); removeBgImg();}}
                style={{ position: 'absolute', top: '-5px', left: '-5px', width: '200%', height: '200%', border: 'none', cursor: 'pointer', padding: 0 }}
              />
            </div>
            <span style={{ fontSize: 13, color: '#aaa' }}>{bgColor}</span>
          </div>

          {/* 배경 이미지 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#555', width: 80 }}>배경 이미지</span>
            {bgImgPreview ? (
              <div style={{ position: 'relative', width: 80, height: 50, borderRadius: 8, overflow: 'hidden' }}>
                <Image src={bgImgPreview} alt="bg" fill style={{ objectFit: 'cover' }} />
                <button
                  onClick={removeBgImg}
                  style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >×</button>
              </div>
            ) : (
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f4f4f0', borderRadius: 10, padding: '8px 14px', fontSize: 13, color: '#555', cursor: 'pointer', border: '1.5px dashed #ddd' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                이미지 선택
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBgImg} />
              </label>
            )}
          </div>
        </div>

        {/* 특수효과 */}
        <div style={{ marginBottom: 32 }}>
          <label style={labelStyle}>특수효과</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {EFFECTS.map(e => (
              <button
                key={e.value}
                onClick={() => setEffect(e.value)}
                style={{
                  flex: 1, padding: '10px 0',
                  borderRadius: 12,
                  border: effect === e.value ? '2px solid #1a1a1a' : '2px solid #e8e8e8',
                  background: effect === e.value ? '#1a1a1a' : '#fff',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 20 }}>{e.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: effect === e.value ? '#fff' : '#555' }}>{e.label}</span>
              </button>
            ))}
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