import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generatePlacement } from '@/lib/ai';
import { LangSchema } from '@/lib/schemas';

const BodySchema = z.object({ uiLang: LangSchema });

export async function POST(req: NextRequest) {
  try {
      const { uiLang } = BodySchema.parse(await req.json());
      const test = await generatePlacement({ uiLang });
      if (!test) {
        return NextResponse.json({ error: 'Invalid response' }, { status: 422 });
      }
      return NextResponse.json(test);
  } catch (err) {
    console.error('Placement API error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
