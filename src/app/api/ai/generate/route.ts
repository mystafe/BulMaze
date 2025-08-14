import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateDailyQuest } from '@/lib/ai';
import { LangSchema } from '@/lib/schemas';

const BodySchema = z.object({
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  uiLanguage: LangSchema,
  targetLanguage: LangSchema,
  count: z.number().min(1).max(20).default(10), // Add count for flexibility
});

export async function POST(req: NextRequest) {
  try {
    console.log('API: Environment variables check:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);

    const body = BodySchema.parse(await req.json());
    console.log('API: Request body:', body);

    // Call the new AI function to generate a list of words
    const quest = await generateDailyQuest({
      level: body.level,
      uiLang: body.uiLanguage,
      targetLang: body.targetLanguage,
      count: body.count,
    });

    if (!quest || quest.length === 0) {
      console.log('API: Quest generation failed - no quest returned');
      return NextResponse.json(
        { error: 'Failed to generate quest. Invalid response from AI.' },
        { status: 502 }, // Bad Gateway, indicates an issue with the upstream AI service
      );
    }

    console.log('API: Quest generated successfully:', quest.length, 'words');

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
