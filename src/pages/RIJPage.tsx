import { ArrowLeft, Sparkles, Target, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SupabaseHealthCheck from '../components/SupabaseHealthCheck';

interface RIJPageProps {
  onBack: () => void;
}

export default function RIJPage({ onBack }: RIJPageProps) {
  const { language } = useLanguage();

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
        <div className="text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight">
              {language === 'en' ? 'RIJ MVP' : 'RIJ MVP'}
            </h1>
            <p className="text-xl text-emerald-400 font-light tracking-wide">
              {language === 'en' ? 'Coming Online Soon' : 'まもなく公開'}
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6 text-gray-300">
            <p className="text-lg leading-relaxed">
              {language === 'en'
                ? 'The Reborn In Japan Minimum Viable Product is being integrated into your wellness journey.'
                : 'Reborn In Japan ミニマルバイアブルプロダクトは、あなたのウェルネスジャーニーに統合されています。'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/50 transition-all">
              <Target className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-light mb-2">
                {language === 'en' ? 'Personalized Journeys' : 'パーソナライズされた旅'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'en'
                  ? 'Custom wellness paths tailored to your goals'
                  : 'あなたの目標に合わせたカスタムウェルネスパス'}
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/50 transition-all">
              <Users className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-light mb-2">
                {language === 'en' ? 'Expert Guidance' : '専門家のガイダンス'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'en'
                  ? 'Connect with verified wellness practitioners'
                  : '認定されたウェルネス実践者とつながる'}
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/50 transition-all">
              <TrendingUp className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-light mb-2">
                {language === 'en' ? 'Track Progress' : '進捗を追跡'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'en'
                  ? 'Monitor your wellness transformation journey'
                  : 'ウェルネス変革の旅を監視する'}
              </p>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-white/10 space-y-8">
            <div>
              <h3 className="text-lg font-light text-gray-300 mb-4">
                {language === 'en' ? 'System Status' : 'システムステータス'}
              </h3>
              <SupabaseHealthCheck />
            </div>

            <p className="text-sm text-gray-500">
              {language === 'en'
                ? 'RIJ MVP features will be activated in upcoming releases'
                : 'RIJ MVP機能は今後のリリースで有効化されます'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
