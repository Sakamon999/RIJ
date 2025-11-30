export type WellnessPillar =
  | 'toji'
  | 'zen'
  | 'shinrinyoku'
  | 'shokuyojo'
  | 'matsuri'
  | 'movement'
  | 'rest';

export type ProfilingPhase =
  | 'state'
  | 'body'
  | 'social'
  | 'sensory'
  | 'constraints'
  | 'recap'
  | 'done';

export type SafetyFlag =
  | 'self_harm_or_imminent_danger'
  | 'medical_request'
  | 'none';

export type Locale = 'en' | 'ja';

export type InputMode = 'text' | 'voice' | 'system';

export interface ProfilingTurn {
  turnNumber: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  inputMode: InputMode;
  timestamp: Date;
}

export interface SessionContext {
  sessionId: string;
  userId: string;
  phase: ProfilingPhase;
  turns: ProfilingTurn[];
  extractedData: ExtractedProfilingData;
  locale: Locale;
}

export interface ExtractedProfilingData {
  emotionalState?: string[];
  stressLevel?: number;
  sleepQuality?: string;
  healthConditions?: string[];
  dietaryRestrictions?: string[];
  mobilityLevel?: string;
  companionCount?: number;
  preferredPillars?: WellnessPillar[];
  avoidPillars?: WellnessPillar[];
  budgetRange?: string;
  travelDates?: {
    start?: string;
    end?: string;
    flexible?: boolean;
  };
  intensity?: 'low' | 'medium' | 'high';
  specialRequests?: string[];
}

export interface SafetyCheckResult {
  flags: SafetyFlag[];
  shouldStop: boolean;
  emergencyMessage?: string;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  locale: Locale;
}

export interface LLMNextTurnInput {
  phase: ProfilingPhase;
  transcript: string;
  sessionContext: SessionContext;
  locale: Locale;
}

export interface LLMNextTurnOutput {
  response: string;
  nextPhase: ProfilingPhase;
  extractedData: Partial<ExtractedProfilingData>;
  shouldProceedToItinerary: boolean;
}

export interface ItineraryBlock {
  id: string;
  dayNumber: number;
  sequenceOrder: number;
  title: string;
  description: string;
  pillar: WellnessPillar;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  durationMinutes: number;
  intensity: 'low' | 'medium' | 'high';
  planB?: {
    title: string;
    description: string;
  };
  notes?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  theme: string;
  narrative: string;
  blocks: ItineraryBlock[];
}

export interface GeneratedItinerary {
  id: string;
  title: string;
  description: string;
  days: ItineraryDay[];
  totalDays: number;
  overallNarrative: string;
  pillarWeights: Record<WellnessPillar, number>;
  intensityCurve: number[];
}

export interface ItineraryGenerationInput {
  profileData: ExtractedProfilingData;
  locale: Locale;
  targetDays?: number;
}

export interface SpeechToTextProvider {
  transcribe(
    audio: Buffer,
    mimeType: string,
    locale: Locale
  ): Promise<TranscriptionResult>;
}

export interface LLMProvider {
  nextTurn(input: LLMNextTurnInput): Promise<LLMNextTurnOutput>;
}

export interface ItineraryEngineConfig {
  defaultDays: number;
  actsPerDay: number;
}
