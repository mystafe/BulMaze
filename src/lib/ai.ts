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
import { z } from 'zod';

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }
  return new OpenAI({ apiKey });
}

export async function generateDailyQuest(args: {
  level: 'beginner' | 'intermediate' | 'advanced';
  uiLang: Lang;
  count: number;
}): Promise<WordItem[] | null> {
  const openai = getClient();
  const { level, uiLang, count } = args;

  const system =
    'You are a language learning content generator for English learners. Return VALID JSON only. The user will provide a difficulty level, and you should generate a list of words appropriate for that level.';

  const user = `
    Difficulty level: ${level}.
    Generate ${count} common English words.
    For each word, provide the following fields in a JSON object:
    - "word": The English word.
    - "definition": A simple definition of the word in ${uiLang}.
    - "example": An example sentence using the word in English.
    - "pos": The part of speech (e.g., "noun", "verb", "adjective").
    - "options": An array of 3 plausible but incorrect multiple-choice options for the word's definition. These should be in ${uiLang}.

    Return the result as a JSON array of these objects. Ensure the JSON is valid and contains no extra text or explanations.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // Using a powerful model for better JSON generation
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      console.error('OpenAI response content is null');
      return null;
    }

    // The model might wrap the array in a parent object, e.g., { "words": [...] }
    // We need to handle this to extract the array.
    const data = JSON.parse(content);
    const questArray = Array.isArray(data) ? data : data.words || data.quest;

    if (!questArray) {
      console.error('Could not find a word array in the AI response:', content);
      return null;
    }

    const DailyQuestSchema = z.array(WordItemSchema);
    return DailyQuestSchema.parse(questArray);
  } catch (error) {
    console.error('Error generating daily quest from OpenAI:', error);
    return null;
  }
}

export async function generatePlacement(args: {
  uiLang: Lang;
}): Promise<Placement | null> {
  const openai = getClient();
  const { uiLang } = args;
  const system =
    'You are a language placement test generator. Return VALID JSON.';
  const baseUser = `Generate 10 mixed questions (multiple-choice and fill-in) level-graded in ${uiLang}. Include correct answers. Structure: {id,type:'mcq'|'fill',prompt,options?,correct?} in an object {items:[...]}.`;

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
