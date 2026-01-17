
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Layout, BookOpen, Sparkles, Trash2, Edit3, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Flashcard, ViewMode, CardFormData } from './types';
import { FlashcardItem } from './components/FlashcardItem';
import { CardEditor } from './components/CardEditor';
import { AIGenerator } from './components/AIGenerator';

const INITIAL_CARDS: Flashcard[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    createdAt: Date.now(),
  },
  {
    id: '2',
    question: 'What is React?',
    answer: 'A JavaScript library for building user interfaces.',
    createdAt: Date.now(),
  },
  {
    id: '3',
    question: 'Define "Closure" in JavaScript.',
    answer: 'A function that remembers its outer variables even after the outer function has finished executing.',
    createdAt: Date.now(),
  }
];

export default function App() {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('gemini-flashcards');
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('study');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  useEffect(() => {
    localStorage.setItem('gemini-flashcards', JSON.stringify(cards));
  }, [cards]);

  const handleAddCard = (data: CardFormData) => {
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: Date.now(),
    };
    setCards(prev => [newCard, ...prev]);
    setIsEditorOpen(false);
  };

  const handleEditCard = (data: CardFormData) => {
    if (!editingCard) return;
    setCards(prev => prev.map(c => c.id === editingCard.id ? { ...c, ...data } : c));
    setEditingCard(null);
    setIsEditorOpen(false);
  };

  const handleDeleteCard = (id: string) => {
    setCards(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (currentIndex >= filtered.length && filtered.length > 0) {
        setCurrentIndex(filtered.length - 1);
      }
      return filtered;
    });
  };

  const handleAddGeneratedCards = (newCards: Partial<Flashcard>[]) => {
    const cardsToAdd: Flashcard[] = newCards.map(c => ({
      id: crypto.randomUUID(),
      question: c.question || '',
      answer: c.answer || '',
      createdAt: Date.now(),
    }));
    setCards(prev => [...cardsToAdd, ...prev]);
    setViewMode('study');
    setCurrentIndex(0);
  };

  const nextCard = () => {
    setCurrentIndex(prev => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <BookOpen size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">Gemini Flash</h1>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => setViewMode('study')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${viewMode === 'study' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Layout size={18} />
              <span className="hidden xs:inline">Study</span>
            </button>
            <button 
              onClick={() => setViewMode('manage')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${viewMode === 'manage' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Edit3 size={18} />
              <span className="hidden xs:inline">Manage</span>
            </button>
            <button 
              onClick={() => setViewMode('generate')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${viewMode === 'generate' ? 'bg-purple-50 text-purple-700' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Sparkles size={18} />
              <span className="hidden xs:inline">AI Magic</span>
            </button>
          </nav>

          <button 
            onClick={() => {
              setEditingCard(null);
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            <Plus size={18} />
            <span className="hidden xs:inline">New Card</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {viewMode === 'study' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            {cards.length > 0 ? (
              <div className="w-full max-w-xl space-y-8">
                <div className="text-center mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Card {currentIndex + 1} of {cards.length}
                  </span>
                </div>
                
                <FlashcardItem card={cards[currentIndex]} />
                
                <div className="flex items-center justify-between gap-4 mt-8">
                  <button 
                    onClick={prevCard}
                    className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-indigo-200 transition-all group"
                  >
                    <ChevronLeft className="text-slate-500 group-hover:text-indigo-600" />
                  </button>
                  
                  <div className="flex-1 flex gap-4">
                    <button 
                      onClick={() => {
                        setEditingCard(cards[currentIndex]);
                        setIsEditorOpen(true);
                      }}
                      className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-medium hover:border-indigo-200 transition-all"
                    >
                      Edit Card
                    </button>
                    <button 
                      onClick={() => handleDeleteCard(cards[currentIndex].id)}
                      className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-red-500 font-medium hover:bg-red-50 hover:border-red-200 transition-all"
                    >
                      Delete
                    </button>
                  </div>

                  <button 
                    onClick={nextCard}
                    className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-indigo-200 transition-all group"
                  >
                    <ChevronRight className="text-slate-500 group-hover:text-indigo-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 px-6 bg-white border-2 border-dashed border-slate-200 rounded-3xl max-w-md">
                <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-6">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Cards Yet</h3>
                <p className="text-slate-500 mb-8">Ready to start studying? Add your own cards or let Gemini AI generate a set for you.</p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setIsEditorOpen(true)}
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    Create Manually
                  </button>
                  <button 
                    onClick={() => setViewMode('generate')}
                    className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                  >
                    Generate with AI
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'manage' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Your Flashcards</h2>
                <p className="text-slate-500">You have {cards.length} cards in your deck.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map(card => (
                <div key={card.id} className="bg-white border border-slate-200 p-6 rounded-3xl hover:border-indigo-200 transition-all group relative">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingCard(card);
                          setIsEditorOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-800 line-clamp-3 mb-4 h-18">{card.question}</p>
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Answer</span>
                    <p className="text-sm text-slate-600 line-clamp-2">{card.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'generate' && (
          <div className="max-w-2xl mx-auto">
            <AIGenerator onGenerated={handleAddGeneratedCards} onCancel={() => setViewMode('study')} />
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <CardEditor 
              card={editingCard} 
              onSave={editingCard ? handleEditCard : handleAddCard} 
              onClose={() => {
                setIsEditorOpen(false);
                setEditingCard(null);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
