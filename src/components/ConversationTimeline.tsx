import { Bot, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Turn {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  inputMode: 'text' | 'voice' | 'system';
  createdAt: string;
}

interface ConversationTimelineProps {
  turns: Turn[];
}

export default function ConversationTimeline({ turns }: ConversationTimelineProps) {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      {turns.map((turn) => {
        const isUser = turn.role === 'user';
        const isSystem = turn.role === 'system';

        if (isSystem) {
          return (
            <div key={turn.id} className="flex justify-center">
              <div className="px-4 py-2 bg-white/5 rounded-full text-xs text-gray-500">
                {turn.content}
              </div>
            </div>
          );
        }

        return (
          <div
            key={turn.id}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isUser
                  ? 'bg-teal-500/20'
                  : 'bg-emerald-500/20'
              }`}
            >
              {isUser ? (
                <User className="w-5 h-5 text-teal-400" />
              ) : (
                <Bot className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            <div
              className={`flex-1 max-w-lg ${
                isUser ? 'items-end' : 'items-start'
              } flex flex-col`}
            >
              <div
                className={`px-4 py-3 rounded-2xl ${
                  isUser
                    ? 'bg-teal-600/30 border border-teal-500/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">
                  {turn.content}
                </p>
                {isUser && turn.inputMode === 'voice' && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-teal-400">
                    <div className="w-1 h-1 rounded-full bg-teal-400 animate-pulse" />
                    {language === 'en' ? 'Voice' : '音声'}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1 px-1">
                {new Date(turn.createdAt).toLocaleTimeString(
                  language === 'en' ? 'en-US' : 'ja-JP',
                  { hour: '2-digit', minute: '2-digit' }
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
