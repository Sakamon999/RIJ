import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { createOrchestrator } from '../lib/rij';
import {
  getUserSession,
  getSessionTurns,
  createProfilingTurn,
  updateSessionMetadata,
} from '../lib/supabase/rij';
import ConversationTimeline from '../components/ConversationTimeline';
import RecorderControl from '../components/RecorderControl';
import TranscriptEditor from '../components/TranscriptEditor';
import PhaseIndicator from '../components/PhaseIndicator';
import SafetyNotice from '../components/SafetyNotice';
import type { SessionContext, ProfilingPhase } from '../lib/rij/types';

interface ProfilingPageProps {
  sessionId: string;
  onBack: () => void;
  onComplete: (sessionId: string) => void;
}

export default function ProfilingPage({ sessionId, onBack, onComplete }: ProfilingPageProps) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionContext, setSessionContext] = useState<SessionContext | null>(null);
  const [currentPhase, setCurrentPhase] = useState<ProfilingPhase>('state');
  const [turns, setTurns] = useState<any[]>([]);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [safetyFlags, setSafetyFlags] = useState<string[]>([]);
  const [emergencyMessage, setEmergencyMessage] = useState<string | undefined>();

  const orchestrator = createOrchestrator();

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const session = await getUserSession(sessionId);
      const existingTurns = await getSessionTurns(sessionId);

      if (existingTurns.length === 0) {
        const initContext = orchestrator.initializeSession(
          session.user_id,
          session.metadata?.locale || language
        );
        setSessionContext(initContext);
        setCurrentPhase(initContext.phase);

        await createProfilingTurn({
          sessionId,
          userId: session.user_id,
          turnNumber: 1,
          role: 'assistant',
          content: initContext.turns[0].content,
          inputMode: 'system',
        });

        setTurns([
          {
            id: crypto.randomUUID(),
            role: initContext.turns[0].role,
            content: initContext.turns[0].content,
            inputMode: initContext.turns[0].inputMode,
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        setTurns(
          existingTurns.map((t) => ({
            id: t.id,
            role: t.role,
            content: t.content,
            inputMode: t.input_mode,
            createdAt: t.created_at,
          }))
        );

        const reconstructedContext: SessionContext = {
          sessionId: session.id,
          userId: session.user_id,
          phase: (session.metadata?.currentPhase as ProfilingPhase) || 'state',
          turns: existingTurns.map((t) => ({
            turnNumber: t.turn_number,
            role: t.role,
            content: t.content,
            inputMode: t.input_mode,
            timestamp: new Date(t.created_at),
          })),
          extractedData: session.metadata?.extractedData || {},
          locale: session.metadata?.locale || language,
        };

        setSessionContext(reconstructedContext);
        setCurrentPhase(reconstructedContext.phase);
      }
    } catch (err) {
      console.error('Error loading session:', err);
      setError(
        language === 'en'
          ? 'Failed to load session'
          : 'セッションの読み込みに失敗しました'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRecordingComplete = async (_audioBlob: Blob) => {
    setProcessing(true);
    try {
      const mockTranscript =
        language === 'en'
          ? 'I want to reduce stress and feel more balanced.'
          : 'ストレスを減らして、よりバランスの取れた気分になりたいです。';

      setTranscript(mockTranscript);
    } catch (err) {
      console.error('Error processing audio:', err);
      setError(
        language === 'en'
          ? 'Failed to process audio'
          : '音声の処理に失敗しました'
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleTranscriptConfirm = async (confirmedText: string) => {
    if (!sessionContext) return;

    setProcessing(true);
    setTranscript(null);

    try {
      const result = await orchestrator.processTurn({
        sessionContext,
        userInput: confirmedText,
        inputMode: 'text',
      });

      if (result.shouldStop) {
        setSafetyFlags(result.updatedContext.extractedData.emotionalState || []);
        setEmergencyMessage(result.assistantResponse);
        return;
      }

      const userTurn = result.updatedContext.turns[result.updatedContext.turns.length - 2];
      const assistantTurn = result.updatedContext.turns[result.updatedContext.turns.length - 1];

      await createProfilingTurn({
        sessionId,
        userId: sessionContext.userId,
        turnNumber: userTurn.turnNumber,
        role: userTurn.role,
        content: userTurn.content,
        inputMode: userTurn.inputMode,
      });

      await createProfilingTurn({
        sessionId,
        userId: sessionContext.userId,
        turnNumber: assistantTurn.turnNumber,
        role: assistantTurn.role,
        content: assistantTurn.content,
        inputMode: assistantTurn.inputMode,
      });

      await updateSessionMetadata(sessionId, {
        ...result.updatedContext.extractedData,
        currentPhase: result.updatedContext.phase,
        extractedData: result.updatedContext.extractedData,
        locale: result.updatedContext.locale,
      });

      setSessionContext(result.updatedContext);
      setCurrentPhase(result.updatedContext.phase);

      setTurns((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: userTurn.role,
          content: userTurn.content,
          inputMode: userTurn.inputMode,
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          role: assistantTurn.role,
          content: assistantTurn.content,
          inputMode: assistantTurn.inputMode,
          createdAt: new Date().toISOString(),
        },
      ]);

      if (result.readyForItinerary) {
        setTimeout(() => onComplete(sessionId), 1000);
      }
    } catch (err) {
      console.error('Error processing turn:', err);
      setError(
        language === 'en'
          ? 'Failed to process response'
          : '応答の処理に失敗しました'
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    setTranscript(textInput);
    setTextInput('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-gray-400">
            {language === 'en' ? 'Loading session...' : 'セッションを読み込み中...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-light">
              {language === 'en' ? 'Back' : '戻る'}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 space-y-8">
        <PhaseIndicator currentPhase={currentPhase} />

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-100 text-sm">
            {error}
          </div>
        )}

        <SafetyNotice flags={safetyFlags} emergencyMessage={emergencyMessage} />

        <ConversationTimeline turns={turns} />

        {transcript ? (
          <TranscriptEditor
            transcript={transcript}
            onConfirm={handleTranscriptConfirm}
            onCancel={() => setTranscript(null)}
          />
        ) : (
          <div className="space-y-4">
            <RecorderControl
              onRecordingComplete={handleRecordingComplete}
              isProcessing={processing}
            />

            <div className="relative">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                placeholder={
                  language === 'en'
                    ? 'Or type your response...'
                    : 'または応答を入力...'
                }
                disabled={processing}
                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim() || processing}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
