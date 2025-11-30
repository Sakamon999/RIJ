import type {
  SpeechToTextProvider,
  TranscriptionResult,
  Locale,
} from '../types';

export class FakeSTTProvider implements SpeechToTextProvider {
  async transcribe(
    audio: Buffer,
    _mimeType: string,
    locale: Locale
  ): Promise<TranscriptionResult> {
    if (!audio || audio.length === 0) {
      return {
        text:
          locale === 'ja'
            ? '[音声プレースホルダー - 開発モード]'
            : '[Audio placeholder - dev mode]',
        confidence: 1.0,
        locale,
      };
    }

    const placeholderText =
      locale === 'ja'
        ? 'ストレスを減らして、よく眠れるようになりたいです。'
        : 'I want to reduce stress and sleep better.';

    return {
      text: placeholderText,
      confidence: 0.95,
      locale,
    };
  }
}

export function createSTTProvider(): SpeechToTextProvider {
  return new FakeSTTProvider();
}
