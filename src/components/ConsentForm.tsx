import { useState } from 'react';
import { Mic, Activity, MapPin, Info, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ConsentModal from './ConsentModal';

interface ConsentFormProps {
  onSubmit: (consents: {
    audio: boolean;
    bio: boolean;
    location: boolean;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export default function ConsentForm({ onSubmit, isSubmitting }: ConsentFormProps) {
  const { language } = useLanguage();
  const [consents, setConsents] = useState({
    audio: false,
    bio: false,
    location: false,
  });
  const [modalOpen, setModalOpen] = useState<'audio' | 'bio' | 'location' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consents.audio) return;
    await onSubmit(consents);
  };

  const consentItems = [
    {
      id: 'audio' as const,
      icon: Mic,
      required: true,
      title: {
        en: 'Audio Recording',
        ja: '音声録音',
      },
      description: {
        en: 'Required for voice profiling. We record your responses to create a personalized wellness plan.',
        ja: '音声プロファイリングに必要です。パーソナライズされたウェルネスプランを作成するために応答を録音します。',
      },
    },
    {
      id: 'bio' as const,
      icon: Activity,
      required: false,
      title: {
        en: 'Wellness Check-ins',
        ja: 'ウェルネスチェックイン',
      },
      description: {
        en: 'Optional. Track mood and energy levels during your journey to refine recommendations.',
        ja: 'オプション。推奨事項を改善するために、旅行中の気分とエネルギーレベルを追跡します。',
      },
    },
    {
      id: 'location' as const,
      icon: MapPin,
      required: false,
      title: {
        en: 'Location Awareness',
        ja: '位置情報認識',
      },
      description: {
        en: 'Optional. Use your location for context-aware suggestions during check-ins.',
        ja: 'オプション。チェックイン中のコンテキスト対応の提案に位置情報を使用します。',
      },
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {consentItems.map((item) => {
          const Icon = item.icon;
          const isChecked = consents[item.id];

          return (
            <div
              key={item.id}
              className={`p-6 rounded-xl border transition-all ${
                isChecked
                  ? 'bg-emerald-500/10 border-emerald-500/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setConsents((prev) => ({
                      ...prev,
                      [item.id]: !prev[item.id],
                    }))
                  }
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  aria-label={`Toggle ${item.id} consent`}
                >
                  {isChecked && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <h3 className="text-lg font-light text-white">
                      {item.title[language]}
                    </h3>
                    {item.required && (
                      <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                        {language === 'en' ? 'Required' : '必須'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3">
                    {item.description[language]}
                  </p>
                  <button
                    type="button"
                    onClick={() => setModalOpen(item.id)}
                    className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <Info className="w-3 h-3" />
                    <span>
                      {language === 'en'
                        ? 'Learn more about data usage'
                        : 'データ使用について詳しく知る'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!consents.audio && (
        <div className="flex items-start gap-3 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-100 leading-relaxed">
            {language === 'en'
              ? 'Audio recording consent is required to begin voice profiling. This allows us to understand your wellness needs through conversation.'
              : '音声プロファイリングを開始するには音声録音の同意が必要です。これにより、会話を通じてウェルネスニーズを理解できます。'}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!consents.audio || isSubmitting}
        className={`w-full px-8 py-4 rounded-full font-light tracking-wide transition-all flex items-center justify-center gap-2 ${
          consents.audio && !isSubmitting
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/50'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{language === 'en' ? 'Creating Session...' : 'セッションを作成中...'}</span>
          </>
        ) : (
          <span>
            {language === 'en' ? 'Continue to Profiling' : 'プロファイリングに進む'}
          </span>
        )}
      </button>

      {modalOpen && (
        <ConsentModal
          isOpen={true}
          onClose={() => setModalOpen(null)}
          consentType={modalOpen}
        />
      )}
    </form>
  );
}
