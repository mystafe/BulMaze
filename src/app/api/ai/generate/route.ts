import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateWordItem } from '@/lib/ai';
import { LangSchema } from '@/lib/schemas';

const BodySchema = z.object({
  targetLang: LangSchema,
  cefr: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  uiLanguage: LangSchema,
});

export async function POST(req: NextRequest) {
  try {
    const body = BodySchema.parse(await req.json());
    const item = await generateWordItem({
      targetLang: body.targetLang,
      cefr: body.cefr,
      uiLang: body.uiLanguage,
    });
    if (!item) {
      return NextResponse.json({ error: 'Invalid response' }, { status: 422 });
    }
    return NextResponse.json(item);
  } catch (err) {
    console.error('Generate API error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
