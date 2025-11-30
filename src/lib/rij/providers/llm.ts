import type {
  LLMProvider,
  LLMNextTurnInput,
  LLMNextTurnOutput,
  ProfilingPhase,
  ExtractedProfilingData,
  WellnessPillar,
  Locale,
} from '../types';
import {
  detectSafetyFlags,
  getComfortFocusedResponse,
} from '../safety';

const PHASE_ORDER: ProfilingPhase[] = [
  'state',
  'body',
  'social',
  'sensory',
  'constraints',
  'recap',
  'done',
];

function getNextPhase(currentPhase: ProfilingPhase): ProfilingPhase {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  if (currentIndex === -1 || currentIndex >= PHASE_ORDER.length - 1) {
    return 'done';
  }
  return PHASE_ORDER[currentIndex + 1];
}

function extractEmotionalState(transcript: string): string[] {
  const emotions: string[] = [];
  const lowerText = transcript.toLowerCase();

  const emotionKeywords: Record<string, string[]> = {
    stressed: ['stress', 'stressed', 'anxious', 'worry', 'overwhelmed'],
    tired: ['tired', 'exhausted', 'fatigue', 'drained'],
    restless: ['restless', 'can\'t relax', 'tense'],
    peaceful: ['peaceful', 'calm', 'relaxed', 'serene'],
  };

  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    if (keywords.some((kw) => lowerText.includes(kw))) {
      emotions.push(emotion);
    }
  });

  return emotions.length > 0 ? emotions : ['seeking_balance'];
}

function extractStressLevel(transcript: string): number | undefined {
  const lowerText = transcript.toLowerCase();

  if (lowerText.includes('very stress') || lowerText.includes('extremely')) {
    return 8;
  }
  if (lowerText.includes('quite stress') || lowerText.includes('high stress')) {
    return 7;
  }
  if (lowerText.includes('stress')) {
    return 6;
  }
  if (lowerText.includes('little stress') || lowerText.includes('somewhat')) {
    return 4;
  }

  return undefined;
}

function extractPillars(transcript: string): WellnessPillar[] {
  const pillars: WellnessPillar[] = [];
  const lowerText = transcript.toLowerCase();

  const pillarKeywords: Record<WellnessPillar, string[]> = {
    toji: ['hot spring', 'onsen', 'spa', 'thermal', 'bath'],
    zen: ['meditation', 'mindful', 'zen', 'quiet', 'stillness', 'temple'],
    shinrinyoku: ['forest', 'nature', 'trees', 'hiking', 'outdoor'],
    shokuyojo: ['food', 'culinary', 'cooking', 'eat', 'cuisine', 'meal'],
    matsuri: ['festival', 'culture', 'tradition', 'celebration'],
    movement: ['yoga', 'exercise', 'walk', 'activity', 'physical'],
    rest: ['sleep', 'rest', 'relax', 'unwind', 'recharge'],
  };

  Object.entries(pillarKeywords).forEach(([pillar, keywords]) => {
    if (keywords.some((kw) => lowerText.includes(kw))) {
      pillars.push(pillar as WellnessPillar);
    }
  });

  return pillars;
}

function extractIntensity(
  transcript: string
): 'low' | 'medium' | 'high' | undefined {
  const lowerText = transcript.toLowerCase();

  if (
    lowerText.includes('gentle') ||
    lowerText.includes('easy') ||
    lowerText.includes('slow pace')
  ) {
    return 'low';
  }
  if (
    lowerText.includes('moderate') ||
    lowerText.includes('balanced') ||
    lowerText.includes('medium')
  ) {
    return 'medium';
  }
  if (
    lowerText.includes('active') ||
    lowerText.includes('energetic') ||
    lowerText.includes('intense')
  ) {
    return 'high';
  }

  return undefined;
}

function extractCompanionCount(transcript: string): number | undefined {
  const lowerText = transcript.toLowerCase();

  if (
    lowerText.includes('solo') ||
    lowerText.includes('alone') ||
    lowerText.includes('by myself')
  ) {
    return 1;
  }
  if (lowerText.includes('partner') || lowerText.includes('spouse')) {
    return 2;
  }
  if (lowerText.includes('family') || lowerText.includes('group')) {
    return 3;
  }

  const numberMatch = transcript.match(/\b(\d+)\s+(people|person)/i);
  if (numberMatch) {
    return parseInt(numberMatch[1], 10);
  }

  return undefined;
}

function extractBudget(transcript: string): string | undefined {
  const lowerText = transcript.toLowerCase();

  if (lowerText.includes('budget') || lowerText.includes('affordable')) {
    return 'budget';
  }
  if (lowerText.includes('moderate') || lowerText.includes('mid-range')) {
    return 'moderate';
  }
  if (lowerText.includes('luxury') || lowerText.includes('premium')) {
    return 'luxury';
  }

  return undefined;
}

