import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateGameContent } from '@/lib/ai';
import { LangSchema } from '@/lib/schemas';

const BodySchema = z.object({
  gameType: z.enum(['word-scramble', 'wordle', 'hangman', 'crossword']),
  targetLanguage: LangSchema,
  uiLanguage: LangSchema.optional(),
  count: z.number().min(1).max(20).default(10),
  seed: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = BodySchema.parse(await req.json());

    const content = await generateGameContent({
      gameType: body.gameType,
      targetLang: body.targetLanguage,
      uiLang: body.uiLanguage,
      count: body.count,
      seed: body.seed,
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Failed to generate game content.' },
        { status: 502 },
      );
    }

    return NextResponse.json(content);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: err.errors },
        { status: 400 },
      );
    }
    console.error('Quick Game API error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
