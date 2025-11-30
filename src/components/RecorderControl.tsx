import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Circle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RecorderControlProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isProcessing: boolean;
}

export default function RecorderControl({ onRecordingComplete, isProcessing }: RecorderControlProps) {
  const { language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [mode, setMode] = useState<'hold' | 'toggle'>('toggle');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermissionDenied(false);

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(blob);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
        }
        animationRef.current = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();

    } catch (err) {
      console.error('Error accessing microphone:', err);
      setPermissionDenied(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsRecording(false);
    setAudioLevel(0);
  };

  const handlePress = () => {
    if (mode === 'hold' && !isRecording) {
      startRecording();
    }
  };

  const handleRelease = () => {
    if (mode === 'hold' && isRecording) {
      stopRecording();
    }
  };

  const handleToggle = () => {
    if (mode === 'toggle') {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (permissionDenied) {
    return (
      <div className="p-6 bg-amber-900/20 border border-amber-500/30 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm text-amber-100 leading-relaxed">
              {language === 'en'
                ? 'Microphone access is required for voice profiling. Please enable it in your browser settings or use text input below.'
                : 'マイクアクセスは音声プロファイリングに必要です。ブラウザ設定で有効にするか、以下のテキスト入力を使用してください。'}
            </p>
            <button
              onClick={() => setPermissionDenied(false)}
              className="text-sm text-amber-400 hover:text-amber-300 underline"
            >
              {language === 'en' ? 'Try Again' : '再試行'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('toggle')}
            className={`px-3 py-1 rounded-full text-xs font-light transition-colors ${
              mode === 'toggle'
                ? 'bg-emerald-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {language === 'en' ? 'Tap' : 'タップ'}
          </button>
          <button
            onClick={() => setMode('hold')}
            className={`px-3 py-1 rounded-full text-xs font-light transition-colors ${
              mode === 'hold'
                ? 'bg-emerald-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {language === 'en' ? 'Hold' : 'ホールド'}
          </button>
        </div>
        {isRecording && (
          <div className="text-sm text-gray-400 font-mono">
            {formatTime(recordingTime)}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={handleToggle}
          onMouseDown={handlePress}
          onMouseUp={handleRelease}
          onMouseLeave={handleRelease}
          onTouchStart={handlePress}
          onTouchEnd={handleRelease}
          disabled={isProcessing}
          className={`w-full relative overflow-hidden rounded-2xl transition-all ${
            isRecording
              ? 'bg-red-500/20 border-2 border-red-500'
              : isProcessing
              ? 'bg-gray-800 border-2 border-gray-700'
              : 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-500/50 hover:from-emerald-500/30 hover:to-teal-600/30'
          } ${isProcessing ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
        >
          <div className="relative z-10 flex flex-col items-center justify-center py-12 space-y-4">
            <div
              className={`relative transition-transform ${
                isRecording ? 'scale-110' : ''
              }`}
            >
              {isRecording ? (
                <Square className="w-12 h-12 text-red-400" />
              ) : isProcessing ? (
                <Circle className="w-12 h-12 text-gray-500 animate-pulse" />
              ) : (
                <Mic className="w-12 h-12 text-emerald-400" />
              )}
            </div>

            <div className="text-center">
              <p className="text-lg font-light text-white">
                {isRecording
                  ? language === 'en'
                    ? mode === 'hold'
                      ? 'Release to stop'
                      : 'Tap to stop'
                    : mode === 'hold'
                    ? '離して停止'
                    : 'タップして停止'
                  : isProcessing
                  ? language === 'en'
                    ? 'Processing...'
                    : '処理中...'
                  : language === 'en'
                  ? mode === 'hold'
                    ? 'Hold to record'
                    : 'Tap to record'
                  : mode === 'hold'
                  ? '押したまま録音'
                  : 'タップして録音'}
              </p>
              {!isRecording && !isProcessing && (
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'en'
                    ? 'Or use text input below'
                    : 'または下記のテキスト入力を使用'}
                </p>
              )}
            </div>
          </div>

          {isRecording && (
            <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-1 px-4 pb-4">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-red-400 rounded-t transition-all duration-100"
                  style={{
                    height: `${Math.max(4, audioLevel * 100 * (0.5 + Math.random() * 0.5))}%`,
                  }}
                />
              ))}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
