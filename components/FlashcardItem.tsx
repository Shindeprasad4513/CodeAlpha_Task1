
import React, { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardItemProps {
  card: Flashcard;
}

export const FlashcardItem: React.FC<FlashcardItemProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div 
      className="perspective-1000 w-full h-80 sm:h-96 cursor-pointer group"
      onClick={handleFlip}
    >
      <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center p-8 text-center">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
            Question
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed max-w-sm">
            {card.question}
          </h2>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
            <RefreshCcw size={16} className="animate-spin-slow" />
            <span className="text-xs font-semibold">Tap to show answer</span>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-[2.5rem] shadow-xl shadow-indigo-300 flex flex-col items-center justify-center p-8 text-center text-white">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
            Answer
          </div>
          <div className="overflow-y-auto max-h-[80%] custom-scrollbar">
            <p className="text-lg sm:text-xl font-medium leading-relaxed">
              {card.answer}
            </p>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/50 group-hover:text-white transition-colors">
            <RefreshCcw size={16} />
            <span className="text-xs font-semibold">Tap to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
};
