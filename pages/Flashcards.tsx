import React, { useState } from 'react';
import { generateFlashcards } from '../services/gemini';
import { Flashcard } from '../types';
import { Loader2, RotateCw, ThumbsUp, ThumbsDown } from 'lucide-react';

export const Flashcards = () => {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setCards([]);
    try {
      const generatedCards = await generateFlashcards(topic, 5);
      setCards(generatedCards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(c => c + 1);
      setIsFlipped(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-700">Generating Flashcards...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Flashcards</h1>
        <p className="text-gray-500 mb-6">Enter a topic and let Gemini create a study deck for you.</p>
        
        <div className="flex space-x-2">
          <input 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Photosynthesis, React Hooks, World War II"
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          <button 
            onClick={handleGenerate}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
          >
            Generate
          </button>
        </div>
      </div>

      {cards.length > 0 && (
        <div className="perspective-1000">
          <div className="relative h-80 w-full cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`absolute inset-0 w-full h-full transition-all duration-500 transform preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Front */}
              <div className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center backface-hidden">
                <span className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4">Question</span>
                <p className="text-2xl text-center font-medium text-gray-800">{cards[currentIndex].front}</p>
                <p className="absolute bottom-6 text-sm text-gray-400">Click to flip</p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180">
                <span className="text-xs font-bold text-purple-200 uppercase tracking-widest mb-4">Answer</span>
                <p className="text-xl text-center font-medium text-white">{cards[currentIndex].back}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 px-4">
            <span className="text-gray-500 font-medium">Card {currentIndex + 1} of {cards.length}</span>
            <div className="flex space-x-4">
              <button className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-500 transition-colors">
                <ThumbsDown size={24} />
              </button>
              <button 
                onClick={nextCard}
                className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-500 transition-colors"
              >
                <ThumbsUp size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
