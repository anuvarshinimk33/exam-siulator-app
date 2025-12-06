import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateQuestion } from '../services/gemini';
import { db } from '../services/mockDb';
import { Question, Difficulty } from '../types';
import { Loader2, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

export const AdaptiveTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const examName = location.state?.examName || 'General Knowledge';
  const topicName = location.state?.topicName || 'General';

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [history, setHistory] = useState<boolean[]>([]); // Track correct/incorrect

  // Load first question
  useEffect(() => {
    loadNextQuestion();
  }, []);

  const loadNextQuestion = async () => {
    setLoading(true);
    setIsSubmitted(false);
    setSelectedOption(null);
    
    // Adaptive Logic
    let nextDiff = difficulty;
    if (history.length > 0) {
      const lastResult = history[history.length - 1];
      if (lastResult) {
         // Correct answer, increase difficulty if not hard
         if (difficulty === Difficulty.EASY) nextDiff = Difficulty.MEDIUM;
         else if (difficulty === Difficulty.MEDIUM) nextDiff = Difficulty.HARD;
      } else {
         // Wrong answer, decrease difficulty
         if (difficulty === Difficulty.HARD) nextDiff = Difficulty.MEDIUM;
         else if (difficulty === Difficulty.MEDIUM) nextDiff = Difficulty.EASY;
      }
    }
    setDifficulty(nextDiff);

    try {
      const q = await generateQuestion(topicName, nextDiff, examName);
      setCurrentQuestion(q);
    } catch (error) {
      console.error("Failed to generate question", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null || !currentQuestion) return;
    
    setIsSubmitted(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    if (isCorrect) setScore(s => s + 1);
    setHistory([...history, isCorrect]);
    setQuestionCount(c => c + 1);
  };

  const finishTest = () => {
    // Save results mock
    db.addResult({
      id: Math.random().toString(),
      examName: examName,
      score: score,
      totalQuestions: questionCount,
      date: new Date().toISOString(),
      difficultyBreakdown: { easy: 0, medium: 0, hard: 0 } // simplified
    });
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-700">Generating Adaptive Question...</h2>
        <p className="text-gray-500">AI is analyzing your performance</p>
      </div>
    );
  }

  if (!currentQuestion) return <div>Error loading question. Please refresh.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{examName}</h1>
          <p className="text-gray-500">Topic: {topicName} • Question {questionCount + 1}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${difficulty === Difficulty.EASY ? 'bg-green-100 text-green-700' : 
              difficulty === Difficulty.MEDIUM ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
          `}>
            {difficulty}
          </span>
          <div className="text-indigo-600 font-bold">Score: {score}</div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <h2 className="text-xl font-medium text-gray-800 mb-6 leading-relaxed">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let stateClass = "border-gray-200 hover:bg-gray-50";
              if (isSubmitted) {
                if (idx === currentQuestion.correctAnswerIndex) stateClass = "bg-green-50 border-green-500 text-green-700";
                else if (idx === selectedOption) stateClass = "bg-red-50 border-red-500 text-red-700";
                else stateClass = "opacity-50 border-gray-100";
              } else if (selectedOption === idx) {
                stateClass = "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isSubmitted && setSelectedOption(idx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${stateClass}`}
                >
                  <span className="font-medium">{option}</span>
                  {isSubmitted && idx === currentQuestion.correctAnswerIndex && <CheckCircle size={20} className="text-green-600" />}
                  {isSubmitted && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && <XCircle size={20} className="text-red-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Footer */}
        {isSubmitted && (
          <div className="bg-indigo-50 p-6 border-t border-indigo-100 animate-in slide-in-from-bottom-2">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-indigo-600 mt-1" size={20} />
              <div>
                <h3 className="font-bold text-indigo-900 mb-1">Explanation</h3>
                <p className="text-indigo-800 text-sm leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <button 
          onClick={finishTest}
          className="text-gray-500 hover:text-gray-700 font-medium px-4"
        >
          End Test
        </button>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
              selectedOption !== null ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={loadNextQuestion}
            className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center space-x-2 animate-pulse"
          >
            <span>Next Question</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
