'use client';

import React from 'react';
import { useExamStore } from '@/lib/store';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';

export const BottomPalette: React.FC = () => {
  const {
    exam,
    currentQuestionNumber,
    currentPartNumber,
    answers,
    reviewed,
    setCurrentQuestion,
    setCurrentPart,
    toggleReview,
  } = useExamStore();

  const totalQuestions = 40;
  const isCurrentReviewed = Boolean(reviewed[currentQuestionNumber]);

  const handlePrev = () => {
    if (currentQuestionNumber > 1) {
      setCurrentQuestion(currentQuestionNumber - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionNumber < totalQuestions) {
      setCurrentQuestion(currentQuestionNumber + 1);
    }
  };

  // Group questions by Part
  const partMap: Record<number, number[]> = {};
  exam.parts.forEach((p) => {
    partMap[p.partNumber] = p.questions.map((q) => q.number);
  });

  return (
    <footer className="h-16 px-4 sm:px-6 border-t border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm flex items-center justify-between select-none shrink-0 z-30">
      {/* Part Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 mr-2">
        {exam.parts.map((p) => {
          const isActive = p.partNumber === currentPartNumber;
          return (
            <button
              key={p.partNumber}
              onClick={() => setCurrentPart(p.partNumber)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span>Part {p.partNumber}</span>
            </button>
          );
        })}
      </div>

      {/* Numbered Palette (1 to 40) */}
      <div className="flex-1 max-w-3xl overflow-x-auto py-1 px-2 flex items-center gap-1.5 no-scrollbar">
        {exam.parts.map((part) => (
          <div key={part.partNumber} className="flex items-center gap-1 shrink-0">
            {part.questions.map((q) => {
              const isCurrent = q.number === currentQuestionNumber;
              const ans = answers[q.number];
              const isAnswered = Array.isArray(ans)
                ? ans.length > 0
                : Boolean(ans && ans.toString().trim());
              const isFlagged = Boolean(reviewed[q.number]);

              return (
                <button
                  key={q.number}
                  onClick={() => setCurrentQuestion(q.number)}
                  title={`Question ${q.number}${isAnswered ? ' (Answered)' : ' (Unanswered)'}${isFlagged ? ' (Review)' : ''}`}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-xs font-bold transition relative flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'border-2 border-sky-600 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/30'
                      : isAnswered
                      ? 'bg-slate-800 dark:bg-zinc-200 text-white dark:text-slate-900 border border-slate-700 dark:border-zinc-300'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 hover:border-slate-400'
                  }`}
                >
                  <span>{q.number}</span>

                  {/* Flagged for Review dot */}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white dark:border-zinc-900 shadow-xs" />
                  )}

                  {/* Answered underline */}
                  {isAnswered && !isCurrent && (
                    <span className="absolute bottom-0.5 w-3 h-0.5 rounded-full bg-white dark:bg-slate-900" />
                  )}
                </button>
              );
            })}
            {part.partNumber < exam.parts.length && (
              <div className="w-px h-6 bg-slate-300 dark:bg-zinc-700 mx-1.5 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Review Checkbox & Navigation arrows */}
      <div className="flex items-center gap-2 sm:gap-3 ml-2">
        <label
          onClick={(e) => e.stopPropagation()}
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white"
        >
          <input
            type="checkbox"
            checked={isCurrentReviewed}
            onChange={() => toggleReview(currentQuestionNumber)}
            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
          />
          <Flag className={`w-3.5 h-3.5 ${isCurrentReviewed ? 'text-amber-500 fill-amber-500' : ''}`} />
          <span>Review</span>
        </label>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={currentQuestionNumber <= 1}
            className="p-1.5 rounded-md border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition"
            title="Previous question"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionNumber >= totalQuestions}
            className="p-1.5 rounded-md border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition"
            title="Next question"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
