import { NextRequest, NextResponse } from 'next/server';
import { generatePlacementTest } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { uiLang } = await req.json();
  const test = await generatePlacementTest({ uiLang });
  return NextResponse.json(test);
}
