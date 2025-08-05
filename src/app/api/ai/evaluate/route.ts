import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { evaluatePlacementAnswers } from '@/lib/ai';

const BodySchema = z.object({ answers: z.any() });

export async function POST(req: NextRequest) {
  const { answers } = BodySchema.parse(await req.json());
  const result = await evaluatePlacementAnswers({ answers });
  return NextResponse.json(result);
}
