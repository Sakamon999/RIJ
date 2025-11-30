import type {
  GeneratedItinerary,
  ItineraryGenerationInput,
  ItineraryDay,
  ItineraryBlock,
  WellnessPillar,
  ExtractedProfilingData,
  Locale,
} from './types';

const PILLAR_LABELS: Record<WellnessPillar, { en: string; ja: string }> = {
  toji: { en: 'Hot Springs', ja: '温泉' },
  zen: { en: 'Zen & Meditation', ja: '禅と瞑想' },
  shinrinyoku: { en: 'Forest Bathing', ja: '森林浴' },
  shokuyojo: { en: 'Culinary Healing', ja: '食養生' },
  matsuri: { en: 'Cultural Festivals', ja: '祭り' },
  movement: { en: 'Movement & Yoga', ja: '運動とヨガ' },
  rest: { en: 'Rest & Relaxation', ja: '休息とリラクゼーション' },
};

interface BlockTemplate {
  pillar: WellnessPillar;
  title: { en: string; ja: string };
  description: { en: string; ja: string };
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  durationMinutes: number;
  intensity: 'low' | 'medium' | 'high';
  planB: { en: string; ja: string };
}

const BLOCK_TEMPLATES: BlockTemplate[] = [
  {
    pillar: 'zen',
    title: { en: 'Morning Meditation', ja: '朝の瞑想' },
    description: {
      en: 'Start your day with guided meditation in a peaceful temple setting. Focus on breath awareness and cultivating inner calm.',
      ja: '静かな寺院で誘導瞑想から一日を始めましょう。呼吸の意識と内なる静けさを育てることに焦点を当てます。',
    },
    timeSlot: 'morning',
    durationMinutes: 60,
    intensity: 'low',
    planB: {
      en: 'If weather permits, meditation can be done in a temple garden.',
      ja: '天候が許せば、寺院の庭園で瞑想を行うことができます。',
    },
  },
  {
    pillar: 'toji',
    title: { en: 'Onsen Experience', ja: '温泉体験' },
    description: {
      en: 'Immerse yourself in natural hot springs renowned for their therapeutic properties. Allow the mineral-rich waters to ease tension and promote deep relaxation.',
      ja: '治療効果で有名な天然温泉に浸かりましょう。ミネラル豊富な水が緊張を和らげ、深いリラクゼーションを促進します。',
    },
    timeSlot: 'afternoon',
    durationMinutes: 120,
    intensity: 'low',
    planB: {
      en: 'Alternative private bath available if shared facilities are uncomfortable.',
      ja: '共用施設が不快な場合は、代替の貸切風呂が利用可能です。',
    },
  },
  {
    pillar: 'shinrinyoku',
    title: { en: 'Forest Bathing Walk', ja: '森林浴ウォーク' },
    description: {
      en: 'Gentle walk through ancient forests, engaging all your senses. Experience the healing power of nature and the peace of being surrounded by trees.',
      ja: '古代の森を通る穏やかな散歩で、すべての感覚を使いましょう。自然の癒しの力と木々に囲まれた平和を体験してください。',
    },
    timeSlot: 'morning',
    durationMinutes: 90,
    intensity: 'low',
    planB: {
      en: 'Shorter trail available for those preferring lighter activity.',
      ja: 'より軽い活動を好む方のために、短いトレイルが利用可能です。',
    },
  },
  {
    pillar: 'shokuyojo',
    title: { en: 'Seasonal Kaiseki', ja: '季節の懐石料理' },
    description: {
      en: 'Multi-course meal featuring seasonal, locally-sourced ingredients prepared with mindful attention. Each dish is designed to nourish both body and spirit.',
      ja: '季節の地元産食材を使用した、心を込めて調理された多皿コース料理。各料理は体と精神の両方を養うように設計されています。',
    },
    timeSlot: 'evening',
    durationMinutes: 90,
    intensity: 'low',
    planB: {
      en: 'Dietary accommodations available with advance notice.',
      ja: '事前にお知らせいただければ、食事制限に対応できます。',
    },
  },
  {
    pillar: 'movement',
    title: { en: 'Gentle Yoga Session', ja: '穏やかなヨガセッション' },
    description: {
      en: 'Restorative yoga practice focusing on gentle stretches and breath work. Suitable for all levels, emphasizing comfort and self-care.',
      ja: '穏やかなストレッチと呼吸法に焦点を当てた回復的なヨガの実践。すべてのレベルに適しており、快適さとセルフケアを重視します。',
    },
    timeSlot: 'morning',
    durationMinutes: 60,
    intensity: 'medium',
    planB: {
      en: 'Chair yoga option available for those with mobility considerations.',
      ja: '移動に配慮が必要な方のために、椅子ヨガのオプションがあります。',
    },
  },
  {
    pillar: 'rest',
    title: { en: 'Afternoon Rest', ja: '午後の休息' },
    description: {
      en: 'Dedicated time for rest in your peaceful accommodation. Use this time to journal, nap, or simply be present with yourself.',
      ja: '静かな宿泊施設での休息のための専用時間。この時間を使って日記を書いたり、昼寝をしたり、ただ自分自身と向き合ったりしてください。',
    },
    timeSlot: 'afternoon',
    durationMinutes: 120,
    intensity: 'low',
    planB: {
      en: 'Gentle reading in a garden setting if preferred.',
      ja: 'お好みであれば、庭園での穏やかな読書も可能です。',
    },
  },
  {
    pillar: 'matsuri',
    title: { en: 'Tea Ceremony', ja: '茶道体験' },
    description: {
      en: 'Participate in a traditional tea ceremony, learning about the principles of harmony, respect, and tranquility embodied in this ancient practice.',
      ja: '伝統的な茶道に参加し、この古代の実践に体現された調和、尊敬、静寂の原則について学びましょう。',
    },
    timeSlot: 'afternoon',
    durationMinutes: 90,
    intensity: 'low',
    planB: {
      en: 'Informal tea appreciation session available as alternative.',
      ja: '代替として、非公式のお茶の鑑賞会が利用可能です。',
    },
  },
];

