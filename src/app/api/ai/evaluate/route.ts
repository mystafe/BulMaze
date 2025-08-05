import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { answers } = await req.json();
  const completion = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: [{
      role: 'system',
      content: 'You evaluate placement tests and return CEFR level as A1..C2.'
    }, {
      role: 'user',
      content: JSON.stringify(answers)
    }]
  });
  return NextResponse.json({ level: completion.output_text.trim() });
}
