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

function generateFallbackQuest(
  level: 'beginner' | 'intermediate' | 'advanced',
  uiLang: Lang,
  targetLang: Lang,
  count: number,
): WordItem[] {
  // Define fallback words for different target languages
  const fallbackWords: Record<string, Record<string, WordItem[]>> = {
    en: {
      beginner: [
        {
          word: 'hello',
          definition:
            uiLang === 'tr'
              ? 'merhaba'
              : uiLang === 'de'
                ? 'hallo'
                : uiLang === 'es'
                  ? 'hola'
                  : uiLang === 'it'
                    ? 'ciao'
                    : uiLang === 'pt'
                      ? 'olá'
                      : 'hello',
          example: 'Hello, how are you?',
          pos: 'noun',
          options:
            uiLang === 'tr'
              ? ['güle güle', 'teşekkürler', 'lütfen']
              : ['goodbye', 'thanks', 'please'],
        },
        {
          word: 'beautiful',
          definition:
            uiLang === 'tr'
              ? 'güzel'
              : uiLang === 'de'
                ? 'schön'
                : uiLang === 'es'
                  ? 'hermoso'
                  : uiLang === 'it'
                    ? 'bello'
                    : uiLang === 'pt'
                      ? 'bonito'
                      : 'beautiful',
          example: 'She is a beautiful woman.',
          pos: 'adj',
          options:
            uiLang === 'tr'
              ? ['çirkin', 'büyük', 'küçük']
              : ['ugly', 'big', 'small'],
        },
        {
          word: 'run',
          definition:
            uiLang === 'tr'
              ? 'koşmak'
              : uiLang === 'de'
                ? 'laufen'
                : uiLang === 'es'
                  ? 'correr'
                  : uiLang === 'it'
                    ? 'correre'
                    : uiLang === 'pt'
                      ? 'correr'
                      : 'to run',
          example: 'I like to run in the morning.',
          pos: 'verb',
          options:
            uiLang === 'tr'
              ? ['yürümek', 'oturmak', 'durmak']
              : ['walk', 'sleep', 'eat'],
        },
        {
          word: 'book',
          definition:
            uiLang === 'tr'
              ? 'kitap'
              : uiLang === 'de'
                ? 'buch'
                : uiLang === 'es'
                  ? 'libro'
                  : uiLang === 'it'
                    ? 'libro'
                    : uiLang === 'pt'
                      ? 'livro'
                      : 'book',
          example: 'I am reading a book.',
          pos: 'noun',
          options:
            uiLang === 'tr'
              ? ['kalem', 'masa', 'sandalye']
              : ['pen', 'table', 'chair'],
        },
        {
          word: 'happy',
          definition:
            uiLang === 'tr'
              ? 'mutlu'
              : uiLang === 'de'
                ? 'glücklich'
                : uiLang === 'es'
                  ? 'feliz'
                  : uiLang === 'it'
                    ? 'felice'
                    : uiLang === 'pt'
                      ? 'feliz'
                      : 'happy',
          example: 'She feels happy today.',
          pos: 'adj',
          options:
            uiLang === 'tr'
              ? ['üzgün', 'kızgın', 'yorgun']
              : ['sad', 'angry', 'tired'],
        },
      ],
      intermediate: [
        {
          word: 'accomplish',
          definition:
            uiLang === 'tr'
              ? 'başarmak'
              : uiLang === 'de'
                ? 'erreichen'
                : uiLang === 'es'
                  ? 'lograr'
                  : uiLang === 'it'
                    ? 'realizzare'
                    : uiLang === 'pt'
                      ? 'realizar'
                      : 'to accomplish',
          example: 'She accomplished her goals.',
          pos: 'verb',
          options:
            uiLang === 'tr'
              ? ['başarısız olmak', 'denemek', 'başlamak']
              : ['fail', 'try', 'start'],
        },
        {
          word: 'brilliant',
          definition:
            uiLang === 'tr'
              ? 'parlak'
              : uiLang === 'de'
                ? 'brillant'
                : uiLang === 'es'
                  ? 'brillante'
                  : uiLang === 'it'
                    ? 'brillante'
                    : uiLang === 'pt'
                      ? 'brilhante'
                      : 'brilliant',
          example: 'He has a brilliant mind.',
          pos: 'adj',
          options:
            uiLang === 'tr'
              ? ['donuk', 'basit', 'temel']
              : ['dull', 'simple', 'basic'],
        },
      ],
      advanced: [
        {
          word: 'sophisticated',
          definition:
            uiLang === 'tr'
              ? 'sofistike'
              : uiLang === 'de'
                ? 'anspruchsvoll'
                : uiLang === 'es'
                  ? 'sofisticado'
                  : uiLang === 'it'
                    ? 'sofisticato'
                    : uiLang === 'pt'
                      ? 'sofisticado'
                      : 'sophisticated',
          example: 'She has sophisticated taste.',
          pos: 'adj',
          options:
            uiLang === 'tr'
              ? ['basit', 'temel', 'kaba']
              : ['simple', 'basic', 'crude'],
        },
      ],
    },
    de: {
      beginner: [
        {
          word: 'hallo',
          definition:
            uiLang === 'tr'
              ? 'merhaba'
              : uiLang === 'en'
                ? 'hello'
                : uiLang === 'es'
                  ? 'hola'
                  : uiLang === 'it'
                    ? 'ciao'
                    : uiLang === 'pt'
                      ? 'olá'
                      : 'hallo',
          example: 'Hallo, wie geht es dir?',
          pos: 'noun',
          options:
            uiLang === 'tr'
              ? ['güle güle', 'teşekkürler', 'lütfen']
              : ['auf wiedersehen', 'danke', 'bitte'],
        },
        {
          word: 'schön',
          definition:
            uiLang === 'tr'
              ? 'güzel'
              : uiLang === 'en'
                ? 'beautiful'
                : uiLang === 'es'
                  ? 'hermoso'
                  : uiLang === 'it'
                    ? 'bello'
                    : uiLang === 'pt'
                      ? 'bonito'
                      : 'schön',
          example: 'Sie ist eine schöne Frau.',
          pos: 'adj',
          options:
            uiLang === 'tr'
              ? ['çirkin', 'büyük', 'küçük']
              : ['hässlich', 'groß', 'klein'],
        },
      ],
      intermediate: [
        {
          word: 'erreichen',
          definition:
            uiLang === 'tr'
              ? 'başarmak'
              : uiLang === 'en'
                ? 'to accomplish'
                : uiLang === 'es'
                  ? 'lograr'
                  : uiLang === 'it'
                    ? 'realizzare'
                    : uiLang === 'pt'
                      ? 'realizar'
                      : 'erreichen',
          example: 'Sie hat ihre Ziele erreicht.',
          pos: 'verb',
          options:
            uiLang === 'tr'
              ? ['başarısız olmak', 'denemek', 'başlamak']
              : ['versagen', 'versuchen', 'beginnen'],
        },
      ],
      advanced: [
        {
          word: 'anspruchsvoll',
          definition:
            uiLang === 'tr'
              ? 'sofistike'
              : uiLang === 'en'
                ? 'sophisticated'
                : uiLang === 'es'
                  ? 'sofisticado'
                  : uiLang === 'it'
                    ? 'sofisticato'
                    : uiLang === 'pt'
                      ? 'sofisticado'
                      : 'anspruchsvoll',
          example: 'Sie hat anspruchsvolle Geschmäcker.',
          pos: 'adj',
          options:
            uiLang === 'tr'
              ? ['basit', 'temel', 'kaba']
              : ['einfach', 'grundlegend', 'grob'],
        },
      ],
    },
    es: {
      beginner: [
        {
          word: 'hola',
          definition:
            uiLang === 'tr'
              ? 'merhaba'
              : uiLang === 'en'
                ? 'hello'
                : uiLang === 'de'
                  ? 'hallo'
                  : uiLang === 'it'
                    ? 'ciao'
                    : uiLang === 'pt'
                      ? 'olá'
                      : 'hola',
          example: '¡Hola! ¿Cómo estás?',
          pos: 'noun',
          options:
            uiLang === 'tr'
              ? ['güle güle', 'teşekkürler', 'lütfen']
              : ['adiós', 'gracias', 'por favor'],
        },
        {
          word: 'hermoso',
          definition:
            uiLang === 'tr'
              ? 'güzel'
              : uiLang === 'en'
                ? 'beautiful'
                : uiLang === 'de'
                  ? 'schön'
                  : uiLang === 'it'
                    ? 'bello'
                    : uiLang === 'pt'
                      ? 'bonito'
                      : 'hermoso',
          example: 'Ella es una mujer hermosa.',
          pos: 'adj',
          options:
            uiLang === 'tr'
              ? ['çirkin', 'büyük', 'küçük']
              : ['feo', 'grande', 'pequeño'],
        },
      ],
      intermediate: [
        {
          word: 'lograr',
          definition:
            uiLang === 'tr'
              ? 'başarmak'
              : uiLang === 'en'
                ? 'to accomplish'
                : uiLang === 'de'
                  ? 'erreichen'
                  : uiLang === 'it'
                    ? 'realizzare'
                    : uiLang === 'pt'
                      ? 'realizar'
                      : 'lograr',
          example: 'Ella logró sus objetivos.',
          pos: 'verb',
          options:
            uiLang === 'tr'
              ? ['başarısız olmak', 'denemek', 'başlamak']
              : ['fallar', 'intentar', 'comenzar'],
        },
      ],
      advanced: [
        {
          word: 'sofisticado',
          definition:
            uiLang === 'tr'
              ? 'sofistike'
              : uiLang === 'en'
                ? 'sophisticated'
                : uiLang === 'de'
                  ? 'anspruchsvoll'
                  : uiLang === 'es'
                    ? 'sofisticado'
                    : uiLang === 'it'
                      ? 'sofisticato'
                      : 'sofisticado',
          example: 'Ella tiene gustos sofisticados.',
          pos: 'adj',
          options:
            uiLang === 'tr'
              ? ['basit', 'temel', 'kaba']
              : ['simple', 'básico', 'crudo'],
        },
      ],
    },
    it: {
      beginner: [
        {
          word: 'ciao',
          definition:
            uiLang === 'tr'
              ? 'merhaba'
              : uiLang === 'en'
                ? 'hello'
                : uiLang === 'de'
                  ? 'hallo'
                  : uiLang === 'es'
                    ? 'hola'
                    : uiLang === 'pt'
                      ? 'olá'
                      : 'ciao',
          example: 'Ciao! Come stai?',
          pos: 'noun',
          options:
            uiLang === 'tr'
              ? ['güle güle', 'teşekkürler', 'lütfen']
              : ['arrivederci', 'grazie', 'per favore'],
        },
        {
          word: 'bello',
          definition:
            uiLang === 'tr'
              ? 'güzel'
              : uiLang === 'en'
                ? 'beautiful'
                : uiLang === 'de'
                  ? 'schön'
                  : uiLang === 'es'
                    ? 'hermoso'
                    : uiLang === 'pt'
                      ? 'bonito'
                      : 'bello',
          example: 'Lei è una donna bella.',
          pos: 'adj',
          options:
            uiLang === 'tr'
              ? ['çirkin', 'büyük', 'küçük']
              : ['brutto', 'grande', 'piccolo'],
        },
      ],
      intermediate: [
        {
          word: 'realizzare',
          definition:
            uiLang === 'tr'
              ? 'başarmak'
              : uiLang === 'en'
                ? 'to accomplish'
                : uiLang === 'de'
                  ? 'erreichen'
                  : uiLang === 'es'
                    ? 'lograr'
                    : uiLang === 'pt'
                      ? 'realizar'
                      : 'realizzare',
          example: 'Lei ha realizzato i suoi obiettivi.',
          pos: 'verb',
          options:
            uiLang === 'tr'
              ? ['başarısız olmak', 'denemek', 'başlamak']
              : ['fallire', 'provare', 'iniziare'],
        },
      ],
      advanced: [
        {
          word: 'sofisticato',
          definition:
            uiLang === 'tr'
              ? 'sofistike'
              : uiLang === 'en'
                ? 'sophisticated'
                : uiLang === 'de'
                  ? 'anspruchsvoll'
                  : uiLang === 'es'
                    ? 'sofisticado'
                    : uiLang === 'it'
                      ? 'sofisticato'
                      : 'sofisticato',
          example: 'Lei ha gusti sofisticati.',
          pos: 'adj',
          options:
            uiLang === 'tr'
              ? ['basit', 'temel', 'kaba']
              : ['semplice', 'basico', 'grezzo'],
        },
      ],
    },
    pt: {
      beginner: [
        {
          word: 'olá',
          definition:
            uiLang === 'tr'
              ? 'merhaba'
              : uiLang === 'en'
                ? 'hello'
                : uiLang === 'de'
                  ? 'hallo'
                  : uiLang === 'es'
                    ? 'hola'
                    : uiLang === 'it'
                      ? 'ciao'
                      : 'olá',
          example: 'Olá! Como você está?',
          pos: 'noun',
          options:
            uiLang === 'tr'
              ? ['güle güle', 'teşekkürler', 'lütfen']
              : ['adeus', 'obrigado', 'por favor'],
        },
        {
          word: 'bonito',
          definition:
            uiLang === 'tr'
              ? 'güzel'
              : uiLang === 'en'
                ? 'beautiful'
                : uiLang === 'de'
                  ? 'schön'
                  : uiLang === 'es'
                    ? 'hermoso'
                    : uiLang === 'it'
                      ? 'bello'
                      : 'bonito',
          example: 'Ela é uma mulher bonita.',
          pos: 'adj',
          options:
            uiLang === 'tr'
              ? ['çirkin', 'büyük', 'küçük']
              : ['feio', 'grande', 'pequeno'],
        },
      ],
      intermediate: [
        {
          word: 'realizar',
          definition:
            uiLang === 'tr'
              ? 'başarmak'
              : uiLang === 'en'
                ? 'to accomplish'
                : uiLang === 'de'
                  ? 'erreichen'
                  : uiLang === 'es'
                    ? 'lograr'
                    : uiLang === 'it'
                      ? 'realizzare'
                      : 'realizar',
          example: 'Ela realizou seus objetivos.',
          pos: 'verb',
          options:
            uiLang === 'tr'
              ? ['başarısız olmak', 'denemek', 'başlamak']
              : ['falhar', 'tentar', 'começar'],
        },
      ],
      advanced: [
        {
          word: 'sofisticado',
          definition:
            uiLang === 'tr'
              ? 'sofistike'
              : uiLang === 'en'
                ? 'sophisticated'
                : uiLang === 'de'
                  ? 'anspruchsvoll'
                  : uiLang === 'es'
                    ? 'sofisticado'
                    : uiLang === 'it'
                      ? 'sofisticato'
                      : 'sofisticado',
          example: 'Ela tem gostos sofisticados.',
          pos: 'adj',
          options:
            uiLang === 'tr'
              ? ['basit', 'temel', 'kaba']
              : ['simples', 'básico', 'cru'],
        },
      ],
    },
  };

  const demoWords = fallbackWords[targetLang] || fallbackWords.en;
  const words = demoWords[level] || demoWords.beginner;
  return words.slice(0, count);
}

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('OpenAI API Key exists:', !!apiKey);
  console.log('OpenAI API Key length:', apiKey?.length || 0);
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }
  return new OpenAI({ apiKey });
}

