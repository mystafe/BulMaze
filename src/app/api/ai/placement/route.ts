import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generatePlacementTest } from '@/lib/ai';
import { LangSchema } from '@/lib/schemas';

const BodySchema = z.object({ uiLang: LangSchema });

export async function POST(req: NextRequest) {
  const { uiLang } = BodySchema.parse(await req.json());
  try {
    const test = await generatePlacementTest({ uiLang });
    return NextResponse.json(test);
  } catch {
    return NextResponse.json({ error: 'Invalid response' }, { status: 422 });
  }
}
