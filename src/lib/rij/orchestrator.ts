import type {
  SessionContext,
  ProfilingTurn,
  ProfilingPhase,
  ExtractedProfilingData,
  Locale,
  InputMode,
} from './types';
import { createLLMProvider, createSTTProvider } from './providers';
import type { LLMProvider, SpeechToTextProvider } from './types';
import {
  detectSafetyFlags,
  shouldStopProfiling,
} from './safety';

export interface OrchestratorConfig {
  llmProvider?: LLMProvider;
  sttProvider?: SpeechToTextProvider;
}

export interface ProcessTurnInput {
  sessionContext: SessionContext;
  userInput: string;
  inputMode: InputMode;
}

export interface ProcessTurnOutput {
  updatedContext: SessionContext;
  assistantResponse: string;
  shouldStop: boolean;
  readyForItinerary: boolean;
}

const PHASE_ORDER: ProfilingPhase[] = [
  'state',
  'body',
  'social',
  'sensory',
  'constraints',
  'recap',
  'done',
];

export class ProfilingOrchestrator {
  private llmProvider: LLMProvider;
  private sttProvider: SpeechToTextProvider;

  constructor(config: OrchestratorConfig = {}) {
    this.llmProvider = config.llmProvider || createLLMProvider();
    this.sttProvider = config.sttProvider || createSTTProvider();
  }

  async processTurn(input: ProcessTurnInput): Promise<ProcessTurnOutput> {
    const { sessionContext, userInput, inputMode } = input;

    const safetyCheck = detectSafetyFlags(userInput, sessionContext.locale);

    if (shouldStopProfiling(safetyCheck)) {
      const stopTurn: ProfilingTurn = {
        turnNumber: sessionContext.turns.length + 1,
        role: 'assistant',
        content: safetyCheck.emergencyMessage || '',
        inputMode: 'system',
        timestamp: new Date(),
      };

      return {
        updatedContext: {
          ...sessionContext,
          phase: 'done',
          turns: [...sessionContext.turns, stopTurn],
        },
        assistantResponse: safetyCheck.emergencyMessage || '',
        shouldStop: true,
        readyForItinerary: false,
      };
    }

    const userTurn: ProfilingTurn = {
      turnNumber: sessionContext.turns.length + 1,
      role: 'user',
      content: userInput,
      inputMode,
      timestamp: new Date(),
    };

    const llmResponse = await this.llmProvider.nextTurn({
      phase: sessionContext.phase,
      transcript: userInput,
      sessionContext,
      locale: sessionContext.locale,
    });

    const mergedExtractedData: ExtractedProfilingData = {
      ...sessionContext.extractedData,
      ...llmResponse.extractedData,
    };

    if (llmResponse.extractedData.preferredPillars) {
      const existingPillars =
        sessionContext.extractedData.preferredPillars || [];
      const newPillars = llmResponse.extractedData.preferredPillars;
      mergedExtractedData.preferredPillars = Array.from(
        new Set([...existingPillars, ...newPillars])
      );
    }

    const assistantTurn: ProfilingTurn = {
      turnNumber: sessionContext.turns.length + 2,
      role: 'assistant',
      content: llmResponse.response,
      inputMode: 'system',
      timestamp: new Date(),
    };

    const updatedContext: SessionContext = {
      ...sessionContext,
      phase: llmResponse.nextPhase,
      turns: [...sessionContext.turns, userTurn, assistantTurn],
      extractedData: mergedExtractedData,
    };

    return {
      updatedContext,
      assistantResponse: llmResponse.response,
      shouldStop: false,
      readyForItinerary: llmResponse.shouldProceedToItinerary,
    };
  }

  async transcribeAudio(
    audio: Buffer,
    mimeType: string,
    locale: Locale
  ): Promise<string> {
    const result = await this.sttProvider.transcribe(audio, mimeType, locale);
    return result.text;
  }

  initializeSession(userId: string, locale: Locale = 'en'): SessionContext {
    const sessionId = crypto.randomUUID();

    const greeting =
      locale === 'ja'
        ? 'こんにちは！日本でのウェルネス旅行をお手伝いできることを嬉しく思います。まず、最近どのようにお過ごしか教えていただけますか？'
        : 'Hello! I\'m here to help you plan a wellness journey in Japan. To start, how have you been feeling lately?';

    const initialTurn: ProfilingTurn = {
      turnNumber: 1,
      role: 'assistant',
      content: greeting,
      inputMode: 'system',
      timestamp: new Date(),
    };

    return {
      sessionId,
      userId,
      phase: 'state',
      turns: [initialTurn],
      extractedData: {},
      locale,
    };
  }

  getCurrentPhaseIndex(phase: ProfilingPhase): number {
    return PHASE_ORDER.indexOf(phase);
  }

  getProgress(phase: ProfilingPhase): number {
    const index = this.getCurrentPhaseIndex(phase);
    const total = PHASE_ORDER.length - 1;
    return Math.round((index / total) * 100);
  }

  isComplete(phase: ProfilingPhase): boolean {
    return phase === 'done';
  }

  getProfileSummary(
    extractedData: ExtractedProfilingData,
    locale: Locale = 'en'
  ): string {
    const parts: string[] = [];

    if (extractedData.emotionalState && extractedData.emotionalState.length > 0) {
      parts.push(
        locale === 'ja'
          ? `感情状態: ${extractedData.emotionalState.join(', ')}`
          : `Emotional state: ${extractedData.emotionalState.join(', ')}`
      );
    }

    if (extractedData.preferredPillars && extractedData.preferredPillars.length > 0) {
      parts.push(
        locale === 'ja'
          ? `好きな体験: ${extractedData.preferredPillars.join(', ')}`
          : `Preferred experiences: ${extractedData.preferredPillars.join(', ')}`
      );
    }

    if (extractedData.intensity) {
      parts.push(
        locale === 'ja'
          ? `強度: ${extractedData.intensity}`
          : `Intensity: ${extractedData.intensity}`
      );
    }

    if (extractedData.companionCount) {
      parts.push(
        locale === 'ja'
          ? `同行者: ${extractedData.companionCount}人`
          : `Companions: ${extractedData.companionCount}`
      );
    }

    return parts.join('\n');
  }
}

export function createOrchestrator(
  config: OrchestratorConfig = {}
): ProfilingOrchestrator {
  return new ProfilingOrchestrator(config);
}
