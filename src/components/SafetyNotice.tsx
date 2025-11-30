import { AlertTriangle, Phone, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SafetyNoticeProps {
  flags: string[];
  emergencyMessage?: string;
}

export default function SafetyNotice({ flags, emergencyMessage }: SafetyNoticeProps) {
  const { language } = useLanguage();

  if (!flags || flags.includes('none') || flags.length === 0) {
    return null;
  }

  const isSelfHarm = flags.includes('self_harm_or_imminent_danger');
  const isMedical = flags.includes('medical_request');

  if (isSelfHarm && emergencyMessage) {
    return (
      <div className="p-6 bg-red-900/30 border-2 border-red-500/50 rounded-xl space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-light text-red-100">
              {language === 'en'
                ? 'Your Safety is Important'
                : 'あなたの安全が重要です'}
            </h3>
            <p className="text-sm text-red-100 leading-relaxed whitespace-pre-wrap">
              {emergencyMessage}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="tel:0570-783-556"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full text-white text-sm font-light transition-colors"
          >
            <Phone className="w-4 h-4" />
            {language === 'en' ? 'Call Help Now' : '今すぐ電話'}
          </a>
          <a
            href="https://www.iasp.info/resources/Crisis_Centres/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-light transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {language === 'en' ? 'Crisis Resources' : '危機対応リソース'}
          </a>
        </div>
      </div>
    );
  }

  if (isMedical) {
    return (
      <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-100 leading-relaxed">
            {language === 'en'
              ? 'Please note: RIJ is not a medical service. For health concerns, consult qualified healthcare professionals. We focus on comfort-oriented travel planning.'
              : '注意：RIJは医療サービスではありません。健康上の懸念については、資格のある医療専門家にご相談ください。快適さ重視の旅行計画に焦点を当てています。'}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