function generateQuestionForPhase(
  phase: ProfilingPhase,
  locale: Locale
): string {
  const questions: Record<ProfilingPhase, { en: string; ja: string }> = {
    state: {
      en: 'How have you been feeling lately? What brings you to explore wellness travel in Japan?',
      ja: '最近どのようにお過ごしですか？日本でのウェルネス旅行を探求しようと思ったきっかけは何ですか？',
    },
    body: {
      en: 'Tell me about your physical needs. Are there any activities you particularly enjoy or would like to avoid?',
      ja: '身体的なニーズについて教えてください。特に楽しんでいる活動や避けたい活動はありますか？',
    },
    social: {
      en: 'Will you be traveling alone, or with companions? How do you prefer to spend your time with others?',
      ja: '一人で旅行しますか、それとも同行者と一緒ですか？他の人とどのように時間を過ごすのが好きですか？',
    },
    sensory: {
      en: 'What kinds of experiences resonate with you? Do you prefer quiet contemplation, nature immersion, or cultural activities?',
      ja: 'どのような体験があなたに響きますか？静かな瞑想、自然への没入、それとも文化的な活動を好みますか？',
    },
    constraints: {
      en: 'Do you have any time or budget considerations I should know about? Any specific dates in mind?',
      ja: '考慮すべき時間や予算の制約はありますか？具体的な日程の希望はありますか？',
    },
    recap: {
      en: 'Let me summarize what we\'ve discussed. You\'re looking for a wellness journey that helps you find balance and comfort. Does this sound right?',
      ja: 'これまでお話しした内容をまとめさせてください。バランスと快適さを見つけるウェルネスの旅をお探しですね。これで合っていますか？',
    },
    done: {
      en: 'Thank you for sharing. I\'m ready to create a personalized wellness itinerary for you.',
      ja: '共有していただきありがとうございます。あなたのためにパーソナライズされたウェルネス旅程を作成する準備ができました。',
    },
  };

  return questions[phase][locale];
}

export class RuleBasedLLMProvider implements LLMProvider {
  async nextTurn(input: LLMNextTurnInput): Promise<LLMNextTurnOutput> {
    const { phase, transcript, sessionContext, locale } = input;

    const safetyCheck = detectSafetyFlags(transcript, locale);

    if (safetyCheck.shouldStop && safetyCheck.emergencyMessage) {
      return {
        response: safetyCheck.emergencyMessage,
        nextPhase: 'done',
        extractedData: {},
        shouldProceedToItinerary: false,
      };
    }

    const extractedData: Partial<ExtractedProfilingData> = {};

    if (phase === 'state') {
      extractedData.emotionalState = extractEmotionalState(transcript);
      extractedData.stressLevel = extractStressLevel(transcript);
      const pillars = extractPillars(transcript);
      if (pillars.length > 0) {
        extractedData.preferredPillars = pillars;
      }
    }

    if (phase === 'body') {
      const pillars = extractPillars(transcript);
      if (pillars.length > 0) {
        extractedData.preferredPillars = [
          ...(sessionContext.extractedData.preferredPillars || []),
          ...pillars,
        ];
      }
      const intensity = extractIntensity(transcript);
      if (intensity) {
        extractedData.intensity = intensity;
      }
    }

    if (phase === 'social') {
      const companionCount = extractCompanionCount(transcript);
      if (companionCount) {
        extractedData.companionCount = companionCount;
      }
    }

    if (phase === 'sensory') {
      const pillars = extractPillars(transcript);
      if (pillars.length > 0) {
        extractedData.preferredPillars = [
          ...(sessionContext.extractedData.preferredPillars || []),
          ...pillars,
        ];
      }
    }

    if (phase === 'constraints') {
      const budget = extractBudget(transcript);
      if (budget) {
        extractedData.budgetRange = budget;
      }
    }

    let response = '';

    if (safetyCheck.flags.includes('medical_request')) {
      const comfortResponse = getComfortFocusedResponse(transcript, locale);
      if (comfortResponse) {
        response = comfortResponse + '\n\n';
      }
    }

    const nextPhase = phase === 'recap' ? 'done' : getNextPhase(phase);
    const shouldProceedToItinerary = nextPhase === 'done';

    response += generateQuestionForPhase(nextPhase, locale);

    if (nextPhase === 'done') {
      response =
        locale === 'ja'
          ? '素晴らしいです！あなたのウェルネスの旅程を作成しています。快適さとバランスを重視した体験をご提案します。'
          : 'Wonderful! I\'m creating your wellness itinerary now. I\'ll focus on experiences that prioritize comfort and balance.';
    }

    return {
      response,
      nextPhase,
      extractedData,
      shouldProceedToItinerary,
    };
  }
}

export function createLLMProvider(): LLMProvider {
  return new RuleBasedLLMProvider();
}
