import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rollingPaper, banner, letter } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const { title, password, comment, bannerId, bannerSrc } = await req.json();

  const [newPaper] = await db.insert(rollingPaper).values({
    title,
    password,
  }).$returningId();

  if (bannerId !== 0) {
    await db.insert(banner).values({
      rollingPaperId: newPaper.rollingPaperId,
      comment: comment,
      imageUrl: bannerSrc,
    });
  }

  return NextResponse.json({ id: newPaper.rollingPaperId });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  if (id) {
    const paperData = await db.select().from(rollingPaper)
      .where(eq(rollingPaper.rollingPaperId, Number(id)));
    if (!paperData.length) return NextResponse.json({ error: 'not found' }, { status: 404 });

    const bannerData = await db.select().from(banner)
      .where(eq(banner.rollingPaperId, Number(id)));

    const letterData = await db.select().from(letter)
      .where(eq(letter.rollingPaperId, Number(id)));

    return NextResponse.json({
      ...paperData[0],
      banner: bannerData[0] ?? null,
      letters: letterData,
    });
  }

  // id 없으면 전체 목록
  const data = await db.select().from(rollingPaper);
  return NextResponse.json(data);
}