import { useState } from 'react';
import { Check, Edit2, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TranscriptEditorProps {
  transcript: string;
  onConfirm: (text: string) => void;
  onCancel: () => void;
}

export default function TranscriptEditor({ transcript, onConfirm, onCancel }: TranscriptEditorProps) {
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(transcript);

  const handleConfirm = () => {
    if (isEditing) {
      setIsEditing(false);
    }
    onConfirm(editedText);
  };

  const handleCancel = () => {
    if (isEditing) {
      setEditedText(transcript);
      setIsEditing(false);
    } else {
      onCancel();
    }
  };

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-light text-gray-400">
          {language === 'en' ? 'Your response:' : 'あなたの応答:'}
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Edit2 className="w-3 h-3" />
          {isEditing
            ? language === 'en'
              ? 'Cancel edit'
              : '編集キャンセル'
            : language === 'en'
            ? 'Edit'
            : '編集'}
        </button>
      </div>

      {isEditing ? (
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          rows={4}
          placeholder={
            language === 'en'
              ? 'Edit your response...'
              : '応答を編集...'
          }
        />
      ) : (
        <p className="text-white leading-relaxed whitespace-pre-wrap">
          {editedText}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleCancel}
          className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-sm font-light transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          {language === 'en' ? 'Cancel' : 'キャンセル'}
        </button>
        <button
          onClick={handleConfirm}
          disabled={!editedText.trim()}
          className={`flex-1 px-4 py-2 rounded-full text-sm font-light transition-colors flex items-center justify-center gap-2 ${
            editedText.trim()
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Check className="w-4 h-4" />
          {language === 'en' ? 'Confirm & Continue' : '確認して続行'}
        </button>
      </div>
    </div>
  );
}
