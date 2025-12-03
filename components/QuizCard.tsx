import React from 'react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  onAnswer: (value: string | number) => void;
  currentNumber: number;
  total: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({ question, onAnswer, currentNumber, total }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full fade-in border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-blue-600 tracking-wider">QUESTION {currentNumber} / {total}</span>
        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(currentNumber / total) * 100}%` }}
          />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(option.value)}
            className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group flex items-center"
          >
            <div className="w-6 h-6 rounded-full border-2 border-slate-300 mr-4 group-hover:border-blue-500 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-slate-700 font-medium group-hover:text-blue-700">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};