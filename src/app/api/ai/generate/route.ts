import { NextRequest, NextResponse } from 'next/server';
import { openai, buildGeneratePrompt } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { targetLang, cefr, uiLang } = await req.json();
  const { system, user } = buildGeneratePrompt(cefr, targetLang, uiLang);
  const completion = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: [{ role: 'system', content: system }, { role: 'user', content: user }],
  });
  const text = completion.output_text;
  return NextResponse.json(JSON.parse(text));
}
