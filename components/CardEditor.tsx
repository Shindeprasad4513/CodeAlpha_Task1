
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Flashcard, CardFormData } from '../types';

interface CardEditorProps {
  card?: Flashcard | null;
  onSave: (data: CardFormData) => void;
  onClose: () => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({ card, onSave, onClose }) => {
  const [formData, setFormData] = useState<CardFormData>({
    question: '',
    answer: '',
  });

  useEffect(() => {
    if (card) {
      setFormData({
        question: card.question,
        answer: card.answer,
      });
    }
  }, [card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) return;
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">
          {card ? 'Edit Flashcard' : 'Add New Flashcard'}
        </h2>
        <button 
          type="button"
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Front (Question)
          </label>
          <textarea
            required
            autoFocus
            className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-300 resize-none"
            placeholder="What would you like to ask?"
            value={formData.question}
            onChange={e => setFormData({ ...formData, question: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Back (Answer)
          </label>
          <textarea
            required
            className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-300 resize-none"
            placeholder="Write the clear and concise answer here..."
            value={formData.answer}
            onChange={e => setFormData({ ...formData, answer: e.target.value })}
          />
        </div>
      </div>

      <div className="p-6 bg-slate-50 flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 text-slate-600 font-bold hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {card ? 'Update Card' : 'Save Card'}
        </button>
      </div>
    </form>
  );
};
