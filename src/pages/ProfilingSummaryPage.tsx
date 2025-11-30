import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getUserSession, completeProfilingSession, createItinerary } from '../lib/supabase/rij';
import { createItineraryEngine } from '../lib/rij';

interface ProfilingSummaryPageProps {
  sessionId: string;
  onBack: () => void;
  onViewItinerary: (itineraryId: string) => void;
}

export default function ProfilingSummaryPage({ sessionId, onBack, onViewItinerary }: ProfilingSummaryPageProps) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [allergyConfirmed, setAllergyConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasAllergies = session?.metadata?.extractedData?.dietaryRestrictions?.length > 0;

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const sessionData = await getUserSession(sessionId);
      setSession(sessionData);
    } catch (err) {
      console.error('Error loading session:', err);
      setError(language === 'en' ? 'Failed to load session' : 'セッションの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateItinerary = async () => {
    if (hasAllergies && !allergyConfirmed) {
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      await completeProfilingSession(sessionId);

      const engine = createItineraryEngine();
      const itinerary = engine.generate({
        profileData: session.metadata?.extractedData || {},
        locale: session.metadata?.locale || language,
        targetDays: 3,
      });

      const createdItinerary = await createItinerary({
        userId: session.user_id,
        profileId: sessionId,
        title: itinerary.title,
        description: itinerary.description,
        totalDays: itinerary.totalDays,
        metadata: {
          pillarWeights: itinerary.pillarWeights,
          intensityCurve: itinerary.intensityCurve,
          overallNarrative: itinerary.overallNarrative,
          days: itinerary.days,
        },
      });

      setTimeout(() => onViewItinerary(createdItinerary.id), 1000);
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(
        language === 'en'
          ? 'Failed to generate itinerary. Please try again.'
          : '旅程の生成に失敗しました。もう一度お試しください。'
      );
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  const extractedData = session?.metadata?.extractedData || {};
  const preferredPillars = extractedData.preferredPillars || [];
  const intensity = extractedData.intensity || 'medium';
  const companionCount = extractedData.companionCount || 1;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-light">{language === 'en' ? 'Back' : '戻る'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-light">
            {language === 'en' ? 'Your Wellness Profile' : 'あなたのウェルネスプロファイル'}
          </h1>
          <p className="text-gray-400">
            {language === 'en'
              ? 'Review your profile before we generate your personalized itinerary'
              : 'パーソナライズされた旅程を生成する前にプロファイルを確認してください'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-100 text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
            <h3 className="text-lg font-light text-emerald-400">
              {language === 'en' ? 'Wellness Focus' : 'ウェルネスフォーカス'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {preferredPillars.length > 0 ? (
                preferredPillars.map((pillar: string) => (
                  <span
                    key={pillar}
                    className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-sm text-emerald-400"
                  >
                    {pillar}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  {language === 'en' ? 'Balanced mix' : 'バランスの取れたミックス'}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
            <h3 className="text-lg font-light text-emerald-400">
              {language === 'en' ? 'Journey Style' : '旅のスタイル'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">{language === 'en' ? 'Intensity' : '強度'}</span>
                <span className="text-white capitalize">{intensity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{language === 'en' ? 'Travelers' : '旅行者'}</span>
                <span className="text-white">{companionCount}</span>
              </div>
            </div>
          </div>
        </div>

        {hasAllergies && (
          <div className="p-6 bg-amber-900/20 border border-amber-500/30 rounded-xl space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-light text-amber-100">
                  {language === 'en' ? 'Important: Dietary Restrictions' : '重要：食事制限'}
                </h3>
                <p className="text-sm text-amber-100 leading-relaxed">
                  {language === 'en'
                    ? 'You mentioned dietary restrictions. While we\'ll note these in your itinerary, please always verify with restaurants and venues about allergens and ingredients to ensure your safety.'
                    : '食事制限について言及されました。旅程に記載しますが、安全を確保するため、レストランや施設でアレルゲンや材料について必ず確認してください。'}
                </p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allergyConfirmed}
                    onChange={(e) => setAllergyConfirmed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-amber-500 bg-amber-900/30 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-amber-100">
                    {language === 'en'
                      ? 'I understand and will verify dietary requirements at each venue'
                      : '理解し、各施設で食事要件を確認します'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerateItinerary}
          disabled={generating || (hasAllergies && !allergyConfirmed)}
          className={`w-full px-8 py-4 rounded-full font-light tracking-wide transition-all flex items-center justify-center gap-3 text-lg ${
            generating || (hasAllergies && !allergyConfirmed)
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl hover:shadow-emerald-500/50'
          }`}
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {language === 'en' ? 'Generating Your Itinerary...' : '旅程を生成中...'}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              {language === 'en' ? 'Confirm & Generate Itinerary' : '確認して旅程を生成'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