function calculatePillarWeights(
  profileData: ExtractedProfilingData
): Record<WellnessPillar, number> {
  const weights: Record<WellnessPillar, number> = {
    toji: 0.3,
    zen: 0.2,
    shinrinyoku: 0.15,
    shokuyojo: 0.15,
    matsuri: 0.1,
    movement: 0.05,
    rest: 0.05,
  };

  if (profileData.preferredPillars && profileData.preferredPillars.length > 0) {
    const preferredSet = new Set(profileData.preferredPillars);
    const boost = 0.15;

    Object.keys(weights).forEach((pillar) => {
      if (preferredSet.has(pillar as WellnessPillar)) {
        weights[pillar as WellnessPillar] += boost;
      } else {
        weights[pillar as WellnessPillar] *= 0.7;
      }
    });
  }

  if (profileData.avoidPillars && profileData.avoidPillars.length > 0) {
    profileData.avoidPillars.forEach((pillar) => {
      weights[pillar] = 0;
    });
  }

  if (
    profileData.emotionalState?.some((state) =>
      ['stressed', 'anxious'].includes(state)
    )
  ) {
    weights.zen += 0.1;
    weights.rest += 0.1;
    weights.shinrinyoku += 0.05;
  }

  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  Object.keys(weights).forEach((pillar) => {
    weights[pillar as WellnessPillar] /= total;
  });

  return weights;
}

function generateIntensityCurve(days: number): number[] {
  const curve: number[] = [];

  for (let i = 0; i < days; i++) {
    const progress = i / (days - 1);

    if (progress < 0.3) {
      curve.push(0.3 + progress * 0.5);
    } else if (progress < 0.7) {
      curve.push(0.5);
    } else {
      curve.push(0.5 - (progress - 0.7) * 0.7);
    }
  }

  return curve;
}

function selectBlocksForDay(
  dayNumber: number,
  pillarWeights: Record<WellnessPillar, number>,
  _targetIntensity: number,
  locale: Locale
): ItineraryBlock[] {
  const blocks: ItineraryBlock[] = [];
  const timeSlots: Array<'morning' | 'afternoon' | 'evening'> = [
    'morning',
    'afternoon',
    'evening',
  ];

  const sortedPillars = Object.entries(pillarWeights)
    .filter(([_, weight]) => weight > 0)
    .sort(([_, a], [__, b]) => b - a)
    .map(([pillar]) => pillar as WellnessPillar);

  let pillarIndex = (dayNumber - 1) % sortedPillars.length;

  timeSlots.forEach((timeSlot, sequenceOrder) => {
    const targetPillar = sortedPillars[pillarIndex % sortedPillars.length];

    const candidates = BLOCK_TEMPLATES.filter(
      (template) =>
        template.pillar === targetPillar && template.timeSlot === timeSlot
    );

    let template =
      candidates.length > 0
        ? candidates[0]
        : BLOCK_TEMPLATES.find((t) => t.timeSlot === timeSlot) ||
          BLOCK_TEMPLATES[0];

    const block: ItineraryBlock = {
      id: crypto.randomUUID(),
      dayNumber,
      sequenceOrder,
      title: template.title[locale],
      description: template.description[locale],
      pillar: template.pillar,
      timeSlot: template.timeSlot,
      durationMinutes: template.durationMinutes,
      intensity: template.intensity,
      planB: {
        title: `Alternative: ${template.title[locale]}`,
        description: template.planB[locale],
      },
      notes:
        locale === 'ja'
          ? '具体的な場所は予約確定後にご案内いたします。'
          : 'Specific locations will be provided upon booking confirmation.',
    };

    blocks.push(block);
    pillarIndex++;
  });

  return blocks;
}

