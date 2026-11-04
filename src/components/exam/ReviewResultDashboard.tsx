'use client';

import React, { useState, useEffect } from 'react';
import { useExamStore } from '@/lib/store';
import {
  Trophy,
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
  Filter,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReviewResultDashboard: React.FC = () => {
  const { exam, scoreSummary, retakeExam } = useExamStore();
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');
  const [selectedResult, setSelectedResult] = useState<number | null>(null);

  useEffect(() => {
    // Trigger confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  if (!scoreSummary) {
    return (
      <div className="p-12 text-center text-slate-600 dark:text-zinc-400">
        No score results recorded yet.
      </div>
    );
  }

  const {
    bandScore,
    rawScore,
    totalQuestions,
    percentage,
    timeSpentSeconds,
    partBreakdown,
    typeBreakdown,
    detailedResults,
  } = scoreSummary;

  const minutesSpent = Math.floor(timeSpentSeconds / 60);
  const secondsSpent = timeSpentSeconds % 60;

  // Filtered list
  const filteredResults = detailedResults.filter((r) => {
    if (filterType === 'correct') return r.isCorrect;
    if (filterType === 'incorrect') {
      const hasAnswer = Array.isArray(r.userAnswer)
        ? r.userAnswer.length > 0
        : Boolean(r.userAnswer && r.userAnswer.toString().trim());
      return !r.isCorrect && hasAnswer;
    }
    if (filterType === 'unanswered') {
      const hasAnswer = Array.isArray(r.userAnswer)
        ? r.userAnswer.length > 0
        : Boolean(r.userAnswer && r.userAnswer.toString().trim());
      return !hasAnswer;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <Sparkles className="w-3.5 h-3.5" />
                Exam Completed & Evaluated
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {exam.title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Official Computer-Delivered IELTS Simulation Result
              </p>
            </div>

            {/* Overall Band Card */}
            <div className="flex items-center gap-4 bg-gradient-to-br from-sky-500 to-indigo-600 text-white px-7 py-5 rounded-2xl shadow-lg shrink-0">
              <Trophy className="w-12 h-12 text-yellow-300 shrink-0" />
              <div>
                <div className="text-xs uppercase font-extrabold tracking-wider text-sky-100">
                  Estimated IELTS Band
                </div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight">
                  {bandScore.toFixed(1)}
                </div>
                <div className="text-xs text-sky-100 mt-0.5">
                  Raw Score: {rawScore} / {totalQuestions} ({percentage}%)
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
              <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                Correct Answers
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {rawScore} / {totalQuestions}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
              <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                Accuracy Rate
              </div>
              <div className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                {percentage}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
              <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                Time Spent
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-zinc-100 mt-1">
                {minutesSpent}m {secondsSpent}s
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60">
              <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                CEFR Equivalent
              </div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {bandScore >= 8.5
                  ? 'C2 Mastery'
                  : bandScore >= 7.0
                  ? 'C1 Effective'
                  : bandScore >= 5.5
                  ? 'B2 Vantage'
                  : 'B1 Threshold'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Breakdowns (Part Breakdown & Question Type Breakdown) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Part Breakdown */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-600" />
              Score by Exam Part
            </h3>
            <div className="space-y-4">
              {Object.entries(partBreakdown).map(([partNum, stats]) => {
                const partPercent = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <div key={partNum} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700 dark:text-zinc-300">
                        Part {partNum} (Passage {partNum})
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {stats.correct}/{stats.total} ({partPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        style={{ width: `${partPercent}%` }}
                        className="h-full bg-sky-600 rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Type Breakdown */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              Accuracy by Question Type
            </h3>
            <div className="space-y-4">
              {Object.entries(typeBreakdown).map(([typeKey, stats]) => {
                const typePercent = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                const formatTypeName = (k: string) => {
                  switch (k) {
                    case 'tfng': return 'True / False / Not Given';
                    case 'ynng': return 'Yes / No / Not Given';
                    case 'mcq_single': return 'Multiple Choice (Single)';
                    case 'mcq_multiple': return 'Multiple Choice (Multi)';
                    case 'gap_fill': return 'Sentence / Summary Gap Fill';
                    case 'matching_headings': return 'Matching Headings';
                    case 'matching_information': return 'Matching Information';
                    default: return k;
                  }
                };

                return (
                  <div key={typeKey} className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-slate-700 dark:text-zinc-300">
                        {formatTypeName(typeKey)}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {stats.correct}/{stats.total} ({typePercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        style={{ width: `${typePercent}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          typePercent >= 75 ? 'bg-emerald-500' : typePercent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Detailed Solution View */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Detailed Solutions & Evidence Analysis
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Review your responses against official keys and evidence quotes.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-md transition ${
                  filterType === 'all'
                    ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                All ({detailedResults.length})
              </button>
              <button
                onClick={() => setFilterType('correct')}
                className={`px-3 py-1.5 rounded-md transition ${
                  filterType === 'correct'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                Correct ({rawScore})
              </button>
              <button
                onClick={() => setFilterType('incorrect')}
                className={`px-3 py-1.5 rounded-md transition ${
                  filterType === 'incorrect'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                Incorrect
              </button>
              <button
                onClick={() => setFilterType('unanswered')}
                className={`px-3 py-1.5 rounded-md transition ${
                  filterType === 'unanswered'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                Unanswered
              </button>
            </div>
          </div>

          {/* Solutions list */}
          <div className="space-y-4">
            {filteredResults.map((item) => {
              const isExpanded = selectedResult === item.questionNumber;
              const formatAns = (val: string | string[] | undefined) => {
                if (val === undefined || val === '') return <span className="italic text-slate-400 font-normal">Blank</span>;
                if (Array.isArray(val)) return val.join(', ');
                return val.toString();
              };

              return (
                <div
                  key={item.questionNumber}
                  className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                    item.isCorrect
                      ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10'
                  }`}
                >
                  <div
                    onClick={() => setSelectedResult(isExpanded ? null : item.questionNumber)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-zinc-800/40"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          item.isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {item.questionNumber}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                            Part {item.part} • {item.type.replace('_', ' ')}
                          </span>
                          {item.isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle className="w-3.5 h-3.5" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                              <XCircle className="w-3.5 h-3.5" /> Incorrect
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-zinc-100 mt-1">
                          Your answer: <span className={item.isCorrect ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-rose-700 dark:text-rose-300 font-bold'}>{formatAns(item.userAnswer)}</span>
                          {'  '}•{'  '}
                          Correct: <span className="text-emerald-700 dark:text-emerald-300 font-bold">{formatAns(item.correctAnswer)}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-sky-600' : ''
                      }`}
                    />
                  </div>

                  {/* Expanded Content: Explanation & Evidence Sentence */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-zinc-800 space-y-3 bg-white dark:bg-zinc-900/90 text-sm">
                      {item.evidenceSentence && (
                        <div className="p-3 bg-sky-50 dark:bg-sky-950/50 border-l-4 border-sky-600 rounded-r-lg text-sky-950 dark:text-sky-200">
                          <div className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-1">
                            Passage Evidence Quote:
                          </div>
                          <p className="italic text-xs sm:text-sm font-serif">
                            &ldquo;{item.evidenceSentence}&rdquo;
                          </p>
                        </div>
                      )}

                      <div className="text-slate-700 dark:text-zinc-300">
                        <span className="font-bold text-slate-900 dark:text-zinc-100">Detailed Explanation: </span>
                        {item.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">
              Ready to practice another test?
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">
              You can retake this simulation or navigate to the AI Writing Examiner & Data Importer.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                retakeExam();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Examination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
