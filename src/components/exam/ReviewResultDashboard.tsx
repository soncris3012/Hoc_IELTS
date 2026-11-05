'use client';

import React, { useState, useEffect } from 'react';
import { useExamStore } from '@/lib/store';
import { QuestionScoreResult } from '@/types/ielts';
import { StepByStepBuilderModal } from './StepByStepBuilderModal';
import {
  Trophy,
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
  Filter,
  ChevronDown,
  Sparkles,
  Zap,
  FolderOpen,
  Bookmark,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReviewResultDashboard: React.FC = () => {
  const { exam, scoreSummary, retakeExam } = useExamStore();
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'solutions' | 'mistake_vault' | 'remedial_drill'>('solutions');
  const [drillAnswers, setDrillAnswers] = useState<Record<number, string>>({});
  const [drillSubmitted, setDrillSubmitted] = useState(false);
  const [builderTarget, setBuilderTarget] = useState<QuestionScoreResult | null>(null);

  useEffect(() => {
    try {
      confetti({
        particleCount: 85,
        spread: 75,
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

  // Group incorrect items for Smart Mistake Vault
  const incorrectItems = detailedResults.filter((r) => !r.isCorrect);

  const mistakeCategories: Record<string, typeof incorrectItems> = {
    'Bẫy Suy Diễn (Overthinking / Assumption)': incorrectItems.filter((i) => i.errorTag === 'overthinking_logic'),
    'Thiếu Hụt Từ Đồng Nghĩa (Lexical Gap)': incorrectItems.filter((i) => i.errorTag === 'lexical_gap'),
    'Bỏ Sót Hạn Từ Định Lượng (Scanning Oversight)': incorrectItems.filter((i) => i.errorTag === 'scanning_oversight'),
    'Lỗi Khác & Chưa Phân Loại': incorrectItems.filter((i) => !i.errorTag || (i.errorTag !== 'overthinking_logic' && i.errorTag !== 'lexical_gap' && i.errorTag !== 'scanning_oversight')),
  };

  // Mock Remedial Drill questions
  const remedialQuestions = [
    {
      id: 101,
      prompt: 'In nineteenth-century maritime transport, steam vessels immediately replaced sailing ships across all Mediterranean trading routes.',
      correct: 'FALSE',
      explanation: 'Hạn từ "immediately across all routes" là bẫy tuyệt đối hóa. Quá trình chuyển đổi diễn ra dần dần.',
    },
    {
      id: 102,
      prompt: 'Anaerobic conditions underwater prevent the growth of organisms responsible for timber decomposition.',
      correct: 'TRUE',
      explanation: 'Trầm tích yếm khí triệt tiêu oxy, ngăn cản vi khuẩn và sinh vật làm thối rữa gỗ.',
    },
    {
      id: 103,
      prompt: 'Roman cargo vessels traveling from North Africa were exclusively commanded by naval officers from Rome.',
      correct: 'NOT GIVEN',
      explanation: 'Bài đọc chỉ nói tàu chở hàng từ Bắc Phi đến Ý, không nhắc đến lai lịch các thuyền trưởng.',
    },
  ];

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
                Official Computer-Delivered IELTS Simulation Result • YouPass Standard
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

        {/* Navigation Tabs between: Detailed Solutions, Smart Mistake Vault, Remedial Drill */}
        <div className="flex rounded-xl p-1 bg-slate-200 dark:bg-zinc-800 text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('solutions')}
            className={`flex-1 py-2.5 rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'solutions'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Detailed Solutions & Paraphrase Mapping</span>
          </button>

          <button
            onClick={() => setActiveTab('mistake_vault')}
            className={`flex-1 py-2.5 rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'mistake_vault'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            <FolderOpen className="w-4 h-4 text-amber-500" />
            <span>Sổ Tay Lỗi Sai (Mistake Vault - {incorrectItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('remedial_drill')}
            className={`flex-1 py-2.5 rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'remedial_drill'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>Khắc Phục Câu Sai Ngay (Remedial Drill)</span>
          </button>
        </div>

        {/* TAB 1: Detailed Solutions */}
        {activeTab === 'solutions' && (
          <div className="space-y-6">
            {/* Breakdowns */}
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
                            Part {partNum}
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
                    return (
                      <div key={typeKey} className="space-y-1.5">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="font-semibold text-slate-700 dark:text-zinc-300">
                            {typeKey.toUpperCase().replace('_', ' ')}
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

            {/* Detailed Solution List */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Detailed Solutions & Paraphrase Analysis
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Click any question to view the exact passage quote, paraphrase table, and distractor traps.
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-md transition ${
                      filterType === 'all'
                        ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    All ({detailedResults.length})
                  </button>
                  <button
                    onClick={() => setFilterType('correct')}
                    className={`px-3 py-1.5 rounded-md transition ${
                      filterType === 'correct'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    Correct ({rawScore})
                  </button>
                  <button
                    onClick={() => setFilterType('incorrect')}
                    className={`px-3 py-1.5 rounded-md transition ${
                      filterType === 'incorrect'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    Incorrect ({incorrectItems.length})
                  </button>
                </div>
              </div>

              {/* Questions Accordion */}
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
                              item.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
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
                              Your answer:{' '}
                              <span className={item.isCorrect ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-rose-700 dark:text-rose-300 font-bold'}>
                                {formatAns(item.userAnswer)}
                              </span>
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

                      {/* Expanded View */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-4 bg-white dark:bg-zinc-900/90 text-sm">
                          {/* Evidence Sentence Quote */}
                          {item.evidenceSentence && (
                            <div className="p-3.5 bg-sky-50 dark:bg-sky-950/50 border-l-4 border-sky-600 rounded-r-lg text-sky-950 dark:text-sky-200">
                              <div className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-1 flex items-center justify-between">
                                <span>📍 Passage Evidence Quote:</span>
                              </div>
                              <p className="italic text-xs sm:text-sm font-serif">
                                &ldquo;{item.evidenceSentence}&rdquo;
                              </p>
                            </div>
                          )}

                          {/* Paraphrasing Mapping Table */}
                          {item.paraphrasePairs && item.paraphrasePairs.length > 0 && (
                            <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
                              <div className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>Bảng Từ Khóa Đối Chiếu (Paraphrase Map):</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="font-semibold text-slate-500">Từ khóa trong câu hỏi:</div>
                                <div className="font-semibold text-slate-500">Từ tương đương trong bài:</div>
                                {item.paraphrasePairs.map((pair, pIdx) => (
                                  <React.Fragment key={pIdx}>
                                    <div className="p-2 bg-white dark:bg-zinc-900 rounded border border-slate-200 dark:border-zinc-800 font-medium">
                                      {pair.questionKeyword}
                                    </div>
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 rounded border border-emerald-200 dark:border-emerald-800 font-semibold">
                                      {pair.passageKeyword}
                                    </div>
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Detailed Explanation */}
                          <div className="text-slate-700 dark:text-zinc-300 text-xs sm:text-sm">
                            <span className="font-bold text-slate-900 dark:text-zinc-100">Lời giải chi tiết: </span>
                            {item.explanation}
                          </div>

                          {/* Distractor Analysis */}
                          {item.distractorExplanations && Object.keys(item.distractorExplanations).length > 0 && (
                            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 text-xs space-y-1">
                              <div className="font-bold text-slate-700 dark:text-zinc-300">
                                Phân tích bẫy các phương án khác:
                              </div>
                              {Object.entries(item.distractorExplanations).map(([opt, reason]) => (
                                <div key={opt} className="text-slate-600 dark:text-zinc-400">
                                  <span className="font-bold text-rose-600 mr-1">[{opt}]:</span>
                                  <span>{reason}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* YouPass Builder Action Button */}
                          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 hidden sm:inline">
                              Học sâu cơ chế ra đề & bẫy nhiễu chuẩn YouPass PRO
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBuilderTarget(item);
                              }}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-xs transition"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>YouPass Builder: Xem hướng dẫn 4 bước giải câu này</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Smart Mistake Vault (Sổ tay câu sai) */}
        {activeTab === 'mistake_vault' && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-500" />
                Sổ Tay Bẫy Sai Cá Nhân Hóa (Smart Mistake Vault)
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Hệ thống tự động phân loại các câu sai theo nhóm nguyên nhân nhận thức để giúp bạn triệt tiêu điểm yếu.
              </p>
            </div>

            <div className="space-y-6">
              {Object.entries(mistakeCategories).map(([catName, items]) => {
                if (items.length === 0) return null;
                return (
                  <div key={catName} className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-zinc-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>{catName}</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {items.length} câu
                      </span>
                    </div>

                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.questionNumber}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-800 dark:text-zinc-200">
                              Câu {item.questionNumber} ({item.type.toUpperCase()})
                            </span>
                            <span className="text-rose-600 font-bold">
                              Bạn chọn: {item.userAnswer || 'Chưa làm'} ➔ Đúng: {Array.isArray(item.correctAnswer) ? item.correctAnswer.join(', ') : item.correctAnswer}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-zinc-300">{item.explanation}</p>
                          <div className="pt-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setBuilderTarget(item)}
                              className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Mở YouPass Builder 4 bước</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Remedial Drill (Khắc phục câu sai tức thì) */}
        {activeTab === 'remedial_drill' && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Zap className="w-3.5 h-3.5" />
                Adaptive Practice Drill
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Luyện Nhanh 3 Câu Tương Tự Để Khắc Phục Lỗi Vừa Sai
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Áp dụng phương pháp Active Recall để giải quyết dứt điểm các bẫy True/False/Not Given vừa gặp.
              </p>
            </div>

            <div className="space-y-4">
              {remedialQuestions.map((q) => {
                const userAns = drillAnswers[q.id];
                const isCorrect = userAns === q.correct;
                return (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 space-y-3">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {q.prompt}
                    </div>

                    <div className="flex items-center gap-2">
                      {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                        <button
                          key={opt}
                          disabled={drillSubmitted}
                          onClick={() => setDrillAnswers({ ...drillAnswers, [q.id]: opt })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                            userAns === opt
                              ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                              : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-300 dark:border-zinc-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {drillSubmitted && (
                      <div className={`p-2.5 rounded-lg text-xs font-medium ${isCorrect ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200'}`}>
                        {isCorrect ? '✓ Chính xác!' : `✗ Chưa đúng! Đáp án đúng: ${q.correct}`}{' '}
                        — {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDrillSubmitted(true)}
                className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
              >
                <span>Kiểm tra kết quả Luyện tập</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">
              Khám phá thêm các công cụ luyện thi chuyên sâu
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">
              Bạn có thể nghe chép chính tả Dictation hoặc thi thử kỹ năng Writing CDT.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/dictation"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              <span>Nghe Chép Chính Tả (Dictation)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => retakeExam()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              Làm Lại Đề Này
            </button>
          </div>
        </div>

        {/* YouPass Step-by-Step Builder Modal */}
        <StepByStepBuilderModal
          result={builderTarget}
          onClose={() => setBuilderTarget(null)}
        />
      </div>
    </div>
  );
};
