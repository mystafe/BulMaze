import OpenAI from 'openai';
import {
  WordItemSchema,
  PlacementTestSchema,
  PlacementResultSchema,
  type WordItem,
  type PlacementTest,
  type PlacementResult,
} from './schemas';

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateWordItem(args: {
  cefr: string;
  targetLang: string;
  uiLang: string;
}): Promise<WordItem> {
  const { cefr, targetLang, uiLang } = args;
  const system = `You are a language learning content generator.\nOutput concise JSON only.\nRespect CEFR level: ${cefr} and target language: ${targetLang}.`;
  const user = `Generate a single word guessing item.\nConstraints:\n- targetLanguage: ${targetLang}\n- learnerLevel: ${cefr}\n- partOfSpeech: noun or adjective or verb (balance variety)\n- Provide a short, clear hint in ${uiLang}.\n- Provide 1 sentence example in ${targetLang}, simple and level-appropriate.\n- Provide a brief translation of the example into ${uiLang}.\nReturn JSON:\n{\n  "word": "...",\n  "hint": "...",\n  "example": "...",\n  "exampleTranslation": "...",\n  "pos": "noun|verb|adj",\n  "difficulty": 1-10\n}`;
  const completion = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });
  const data = JSON.parse(completion.output_text);
  return WordItemSchema.parse(data);
}

export async function generatePlacementTest(args: {
  uiLang: string;
}): Promise<PlacementTest> {
  const { uiLang } = args;
  const system = 'You are a language placement test generator. Output JSON.';
  const user = `Generate 10 short questions with answers in ${uiLang}. Include multiple-choice and fill-in-the-blank types.`;
  const completion = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });
  const data = JSON.parse(completion.output_text);
  return PlacementTestSchema.parse(data);
}

export async function evaluatePlacementAnswers(args: {
  answers: unknown;
}): Promise<PlacementResult> {
  const { answers } = args;
  const system = 'You evaluate placement tests and return CEFR level as A1..C2.';
  const completion = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      { role: 'system', content: system },
      { role: 'user', content: JSON.stringify(answers) },
    ],
  });
  const data = { cefr: completion.output_text.trim() };
  return PlacementResultSchema.parse(data);
}

export default openai;
