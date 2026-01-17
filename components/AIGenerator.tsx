
import React, { useState } from 'react';
import { Sparkles, Loader2, Wand2, X } from 'lucide-react';
import { generateFlashcards } from '../services/geminiService';
import { Flashcard } from '../types';

interface AIGeneratorProps {
  onGenerated: (cards: Partial<Flashcard>[]) => void;
  onCancel: () => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({ onGenerated, onCancel }) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or subject.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cards = await generateFlashcards(topic, count);
      if (cards.length > 0) {
        onGenerated(cards);
      } else {
        setError('Gemini couldn\'t generate cards for that topic. Try being more specific.');
      }
    } catch (err) {
      setError('Something went wrong. Please check your API key and connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-100">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white relative">
        <div className="absolute top-4 right-4">
          <button 
            onClick={onCancel}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
          <Sparkles className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Gemini AI Generator</h2>
        <p className="text-indigo-100/80">Tell Gemini what you're studying, and it will instantly create high-quality flashcards for you.</p>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            What are you studying?
          </label>
          <input
            type="text"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-300"
            placeholder="e.g. Molecular Biology, WWII, JavaScript Promises..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
            Number of Cards
          </label>
          <div className="flex gap-2">
            {[3, 5, 10].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                disabled={loading}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  count === n 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-start gap-3">
            <X size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-200 disabled:shadow-none transition-all flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating Magic...
            </>
          ) : (
            <>
              <Wand2 size={20} className="group-hover:scale-110 transition-transform" />
              Generate Flashcards
            </>
          )}
        </button>
      </div>
      
      <div className="px-8 pb-8 text-center">
        <p className="text-[10px] text-slate-400 leading-relaxed italic">
          AI-generated content can occasionally be inaccurate. Always verify your study materials.
        </p>
      </div>
    </div>
  );
};
