import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateDailyQuest } from '@/lib/ai';
import { LangSchema } from '@/lib/schemas';

const BodySchema = z.object({
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  uiLanguage: LangSchema,
  count: z.number().min(1).max(20).default(10), // Add count for flexibility
});

export async function POST(req: NextRequest) {
  try {
    const body = BodySchema.parse(await req.json());

    // Call the new AI function to generate a list of words
    const quest = await generateDailyQuest({
      level: body.level,
      uiLang: body.uiLanguage,
      count: body.count,
    });

    if (!quest || quest.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate quest. Invalid response from AI.' },
        { status: 502 }, // Bad Gateway, indicates an issue with the upstream AI service
      );
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('--- AI Generated Daily Quest ---');
      console.log(JSON.stringify(quest, null, 2));
      console.log('------------------------------');
    }

    return NextResponse.json(quest);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: err.errors },
        { status: 400 },
      );
    }
    console.error('Generate API error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
