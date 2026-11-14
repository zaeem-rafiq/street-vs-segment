import { z } from "zod";

// The shape of one saved Flashpoint research run. Every number the page shows about a
// segment comes from a file that passes this schema; nothing is typed by hand.
const percent = z.number().min(0).max(100);

export const runSchema = z.object({
  ticker: z.string().min(1),
  question: z.string().min(1),
  segment: z.object({
    label: z.string().min(1),
    place: z.string().min(1),
  }),
  marketAtRun: z.object({
    yesPercent: percent,
    time: z.string().min(1),
  }),
  profile: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .min(1),
  questions: z
    .array(
      z.object({
        text: z.string().min(1),
        kind: z.enum(["yes_no", "behavior", "open"]),
        answers: z
          .array(z.object({ option: z.string().min(1), percent }))
          .optional(),
      }),
    )
    .min(1),
  yesShare: percent,
  behaviorSummary: z.string().min(1),
  quotes: z
    .array(z.object({ text: z.string().min(1), persona: z.string().min(1) }))
    .min(3)
    .max(5),
  panelSize: z.number().int().positive(),
  fitScore: z.number().nullable().optional(),
  flashpoint: z.object({
    surveyId: z.string().min(1),
    panelId: z.string().optional(),
  }),
  ranAt: z.string().min(1),
  // #1 Known-answer check: the same panel asked a yes/no question whose answer is already a
  // public fact. Shows how far the panel's Yes share is from the truth (0 or 100).
  knownAnswerCheck: z
    .object({
      question: z.string().min(1),
      correctAnswer: z.enum(["Yes", "No"]),
      fact: z.string().min(1),
      sourceName: z.string().min(1),
      sourceUrl: z.string().url(),
      panelYesShare: percent,
      surveyId: z.string().min(1),
    })
    .optional(),
  // #2 The panel's own number for the market's quantity (for example the Nov 30 gas average),
  // one value per persona, so the page can compare the panel's odds with every Kalshi strike.
  estimate: z
    .object({
      question: z.string().min(1),
      unit: z.string().min(1),
      values: z.array(z.number()).min(10),
      surveyId: z.string().min(1),
    })
    .optional(),
  // #3 Who drives the gap: the Yes share split by a persona attribute.
  breakdowns: z
    .array(
      z.object({
        dimension: z.enum(["age", "region", "gender"]),
        groups: z
          .array(z.object({ label: z.string().min(1), n: z.number().int().positive(), yesShare: percent }))
          .min(2),
      }),
    )
    .optional(),
  // Test fixtures set this so they can never pass as real research.
  fixture: z.boolean().optional(),
});

export type Run = z.infer<typeof runSchema>;

export function parseRun(value: unknown, source: string): Run {
  const result = runSchema.safeParse(value);
  if (!result.success) {
    throw new Error(`${source} is not a valid run file: ${result.error.message}`);
  }
  return result.data;
}