function generateDayTheme(
  dayNumber: number,
  blocks: ItineraryBlock[],
  locale: Locale
): string {
  const dominantPillar = blocks[0].pillar;
  const themes: Record<number, { en: string; ja: string }> = {
    1: {
      en: 'Arrival & Grounding',
      ja: '到着とグラウンディング',
    },
    2: {
      en: 'Deepening Connection',
      ja: 'つながりを深める',
    },
    3: {
      en: 'Integration & Reflection',
      ja: '統合と振り返り',
    },
  };

  const defaultTheme = themes[dayNumber] || themes[1];
  return `${defaultTheme[locale]} - ${PILLAR_LABELS[dominantPillar][locale]}`;
}

function generateDayNarrative(
  dayNumber: number,
  theme: string,
  locale: Locale
): string {
  if (locale === 'ja') {
    if (dayNumber === 1) {
      return `${theme}の一日です。穏やかなペースで始め、新しい環境に慣れることに焦点を当てます。各体験は、快適さとバランスを優先して設計されています。`;
    }
    if (dayNumber === 2) {
      return `${theme}の一日です。昨日の基礎の上に、より深い実践と探求を加えます。自分のペースで進めてください。`;
    }
    return `${theme}の最終日です。これまでの体験を振り返り、日常生活に持ち帰る洞察を統合します。`;
  }

  if (dayNumber === 1) {
    return `A day of ${theme}. We begin at a gentle pace, focusing on settling into your new environment. Each experience is designed with comfort and balance as priorities.`;
  }
  if (dayNumber === 2) {
    return `A day of ${theme}. Building on yesterday's foundation, we add deeper practices and exploration. Move at your own pace.`;
  }
  return `The final day of ${theme}. Time to reflect on your experiences and integrate the insights you'll carry back into daily life.`;
}

export class ItineraryEngine {
  private defaultDays: number;

  constructor(config: { defaultDays?: number } = {}) {
    this.defaultDays = config.defaultDays || 3;
  }

  generate(input: ItineraryGenerationInput): GeneratedItinerary {
    const { profileData, locale, targetDays } = input;
    const days = targetDays || this.defaultDays;

    const pillarWeights = calculatePillarWeights(profileData);
    const intensityCurve = generateIntensityCurve(days);

    const itineraryDays: ItineraryDay[] = [];

    for (let dayNumber = 1; dayNumber <= days; dayNumber++) {
      const targetIntensity = intensityCurve[dayNumber - 1];
      const blocks = selectBlocksForDay(
        dayNumber,
        pillarWeights,
        targetIntensity,
        locale
      );

      const theme = generateDayTheme(dayNumber, blocks, locale);
      const narrative = generateDayNarrative(dayNumber, theme, locale);

      itineraryDays.push({
        dayNumber,
        theme,
        narrative,
        blocks,
      });
    }

    const topPillars = Object.entries(pillarWeights)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3)
      .map(([pillar]) => PILLAR_LABELS[pillar as WellnessPillar][locale]);

    const title =
      locale === 'ja'
        ? `${days}日間のウェルネス体験`
        : `${days}-Day Wellness Journey`;

    const description =
      locale === 'ja'
        ? `${topPillars.join('、')}に焦点を当てた、快適さとバランスを重視した個人向けのウェルネス旅程です。各体験は、リラックスと回復を促進するように慎重に選ばれています。`
        : `A personalized wellness itinerary focusing on ${topPillars.join(', ')}, emphasizing comfort and balance. Each experience is carefully selected to promote relaxation and restoration.`;

    const overallNarrative =
      locale === 'ja'
        ? `この${days}日間の旅は、穏やかな導入から始まり、徐々に深まり、最後は統合と振り返りで締めくくられます。旅を通して、快適さと個人のペースが優先されます。各日には柔軟性のための代替オプションが含まれています。`
        : `This ${days}-day journey begins with a gentle introduction, gradually deepens, and concludes with integration and reflection. Throughout, comfort and personal pacing are prioritized. Each day includes alternative options for flexibility.`;

    return {
      id: crypto.randomUUID(),
      title,
      description,
      days: itineraryDays,
      totalDays: days,
      overallNarrative,
      pillarWeights,
      intensityCurve,
    };
  }

  getBlockById(itinerary: GeneratedItinerary, blockId: string): ItineraryBlock | undefined {
    for (const day of itinerary.days) {
      const block = day.blocks.find((b) => b.id === blockId);
      if (block) return block;
    }
    return undefined;
  }

  getDayBlocks(itinerary: GeneratedItinerary, dayNumber: number): ItineraryBlock[] {
    const day = itinerary.days.find((d) => d.dayNumber === dayNumber);
    return day ? day.blocks : [];
  }
}

export function createItineraryEngine(
  config: { defaultDays?: number } = {}
): ItineraryEngine {
  return new ItineraryEngine(config);
}
