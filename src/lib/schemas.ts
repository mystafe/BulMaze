import { z } from 'zod';

export const LangSchema = z.enum(['tr', 'en', 'de', 'es', 'it', 'pt']);

export const PosSchema = z.enum(['noun', 'verb', 'adj']);

export const WordItemSchema = z.object({
  word: z.string(),
  hint: z.string(),
  example: z.string(),
  exampleTranslation: z.string(),
  pos: PosSchema,
  difficulty: z.number().int().min(1).max(10),
});

export type WordItem = z.infer<typeof WordItemSchema>;
export type Lang = z.infer<typeof LangSchema>;

const PlacementQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).optional(),
  answer: z.string(),
});

export const PlacementTestSchema = z.array(PlacementQuestionSchema).length(10);

export type PlacementTest = z.infer<typeof PlacementTestSchema>;

export const PlacementResultSchema = z.object({
  cefr: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
});

export type PlacementResult = z.infer<typeof PlacementResultSchema>;

const schemas = {
  LangSchema,
  PosSchema,
  WordItemSchema,
  PlacementTestSchema,
  PlacementResultSchema,
};

export default schemas;
