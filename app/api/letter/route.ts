import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { letter } from '@/lib/schema';

export async function POST(req: NextRequest) {
  const { rollingPaperId, nickname, content, color, imgUrl, align } = await req.json();

  await db.insert(letter).values({
    rollingPaperId,
    nickname,
    content,
    color,
    imgUrl,
    align,
  });

  return NextResponse.json({ ok: true });
}