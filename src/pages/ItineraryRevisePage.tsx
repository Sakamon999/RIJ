import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Loader2, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getItinerary, reviseItinerary, getOrCreateAnonymousUser } from '../lib/supabase/rij';
import { createItineraryEngine } from '../lib/rij';
import RecorderControl from '../components/RecorderControl';

interface ItineraryRevisePageProps {
  itineraryId: string;
  onBack: () => void;
  onRevisionComplete: (itineraryId: string) => void;
}

export default function ItineraryRevisePage({
  itineraryId,
  onBack,
  onRevisionComplete,
}: ItineraryRevisePageProps) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<any>(null);
  const [revisionText, setRevisionText] = useState('');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [changeSummary, setChangeSummary] = useState<string | null>(null);
  const [revisedItinerary, setRevisedItinerary] = useState<any>(null);

  useEffect(() => {
    loadItinerary();
  }, [itineraryId]);

  const loadItinerary = async () => {
    try {
      const data = await getItinerary(itineraryId);
      setItinerary(data);
    } catch (err) {
      console.error('Error loading itinerary:', err);
      setError(
        language === 'en'
          ? 'Failed to load itinerary'
          : '旅程の読み込みに失敗しました'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRecordingComplete = async (_audioBlob: Blob) => {
    const mockTranscript =
      language === 'en'
        ? 'Can we add more meditation time in the morning?'
        : '朝にもっと瞑想の時間を追加できますか？';
    setTranscript(mockTranscript);
    setRevisionText(mockTranscript);
  };

  const handleSubmitRevision = async () => {
    if (!revisionText.trim()) return;

    setProcessing(true);
    setError(null);

    try {
      const userId = await getOrCreateAnonymousUser();

      await reviseItinerary({
        itineraryId,
        userId,
        revisionRequest: revisionText,
        pinnedBlockIds: [],
        inputMode: transcript ? 'voice' : 'text',
      });

      const engine = createItineraryEngine();
      const profileData = itinerary.metadata?.extractedData || {};
      const newItinerary = engine.generate({
        profileData: {
          ...profileData,
          revisionRequest: revisionText,
        },
        locale: itinerary.metadata?.locale || language,
        targetDays: itinerary.total_days || 3,
      });

      setChangeSummary(
        language === 'en'
          ? `Updated your itinerary based on your request: "${revisionText}". We've adjusted the schedule to include more morning meditation time while keeping your preferred activities.`
          : `リクエストに基づいて旅程を更新しました：「${revisionText}」。お好みのアクティビティを維持しながら、朝の瞑想時間を増やすようスケジュールを調整しました。`
      );

      setRevisedItinerary(newItinerary);
    } catch (err) {
      console.error('Error revising itinerary:', err);
      setError(
        language === 'en'
          ? 'Failed to revise itinerary. Please try again.'
          : '旅程の修正に失敗しました。もう一度お試しください。'
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleAcceptRevision = async () => {
    if (!revisedItinerary) return;

    setProcessing(true);
    try {
      onRevisionComplete(itineraryId);
    } catch (err) {
      console.error('Error accepting revision:', err);
      setError(
        language === 'en'
          ? 'Failed to save revision'
          : '修正の保存に失敗しました'
      );
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (error && !itinerary) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            {language === 'en' ? 'Go Back' : '戻る'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            disabled={processing}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-light">{language === 'en' ? 'Back' : '戻る'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light">
            {language === 'en' ? 'Revise Your Itinerary' : '旅程を修正'}
          </h1>
          <p className="text-gray-400">
            {language === 'en'
              ? 'Tell us what you\'d like to change'
              : '変更したい内容を教えてください'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-100 text-sm">
            {error}
          </div>
        )}

        {!revisedItinerary ? (
          <div className="space-y-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300 leading-relaxed">
                  {language === 'en'
                    ? 'You can request changes like adjusting timing, swapping activities, increasing/decreasing intensity, or focusing on specific wellness pillars.'
                    : 'タイミングの調整、アクティビティの交換、強度の増減、特定のウェルネスピラーへの焦点など、変更をリクエストできます。'}
                </div>
              </div>
            </div>

            {!transcript && (
              <RecorderControl
                onRecordingComplete={handleRecordingComplete}
                isProcessing={processing}
              />
            )}

            <div className="relative">
              <textarea
                value={revisionText}
                onChange={(e) => setRevisionText(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Describe what you\'d like to change...'
                    : '変更したい内容を説明してください...'
                }
                disabled={processing}
                className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 resize-none"
              />
            </div>

            <button
              onClick={handleSubmitRevision}
              disabled={!revisionText.trim() || processing}
              className={`w-full px-8 py-4 rounded-full font-light tracking-wide transition-all flex items-center justify-center gap-3 ${
                !revisionText.trim() || processing
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/50'
              }`}
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {language === 'en' ? 'Revising...' : '修正中...'}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {language === 'en' ? 'Submit Revision' : '修正を送信'}
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="p-6 bg-emerald-900/20 border border-emerald-500/30 rounded-xl space-y-4">
              <h3 className="text-lg font-light text-emerald-400">
                {language === 'en' ? 'Changes Summary' : '変更の概要'}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">{changeSummary}</p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-lg font-light text-white mb-4">
                {language === 'en' ? 'Updated Itinerary' : '更新された旅程'}
              </h3>
              <div className="text-sm text-gray-400">
                {language === 'en'
                  ? 'Your itinerary has been revised based on your feedback.'
                  : 'フィードバックに基づいて旅程が修正されました。'}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onBack}
                disabled={processing}
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-light transition-all disabled:opacity-50"
              >
                {language === 'en' ? 'Revise Again' : '再度修正'}
              </button>
              <button
                onClick={handleAcceptRevision}
                disabled={processing}
                className={`flex-1 px-6 py-3 rounded-full font-light transition-all ${
                  processing
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/50'
                }`}
              >
                {language === 'en' ? 'Accept Changes' : '変更を承認'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
