import OpenAI from 'openai';
import {
  Lang,
  WordItemSchema,
  PlacementTestSchema,
  PlacementResultSchema,
  type WordItem,
  type PlacementTest,
  type PlacementResult,
} from './schemas';

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }
  return new OpenAI({ apiKey });
}

export async function generateWordItem(args: {
  cefr: string;
  targetLang: Lang;
  uiLang: Lang;
}): Promise<WordItem | null> {
  const openai = getClient();
  const { cefr, targetLang, uiLang } = args;
  const system =
    'You are a language learning content generator. Return VALID JSON only. Respect CEFR and target language.';
  const baseUser =
    `CEFR level ${cefr}. Generate ONE common word with fields: word, hint (in ${uiLang}), example (in ${targetLang}), exampleTranslation (in ${uiLang}), pos (noun|verb|adj), difficulty (1-10).`;

  const prompts = [
    baseUser,
    `${baseUser} Return ONLY valid JSON with no extra text.`,
  ];

  for (const user of prompts) {
    try {
      const completion = await openai.responses.create({
        model: 'gpt-4.1-mini',
        input: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      });
      const data = JSON.parse(completion.output_text);
      return WordItemSchema.parse(data);
    } catch {
      if (user === prompts[prompts.length - 1]) {
        return null;
      }
    }
  }
  return null;
}

export async function generatePlacementTest(args: {
  uiLang: Lang;
}): Promise<PlacementTest> {
  const openai = getClient();
  const { uiLang } = args;
  const system =
    'You are a language placement test generator. Return VALID JSON.';
  const user =
    `Generate 10 mixed questions (multiple-choice and fill-in) level-graded in ${uiLang}. Include correct answers. Return an array of {question, options?, answer}.`;
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

function fallbackEvaluate(answers: unknown): PlacementResult {
  let total = 0;
  let correct = 0;
  if (Array.isArray(answers)) {
    total = answers.length;
    for (const ans of answers) {
      if (typeof ans === 'boolean') correct += ans ? 1 : 0;
      else if (typeof ans === 'object' && ans && 'correct' in ans) {
        correct += (Boolean((ans as { correct: unknown }).correct)) ? 1 : 0;
      }
    }
  }
  const ratio = total ? correct / total : 0;
  let cefr: PlacementResult['cefr'] = 'A1';
  if (ratio > 0.9) cefr = 'C2';
  else if (ratio > 0.8) cefr = 'C1';
  else if (ratio > 0.7) cefr = 'B2';
  else if (ratio > 0.6) cefr = 'B1';
  else if (ratio > 0.4) cefr = 'A2';
  return { cefr };
}

export async function evaluatePlacementAnswers(args: {
  answers: unknown;
}): Promise<PlacementResult> {
  const openai = getClient();
  const { answers } = args;
  const system =
    'You evaluate placement tests and return JSON { "cefr": "A1|A2|B1|B2|C1|C2" } only.';
  const user = `Answers: ${JSON.stringify(answers)}`;
  try {
    const completion = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });
    const data = JSON.parse(completion.output_text);
    return PlacementResultSchema.parse(data);
  } catch {
    return fallbackEvaluate(answers);
  }
}

export { getClient as createOpenAIClient };
