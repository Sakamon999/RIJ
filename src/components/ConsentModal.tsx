import { X, Mic, Activity, MapPin, Shield, Trash2, Database } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  consentType: 'audio' | 'bio' | 'location';
}

export default function ConsentModal({ isOpen, onClose, consentType }: ConsentModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const content = {
    audio: {
      icon: Mic,
      title: {
        en: 'Audio Recording Consent',
        ja: '音声録音の同意',
      },
      description: {
        en: 'We use audio recording to understand your wellness needs through voice profiling.',
        ja: '音声プロファイリングを通じてあなたのウェルネスニーズを理解するために音声録音を使用します。',
      },
      sections: [
        {
          title: { en: 'What We Record', ja: '記録内容' },
          content: {
            en: 'Your voice responses during the profiling session (10-15 minutes). This helps us understand your emotional state, preferences, and wellness goals.',
            ja: 'プロファイリングセッション中の音声応答（10〜15分）。これにより、感情状態、好み、ウェルネス目標を理解できます。',
          },
        },
        {
          title: { en: 'How We Store It', ja: '保存方法' },
          content: {
            en: 'Audio is encrypted and stored securely in our database. We convert speech to text for processing, then use it only to generate your personalized wellness itinerary.',
            ja: '音声は暗号化され、データベースに安全に保存されます。処理のために音声をテキストに変換し、パーソナライズされたウェルネス旅程の生成にのみ使用します。',
          },
        },
        {
          title: { en: 'Your Rights', ja: 'あなたの権利' },
          content: {
            en: 'You can request deletion of your audio data at any time. Contact support to exercise this right. Audio is automatically deleted after 90 days unless you opt to keep it.',
            ja: 'いつでも音声データの削除をリクエストできます。この権利を行使するにはサポートに連絡してください。オプトインしない限り、90日後に自動的に削除されます。',
          },
        },
        {
          title: { en: 'Non-Medical Use Only', ja: '非医療目的のみ' },
          content: {
            en: 'Audio is used solely for comfort-focused travel planning. We do not diagnose conditions, provide medical advice, or share data with healthcare providers.',
            ja: '音声は快適さ重視の旅行計画にのみ使用されます。医療診断、医学的アドバイスの提供、医療提供者とのデータ共有は行いません。',
          },
        },
      ],
    },
    bio: {
      icon: Activity,
      title: {
        en: 'Biometric Data Consent',
        ja: '生体データの同意',
      },
      description: {
        en: 'We may collect basic wellness indicators to personalize your experience.',
        ja: '体験をパーソナライズするために基本的なウェルネス指標を収集する場合があります。',
      },
      sections: [
        {
          title: { en: 'What We Collect', ja: '収集内容' },
          content: {
            en: 'Optional: mood ratings (1-5), energy levels (1-5), and wellness check-ins during your journey. This is entirely optional and helps us refine recommendations.',
            ja: 'オプション：気分評価（1〜5）、エネルギーレベル（1〜5）、旅行中のウェルネスチェックイン。完全にオプションで、推奨事項の改善に役立ちます。',
          },
        },
        {
          title: { en: 'How We Use It', ja: '使用方法' },
          content: {
            en: 'Data helps us understand your experience and adjust recommendations. We never share this with third parties or use it for medical purposes.',
            ja: 'データは体験の理解と推奨事項の調整に役立ちます。第三者と共有したり、医療目的で使用したりすることはありません。',
          },
        },
        {
          title: { en: 'Your Control', ja: 'あなたの管理' },
          content: {
            en: 'You can skip any check-in or delete historical data at any time. This consent is optional - you can still use RIJ without it.',
            ja: 'いつでもチェックインをスキップしたり、履歴データを削除したりできます。この同意はオプションです。同意なしでもRIJを使用できます。',
          },
        },
      ],
    },
    location: {
      icon: MapPin,
      title: {
        en: 'Location Tracking Consent',
        ja: '位置情報追跡の同意',
      },
      description: {
        en: 'We may use location data to enhance your wellness journey with context-aware features.',
        ja: 'コンテキスト対応機能でウェルネスジャーニーを強化するために位置情報データを使用する場合があります。',
      },
      sections: [
        {
          title: { en: 'What We Track', ja: '追跡内容' },
          content: {
            en: 'Optional: approximate location during check-ins to suggest nearby experiences or adjust recommendations based on your current area. This is optional.',
            ja: 'オプション：チェックイン中のおおよその位置情報で、近くの体験を提案したり、現在のエリアに基づいて推奨事項を調整したりします。オプションです。',
          },
        },
        {
          title: { en: 'How We Use It', ja: '使用方法' },
          content: {
            en: 'Location helps us provide relevant, timely suggestions. For example, suggesting a nearby hot spring when you\'re feeling stressed, or recommending a quiet temple nearby.',
            ja: '位置情報は関連性の高いタイムリーな提案の提供に役立ちます。たとえば、ストレスを感じているときに近くの温泉を提案したり、近くの静かな寺院を推奨したりします。',
          },
        },
        {
          title: { en: 'Privacy & Control', ja: 'プライバシーと管理' },
          content: {
            en: 'Location is only collected when you explicitly check in. You can disable this at any time in settings. We never track your location continuously or share it with others.',
            ja: '位置情報は明示的にチェックインしたときにのみ収集されます。いつでも設定で無効にできます。継続的に位置情報を追跡したり、他者と共有したりすることはありません。',
          },
        },
      ],
    },
  };

  const current = content[consentType];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          <div className="p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-light text-white mb-2">
                  {current.title[language]}
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {current.description[language]}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {current.sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {idx === 0 && <Database className="w-4 h-4 text-emerald-400" />}
                    {idx === 1 && <Shield className="w-4 h-4 text-emerald-400" />}
                    {idx === 2 && <Trash2 className="w-4 h-4 text-emerald-400" />}
                    {idx === 3 && <Shield className="w-4 h-4 text-amber-400" />}
                    <h3 className="text-lg font-light text-white">
                      {section.title[language]}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed pl-6">
                    {section.content[language]}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-full text-white font-light tracking-wide transition-all"
              >
                {language === 'en' ? 'I Understand' : '理解しました'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
