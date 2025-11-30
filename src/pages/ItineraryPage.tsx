import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Play, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getItinerary, startTrip, getOrCreateAnonymousUser } from '../lib/supabase/rij';
import BlockCard from '../components/BlockCard';

interface ItineraryPageProps {
  itineraryId: string;
  onBack: () => void;
  onRevise: (itineraryId: string) => void;
  onStartTrip: (tripSessionId: string) => void;
}

export default function ItineraryPage({ itineraryId, onBack, onRevise, onStartTrip }: ItineraryPageProps) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<any>(null);
  const [pinnedBlocks, setPinnedBlocks] = useState<Set<string>>(new Set());

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

  const handleStartTrip = async () => {
    setStarting(true);
    try {
      const userId = await getOrCreateAnonymousUser();
      const trip = await startTrip({
        userId,
        itineraryId,
        metadata: {
          pinnedBlocks: Array.from(pinnedBlocks),
        },
      });
      onStartTrip(trip.id);
    } catch (err) {
      console.error('Error starting trip:', err);
      setError(
        language === 'en'
          ? 'Failed to start trip'
          : '旅行の開始に失敗しました'
      );
      setStarting(false);
    }
  };

  const togglePin = (blockId: string) => {
    setPinnedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-gray-400">
            {language === 'en' ? 'Loading itinerary...' : '旅程を読み込み中...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
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

  const metadata = itinerary.metadata || {};
  const days = metadata.days || [];
  const pillarWeights = metadata.pillarWeights || {};
  const narrative = metadata.overallNarrative || {};

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-light">{language === 'en' ? 'Back' : '戻る'}</span>
          </button>

          <button
            onClick={() => onRevise(itineraryId)}
            disabled={starting}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all disabled:opacity-50"
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm font-light">{language === 'en' ? 'Revise' : '修正'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12 space-y-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-light">{itinerary.title}</h1>
            <p className="text-lg text-gray-400">{itinerary.description}</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-xl">
                <div className="text-3xl font-light text-emerald-400 mb-2">Reset</div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {narrative.reset || (language === 'en' ? 'Release stress and restore balance' : 'ストレスを解放しバランスを回復')}
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-teal-900/30 to-cyan-900/30 border border-teal-500/30 rounded-xl">
                <div className="text-3xl font-light text-teal-400 mb-2">Reconnect</div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {narrative.reconnect || (language === 'en' ? 'Find harmony with nature and self' : '自然と自己との調和を見つける')}
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl">
                <div className="text-3xl font-light text-cyan-400 mb-2">Reborn</div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {narrative.reborn || (language === 'en' ? 'Emerge renewed and empowered' : '新しく力強く生まれ変わる')}
                </p>
              </div>
            </div>

            {Object.keys(pillarWeights).length > 0 && (
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-lg font-light text-emerald-400 mb-4">
                  {language === 'en' ? 'Wellness Focus' : 'ウェルネスフォーカス'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(pillarWeights)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([pillar, weight]) => (
                      <div
                        key={pillar}
                        className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full"
                      >
                        <span className="text-sm text-white">{pillar}</span>
                        <span className="text-xs text-gray-500">
                          {Math.round((weight as number) * 100)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {days.map((day: any, dayIndex: number) => (
          <div key={dayIndex} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-light text-lg">
                {dayIndex + 1}
              </div>
              <div>
                <h2 className="text-2xl font-light">
                  {language === 'en' ? `Day ${dayIndex + 1}` : `${dayIndex + 1}日目`}
                </h2>
                <p className="text-sm text-gray-400">{day.theme || ''}</p>
              </div>
            </div>

            <div className="space-y-4">
              {day.blocks?.map((block: any) => (
                <BlockCard
                  key={block.id}
                  block={block}
                  isPinned={pinnedBlocks.has(block.id)}
                  onTogglePin={() => togglePin(block.id)}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="sticky bottom-6 left-0 right-0 flex justify-center">
          <button
            onClick={handleStartTrip}
            disabled={starting}
            className={`px-8 py-4 rounded-full font-light tracking-wide transition-all flex items-center gap-3 text-lg shadow-2xl ${
              starting
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white hover:shadow-emerald-500/50'
            }`}
          >
            {starting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {language === 'en' ? 'Starting Trip...' : '旅行を開始中...'}
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {language === 'en' ? 'Start My Wellness Journey' : 'ウェルネスジャーニーを開始'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
