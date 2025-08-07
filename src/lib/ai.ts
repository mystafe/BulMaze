import 'server-only';
import OpenAI from 'openai';
import {
  Lang,
  WordItemSchema,
  PlacementSchema,
  EvaluateResultSchema,
  type WordItem,
  type Placement,
  type EvaluateResult,
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
      { user: baseUser, temperature: 0.2 },
      {
        user: `${baseUser} Return ONLY valid JSON with no extra text.`,
        temperature: 0,
      },
    ];

    for (const { user, temperature } of prompts) {
      try {
        const completion = await openai.responses.create({
          model: 'gpt-4.1-mini',
          temperature,
          input: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        });
        const data = JSON.parse(completion.output_text);
        return WordItemSchema.parse(data);
      } catch {
        if (user === prompts[prompts.length - 1].user) {
          return null;
        }
      }
    }
    return null;
  }

export async function generatePlacement(args: {
  uiLang: Lang;
}): Promise<Placement | null> {
  const openai = getClient();
  const { uiLang } = args;
  const system =
    'You are a language placement test generator. Return VALID JSON.';
  const baseUser =
    `Generate 10 mixed questions (multiple-choice and fill-in) level-graded in ${uiLang}. Include correct answers. Structure: {id,type:'mcq'|'fill',prompt,options?,correct?} in an object {items:[...]}.`;

  const prompts = [
    { user: baseUser, temperature: 0.2 },
    {
      user: `${baseUser} Return ONLY valid JSON with no extra text.`,
      temperature: 0,
    },
  ];

  for (const { user, temperature } of prompts) {
    try {
      const completion = await openai.responses.create({
        model: 'gpt-4.1-mini',
        temperature,
        input: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      });
      const data = JSON.parse(completion.output_text);
      return PlacementSchema.parse(data);
    } catch {
      if (user === prompts[prompts.length - 1].user) {
        return null;
      }
    }
  }
  return null;
}

export async function evaluatePlacementAnswers(args: {
  answers: unknown;
}): Promise<EvaluateResult | null> {
  const openai = getClient();
  const { answers } = args;
  const system =
    'You evaluate placement tests and return JSON { "cefr": "A1|A2|B1|B2|C1|C2" } only.';
  const baseUser = `Answers: ${JSON.stringify(answers)}`;

  const prompts = [
    { user: baseUser, temperature: 0.2 },
    {
      user: `${baseUser} Return ONLY valid JSON with no extra text.`,
      temperature: 0,
    },
  ];

  for (const { user, temperature } of prompts) {
    try {
      const completion = await openai.responses.create({
        model: 'gpt-4.1-mini',
        temperature,
        input: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      });
      const data = JSON.parse(completion.output_text);
      return EvaluateResultSchema.parse(data);
    } catch {
      if (user === prompts[prompts.length - 1].user) {
        return null;
      }
    }
  }
  return null;
}

export { getClient as createOpenAIClient };
