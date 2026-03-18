'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Align } from '@/lib/enums';

interface Props {
  rollingPaperId: number;
  onClose: () => void;
}

const COLORS = [
  '#ffffff',
  '#fef08a',
  '#bfdbfe',
  '#fca5a5',
  '#bbf7d0',
  '#f9a8d4',
  '#fef9c3',
  '#a5f3fc',
  '#d9f99d',
  '#fed7aa',
  '#e9d5ff',
  '#1a1a1a',
];

export default function WriteLetterModal({ rollingPaperId, onClose }: Props) {
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [align, setAlign] = useState<Align>(Align.LEFT);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
    setSelectedColor('');
  };

  const removeImage = () => {
    setImgFile(null);
    setImgPreview(null);
    setSelectedColor('#ffffff');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);

    let imgUrl = null;
    if (imgFile) {
      const formData = new FormData();
      formData.append('file', imgFile);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      imgUrl = data.url;
    }

    await fetch('/api/letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rollingPaperId,
        nickname: nickname || '익명',
        content,
        color: selectedColor,
        imgUrl,
        align,
      }),
    });

    setLoading(false);
    router.refresh();
    onClose();
  };

  const isLight = (hex: string) => {
    if (!hex || hex === '') return true;
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0,2),16);
    const g = parseInt(c.substring(2,4),16);
    const b = parseInt(c.substring(4,6),16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  };

  const textColor = imgPreview ? '#111' : isLight(selectedColor) ? '#111' : '#fff';

  return (
    <>
      <style>{`
        .wl-overlay {
          position: fixed; inset: 0; z-index: 300;
          background: rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        .wl-modal {
          width: 100%; max-width: 480px;
          background: #fff;
          border-radius: 24px;
          padding: 20px 20px 36px;
          animation: slideUp 0.3s cubic-bezier(.4,0,.2,1);
          max-height: 92vh;
          overflow-y: auto;
          margin: 16px;
        }
        @keyframes slideUp {
          from { transform: translateY(100%) }
          to { transform: translateY(0) }
        }

        .wl-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }

        .wl-preview {
          position: relative;
          width: 100%; aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
          display: flex; flex-direction: column;
          padding: 16px;
          transition: background 0.2s;
        }

        .wl-preview textarea {
          flex: 1;
          border: none; outline: none; resize: none;
          background: transparent;
          font-size: 14px; line-height: 1.7;
          font-family: 'Noto Sans KR', sans-serif;
          width: 100%;
        }

        .wl-from {
          display: flex; align-items: center; gap: 6px;
          margin-top: 8px;
        }

        .wl-from input {
          border: none; outline: none; background: transparent;
          font-size: 12px; font-weight: 600;
          font-family: 'Noto Sans KR', sans-serif;
          width: 120px;
        }

        .wl-toolbar {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .wl-color-btn {
          width: 28px; height: 28px; border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer; flex-shrink: 0;
          transition: transform 0.15s, border-color 0.15s;
        }
        .wl-color-btn:hover { transform: scale(1.15); }
        .wl-color-btn.active { border-color: #1a1a1a; transform: scale(1.15); }
        .wl-color-btn.white { box-shadow: inset 0 0 0 1px #ddd; }

        .wl-align-btn {
          width: 32px; height: 32px; border-radius: 8px;
          border: none; background: #f4f4f0; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #555;
          transition: background 0.15s;
        }
        .wl-align-btn.active { background: #1a1a1a; color: #fff; }

        .wl-img-btn {
          width: 32px; height: 32px; border-radius: 8px;
          border: none; background: #f4f4f0; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #555; margin-left: auto;
        }
        .wl-img-btn:hover { background: #e8e8e4; }

        .wl-submit {
          width: 100%; padding: 16px;
          background: #1a1a1a; color: #fff;
          border: none; border-radius: 14px;
          font-size: 15px; font-weight: 700;
          cursor: pointer; font-family: 'Noto Sans KR', sans-serif;
          transition: opacity 0.15s;
          margin-top: 4px;
        }
        .wl-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        .wl-img-remove {
          position: absolute; top: 8px; right: 8px;
          width: 24px; height: 24px; border-radius: 50%;
          background: rgba(0,0,0,0.5); color: #fff;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }

        .wl-divider {
          width: 1px; height: 20px; background: #e8e8e8; margin: 0 4px;
        }
      `}</style>

      <div className="wl-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="wl-modal">

          {/* 상단 */}
          <div className="wl-top">
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>페이퍼 생성</span>
            <div style={{ width: 28 }} />
          </div>

          {/* 편지 미리보기 */}
          <div
            className="wl-preview"
            style={{
              background: imgPreview ? `url(${imgPreview}) center/cover no-repeat` : selectedColor || '#ffffff',
            }}
          >
            {imgPreview && (
              <button className="wl-img-remove" onClick={removeImage}>×</button>
            )}
            <textarea
              placeholder="내용을 입력하세요..."
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{
                color: textColor,
                textAlign: align,
              }}
            />
            <div className="wl-from">
              <span style={{ fontSize: 12, color: textColor, opacity: 0.6 }}>from</span>
              <input
                placeholder="닉네임"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                maxLength={20}
                style={{ color: textColor }}
              />
            </div>
          </div>

          {/* 툴바 */}
          <div className="wl-toolbar">
            {/* 정렬 버튼 */}
            <button className={`wl-align-btn ${align === 'left' ? 'active' : ''}`} onClick={() => setAlign(Align.LEFT)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
              </svg>
            </button>
            <button className={`wl-align-btn ${align === 'center' ? 'active' : ''}`} onClick={() => setAlign(Align.CENTER)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
              </svg>
            </button>
            <button className={`wl-align-btn ${align === 'right' ? 'active' : ''}`} onClick={() => setAlign(Align.RIGHT)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            <div className="wl-divider" />

            {/* 색상 선택 */}
            {COLORS.map(color => (
              <button
                key={color}
                className={`wl-color-btn ${color === '#ffffff' ? 'white' : ''} ${selectedColor === color && !imgPreview ? 'active' : ''}`}
                style={{ background: color }}
                onClick={() => { setSelectedColor(color); }}
              />
            ))}

            {/* 이미지 버튼 */}
            <button className="wl-img-btn" onClick={() => fileInputRef.current?.click()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
          </div>

          {/* 등록 버튼 */}
          <button
            className="wl-submit"
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
          >
            {loading ? '등록 중...' : '등록'}
          </button>

        </div>
      </div>
    </>
  );
}