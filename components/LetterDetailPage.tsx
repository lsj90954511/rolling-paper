'use client';
import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import { Align } from '@/lib/enums';

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
  letters: Letter[];
}

interface Props {
  data: RollingPaperData;
  targetLetterId: number;
}

export default function LetterDetailPage({ data, targetLetterId }: Props) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (targetRef.current) {
        targetRef.current.scrollIntoView({ block: 'center' });
      }
    }, 100);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans KR', sans-serif; background: #f4f4f0; }

        .letter-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 16px 0 80px;
        }

        .letter-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .letter-item {
          width: 350px;
          height: 350px;
          border-radius: 12px;
          padding: 20px;
          position: relative;
          box-shadow: 2px 3px 12px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s ease;
        }

        .letter-item.active {
          box-shadow: 0 6px 24px rgba(0,0,0,0.15);
          outline: 2px solid rgba(0,0,0,0.08);
        }

        .letter-content {
          font-size: 14px;
          line-height: 1.8;
          color: rgba(0,0,0,0.75);
          word-break: keep-all;
          overflow-wrap: break-word;
          flex: 1;
          overflow-y: auto;
          white-space: pre-wrap;
        }

        .letter-footer {
          width: 350px;
          display: flex;
          justify-content: flex-end;
          padding: 8px 4px 0;
        }

        .letter-from {
          font-size: 12px;
          font-weight: 700;
          color: rgba(0,0,0,0.5);
        }
      `}</style>

      <Header title={data.title} showBack={true} />

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f4f0' }}>
        <main style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 620, padding: '0 16px', paddingTop: 52 }}>
            <div className="letter-list">
              {data.letters.map((letter) => {
                const isTarget = letter.letterId === targetLetterId;
                return (
                  <div
                    key={letter.letterId}
                    ref={isTarget ? targetRef : null}
                    className="letter-wrapper"
                  >
                    <div
                      className={`letter-item ${isTarget ? 'active' : ''}`}
                      style={{
                        background: letter.imgUrl
                          ? `url(${letter.imgUrl}) center/cover no-repeat`
                          : letter.color || '#ffffff',
                      }}
                    >
                      <div
                        className="letter-content"
                        style={{ textAlign: letter.align || Align.LEFT }}
                      >
                        {letter.content}
                      </div>
                    </div>
                    <div className="letter-footer">
                      <span className="letter-from">From. {letter.nickname}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}