export async function generateDailyQuest(args: {
  level: 'beginner' | 'intermediate' | 'advanced';
  uiLang: Lang;
  targetLang: Lang;
  count: number;
}): Promise<WordItem[] | null> {
  const { level, uiLang, targetLang, count } = args;

  // Check if OpenAI API key is valid
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes('invalid') || apiKey.length < 50) {
    console.log('Using fallback demo data due to invalid API key');
    return generateFallbackQuest(level, uiLang, targetLang, count);
  }

  const openai = getClient();

  const system = `You are a language learning content generator for ${targetLang} learners. Return VALID JSON only. The user will provide a difficulty level, and you should generate a list of words appropriate for that level.`;

  const user = `
    Difficulty level: ${level}.
    Generate EXACTLY ${count} different ${targetLang} words.
    
    IMPORTANT: 
    - Return a JSON ARRAY with ${count} items
    - For the "pos" field, use EXACTLY one of these values: "noun", "verb", "adj", "adverb", "preposition"
    - DO NOT use "adjective" - use "adj" instead.
    - Each word must be different from the others.
    
    For each word, provide the following fields in a JSON object:
    - "word": The ${targetLang} word.
    - "definition": A simple definition of the word in ${uiLang}.
    - "example": An example sentence using the word in ${targetLang}.
    - "pos": The part of speech (use exactly: "noun", "verb", "adj", "adverb", "preposition").
    - "options": An array of 3 plausible but incorrect multiple-choice options for the word's definition. These should be in ${uiLang}.

    Example format for ${count} words:
    [
      {
        "word": "beautiful",
        "definition": "güzel",
        "example": "She is a beautiful woman.",
        "pos": "adj",
        "options": ["çirkin", "büyük", "küçük"]
      },
      {
        "word": "run",
        "definition": "koşmak",
        "example": "He likes to run in the morning.",
        "pos": "verb",
        "options": ["yürümek", "oturmak", "durmak"]
      }
    ]

    Return the result as a JSON array with ${count} different words. Ensure the JSON is valid and contains no extra text or explanations.
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    const completion = await openai.chat.completions.create(
      {
        model: 'gpt-3.5-turbo', // Using faster model for quicker response
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3, // Lower temperature for more consistent output
      },
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    const content = completion.choices[0].message.content;
    if (!content) {
      console.error('OpenAI response content is null');
      return null;
    }

    // The model might wrap the array in a parent object, e.g., { "words": [...] }
    // We need to handle this to extract the array.
    const data = JSON.parse(content);
    console.log('AI Response data:', JSON.stringify(data, null, 2));

    let questArray;
    if (Array.isArray(data)) {
      questArray = data;
    } else if (data.words) {
      questArray = data.words;
    } else if (data.quest) {
      questArray = data.quest;
    } else if (data[`${level}_words`]) {
      questArray = data[`${level}_words`];
    } else if (data.beginner_words) {
      questArray = data.beginner_words;
    } else if (data.intermediate_words) {
      questArray = data.intermediate_words;
    } else if (data.advanced_words) {
      questArray = data.advanced_words;
    } else {
      // If it's a single object, wrap it in an array
      questArray = [data];
    }

    if (!questArray || !Array.isArray(questArray)) {
      console.error('Could not find a word array in the AI response:', content);
      return null;
    }

    const DailyQuestSchema = z.array(WordItemSchema);
    return DailyQuestSchema.parse(questArray);
  } catch (error) {
    console.error('Error generating daily quest from OpenAI:', error);

    // If it's a timeout error, use fallback data
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('OpenAI request timed out, using fallback data');
      return generateFallbackQuest(level, uiLang, targetLang, count);
    }

    // For other errors, also use fallback
    console.log('OpenAI request failed, using fallback data');
    return generateFallbackQuest(level, uiLang, targetLang, count);
  }
}

export async function generateGameContent(args: {
  gameType: 'word-scramble' | 'wordle' | 'hangman' | 'crossword';
  targetLang: Lang;
  uiLang?: Lang;
  count: number;
  seed?: number;
}): Promise<unknown | null> {
  const { gameType, targetLang, uiLang, count, seed } = args;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes('invalid') || apiKey.length < 50) {
    console.log('Using fallback demo data due to invalid API key');
    return null;
  }

  const openai = getClient();
  let system = '';
  let user = '';

  switch (gameType) {
    case 'word-scramble':
      system = `You are a language learning content generator for ${targetLang} learners. Return VALID JSON only.`;
      user = `
        SEED: ${seed ?? Date.now()}
        Generate EXACTLY ${count} different ${targetLang} words for a word scramble game.
        The words should be of medium difficulty.
        IMPORTANT:
        - Return a JSON object with a "words" key, which is an array of ${count} strings.
        - No explanations.
      `;
      break;
    case 'wordle':
      system = `You are a language learning content generator for ${targetLang} learners. Return VALID JSON only.`;
      user = `
        SEED: ${seed ?? Date.now()}
        Generate EXACTLY 1 ${targetLang} word for a Wordle-like game.
        The word length MUST be between 4 and 8 characters (inclusive).
        IMPORTANT:
        - Return a JSON object with a single key "word" containing the word as a string.
        - No explanations.
      `;
      break;
    case 'hangman':
      system = `You are a language learning content generator for ${targetLang} learners. Return VALID JSON only.`;
      user = `
        SEED: ${seed ?? Date.now()}
        Generate EXACTLY 1 ${targetLang} word for a Hangman game. The word should be of medium difficulty.
        IMPORTANT:
        - Return a JSON object with a single key "word" containing the word as a string.
        - No explanations.
      `;
      break;
    case 'crossword':
      system = `You are a language learning content generator for language learning games. Return VALID JSON only.`;
      user = `
        SEED: ${seed ?? Date.now()}
        Generate a small 5x5 crossword puzzle.
        - All ANSWERS must be in the target language: ${targetLang}
        - All CLUES must be written in the UI language: ${uiLang ?? 'en'}
        Return a JSON object with the following structure:
        {
          "grid": Array<Array<string|null>> (5x5) with letters or null for black squares,
          "clues": {
            "across": { "1": { "clue": string, "answer": string, "row": number, "col": number }, ... },
            "down": { "1": { "clue": string, "answer": string, "row": number, "col": number }, ... }
          }
        }
        Ensure the answers fit into the grid and intersect correctly.
        No explanations.
      `;
      break;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const completion = await openai.chat.completions.create(
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      },
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    const content = completion.choices[0].message.content;
    if (!content) {
      console.error('OpenAI response content is null');
      return null;
    }

    const data = JSON.parse(content);

    if (Array.isArray(data)) {
      return data;
    } else if (data.words) {
      return data.words;
    } else if (data.word) {
      return data.word;
    } else if (data.grid && data.clues) {
      return data;
    }

    return null;
  } catch (error) {
    console.error(`Error generating ${gameType} content from OpenAI:`, error);
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
