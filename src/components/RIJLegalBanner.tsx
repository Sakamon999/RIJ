import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function RIJLegalBanner() {
  const { language } = useLanguage();

  const message =
    language === 'ja'
      ? 'RIJは医療サービスを提供するものではなく、医学的アドバイス、診断、治療の代わりにはなりません。健康上の懸念がある場合は、資格のある医療専門家にご相談ください。快適さとウェルネスに焦点を当てた旅行計画をお手伝いします。'
      : 'RIJ is not a medical service and does not provide medical advice, diagnosis, or treatment. If you have health concerns, please consult with a qualified healthcare professional. We focus on comfort-oriented travel planning for wellness experiences.';

  return (
    <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-100 leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
}
