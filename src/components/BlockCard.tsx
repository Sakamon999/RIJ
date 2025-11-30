import { useState } from 'react';
import { Clock, Info, Pin, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BlockCardProps {
  block: {
    id: string;
    title: string;
    pillar: string;
    intent: string;
    intensity: 'light' | 'medium' | 'deep';
    duration: number;
    timeSlot: string;
    planB?: string;
  };
  isPinned: boolean;
  onTogglePin: () => void;
}

export default function BlockCard({ block, isPinned, onTogglePin }: BlockCardProps) {
  const { language } = useLanguage();
  const [showPlanB, setShowPlanB] = useState(false);

  const pillarColors: Record<string, string> = {
    Toji: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    Zen: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
    Shinrinyoku: 'bg-green-500/20 border-green-500/30 text-green-400',
    Shokuyojo: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
    Matsuri: 'bg-pink-500/20 border-pink-500/30 text-pink-400',
    default: 'bg-gray-500/20 border-gray-500/30 text-gray-400',
  };

  const intensityColors: Record<string, string> = {
    light: 'text-emerald-400',
    medium: 'text-yellow-400',
    deep: 'text-red-400',
  };

  const pillarColor = pillarColors[block.pillar] || pillarColors.default;

  return (
    <div className={`p-6 rounded-xl border transition-all ${isPinned ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-light border ${pillarColor}`}>
              {block.pillar}
            </span>
            <span className={`text-xs ${intensityColors[block.intensity]}`}>
              {block.intensity.charAt(0).toUpperCase() + block.intensity.slice(1)}
            </span>
            {isPinned && (
              <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-400">
                {language === 'en' ? 'Pinned' : '固定'}
              </span>
            )}
          </div>

          <h3 className="text-lg font-light text-white">{block.title}</h3>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{block.timeSlot}</span>
            </div>
            <span>•</span>
            <span>
              {block.duration} {language === 'en' ? 'hrs' : '時間'}
            </span>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-300">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
            <p className="leading-relaxed">{block.intent}</p>
          </div>

          {block.planB && (
            <button
              onClick={() => setShowPlanB(!showPlanB)}
              className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {showPlanB ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  {language === 'en' ? 'Hide Plan B' : 'プランBを隠す'}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  {language === 'en' ? 'Show Plan B' : 'プランBを表示'}
                </>
              )}
            </button>
          )}

          {showPlanB && block.planB && (
            <div className="p-4 bg-black/30 border border-white/10 rounded-lg">
              <p className="text-sm text-gray-300 leading-relaxed">{block.planB}</p>
            </div>
          )}
        </div>

        <button
          onClick={onTogglePin}
          className={`flex-shrink-0 p-2 rounded-lg transition-all ${
            isPinned
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
          title={language === 'en' ? 'Pin this activity' : 'このアクティビティを固定'}
        >
          <Pin className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
