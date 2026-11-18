'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Eye,
  EyeOff,
  FileText,
  Home,
  LayoutGrid,
  Monitor,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  YouPassAttemptRecord,
  YouPassGoal,
  YouPassQuizDetail,
  YouPassSkill,
  YouPassSpeakingTopic,
} from '@/types/youpass';
import {
  calculateBandScore,
} from '@/lib/bandCalculator';
import {
  DEFAULT_YOUPASS_GOAL,
  evaluateQuestionSlot,
  expandQuestionSetSlots,
  formatSecondsHMS,
  inferSkillFromQuizType,
  loadYouPassGoal,
  loadYouPassHistory,
  saveYouPassAttempt,
  saveYouPassGoal,
} from '@/lib/youpassHelpers';
import { YouPassCatalog } from '@/components/youpass/YouPassCatalog';
import { YouPassHomepageDashboard } from '@/components/youpass/YouPassHomepageDashboard';
import { YouPassReadingListeningRoom } from '@/components/youpass/YouPassReadingListeningRoom';
import { YouPassWritingRoom } from '@/components/youpass/YouPassWritingRoom';
import { YouPassSpeakingStudio } from '@/components/youpass/YouPassSpeakingStudio';

export const YouPassExamView: React.FC = () => {
  // Top-level Navigation State
  const [viewMode, setViewMode] = useState<'catalog' | 'dashboard' | 'exam' | 'speaking'>(
    'catalog'
  );
  const [catalogSkill, setCatalogSkill] = useState<YouPassSkill>('reading');
  const [totalTestsBadge, setTotalTestsBadge] = useState<number>(2540);

  // Active Exam / Speaking Data States
  const [activeQuiz, setActiveQuiz] = useState<YouPassQuizDetail | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);
  const [quizLoadError, setQuizLoadError] = useState<string | null>(null);
  const [launchMode, setLaunchMode] = useState<'normal' | 'dictation'>('normal');

  const [activeSpeakingTopic, setActiveSpeakingTopic] = useState<{
    topic: YouPassSpeakingTopic;
    part: '1' | '2' | '3';
  } | null>(null);

  // User Progress & LocalStorage Persistence
  const [history, setHistory] = useState<YouPassAttemptRecord[]>([]);
  const [goal, setGoal] = useState<YouPassGoal>(DEFAULT_YOUPASS_GOAL);

  // Hydrate persisted state on mount
  useEffect(() => {
    setHistory(loadYouPassHistory());
    setGoal(loadYouPassGoal());
  }, []);

  const completedQuizIds = useMemo(() => {
    const set = new Set<number>();
    history.forEach((h) => set.add(h.quizId));
    return set;
  }, [history]);

  // Exam Room UI & Settings States
  const [fontSize, setFontSize] = useState<'S' | 'M' | 'L'>('M');
  const [eyeProtection, setEyeProtection] = useState<boolean>(true);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Exam Answers, Writing Essay & Tools
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [essayText, setEssayText] = useState<string>('');
  const [currentQuestionOrder, setCurrentQuestionOrder] = useState<number>(1);
  const [notesList, setNotesList] = useState<string[]>([]);
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [activeTool, setActiveTool] = useState<'highlight' | 'note' | 'vocab' | null>(null);

  // Countdown Timer (seconds)
  const [totalAllowedSeconds, setTotalAllowedSeconds] = useState<number>(1200);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1200);

  useEffect(() => {
    if (isSubmitted || viewMode !== 'exam' || !activeQuiz) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, viewMode, activeQuiz]);

  // Keyboard shortcuts H (Highlight), N (Notes Drawer), T (Vocab)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (viewMode !== 'exam') return;
      if (e.key === 'h' || e.key === 'H') {
        setActiveTool((prev) => (prev === 'highlight' ? null : 'highlight'));
      } else if (e.key === 'n' || e.key === 'N') {
        setActiveTool((prev) => (prev === 'note' ? null : 'note'));
        setIsNotesOpen((prev) => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        setActiveTool((prev) => (prev === 'vocab' ? null : 'vocab'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // Compute all question slots across all parts of activeQuiz (for bottom palette & scoring)
  const allQuestionSlots = useMemo(() => {
    if (!activeQuiz?.parts) return [];
    const list: Array<{
      order: number;
      qsType: string;
      question: ReturnType<typeof expandQuestionSetSlots>[number]['question'];
    }> = [];
    activeQuiz.parts.forEach((p) => {
      (p.question_sets || []).forEach((qs) => {
        expandQuestionSetSlots(qs).forEach((slot) => {
          list.push({
            order: slot.order,
            qsType: qs.question_type,
            question: slot.question,
          });
        });
      });
    });
    return list.sort((a, b) => a.order - b.order);
  }, [activeQuiz]);

  const isWritingQuiz = activeQuiz?.type === 7;

  // Launch any quiz ID from YouPass API
  const launchQuizById = async (
    quizId: number,
    options?: {
      mode?: 'normal' | 'dictation';
      prefilledAnswers?: Record<number, string | string[]>;
      prefilledEssay?: string;
      submitted?: boolean;
    }
  ) => {
    setViewMode('exam');
    setLaunchMode(options?.mode || 'normal');
    setIsLoadingQuiz(true);
    setQuizLoadError(null);
    setIsSubmitted(Boolean(options?.submitted));
    setAnswers(options?.prefilledAnswers || {});
    setEssayText(options?.prefilledEssay || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const res = await fetch(`/api/youpass?action=quiz&id=${quizId}`);
      const json = await res.json();
      if (!json?.success || !json.data) {
        throw new Error(json?.error || `Không tải được đề thi #${quizId}`);
      }
      const quizData: YouPassQuizDetail = json.data;
      setActiveQuiz(quizData);

      const durMins = quizData.time || (quizData.type === 7 ? 20 : 20);
      setTotalAllowedSeconds(durMins * 60);
      setSecondsRemaining(durMins * 60);

      const firstOrder =
        quizData.parts?.[0]?.question_sets?.[0]?.questions?.[0]?.order ?? 1;
      setCurrentQuestionOrder(firstOrder);
    } catch (err) {
      setQuizLoadError(err instanceof Error ? err.message : 'Lỗi tải đề thi');
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleAnswerChange = (order: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [order]: value }));
  };

  const handleMultiAnswerChange = (orders: number[], selectedValues: string[]) => {
    setAnswers((prev) => {
      const next = { ...prev };
      orders.forEach((ord, idx) => {
        next[ord] = selectedValues[idx] || '';
      });
      return next;
    });
  };

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false);
    setIsSubmitted(true);

    if (!activeQuiz) return;
    let correct = 0;
    const total = allQuestionSlots.length;
    allQuestionSlots.forEach((slot) => {
      const ev = evaluateQuestionSlot(
        slot.question,
        answers[slot.order],
        slot.qsType,
        slot.order,
        answers
      );
      if (ev.isCorrect) correct += 1;
    });

    const skill = inferSkillFromQuizType(activeQuiz.type);
    const scaledForBand = total > 0 && total < 40 ? Math.round((correct / total) * 40) : correct;
    const band =
      skill === 'reading' || skill === 'listening'
        ? calculateBandScore(scaledForBand, skill)
        : undefined;

    const record: YouPassAttemptRecord = {
      id: `${activeQuiz.id}-${Date.now()}`,
      quizId: activeQuiz.id,
      title: activeQuiz.title,
      skill,
      correct,
      total,
      bandScore: band,
      durationSeconds: Math.max(1, totalAllowedSeconds - secondsRemaining),
      answers,
      submittedAt: new Date().toISOString(),
    };
    setHistory(saveYouPassAttempt(record));
  };

  const handleSaveWritingSubmission = (writtenText: string, bandScore?: number) => {
    if (!activeQuiz) return;
    const record: YouPassAttemptRecord = {
      id: `${activeQuiz.id}-${Date.now()}`,
      quizId: activeQuiz.id,
      title: activeQuiz.title,
      skill: 'writing',
      correct: bandScore ? Math.round(bandScore) : 0,
      total: 9,
      bandScore,
      durationSeconds: Math.max(1, totalAllowedSeconds - secondsRemaining),
      answers: {},
      essayText: writtenText,
      submittedAt: new Date().toISOString(),
    };
    setHistory(saveYouPassAttempt(record));
  };

  const handleSaveSpeakingAttempt = (topicTitle: string, durationSec: number) => {
    const record: YouPassAttemptRecord = {
      id: `sp-${Date.now()}`,
      quizId: activeSpeakingTopic?.topic.id || Date.now(),
      title: topicTitle,
      skill: 'speaking',
      correct: 1,
      total: 1,
      durationSeconds: durationSec,
      answers: {},
      submittedAt: new Date().toISOString(),
    };
    setHistory(saveYouPassAttempt(record));
  };

  const handleUpdateGoal = (nextGoal: YouPassGoal) => {
    setGoal(nextGoal);
    saveYouPassGoal(nextGoal);
  };

  const answeredCount = useMemo(
    () =>
      allQuestionSlots.filter((sl) => {
        const val = answers[sl.order];
        return typeof val === 'string' && val.trim().length > 0;
      }).length,
    [allQuestionSlots, answers]
  );

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        eyeProtection ? 'bg-[#FFF8F2] text-[#1D1D1F]' : 'bg-[#FFFFFF] text-[#000000]'
      }`}
    >
      {/* ============================================================ */}
      {/* 1. TOP HEADER NAVIGATION (100% INTERNAL ROUTES & STATE)      */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#ECECEC] shadow-xs select-none">
        <div className="max-w-[1440px] mx-auto px-4 h-12 flex items-center justify-between gap-4">
          {/* Logo & Main Internal Tabs */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setViewMode('catalog')}
              className="flex items-center gap-1.5 shrink-0"
            >
              <span className="text-xl font-black text-[#FF6D3A] tracking-tighter">YouPass</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#FFEDD1] text-[#4D2600]">
                1984
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-1 text-[13px] font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                  viewMode === 'dashboard'
                    ? 'text-[#FF6D3A] bg-[#FFF1E5] font-bold'
                    : 'text-[#8A8A8E] hover:text-[#FF6D3A] hover:bg-[#FFF8F2]'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>My Homepage</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('catalog')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                  viewMode === 'catalog' || viewMode === 'exam' || viewMode === 'speaking'
                    ? 'text-[#FF6D3A] bg-[#FFF1E5] font-bold'
                    : 'text-[#8A8A8E] hover:text-[#FF6D3A] hover:bg-[#FFF8F2]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Luyện đề 4 kỹ năng ({totalTestsBadge.toLocaleString()}+ đề)</span>
              </button>

              <Link
                href="/vocab"
                className="px-3 py-1.5 rounded-xl text-[#8A8A8E] hover:text-[#FF6D3A] hover:bg-[#FFF8F2] transition"
              >
                Sổ Từ vựng
              </Link>

              <Link
                href="/admin/import"
                className="px-3 py-1.5 rounded-xl text-[#8A8A8E] hover:text-[#FF6D3A] hover:bg-[#FFF8F2] transition"
              >
                Import Đề
              </Link>

              <Link
                href="/cdt"
                className="px-3 py-1.5 rounded-xl text-[#8A8A8E] hover:text-[#1D1D1F] hover:bg-slate-100 flex items-center gap-1 transition"
                title="Mở giao diện thi máy Cambridge Computer-Delivered IELTS cổ điển"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>CDT Chuẩn BGT</span>
              </Link>
            </nav>
          </div>

          {/* Right Header: Mobile quick nav, PRO badge, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compact mobile navigation pills */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  viewMode === 'dashboard'
                    ? 'bg-[#FF6D3A] text-white'
                    : 'bg-[#FFF8F2] text-[#4D2600]'
                }`}
              >
                Homepage
              </button>
              <button
                type="button"
                onClick={() => setViewMode('catalog')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  viewMode === 'catalog'
                    ? 'bg-[#FF6D3A] text-white'
                    : 'bg-[#FFF8F2] text-[#4D2600]'
                }`}
              >
                Kho đề
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFF1E5] via-[#FFEBE0] to-[#FCE7F3] border border-[#FF6D3A]/20">
              <span className="text-xs font-extrabold text-[#FF6D3A]">PRO Unlocked</span>
              <span className="text-[11px] font-bold text-[#4D2600]">FREE 100%</span>
            </div>

            <button
              type="button"
              onClick={() => setViewMode('dashboard')}
              className="flex items-center gap-2 pl-2 border-l border-[#E5E5EA]"
              title="Xem Dashboard & Lịch sử làm bài"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF6D3A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                TS
              </div>
              <span className="text-xs font-semibold text-[#1D1D1F] hidden md:inline">
                Trường Sơn
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8E]" />
            </button>
          </div>
        </div>

        {/* Exam Room Control Sub-bar (when inside active exam) */}
        {viewMode === 'exam' && (
          <div className="bg-white border-t border-[#ECECEC] px-4 py-2 flex items-center justify-between gap-2 text-xs shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setViewMode('catalog')}
                className="flex items-center gap-1.5 text-[#8A8A8E] hover:text-[#FF6D3A] font-bold shrink-0 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kho đề</span>
              </button>
              <span className="hidden sm:block w-px h-4 bg-[#E5E5EA] shrink-0" />
              <span className="font-bold text-[#1D1D1F] truncate max-w-xs">
                {activeQuiz ? activeQuiz.title : 'Đang tải đề thi...'}
              </span>
            </div>

            {/* Center: Countdown Timer */}
            <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono font-black shadow-xs shrink-0 transition ${
              secondsRemaining <= 300 ? 'bg-[#FF3532] text-white animate-pulse' : 'bg-[#FF6D3A] text-white'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatSecondsHMS(secondsRemaining)}</span>
            </div>

            {/* Tools: Font, Eye, Notes, Settings, Submit */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Font Size Quick Selector */}
              <div className="hidden sm:flex items-center gap-0.5 bg-[#FFF8F2] rounded-full px-1 py-0.5 border border-[#FFEDD1]">
                {(['S', 'M', 'L'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFontSize(sz)}
                    className={`w-6 h-6 rounded-full text-[11px] font-extrabold transition ${
                      fontSize === sz
                        ? 'bg-[#FF6D3A] text-white shadow-xs'
                        : 'text-[#4D2600] hover:bg-[#FFEBE0]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Eye Protection Toggle */}
              <button
                type="button"
                onClick={() => setEyeProtection(!eyeProtection)}
                title={eyeProtection ? 'Tắt bảo vệ mắt' : 'Bật bảo vệ mắt'}
                className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full border font-semibold transition ${
                  eyeProtection
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-white border-[#E5E5EA] text-[#8A8A8E] hover:bg-[#F8F8F8]'
                }`}
              >
                {eyeProtection ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-[#E5E5EA] text-[#1D1D1F] hover:bg-[#F8F8F8] font-semibold transition"
              >
                <FileText className="w-3.5 h-3.5 text-[#FF6D3A]" />
                <span className="hidden sm:inline">Note ({notesList.length})</span>
              </button>

              {!isSubmitted && !isWritingQuiz && activeQuiz && (
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(true)}
                  className="px-4 py-1.5 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-extrabold transition shadow-sm"
                >
                  Hoàn thành
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* 2. ACTIVE VIEWPORT ROUTER                                    */}
      {/* ============================================================ */}
      {viewMode === 'dashboard' && (
        <YouPassHomepageDashboard
          history={history}
          goal={goal}
          onUpdateGoal={handleUpdateGoal}
          onOpenCatalog={(sk) => {
            if (sk) setCatalogSkill(sk);
            setViewMode('catalog');
          }}
          onReviewAttempt={(rec) => {
            launchQuizById(rec.quizId, {
              prefilledAnswers: rec.answers,
              prefilledEssay: rec.essayText,
              submitted: true,
            });
          }}
          onRetakeAttempt={(rec) => {
            launchQuizById(rec.quizId);
          }}
        />
      )}

      {viewMode === 'catalog' && (
        <YouPassCatalog
          activeSkill={catalogSkill}
          onChangeSkill={setCatalogSkill}
          completedQuizIds={completedQuizIds}
          onLaunchQuiz={(quizId, mode) => launchQuizById(quizId, { mode })}
          onLaunchSpeakingTopic={(topic, part) => {
            setActiveSpeakingTopic({ topic, part });
            setViewMode('speaking');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onTotalsLoaded={(totals) => {
            const sum =
              (totals.reading || 533) +
              (totals.listening || 707) +
              (totals.writing || 901) +
              (totals.speaking || 399);
            setTotalTestsBadge(sum);
          }}
        />
      )}

      {viewMode === 'speaking' && activeSpeakingTopic && (
        <YouPassSpeakingStudio
          topic={activeSpeakingTopic.topic}
          partNumber={activeSpeakingTopic.part}
          onBack={() => setViewMode('catalog')}
          onSaveAttempt={handleSaveSpeakingAttempt}
        />
      )}

      {viewMode === 'exam' && (
        <>
          {isLoadingQuiz ? (
            <div className="flex-1 flex items-center justify-center p-10">
              <div className="bg-white rounded-2xl border border-[#FFEDD1] p-8 max-w-md w-full text-center space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-full border-4 border-[#FFF1E5] border-t-[#FF6D3A] animate-spin mx-auto" />
                <h3 className="font-black text-base text-[#1D1D1F]">
                  Đang tải dữ liệu đề thi thực tế từ YouPass...
                </h3>
                <p className="text-xs text-[#8A8A8E]">
                  Đồng bộ văn bản, audio, bảng câu hỏi và giải thích 4 bước.
                </p>
              </div>
            </div>
          ) : quizLoadError ? (
            <div className="flex-1 flex items-center justify-center p-10">
              <div className="bg-white rounded-2xl border border-[#FF3532]/30 p-8 max-w-md w-full text-center space-y-3">
                <p className="font-bold text-sm text-[#FF3532]">{quizLoadError}</p>
                <button
                  type="button"
                  onClick={() => setViewMode('catalog')}
                  className="px-5 py-2 rounded-full bg-[#FF6D3A] text-white font-bold text-xs"
                >
                  Quay lại Kho đề
                </button>
              </div>
            </div>
          ) : activeQuiz && isWritingQuiz ? (
            <YouPassWritingRoom
              quiz={activeQuiz}
              essayText={essayText}
              onEssayChange={setEssayText}
              onSaveSubmission={handleSaveWritingSubmission}
            />
          ) : activeQuiz ? (
            <YouPassReadingListeningRoom
              quiz={activeQuiz}
              isSubmitted={isSubmitted}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onMultiAnswerChange={handleMultiAnswerChange}
              fontSize={fontSize}
              activeTool={activeTool}
              onSelectTool={setActiveTool}
              activeQuestionOrder={currentQuestionOrder}
              onFocusQuestion={setCurrentQuestionOrder}
              onAddNote={(txt) => {
                setNotesList((prev) => [txt, ...prev]);
                setIsNotesOpen(true);
              }}
              initialMode={launchMode}
              onRetake={() => launchQuizById(activeQuiz.id, { mode: launchMode })}
              onBackToCatalog={() => setViewMode('catalog')}
            />
          ) : null}

          {/* Bottom Question Palette for Reading & Listening */}
          {activeQuiz && !isWritingQuiz && allQuestionSlots.length > 0 && (
            <footer className="h-14 bg-white border-t border-[#ECECEC] px-4 sm:px-8 flex items-center justify-between gap-4 z-30 shadow-xs shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {allQuestionSlots.map((slot) => {
                  const val = answers[slot.order];
                  const hasAnswer = typeof val === 'string' && val.trim().length > 0;
                  const isCurrent = currentQuestionOrder === slot.order;
                  const ev = isSubmitted
                    ? evaluateQuestionSlot(
                        slot.question,
                        val,
                        slot.qsType,
                        slot.order,
                        answers
                      )
                    : null;

                  return (
                    <button
                      key={slot.order}
                      type="button"
                      onClick={() => {
                        setCurrentQuestionOrder(slot.order);
                        const cardEl = document.getElementById(`q-card-${slot.order}`);
                        if (cardEl) cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={`w-7 h-7 rounded-full text-xs font-bold transition flex items-center justify-center shrink-0 ${
                        isSubmitted && ev
                          ? ev.isCorrect
                            ? 'bg-[#13A62E] text-white'
                            : 'bg-[#FF3532] text-white'
                          : hasAnswer
                          ? 'bg-[#FF6D3A] text-white shadow-xs'
                          : isCurrent
                          ? 'border-2 border-[#FF6D3A] bg-[#FFF1E5] text-[#FF6D3A]'
                          : 'bg-[#FFF1E5]/60 text-[#4D2600] hover:bg-[#FFEBE0]'
                      }`}
                    >
                      {slot.order}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-[#8A8A8E] hidden sm:inline">
                  Đã làm:{' '}
                  <strong className="text-[#FF6D3A]">
                    {answeredCount}/{allQuestionSlots.length}
                  </strong>
                </span>
                {!isSubmitted && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmModalOpen(true)}
                    className="px-5 py-2 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-extrabold text-xs shadow-sm transition"
                  >
                    Hoàn thành
                  </button>
                )}
              </div>
            </footer>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* 3. SUBMIT CONFIRMATION MODAL                                 */}
      {/* ============================================================ */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-[#FFF1E5] text-[#FF6D3A] flex items-center justify-center mx-auto font-black text-xl">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1D1D1F]">Hoàn thành bài tập</h3>
              <p className="text-xs text-[#8A8A8E] mt-2 leading-relaxed">
                Bạn đã hoàn thành {answeredCount}/{allQuestionSlots.length} câu. Xác nhận nộp bài để xem điểm, định vị câu chứa đáp án và Giải thích 4 Bước miễn phí?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="py-2.5 rounded-full border border-[#CBD5E1] text-[#1D1D1F] hover:bg-[#F8F8F8] font-bold text-xs transition"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="py-2.5 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-extrabold text-xs shadow-sm transition"
              >
                Nộp bài & Chấm điểm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. YOUPASS NOTES DRAWER (SLIDE-OVER PANEL)                   */}
      {/* ============================================================ */}
      {isNotesOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-xs">
          <div className="w-full max-w-sm h-full bg-white shadow-2xl border-l border-[#ECECEC] flex flex-col">
            <div className="p-4 border-b border-[#ECECEC] flex items-center justify-between bg-[#FFF8F2]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF6D3A]" />
                <h3 className="font-extrabold text-[#1D1D1F] text-sm">Ghi chú bài thi</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#FFEDD1] text-[#4D2600] text-[10px] font-bold">
                  {notesList.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsNotesOpen(false)}
                className="p-1 rounded-lg text-[#8A8A8E] hover:text-[#1D1D1F] hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-[#ECECEC] flex items-center justify-between gap-2 bg-[#FAFAFA] text-xs">
              <button
                type="button"
                onClick={() => setIsNotesOpen(false)}
                className="px-3 py-1 rounded-full border border-[#CBD5E1] bg-white hover:bg-[#F8F8F8] font-bold text-[#4D2600] transition"
              >
                Ẩn note
              </button>
              {notesList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setNotesList([])}
                  className="px-3 py-1 rounded-full border border-[#FF3532]/30 bg-[#FFF1F1] hover:bg-rose-100 font-bold text-[#FF3532] transition"
                >
                  Xoá tất cả note
                </button>
              )}
            </div>

            <div className="p-4 border-b border-[#ECECEC] space-y-2">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Nhập ghi chú hoặc từ vựng cần lưu ý khi làm bài..."
                className="w-full h-20 p-2.5 text-xs rounded-xl border border-[#CBD5E1] focus:border-[#FF6D3A] focus:ring-1 focus:ring-[#FF6D3A] outline-hidden resize-none bg-[#FFF8F2]"
              />
              <button
                type="button"
                disabled={!newNoteText.trim()}
                onClick={() => {
                  if (newNoteText.trim()) {
                    setNotesList((prev) => [newNoteText.trim(), ...prev]);
                    setNewNoteText('');
                  }
                }}
                className="w-full py-1.5 rounded-xl bg-[#FF6D3A] hover:bg-[#ff581d] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm ghi chú</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {notesList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#8A8A8E] space-y-2">
                  <FileText className="w-8 h-8 stroke-1 text-[#CBD5E1]" />
                  <p className="text-xs">Chưa có ghi chú nào.</p>
                </div>
              ) : (
                notesList.map((note, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-[#FFF8F2] border border-[#FFEDD1] text-xs text-[#1D1D1F] flex items-start justify-between gap-2 shadow-2xs"
                  >
                    <p className="flex-1 whitespace-pre-wrap leading-relaxed">{note}</p>
                    <button
                      type="button"
                      onClick={() => setNotesList((prev) => prev.filter((_, i) => i !== index))}
                      className="p-1 text-[#8A8A8E] hover:text-[#FF3532] transition"
                      title="Xóa ghi chú này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
