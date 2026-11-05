'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useExamStore } from '@/lib/store';
import { TopBar } from '@/components/exam/TopBar';
import { ResizableSplitPane } from '@/components/exam/ResizableSplitPane';
import { PassagePane } from '@/components/exam/PassagePane';
import { QuestionsPane } from '@/components/exam/QuestionsPane';
import { BottomPalette } from '@/components/exam/BottomPalette';
import { HighlightMenu } from '@/components/exam/HighlightMenu';
import { StickyNoteModal } from '@/components/exam/StickyNoteModal';
import { ReviewResultDashboard } from '@/components/exam/ReviewResultDashboard';
import { CandidateConfirmModal } from '@/components/exam/CandidateConfirmModal';
import { VocabLookupModal } from '@/components/exam/VocabLookupModal';
import { GoalSettingModal } from '@/components/exam/GoalSettingModal';
import { mockReadingExam } from '@/data/mockReadingTest';
import { mockListeningExam } from '@/data/mockListeningTest';
import { youpassLegoExam } from '@/data/youpassLegoTest';
import { BookOpen, Headphones, PenTool, Database, Mic, ShieldAlert, BookMarked, Target, Flame, Sparkles } from 'lucide-react';

export default function ExamRoomPage() {
  const {
    exam,
    isSubmitted,
    theme,
    fontSize,
    loadExam,
    currentQuestionNumber,
    setCurrentQuestion,
    vocabList,
    userGoal,
  } = useExamStore();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Calculate days left
  const calculateDaysLeft = (dateStr?: string) => {
    if (!dateStr) return null;
    const target = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const daysLeft = calculateDaysLeft(userGoal.examDate);

  // Apply theme & font size classes to body element
  useEffect(() => {
    document.body.className = `theme-${theme} font-${fontSize}`;
  }, [theme, fontSize]);

  // Global Keyboard Navigation Shortcuts (Official CDT feature)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + N -> Next Question
      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        if (currentQuestionNumber < 40) {
          setCurrentQuestion(currentQuestionNumber + 1);
        }
      }
      // Alt + P -> Previous Question
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        if (currentQuestionNumber > 1) {
          setCurrentQuestion(currentQuestionNumber - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionNumber, setCurrentQuestion]);

  // If exam has been submitted, show Review Result Dashboard
  if (isSubmitted) {
    return <ReviewResultDashboard />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans">
      {/* Module Switcher Pill Bar (YouPass Style) */}
      <div className="h-8 px-4 bg-slate-900 text-white flex items-center justify-between text-[11px] select-none shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-extrabold uppercase tracking-widest text-sky-400">
            Hoc_IELTS
          </span>
          <span className="opacity-40">•</span>
          <span className="text-slate-300 hidden sm:inline">Official Computer-Delivered IELTS Simulation</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Target Band & Exam Date Countdown Button (YouPass Goal) */}
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-300 font-bold transition text-[10px] sm:text-[11px]"
            title="Bấm để chỉnh sửa Mục tiêu Band & Ngày thi"
          >
            <Target className="w-3 h-3 text-sky-400" />
            <span>Target: {userGoal.targetBand.toFixed(1)}</span>
            {daysLeft !== null && (
              <span className="text-slate-400 font-normal hidden md:inline">
                ({daysLeft}d left)
              </span>
            )}
            <span className="flex items-center gap-0.5 text-orange-400">
              <Flame className="w-2.5 h-2.5" />
              <span>{userGoal.streakDays}d</span>
            </span>
          </button>

          <button
            onClick={() => {
              loadExam(mockReadingExam);
              setIsConfirmModalOpen(true);
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
              exam.module === 'reading'
                ? 'bg-sky-600 text-white font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Reading</span>
          </button>

          <button
            onClick={() => {
              loadExam(mockListeningExam);
              setIsConfirmModalOpen(true);
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
              exam.module === 'listening'
                ? 'bg-sky-600 text-white font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Headphones className="w-3 h-3" />
            <span>Listening</span>
          </button>

          {/* YouPass Simulation Q4 Real Exam */}
          <button
            onClick={() => {
              loadExam(youpassLegoExam);
              setIsConfirmModalOpen(true);
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
              exam.id === youpassLegoExam.id
                ? 'bg-orange-600 text-white font-bold shadow-xs'
                : 'text-amber-300 hover:text-white'
            }`}
            title="Đề YouPass Simulation thực tế được cào trực tiếp từ tài khoản"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>YouPass Lego Test</span>
          </button>

          {/* Sổ Từ Vựng (YouPass Vocab Book) */}
          <Link
            href="/vocab"
            className="flex items-center gap-1 px-2 py-0.5 rounded text-orange-400 hover:text-orange-300 hover:bg-slate-800 transition font-medium"
            title="Sổ Từ Vựng cá nhân & Flashcards"
          >
            <BookMarked className="w-3 h-3" />
            <span>Sổ Từ</span>
            <span className="px-1 py-0.2 rounded-full bg-orange-600 text-white text-[9px] font-bold">
              {vocabList.length}
            </span>
          </Link>

          <Link
            href="/dictation"
            className="flex items-center gap-1 px-2 py-0.5 rounded text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 transition font-medium"
          >
            <Mic className="w-3 h-3" />
            <span>Dictation</span>
          </Link>

          <Link
            href="/writing"
            className="flex items-center gap-1 px-2 py-0.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <PenTool className="w-3 h-3" />
            <span>Writing</span>
          </Link>

          <Link
            href="/admin/import"
            className="flex items-center gap-1 px-2 py-0.5 rounded text-amber-300 hover:text-amber-200 hover:bg-slate-800 transition font-medium"
          >
            <Database className="w-3 h-3" />
            <span className="hidden sm:inline">Import</span>
          </Link>

          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Candidate Setup & Verification Screen"
          >
            <ShieldAlert className="w-3 h-3 text-sky-400" />
            <span className="hidden md:inline">ID Check</span>
          </button>
        </div>
      </div>

      {/* Top Bar (Candidate Info, Countdown Timer, Settings, Submit) */}
      <TopBar />

      {/* Main Workspace (Split-Pane for Reading/Listening) */}
      <main className="flex-1 flex overflow-hidden relative">
        <ResizableSplitPane
          leftPane={<PassagePane />}
          rightPane={<QuestionsPane />}
        />
      </main>

      {/* Bottom Palette (Question numbers 1-40, Parts, Review Checkbox, Prev/Next) */}
      <BottomPalette />

      {/* Highlight context menu & sticky note popover */}
      <HighlightMenu />
      <StickyNoteModal />

      {/* Candidate Start & Sound Verification Modal */}
      <CandidateConfirmModal
        isOpen={isConfirmModalOpen}
        onStart={() => setIsConfirmModalOpen(false)}
      />

      {/* YouPass Vocab Book Lookup Modal */}
      <VocabLookupModal />

      {/* Target Band & Exam Date Goal Modal */}
      <GoalSettingModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />
    </div>
  );
}
