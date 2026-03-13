'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';

interface Letter {
  letterId: number;
  nickname: string;
  content: string;
  color: string;
  imgUrl: string | null;
}

interface RollingPaperData {
  title: string;
  banner: {
    imageUrl: string;
    comment: string;
  } | null;
  letters: Letter[];
}

const CARD_COLORS = ['#fef08a','#bfdbfe','#fca5a5','#bbf7d0','#f9a8d4','#fef9c3','#a5f3fc','#d9f99d','#fed7aa','#e9d5ff'];
const ROTATIONS = [-3, 1.5, 2.5, -1.5, 2, -2.5, 1, -1, 3, -2];

const DUMMY: RollingPaperData = {
  title: '꿀유자 생일롤페 💕',
  banner: null,
  letters: [
    { letterId: 1, nickname: '팬A', content: '유자님 생일 축하해요!! 항상 행복하세요 🎉', color: '#fff', imgUrl: null },
    { letterId: 2, nickname: '팬B', content: '오늘도 빛나는 하루 되세요. 유자님 덕분에 매일이 즐거워요!', color: '#bfdbfe', imgUrl: null },
    { letterId: 3, nickname: '팬C', content: '생일 축하드려요 💕 앞으로도 좋은 일만 가득하길!', color: '#fca5a5', imgUrl: null },
    { letterId: 4, nickname: '팬D', content: '꿀하님! 생일 축하해요~~ 유자님을 알게된지 거의 1년이 다 되어가네요.', color: '#bbf7d0', imgUrl: null },
    { letterId: 5, nickname: '팬E', content: '항상 응원합니다 🌸', color: '#f9a8d4', imgUrl: null },
    { letterId: 6, nickname: '팬F', content: '유자님의 생일을 축하합니다! 항상 힘들어도 웃어주는 유자님이 좋아요.', color: '#fef9c3', imgUrl: null },
    { letterId: 7, nickname: '팬G', content: '생일 너무너무 축하해요! 항상 재밌고 사랑스러운 방송 해줘서 너무 고마워요!', color: '#a5f3fc', imgUrl: null },
    { letterId: 8, nickname: '팬H', content: '안녕유자야 넋처음봤을때부터 숨겨왔던 나의마음을 이렇게 롤링페이퍼로 표현할수밖에없는 못난 꿀빵이를 용서하지마 🐾', color: '#d9f99d', imgUrl: null },
    { letterId: 9, nickname: '팬I', content: '항상 건강하고 행복하세요 💛', color: '#fed7aa', imgUrl: null },
  ],
};

export default function RollingPaperPage({ data = DUMMY }: { data?: RollingPaperData }) {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(true);
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handleScroll = () => {
      const y = el.scrollTop;
      const down = y > lastScrollY.current && y > 10;
      setHeaderVisible(!down);
      setBannerVisible(!down);
      lastScrollY.current = y;
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans KR', sans-serif; background: #f4f4f0; }

        .rp-header {
          position: sticky; top: 0;
          z-index: 100;
          background: rgba(244,244,240,0.92);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          transition: transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s ease;
        }
        .rp-header.hidden {
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
        }

        .rp-banner {
          position: sticky;
          top: 53px;
          z-index: 90;
          transition: transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s ease;
          margin: 0 -16px;
        }
        .rp-banner.hidden {
          transform: translateY(-160px);
          opacity: 0;
          pointer-events: none;
        }

        .masonry {
          columns: 3;
          column-gap: 10px;
          padding: 16px 0 80px;
        }

        .letter-card {
          break-inside: avoid;
          margin-bottom: 10px;
          border-radius: 4px;
          padding: 14px 12px 12px;
          cursor: pointer;
          position: relative;
          box-shadow: 2px 3px 10px rgba(0,0,0,0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .letter-card:hover {
          transform: translateY(-4px) rotate(0deg) !important;
          box-shadow: 4px 10px 24px rgba(0,0,0,0.15) !important;
          z-index: 10;
        }
        .letter-card::before {
          content: '';
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 24px; height: 5px;
          background: rgba(0,0,0,0.05);
          border-radius: 0 0 4px 4px;
        }

        .letter-nickname {
          font-size: 11px;
          font-weight: 700;
          color: rgba(0,0,0,0.4);
          margin-bottom: 6px;
        }
        .letter-content {
          font-size: 12px;
          line-height: 1.6;
          color: rgba(0,0,0,0.72);
          word-break: keep-all;
        }

        .fab {
          position: fixed; bottom: 28px; right: 28px;
          background: #1a1a1a; color: white;
          border: none; border-radius: 16px;
          width: 52px; height: 52px;
          font-size: 24px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          z-index: 200;
          transition: transform 0.15s;
        }
        .fab:hover { transform: scale(1.05); }

        .icon-btn {
          background: none; border: none; cursor: pointer;
          color: #555; padding: 6px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f4f0' }}>
        <main
          ref={mainRef}
          style={{ flex: 1, display: 'flex', justifyContent: 'center', overflowY: 'auto', height: '100vh' }}
        >
          <div style={{ width: '100%', maxWidth: 620, padding: '0 16px' }}>

            {/* 헤더 */}
            <Header title={data.title} showSearch={false}/>

            {/* 배너 */}
            {data.banner && (
              <div className={`rp-banner ${bannerVisible ? '' : 'hidden'}`}>
                <div style={{ position: 'relative', width: '100%', height: 160 }}>
                  <Image src={data.banner.imageUrl} alt="banner" fill style={{ objectFit: 'cover' }} />
                  {data.banner.comment && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                      paddingBottom: 16,
                    }}>
                      <span style={{
                        fontSize: 18, fontWeight: 800, color: '#fff',
                        textShadow: '0 1px 6px rgba(0,0,0,0.5)',
                        background: 'rgba(0,0,0,0.15)',
                        padding: '4px 16px', borderRadius: 20,
                        backdropFilter: 'blur(2px)',
                        whiteSpace: 'nowrap',
                      }}>
                        {data.banner.comment}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 편지 그리드 */}
            <div className="masonry">
              {data.letters.map((letter, i) => (
                <div
                  key={letter.letterId}
                  className="letter-card"
                  style={{
                    width: 180,
                    height: 180,
                    background: letter.imgUrl
                      ? `url(${letter.imgUrl}) center/cover no-repeat`
                      : letter.color || '#ffffff',
                    transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`,
                  }}
                >
                  <div className="letter-nickname">From. {letter.nickname}</div>
                  <div className="letter-content">{letter.content}</div>
                </div>
              ))}
            </div>

          </div>
        </main>

        {/* FAB */}
        <button className="fab">✏️</button>
      </div>
    </>
  );
}