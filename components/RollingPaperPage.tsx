'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { BANNERS } from '@/lib/banners';
import { Align } from '@/lib/enums';
import { useRouter } from 'next/navigation';
import WriteLetterModal from '@/components/WriteLetterModal';

interface Letter {
  letterId: number;
  nickname: string;
  content: string;
  color: string;
  imgUrl: string | null;
  align: Align | null;
}

interface RollingPaperData {
  rollingPaperId: number;
  title: string;
  banner: {
    imageUrl: string;
    comment: string;
  } | null;
  letters: Letter[];
}

const ROTATIONS = [-3, 1.5, 2.5, -1.5, 2, -2.5, 1, -1, 3, -2];

export default function RollingPaperPage({ data }: { data: RollingPaperData }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);

  const [bannerVisible, setBannerVisible] = useState(true);
  const [bannerPos, setBannerPos] = useState<{ left: number; width: number } | null>(null);
  const [bannerHeight, setBannerHeight] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const updateBannerPos = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setBannerPos({ left: rect.left, width: rect.width });
    };
    updateBannerPos();
    window.addEventListener('resize', updateBannerPos);
    return () => window.removeEventListener('resize', updateBannerPos);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const down = y > lastScrollY.current && y > 10;
      if (down) setBannerVisible(false);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setBannerVisible(true), 1000);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!bannerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (bannerRef.current) setBannerHeight(bannerRef.current.offsetHeight);
    });
    observer.observe(bannerRef.current);
    return () => observer.disconnect();
  }, [bannerPos]);

  const bannerMeta = data.banner ? BANNERS.find(b => b.src === data.banner!.imageUrl) : null;
  const namePosition = bannerMeta?.detailNamePosition ?? { bottom: '5%', left: '50%', transform: 'translateX(-50%)' };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans KR', sans-serif; background: #f4f4f0; }

        .masonry {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: min-content;
          gap: 10px;
          padding: 25px 18px;
          border: 1.5px solid #e8e8e8;
          border-radius: 16px;
          box-shadow: 2px 4px 16px rgba(0,0,0,0.06);
          background: #fff;
          min-height: calc(100vh - 120px);
          align-items: start;
        }

        .letter-card {
          aspect-ratio: 1;
          border-radius: 4px;
          padding: 14px 12px 12px;
          cursor: pointer;
          position: relative;
          box-shadow: 2px 3px 10px rgba(0,0,0,0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          overflow: hidden;
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
          word-break: break-all;
          overflow-wrap: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
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

        .rp-banner {
          position: fixed;
          bottom: 0;
          z-index: 150;
          transition: transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s ease;
        }
        .rp-banner.hidden {
          transform: translateY(100%);
          opacity: 0;
          pointer-events: none;
        }
      `}</style>

      <Header title={data.title} showBack={true} />

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f4f0' }}>
        {modalOpen && <WriteLetterModal rollingPaperId={data.rollingPaperId} onClose={() => setModalOpen(false)} />}
        <main style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div ref={containerRef} style={{ width: '100%', maxWidth: 620, padding: '0 16px', paddingTop: 52 }}>

            {/* 편지 그리드 */}
            <div className="masonry" style={{ paddingBottom: data.banner ? bannerHeight + 20 : 20 }}>
              {data.letters.map((letter, i) => (
                <div
                  key={letter.letterId}
                  className="letter-card"
                  style={{
                    background: letter.imgUrl
                      ? `url(${letter.imgUrl}) center/cover no-repeat`
                      : letter.color || '#ffffff',
                    transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`,
                  }}
                  onClick={() => router.push(`/${data.rollingPaperId}/${letter.letterId}`)}
                >
                  <div className="letter-nickname">From. {letter.nickname}</div>
                  <div className="letter-content" style={{ textAlign: letter.align || Align.LEFT }}>{letter.content}</div>
                </div>
              ))}
            </div>

          </div>
        </main>

        {/* 배너 */}
        {data.banner && bannerPos && (
          <div
            ref={bannerRef}
            className={`rp-banner ${bannerVisible ? '' : 'hidden'}`}
            style={{ left: bannerPos.left, width: bannerPos.width }}
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <Image
                src={data.banner.imageUrl}
                alt="banner"
                width={0} height={0} sizes="100vw"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              {data.banner.comment && (
                <span style={{
                  position: 'absolute',
                  ...namePosition,
                  fontSize: 'clamp(9px, 2.5vw, 13px)', fontWeight: 800, color: '#111',
                  whiteSpace: 'nowrap',
                }}>
                  {data.banner.comment}
                </span>
              )}
            </div>
          </div>
        )}

        {/* FAB */}
        <button className="fab" onClick={() => setModalOpen(true)}>✏️</button>
      </div>
    </>
  );
}