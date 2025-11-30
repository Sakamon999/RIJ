import { z } from 'zod';

export const wellnessPillarSchema = z.enum([
  'toji',
  'zen',
  'shinrinyoku',
  'shokuyojo',
  'matsuri',
  'movement',
  'rest',
]);

export const profilingPhaseSchema = z.enum([
  'state',
  'body',
  'social',
  'sensory',
  'constraints',
  'recap',
  'done',
]);

export const safetyFlagSchema = z.enum([
  'self_harm_or_imminent_danger',
  'medical_request',
  'none',
]);

export const localeSchema = z.enum(['en', 'ja']);

export const inputModeSchema = z.enum(['text', 'voice', 'system']);

export const profilingTurnSchema = z.object({
  turnNumber: z.number().int().positive(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
  inputMode: inputModeSchema,
  timestamp: z.date(),
});

export const extractedProfilingDataSchema = z.object({
  emotionalState: z.array(z.string()).optional(),
  stressLevel: z.number().min(1).max(10).optional(),
  sleepQuality: z.string().optional(),
  healthConditions: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  mobilityLevel: z.string().optional(),
  companionCount: z.number().int().positive().optional(),
  preferredPillars: z.array(wellnessPillarSchema).optional(),
  avoidPillars: z.array(wellnessPillarSchema).optional(),
  budgetRange: z.string().optional(),
  travelDates: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
      flexible: z.boolean().optional(),
    })
    .optional(),
  intensity: z.enum(['low', 'medium', 'high']).optional(),
  specialRequests: z.array(z.string()).optional(),
});

export const sessionContextSchema = z.object({
  sessionId: z.string().uuid(),
  userId: z.string().uuid(),
  phase: profilingPhaseSchema,
  turns: z.array(profilingTurnSchema),
  extractedData: extractedProfilingDataSchema,
  locale: localeSchema,
});

export const safetyCheckResultSchema = z.object({
  flags: z.array(safetyFlagSchema),
  shouldStop: z.boolean(),
  emergencyMessage: z.string().optional(),
});

export const transcriptionResultSchema = z.object({
  text: z.string(),
  confidence: z.number().min(0).max(1),
  locale: localeSchema,
});

export const llmNextTurnInputSchema = z.object({
  phase: profilingPhaseSchema,
  transcript: z.string(),
  sessionContext: sessionContextSchema,
  locale: localeSchema,
});

export const llmNextTurnOutputSchema = z.object({
  response: z.string().min(1),
  nextPhase: profilingPhaseSchema,
  extractedData: extractedProfilingDataSchema.partial(),
  shouldProceedToItinerary: z.boolean(),
});

export const itineraryBlockSchema = z.object({
  id: z.string().uuid(),
  dayNumber: z.number().int().positive(),
  sequenceOrder: z.number().int().min(0),
  title: z.string().min(1),
  description: z.string().min(1),
  pillar: wellnessPillarSchema,
  timeSlot: z.enum(['morning', 'afternoon', 'evening', 'night']),
  durationMinutes: z.number().int().positive(),
  intensity: z.enum(['low', 'medium', 'high']),
  planB: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
    })
    .optional(),
  notes: z.string().optional(),
});

export const itineraryDaySchema = z.object({
  dayNumber: z.number().int().positive(),
  theme: z.string().min(1),
  narrative: z.string().min(1),
  blocks: z.array(itineraryBlockSchema),
});

export const generatedItinerarySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  days: z.array(itineraryDaySchema),
  totalDays: z.number().int().positive(),
  overallNarrative: z.string().min(1),
  pillarWeights: z.record(wellnessPillarSchema, z.number().min(0).max(1)),
  intensityCurve: z.array(z.number().min(0).max(1)),
});

export const itineraryGenerationInputSchema = z.object({
  profileData: extractedProfilingDataSchema,
  locale: localeSchema,
  targetDays: z.number().int().positive().optional(),
});

export function validateProfilingTurn(data: unknown) {
  return profilingTurnSchema.parse(data);
}

export function validateSessionContext(data: unknown) {
  return sessionContextSchema.parse(data);
}

export function validateExtractedData(data: unknown) {
  return extractedProfilingDataSchema.parse(data);
}

export function validateItinerary(data: unknown) {
  return generatedItinerarySchema.parse(data);
}

export function validateItineraryGenerationInput(data: unknown) {
  return itineraryGenerationInputSchema.parse(data);
}
