import { useLanguage } from '../contexts/LanguageContext';
import type { ProfilingPhase } from '../lib/rij/types';

interface PhaseIndicatorProps {
  currentPhase: ProfilingPhase;
}

const PHASES: ProfilingPhase[] = ['state', 'body', 'social', 'sensory', 'constraints', 'recap', 'done'];

export default function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  const { language } = useLanguage();

  const phaseLabels: Record<ProfilingPhase, { en: string; ja: string }> = {
    state: { en: 'Emotional State', ja: '感情状態' },
    body: { en: 'Physical Needs', ja: '身体的ニーズ' },
    social: { en: 'Social Preferences', ja: '社会的好み' },
    sensory: { en: 'Sensory Preferences', ja: '感覚の好み' },
    constraints: { en: 'Constraints', ja: '制約' },
    recap: { en: 'Summary', ja: '要約' },
    done: { en: 'Complete', ja: '完了' },
  };

  const currentIndex = PHASES.indexOf(currentPhase);
  const progress = ((currentIndex + 1) / PHASES.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          {language === 'en' ? 'Progress' : '進捗'}
        </span>
        <span className="text-emerald-400 font-medium">
          {currentIndex + 1} / {PHASES.length}
        </span>
      </div>

      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center">
        <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
          <span className="text-sm text-emerald-400 font-light">
            {phaseLabels[currentPhase][language]}
          </span>
        </div>
      </div>
    </div>
  );
}
