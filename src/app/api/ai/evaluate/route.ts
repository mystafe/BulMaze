import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { evaluatePlacementAnswers } from '@/lib/ai';

const BodySchema = z.object({ answers: z.any() });

export async function POST(req: NextRequest) {
  try {
      const { answers } = BodySchema.parse(await req.json());
      const result = await evaluatePlacementAnswers({ answers });
      if (!result) {
        return NextResponse.json({ error: 'Invalid response' }, { status: 422 });
      }
      return NextResponse.json(result);
  } catch (err) {
    console.error('Evaluate API error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
