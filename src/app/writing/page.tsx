'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Award,
  Clock,
  BookOpen,
} from 'lucide-react';
import { mockWritingExam } from '@/data/mockWritingTest';

interface WritingEvaluation {
  overallBand: number;
  wordCount: number;
  minWords: number;
  criteriaBands?: {
    taskAchievement: number;
    coherence: number;
    lexical: number;
    grammar: number;
  };
  feedback?: {
    strengths: string[];
    improvements: string[];
    grammarCorrections: { original: string; corrected: string; explanation: string }[];
    advancedVocabulary: { word: string; context: string }[];
  };
  sampleRewrite?: string;
}

export default function WritingExamPage() {
  const [activeTaskNum, setActiveTaskNum] = useState<1 | 2>(1);
  const [essayText1, setEssayText1] = useState('');
  const [essayText2, setEssayText2] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<WritingEvaluation | null>(null);

  const activeTask = mockWritingExam.tasks.find((t) => t.taskNumber === activeTaskNum)!;
  const currentText = activeTaskNum === 1 ? essayText1 : essayText2;
  const setCurrentText = (val: string) => {
    if (activeTaskNum === 1) setEssayText1(val);
    else setEssayText2(val);
  };

  const words = currentText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isWordCountMet = wordCount >= activeTask.minWords;

  const handleEvaluate = async () => {
    if (wordCount < 20) {
      alert('Please write at least 20 words before requesting AI evaluation.');
      return;
    }

    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const res = await fetch('/api/ai/grade-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskNumber: activeTaskNum,
          promptTitle: activeTask.title,
          prompt: activeTask.prompt,
          essayText: currentText,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Evaluation failed');
      }

      setEvaluationResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error evaluating essay';
      alert(msg);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 px-6 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-sky-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Exam Room
          </Link>
          <div className="h-5 w-px bg-slate-300 dark:bg-zinc-700" />
          <div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              IELTS Computer-Delivered Writing Simulator
            </span>
            <span className="ml-2 text-xs text-slate-500">
              60 Minutes Total • Academic Module
            </span>
          </div>
        </div>

        {/* Task Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-300 dark:border-zinc-700 p-0.5 bg-slate-100 dark:bg-zinc-800 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTaskNum(1);
                setEvaluationResult(null);
              }}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTaskNum === 1
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              Task 1 (Report)
            </button>
            <button
              onClick={() => {
                setActiveTaskNum(2);
                setEvaluationResult(null);
              }}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTaskNum === 2
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              Task 2 (Essay)
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Pane: Prompt */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Academic Writing Task {activeTaskNum}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Suggested time: {activeTask.timeRecommendedMinutes} minutes
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {activeTask.title}
          </h2>

          <div className="p-4 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700/60 text-sm whitespace-pre-line leading-relaxed">
            {activeTask.prompt}
          </div>

          {activeTask.chartDescription && (
            <div className="p-4 bg-sky-50/60 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800 text-xs text-sky-950 dark:text-sky-200 font-mono whitespace-pre-line leading-relaxed">
              {activeTask.chartDescription}
            </div>
          )}

          {/* Sample Band 9 Answer toggle */}
          <details className="mt-4 text-xs group">
            <summary className="font-bold text-sky-600 cursor-pointer hover:underline list-none flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              View Cambridge Sample Band 9.0 Model Answer
            </summary>
            <div className="mt-2 p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-slate-700 dark:text-zinc-200 whitespace-pre-line leading-relaxed text-xs">
              {activeTask.sampleBand9Answer}
            </div>
          </details>
        </div>

        {/* Right Pane: Text Editor & Word Count */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto bg-slate-50 dark:bg-zinc-950 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Your Written Response:
              </span>

              {/* Dynamic Live Word Counter */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                  isWordCountMet
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                }`}
              >
                <span>Word count: {wordCount}</span>
                <span className="opacity-75">/ Min {activeTask.minWords}</span>
              </div>
            </div>

            <textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Type your response here. Paragraphs should be separated by a blank line..."
              rows={16}
              className="w-full p-4 text-sm font-sans bg-white dark:bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 leading-relaxed resize-y"
            />
          </div>

          {/* Action Bar */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Gemini API Key (optional)"
                className="w-full sm:w-56 p-2 text-xs bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-800 dark:text-zinc-200 font-mono"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setCurrentText('')}
                className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg"
              >
                Clear
              </button>
              <button
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white shadow-sm transition"
              >
                <Sparkles className="w-4 h-4" />
                {isEvaluating ? 'Evaluating with AI...' : 'Submit & Evaluate with AI'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Evaluation Result Card */}
      {evaluationResult && (
        <div className="border-t border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 animate-in slide-in-from-bottom-6 duration-300">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  Official IELTS Writing Rubric Evaluation
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Overall Estimated Band: {Number(evaluationResult.overallBand).toFixed(1)}
                </h3>
              </div>
              <div className="text-4xl font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-5 py-2.5 rounded-2xl border border-sky-200 dark:border-sky-800">
                Band {Number(evaluationResult.overallBand).toFixed(1)}
              </div>
            </div>

            {/* 4 Criteria Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 text-center">
                <div className="text-xs text-slate-500 font-semibold">Task Achievement</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {evaluationResult.criteriaBands?.taskAchievement || '6.5'}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 text-center">
                <div className="text-xs text-slate-500 font-semibold">Coherence & Cohesion</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {evaluationResult.criteriaBands?.coherence || '6.5'}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 text-center">
                <div className="text-xs text-slate-500 font-semibold">Lexical Resource</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {evaluationResult.criteriaBands?.lexical || '6.5'}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 text-center">
                <div className="text-xs text-slate-500 font-semibold">Grammatical Accuracy</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {evaluationResult.criteriaBands?.grammar || '6.5'}
                </div>
              </div>
            </div>

            {/* Feedback & Corrections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                <div className="font-bold text-emerald-900 dark:text-emerald-300">Strengths</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-zinc-300">
                  {evaluationResult.feedback?.strengths?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl space-y-2">
                <div className="font-bold text-amber-900 dark:text-amber-300">Areas for Improvement</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-zinc-300">
                  {evaluationResult.feedback?.improvements?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Grammar corrections */}
            {(evaluationResult.feedback?.grammarCorrections?.length ?? 0) > 0 && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-800 dark:text-zinc-200">
                  Grammar & Lexical Suggestions:
                </div>
                <div className="space-y-1.5">
                  {evaluationResult.feedback?.grammarCorrections?.map((corr, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <span className="line-through text-rose-600 dark:text-rose-400 font-semibold mr-2">
                          {corr.original}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ➔ {corr.corrected}
                        </span>
                      </div>
                      <span className="text-slate-500 italic">{corr.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
