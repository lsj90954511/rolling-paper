import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rollingPaper, banner } from '@/lib/schema';
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
    const data = await db.select().from(rollingPaper)
      .where(eq(rollingPaper.rollingPaperId, Number(id)));
    if (!data.length) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json(data[0]);
  }

  // id 없으면 전체 목록
  const data = await db.select().from(rollingPaper);
  return NextResponse.json(data);
}