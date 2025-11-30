import { ArrowLeft, Sparkles, Mic, Shield, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import RIJLegalBanner from '../components/RIJLegalBanner';
import ConsentForm from '../components/ConsentForm';
import { createConsents, createProfilingSession, getOrCreateAnonymousUser } from '../lib/supabase/rij';

interface RIJPageProps {
  onBack: () => void;
  onNavigateToProfile: (sessionId: string) => void;
  onNavigateToConsent?: () => void;
  isConsentPage?: boolean;
}

export default function RIJPage({ onBack, onNavigateToProfile, onNavigateToConsent, isConsentPage }: RIJPageProps) {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConsentSubmit = async (consents: {
    audio: boolean;
    bio: boolean;
    location: boolean;
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const userId = await getOrCreateAnonymousUser();

      await createConsents({
        userId,
        audioConsent: consents.audio,
        bioConsent: consents.bio,
        locationConsent: consents.location,
        userAgent: navigator.userAgent,
      });

      const session = await createProfilingSession({
        userId,
        locale: language,
        metadata: {
          consentsGiven: consents,
        },
      });

      onNavigateToProfile(session.id);
    } catch (err) {
      console.error('Error creating session:', err);
      setError(
        language === 'en'
          ? 'Failed to create session. Please try again.'
          : 'セッションの作成に失敗しました。もう一度お試しください。'
      );
      setIsSubmitting(false);
    }
  };

  if (isConsentPage) {
    return (
      <div className="min-h-screen bg-black text-white">
        <button
          onClick={onBack}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-light">
            {language === 'en' ? 'Back' : '戻る'}
          </span>
        </button>

        <div className="max-w-4xl mx-auto px-6 py-32">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight">
                {language === 'en' ? 'Consent & Privacy' : '同意とプライバシー'}
              </h1>
              <p className="text-gray-400 text-lg">
                {language === 'en'
                  ? 'Please review and grant permissions to continue'
                  : '続行するには権限を確認して付与してください'}
              </p>
            </div>

            <RIJLegalBanner />

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-100 text-sm">
                {error}
              </div>
            )}

            <ConsentForm onSubmit={handleConsentSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <button
        onClick={onBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-light">
          {language === 'en' ? 'Back to Home' : 'ホームに戻る'}
        </span>
      </button>

      <div className="max-w-6xl mx-auto px-6 py-32">
        <div className="space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600">
              <Sparkles className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-light tracking-tight">
                {language === 'en' ? 'RIJ Voice Profiling' : 'RIJ 音声プロファイリング'}
              </h1>
              <p className="text-xl text-emerald-400 font-light tracking-wide">
                {language === 'en'
                  ? 'Your Personalized Wellness Journey Starts Here'
                  : 'あなた専用のウェルネスジャーニーがここから始まります'}
              </p>
            </div>
          </div>

          <RIJLegalBanner />

          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-light text-center">
                {language === 'en' ? 'What is RIJ?' : 'RIJとは？'}
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  {language === 'en'
                    ? 'RIJ (Reborn In Japan) Voice Profiling is an intelligent wellness planning system that creates personalized itineraries based on your unique needs and preferences.'
                    : 'RIJ（Reborn In Japan）音声プロファイリングは、あなた独自のニーズと好みに基づいてパーソナライズされた旅程を作成するインテリジェントなウェルネス計画システムです。'}
                </p>
                <p>
                  {language === 'en'
                    ? 'Through a conversational profiling session, we learn about your current state, physical needs, social preferences, and wellness goals. Using this information, we generate a custom 3-day wellness journey featuring experiences from our seven wellness pillars.'
                    : '会話形式のプロファイリングセッションを通じて、現在の状態、身体的ニーズ、社会的好み、ウェルネス目標について学びます。この情報を使用して、7つのウェルネスピラーからの体験を特徴とする、カスタマイズされた3日間のウェルネスジャーニーを生成します。'}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-light mb-2">
                  {language === 'en' ? 'Voice or Text' : '音声またはテキスト'}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {language === 'en'
                    ? 'Share your wellness needs through natural conversation, either by voice or text.'
                    : '音声またはテキストを使用して、自然な会話を通じてウェルネスニーズを共有します。'}
                </p>
              </div>

              <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-lg font-light mb-2">
                  {language === 'en' ? 'AI-Powered' : 'AI搭載'}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {language === 'en'
                    ? 'Our intelligent system understands your needs and creates optimal wellness experiences.'
                    : 'インテリジェントシステムがあなたのニーズを理解し、最適なウェルネス体験を創出します。'}
                </p>
              </div>

              <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-light mb-2">
                  {language === 'en' ? 'Private & Secure' : 'プライベート＆セキュア'}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {language === 'en'
                    ? 'Your wellness data is encrypted and used only to create your personalized itinerary.'
                    : 'ウェルネスデータは暗号化され、パーソナライズされた旅程の作成にのみ使用されます。'}
                </p>
              </div>

              <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-light mb-2">
                  {language === 'en' ? 'Comfort-Focused' : '快適さ重視'}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {language === 'en'
                    ? 'We prioritize your comfort and well-being, not medical treatment or diagnosis.'
                    : '医療や診断ではなく、あなたの快適さと幸福を優先します。'}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-xl p-8 space-y-6">
              <h3 className="text-2xl font-light text-center">
                {language === 'en' ? 'The Process' : 'プロセス'}
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-light mb-1">
                      {language === 'en'
                        ? 'Profiling Session (10-15 min)'
                        : 'プロファイリングセッション（10-15分）'}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {language === 'en'
                        ? 'Answer questions about your emotional state, physical needs, social preferences, and wellness goals.'
                        : '感情状態、身体的ニーズ、社会的好み、ウェルネス目標についての質問に答えます。'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-light mb-1">
                      {language === 'en'
                        ? 'Itinerary Generation'
                        : '旅程生成'}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {language === 'en'
                        ? 'Our system creates a personalized 3-day wellness itinerary tailored to your profile.'
                        : 'システムがあなたのプロファイルに合わせたパーソナライズされた3日間のウェルネス旅程を作成します。'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-light mb-1">
                      {language === 'en'
                        ? 'Review & Refine'
                        : 'レビュー＆調整'}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {language === 'en'
                        ? 'Review your itinerary, make adjustments, and prepare for your wellness journey.'
                        : '旅程を確認し、調整を行い、ウェルネスジャーニーの準備をします。'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-6">
              <button
                onClick={onNavigateToConsent}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-full text-white text-lg font-light tracking-wide shadow-xl hover:shadow-emerald-500/50 transition-all"
              >
                <Mic className="w-5 h-5" />
                <span>
                  {language === 'en'
                    ? 'Start Voice Profiling'
                    : '音声プロファイリングを開始'}
                </span>
              </button>
              <p className="text-xs text-gray-500">
                {language === 'en'
                  ? '~10-15 minutes · Voice or text · Private & secure'
                  : '約10-15分 · 音声またはテキスト · プライベート＆セキュア'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
