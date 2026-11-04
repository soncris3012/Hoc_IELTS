'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, X, Send } from 'lucide-react';
import { useExamStore } from '@/lib/store';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({ isOpen, onClose }) => {
  const { exam, answers, reviewed, submitExam } = useExamStore();

  if (!isOpen) return null;

  let totalQuestions = 0;
  let answeredCount = 0;
  let reviewedCount = 0;

  const partStats = exam.parts.map((p) => {
    const partTotal = p.questions.length;
    let partAnswered = 0;
    p.questions.forEach((q) => {
      totalQuestions += 1;
      const ans = answers[q.number];
      const isAns = Array.isArray(ans) ? ans.length > 0 : Boolean(ans && ans.toString().trim());
      if (isAns) {
        answeredCount += 1;
        partAnswered += 1;
      }
      if (reviewed[q.number]) {
        reviewedCount += 1;
      }
    });
    return {
      partNumber: p.partNumber,
      title: p.title,
      total: partTotal,
      answered: partAnswered,
    };
  });

  const unansweredCount = totalQuestions - answeredCount;

  const handleConfirm = async () => {
    onClose();
    await submitExam();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100">
              Submit Your IELTS Test?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {unansweredCount > 0 ? (
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-amber-900 dark:text-amber-200 text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">You have unanswered questions!</p>
                <p className="text-xs mt-0.5 opacity-90">
                  You have left <strong>{unansweredCount}</strong> of {totalQuestions} questions blank. In the official IELTS exam, there is no penalty for guessing.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg text-emerald-900 dark:text-emerald-200 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">All questions answered!</p>
                <p className="text-xs mt-0.5 opacity-90">
                  Great job. You have completed answers for all {totalQuestions} questions.
                </p>
              </div>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-200 dark:border-zinc-700 text-center">
              <div className="text-2xl font-black text-slate-800 dark:text-zinc-100">{answeredCount}</div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Answered</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-200 dark:border-zinc-700 text-center">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{unansweredCount}</div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Unanswered</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg border border-slate-200 dark:border-zinc-700 text-center">
              <div className="text-2xl font-black text-sky-600 dark:text-sky-400">{reviewedCount}</div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Flagged Review</div>
            </div>
          </div>

          {/* Part breakdown table */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Progress by Test Part
            </h4>
            <div className="space-y-2">
              {partStats.map((part) => (
                <div
                  key={part.partNumber}
                  className="flex items-center justify-between text-sm py-1.5 px-3 rounded bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/60"
                >
                  <span className="font-medium text-slate-700 dark:text-zinc-300">
                    Part {part.partNumber}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-zinc-200">
                    {part.answered} / {part.total} answered
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition"
          >
            Return to Test
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 text-sm font-semibold rounded bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            Yes, Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};
