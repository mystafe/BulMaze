import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { uiLang } = await req.json();
  const completion = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: [{
      role: 'system',
      content: 'You are a language placement test generator. Output JSON.'
    }, {
      role: 'user',
      content: `Generate 10 short questions with answers in ${uiLang}.`
    }]
  });
  return NextResponse.json(JSON.parse(completion.output_text));
}
