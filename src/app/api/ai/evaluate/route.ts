import { NextRequest, NextResponse } from 'next/server';
import { evaluatePlacementAnswers } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { answers } = await req.json();
  const result = await evaluatePlacementAnswers({ answers });
  return NextResponse.json(result);
}
