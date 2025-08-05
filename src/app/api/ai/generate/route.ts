import { NextRequest, NextResponse } from 'next/server';
import { generateWordItem } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { targetLang, cefr, uiLang } = await req.json();
  const item = await generateWordItem({ targetLang, cefr, uiLang });
  return NextResponse.json(item);
}
