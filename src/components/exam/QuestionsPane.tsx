'use client';

import React, { useEffect, useRef } from 'react';
import { useExamStore } from '@/lib/store';
import { Question } from '@/types/ielts';
import { Flag, HelpCircle } from 'lucide-react';

export const QuestionsPane: React.FC = () => {
  const {
    exam,
    currentPartNumber,
    currentQuestionNumber,
    answers,
    reviewed,
    setAnswer,
    toggleReview,
    setCurrentQuestion,
  } = useExamStore();

  const currentPart = exam.parts.find((p) => p.partNumber === currentPartNumber);
  const questions = currentPart?.questions || [];
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Auto-scroll to currentQuestionNumber if it changes
  useEffect(() => {
    const el = questionRefs.current[currentQuestionNumber];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentQuestionNumber]);

  if (!questions.length) {
    return (
      <div className="p-8 text-center text-slate-500">
        No questions loaded for this part.
      </div>
    );
  }

  // 1. TFNG & YNNG Component
  const renderTFNG = (q: Question) => {
    const isYNNG = q.type === 'ynng';
    const options = isYNNG ? ['YES', 'NO', 'NOT GIVEN'] : ['TRUE', 'FALSE', 'NOT GIVEN'];
    const currentVal = (answers[q.number] as string) || '';

    return (
      <div className="grid grid-cols-3 gap-2 mt-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              setAnswer(q.number, opt);
              setCurrentQuestion(q.number);
            }}
            className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-md border text-center transition ${
              currentVal === opt
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  };

  // 2. MCQ Single Choice
  const renderMCQSingle = (q: Question) => {
    const currentVal = (answers[q.number] as string) || '';

    return (
      <div className="space-y-2 mt-3">
        {q.options?.map((opt) => (
          <label
            key={opt.label}
            onClick={() => setCurrentQuestion(q.number)}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
              currentVal === opt.label
                ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-600 text-sky-900 dark:text-sky-200 ring-1 ring-sky-500'
                : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            <input
              type="radio"
              name={`q-${q.number}`}
              checked={currentVal === opt.label}
              onChange={() => setAnswer(q.number, opt.label)}
              className="mt-0.5 w-4 h-4 text-sky-600 focus:ring-sky-500"
            />
            <span className="font-bold text-xs uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-700 text-slate-800 dark:text-zinc-200">
              {opt.label}
            </span>
            <span className="text-sm leading-relaxed">{opt.text}</span>
          </label>
        ))}
      </div>
    );
  };

  // 3. MCQ Multiple Choice (Choose TWO / THREE)
  const renderMCQMultiple = (q: Question) => {
    const max = q.maxSelections || 2;
    const currentVals: string[] = Array.isArray(answers[q.number])
      ? (answers[q.number] as string[])
      : answers[q.number]
      ? [answers[q.number] as string]
      : [];

    const handleToggle = (label: string) => {
      setCurrentQuestion(q.number);
      if (currentVals.includes(label)) {
        setAnswer(
          q.number,
          currentVals.filter((v) => v !== label)
        );
      } else {
        if (currentVals.length >= max) {
          // Replace first or prevent
          const updated = [...currentVals.slice(1), label];
          setAnswer(q.number, updated);
        } else {
          setAnswer(q.number, [...currentVals, label]);
        }
      }
    };

    return (
      <div className="space-y-2 mt-3">
        <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded border border-amber-200 dark:border-amber-900/60">
          Choose {max} letters ({currentVals.length}/{max} selected)
        </div>
        {q.options?.map((opt) => {
          const isChecked = currentVals.includes(opt.label);
          return (
            <label
              key={opt.label}
              onClick={() => handleToggle(opt.label)}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                isChecked
                  ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-600 text-sky-900 dark:text-sky-200 ring-1 ring-sky-500'
                  : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}}
                className="mt-0.5 w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <span className="font-bold text-xs uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-700 text-slate-800 dark:text-zinc-200">
                {opt.label}
              </span>
              <span className="text-sm leading-relaxed">{opt.text}</span>
            </label>
          );
        })}
      </div>
    );
  };

  // 4. Gap Fill / Completion
  const renderGapFill = (q: Question) => {
    const currentVal = (answers[q.number] as string) || '';

    return (
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentVal}
            onFocus={() => setCurrentQuestion(q.number)}
            onChange={(e) => setAnswer(q.number, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full sm:max-w-md p-2.5 text-sm bg-white dark:bg-zinc-800 border-2 border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
      </div>
    );
  };

  // 5. Matching Headings
  const renderMatchingHeadings = (q: Question) => {
    const currentVal = (answers[q.number] as string) || '';
    const headingList = q.headingList || [];

    return (
      <div className="mt-3 space-y-2">
        <select
          value={currentVal}
          onFocus={() => setCurrentQuestion(q.number)}
          onChange={(e) => setAnswer(q.number, e.target.value)}
          className="w-full p-2.5 text-sm bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">-- Select matching heading --</option>
          {headingList.map((h) => (
            <option key={h.id} value={h.roman}>
              {h.roman}. {h.text}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // 6. Matching Information
  const renderMatchingInformation = (q: Question) => {
    const currentVal = (answers[q.number] as string) || '';

    return (
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
          Match statement to:
        </span>
        <select
          value={currentVal}
          onFocus={() => setCurrentQuestion(q.number)}
          onChange={(e) => setAnswer(q.number, e.target.value)}
          className="p-2 text-sm bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">-- Choose (A-G) --</option>
          {q.options?.map((opt) => (
            <option key={opt.label} value={opt.label}>
              {opt.label} ({opt.text})
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
      {/* Instructions header for this part */}
      <div className="p-4 bg-sky-50 dark:bg-zinc-800/80 border border-sky-200 dark:border-zinc-700 rounded-lg">
        <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>Part {currentPartNumber} Instructions</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1">
          {currentPart?.instructions}
        </p>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {questions.map((q) => {
          const isCurrent = currentQuestionNumber === q.number;
          const isFlagged = Boolean(reviewed[q.number]);
          const ans = answers[q.number];
          const isAnswered = Array.isArray(ans)
            ? ans.length > 0
            : Boolean(ans && ans.toString().trim());

          return (
            <div
              key={q.id}
              ref={(el) => {
                questionRefs.current[q.number] = el;
              }}
              onClick={() => setCurrentQuestion(q.number)}
              className={`p-5 rounded-xl border transition-all duration-200 ${
                isCurrent
                  ? 'border-sky-600 bg-white dark:bg-zinc-900 shadow-md ring-2 ring-sky-500/20'
                  : 'border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${
                      isCurrent
                        ? 'bg-sky-600 text-white'
                        : isAnswered
                        ? 'bg-slate-800 dark:bg-zinc-200 text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700'
                    }`}
                  >
                    {q.number}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    {q.type.replace('_', ' ')}
                  </span>
                </div>

                {/* Review Checkbox */}
                <label
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                >
                  <input
                    type="checkbox"
                    checked={isFlagged}
                    onChange={() => toggleReview(q.number)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'text-amber-500 fill-amber-500' : ''}`} />
                  <span>Review</span>
                </label>
              </div>

              {/* Prompt */}
              <div className="mt-3 text-slate-800 dark:text-zinc-100 text-sm leading-relaxed font-medium select-text">
                {q.prompt}
              </div>

              {/* Question Specific Input Component */}
              {(q.type === 'tfng' || q.type === 'ynng') && renderTFNG(q)}
              {q.type === 'mcq_single' && renderMCQSingle(q)}
              {q.type === 'mcq_multiple' && renderMCQMultiple(q)}
              {q.type === 'gap_fill' && renderGapFill(q)}
              {q.type === 'matching_headings' && renderMatchingHeadings(q)}
              {q.type === 'matching_information' && renderMatchingInformation(q)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
