import type { SafetyCheckResult, SafetyFlag, Locale } from './types';

const SELF_HARM_KEYWORDS = [
  'suicide',
  'suicidal',
  'kill myself',
  'end my life',
  'hurt myself',
  'self harm',
  'self-harm',
  'want to die',
  'better off dead',
  'no reason to live',
];

const SELF_HARM_KEYWORDS_JA = [
  '自殺',
  '死にたい',
  '自傷',
  '命を絶つ',
  '生きる意味',
];

const MEDICAL_KEYWORDS = [
  'diagnose',
  'diagnosis',
  'disease',
  'illness',
  'medical condition',
  'symptoms',
  'treatment',
  'cure',
  'medication',
  'prescription',
  'doctor',
  'therapy',
  'clinical',
  'disorder',
];

const MEDICAL_KEYWORDS_JA = [
  '診断',
  '病気',
  '疾患',
  '症状',
  '治療',
  '薬',
  '処方',
  '医師',
  '医者',
  '障害',
];

const EMERGENCY_MESSAGE_EN = `I notice you may be experiencing distress. Your safety is the most important thing right now.

If you're in immediate danger or having thoughts of self-harm, please reach out to emergency services or a crisis helpline immediately:

**International Crisis Resources:**
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/
- Crisis Text Line (US): Text HOME to 741741
- Samaritans (UK/Ireland): 116 123

**Japan Crisis Resources:**
- TELL Lifeline: 03-5774-0992 (9am-11pm daily)
- Inochi no Denwa (Japanese): 0570-783-556 (24/7)

We're here to help you plan a comfortable wellness journey when you're ready, but professional support should be your first priority right now.`;

const EMERGENCY_MESSAGE_JA = `あなたが苦しんでいることに気づきました。今はあなたの安全が最も重要です。

すぐに危険がある場合や自傷の考えがある場合は、すぐに緊急サービスまたは危機相談窓口に連絡してください：

**日本の危機対応リソース：**
- よりそいホットライン: 0120-279-338（24時間対応）
- いのちの電話: 0570-783-556（24時間対応）
- TELL ライフライン: 03-5774-0992（毎日9:00-23:00）

**国際的な危機対応リソース：**
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

準備ができたら、快適なウェルネス旅行の計画をお手伝いしますが、今は専門家のサポートを優先してください。`;

function containsKeywords(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  );
}

function detectSelfHarm(transcript: string, locale: Locale): boolean {
  const keywords =
    locale === 'ja'
      ? [...SELF_HARM_KEYWORDS, ...SELF_HARM_KEYWORDS_JA]
      : SELF_HARM_KEYWORDS;

  return containsKeywords(transcript, keywords);
}

function detectMedicalRequest(transcript: string, locale: Locale): boolean {
  const keywords =
    locale === 'ja'
      ? [...MEDICAL_KEYWORDS, ...MEDICAL_KEYWORDS_JA]
      : MEDICAL_KEYWORDS;

  return containsKeywords(transcript, keywords);
}

export function detectSafetyFlags(
  transcript: string,
  locale: Locale = 'en'
): SafetyCheckResult {
  const flags: SafetyFlag[] = [];
  let shouldStop = false;
  let emergencyMessage: string | undefined;

  if (detectSelfHarm(transcript, locale)) {
    flags.push('self_harm_or_imminent_danger');
    shouldStop = true;
    emergencyMessage =
      locale === 'ja' ? EMERGENCY_MESSAGE_JA : EMERGENCY_MESSAGE_EN;
  } else if (detectMedicalRequest(transcript, locale)) {
    flags.push('medical_request');
  }

  if (flags.length === 0) {
    flags.push('none');
  }

  return {
    flags,
    shouldStop,
    emergencyMessage,
  };
}

export function shouldStopProfiling(result: SafetyCheckResult): boolean {
  return result.shouldStop;
}

export function getMedicalDisclaimerMessage(locale: Locale = 'en'): string {
  if (locale === 'ja') {
    return 'RIJは医療サービスを提供するものではなく、医学的アドバイスや診断、治療の代わりにはなりません。健康上の懸念がある場合は、資格のある医療専門家にご相談ください。快適さとウェルネスに焦点を当てた旅行計画をお手伝いします。';
  }

  return 'RIJ is not a medical service and does not provide medical advice, diagnosis, or treatment. If you have health concerns, please consult with a qualified healthcare professional. We focus on comfort-oriented travel planning for wellness experiences.';
}

export function getComfortFocusedResponse(
  userInput: string,
  locale: Locale = 'en'
): string {
  const safetyCheck = detectSafetyFlags(userInput, locale);

  if (safetyCheck.flags.includes('medical_request')) {
    const disclaimer = getMedicalDisclaimerMessage(locale);

    if (locale === 'ja') {
      return `${disclaimer}\n\nリラックスや快適さを高める体験についてお話しできますか？例えば、温泉、瞑想、自然の中での時間などです。`;
    }

    return `${disclaimer}\n\nCould we talk about experiences that might help you feel more relaxed and comfortable? For example, hot springs, meditation, or time in nature.`;
  }

  return '';
}
