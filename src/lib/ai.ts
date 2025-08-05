import OpenAI from 'openai';

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export function buildGeneratePrompt(level: string, targetLang: string, uiLang: string) {
  const system = `You are a language learning content generator.\nOutput concise JSON only.\nRespect CEFR level: ${level} and target language: ${targetLang}.`;
  const user = `Generate a single word guessing item.\nConstraints:\n- targetLanguage: ${targetLang}\n- learnerLevel: ${level}\n- partOfSpeech: noun or adjective or verb (balance variety)\n- The word must be common, level-appropriate, and not offensive.\n- Provide a short, clear hint in ${uiLang}.\n- Provide 1 sentence example in ${targetLang}, simple and level-appropriate.\n- Provide a brief translation of the example into ${uiLang}.\nReturn JSON:\n{\n  "word": "...",\n  "hint": "...",\n  "example": "...",\n  "exampleTranslation": "...",\n  "pos": "noun|verb|adj",\n  "difficulty": 1-10\n}`;
  return { system, user };
}
