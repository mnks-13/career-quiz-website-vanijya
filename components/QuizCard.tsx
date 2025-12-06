import React from 'react';
import { Question } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  onAnswer: (value: string | number) => void;
  currentNumber: number;
  total: number;
  onPrevious: () => void;
  hasPrevious: boolean;
  selectedValue?: string | number | null;
}

export const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  onAnswer, 
  currentNumber, 
  total,
  onPrevious,
  hasPrevious,
  selectedValue
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8 max-w-2xl w-full fade-in border border-slate-100 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-blue-600 tracking-wider">QUESTION {currentNumber} / {total}</span>
        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(currentNumber / total) * 100}%` }}
          />
        </div>
      </div>
      
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
        {question.text}
      </h2>

      <div className="space-y-3 mb-8">
        {question.options.map((option, idx) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={idx}
              onClick={() => onAnswer(option.value)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group flex items-start
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-100 hover:border-blue-500 hover:bg-blue-50'
                }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 mt-0.5
                ${isSelected ? 'border-blue-500' : 'border-slate-300 group-hover:border-blue-500'}
              `}>
                <div className={`w-3 h-3 rounded-full bg-blue-500 transition-opacity
                  ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `} />
              </div>
              <span className={`font-medium group-hover:text-blue-700 break-words
                ${isSelected ? 'text-blue-800' : 'text-slate-700'}
              `}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center border-t border-slate-100 pt-6">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`flex items-center gap-2 font-medium transition-colors
            ${hasPrevious 
              ? 'text-slate-500 hover:text-slate-800 cursor-pointer' 
              : 'text-slate-300 cursor-not-allowed'}
          `}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        
        <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">Select an option to continue</span>
      </div>
    </div>
  );
};