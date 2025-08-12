import { z } from 'zod';

export const LangSchema = z.enum(['tr', 'en', 'de', 'es', 'it', 'pt']);

export const PosSchema = z.enum([
  'noun',
  'verb',
  'adj',
  'adverb',
  'preposition',
]); // Expanded for more variety

export const WordItemSchema = z.object({
  word: z.string(),
  definition: z.string(),
  example: z.string(),
  pos: PosSchema,
  options: z.array(z.string()).length(3),
});

export type WordItem = z.infer<typeof WordItemSchema>;
export type Lang = z.infer<typeof LangSchema>;

const PlacementItemSchema = z.object({
  id: z.string(),
  type: z.enum(['mcq', 'fill']),
  prompt: z.string(),
  options: z.array(z.string()).optional(),
  correct: z.string().optional(),
});

export const PlacementSchema = z.object({
  items: z.array(PlacementItemSchema).length(10),
});

export type Placement = z.infer<typeof PlacementSchema>;

export const EvaluateResultSchema = z.object({
  cefr: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
});

export type EvaluateResult = z.infer<typeof EvaluateResultSchema>;

const schemas = {
  LangSchema,
  PosSchema,
  WordItemSchema,
  PlacementSchema,
  EvaluateResultSchema,
};

export default schemas;
