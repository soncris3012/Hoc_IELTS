'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Settings,
  FileText,
  Highlighter,
  BookOpen,
  ChevronDown,
  Clock,
  RotateCcw,
  Zap,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import { youpassLegoExam } from '@/data/youpassLegoTest';
import { StepByStepBuilderModal } from '@/components/exam/StepByStepBuilderModal';
import { QuestionScoreResult } from '@/types/ielts';

export const YouPassExamView: React.FC = () => {
  // Navigation & UI States
  const [fontSize, setFontSize] = useState<'S' | 'M' | 'L'>('M');
  const [eyeProtection, setEyeProtection] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedBuilderQuestion, setSelectedBuilderQuestion] = useState<QuestionScoreResult | null>(null);

  // Exam Answers State
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState<number>(14);
  const [selectedHeading, setSelectedHeading] = useState<string | null>(null);
  const [notesList, setNotesList] = useState<string[]>([]);
  const [newNoteText, setNewNoteText] = useState('');

  // Active Tool Mode (H: Highlight, N: Note, T: Tra từ vựng)
  const [activeTool, setActiveTool] = useState<'highlight' | 'note' | 'vocab' | null>(null);

  // Timer State (starts at 20:00 = 1200 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1200);

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Keyboard Shortcuts (H for Highlight, N for Notes, T for Vocab)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'h' || e.key === 'H') {
        setActiveTool((prev) => (prev === 'highlight' ? null : 'highlight'));
      } else if (e.key === 'n' || e.key === 'N') {
        setActiveTool((prev) => (prev === 'note' ? null : 'note'));
      } else if (e.key === 't' || e.key === 'T') {
        setActiveTool((prev) => (prev === 'vocab' ? null : 'vocab'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `00:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qNum: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [qNum]: value }));
  };

  const handleDropHeading = (paraId: string, qNum: number) => {
    if (selectedHeading) {
      handleSelectAnswer(qNum, selectedHeading);
      setSelectedHeading(null);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    const questions = youpassLegoExam.parts[0].questions;
    questions.forEach((q) => {
      const userAns = (answers[q.number] || '').trim().toLowerCase();
      const targetAns = (q.correctAnswer as string).trim().toLowerCase();
      if (userAns === targetAns) correct += 1;
    });
    return correct;
  };

  const scoreCount = calculateScore();
  const totalCount = youpassLegoExam.parts[0].questions.length;

  const headingsList = [
    'Amateur designers create successful products',
    'An early design fault is put right',
    'An unexpected answer to an environmental problem',
    'A slimmer, more profitable company finally wins praise',
    'A promising alternative is rejected',
    'A worldwide emergency tests the business',
    'Changing habits and new competitors cause a decline',
    'A sad farewell for online players',
  ];

  const fontSizeClasses = {
    S: 'text-xs leading-5',
    M: 'text-sm leading-6',
    L: 'text-base leading-7',
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        eyeProtection ? 'bg-[#FFF8F2] text-[#1D1D1F]' : 'bg-[#FFFFFF] text-[#000000]'
      }`}
    >
      {/* ============================================================ */}
      {/* 1. TOP HEADER NAVIGATION (YOU PASS BRAND BAR)                */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#ECECEC] shadow-xs select-none">
        <div className="max-w-[1440px] mx-auto px-4 h-11 flex items-center justify-between">
          {/* Logo & Main Nav Tabs */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-1.5 shrink-0">
              <span className="text-xl font-black text-[#FF6D3A] tracking-tighter">YouPass</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#FFEDD1] text-[#4D2600]">
                1984
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-1 text-[13px] font-semibold text-[#8A8A8E]">
              <a
                href="https://youpass.vn/home"
                className="px-2.5 py-1.5 rounded-t-lg hover:text-[#FF6D3A] hover:bg-[#FFF8F2] transition"
              >
                My Homepage
              </a>
              <a
                href="https://youpass.vn/khoa-hoc-ielts-intensive-aim-7"
                className="px-2.5 py-1.5 rounded-t-lg hover:text-[#FF6D3A] hover:bg-[#FFF8F2] transition"
              >
                Khóa học Intensive 7.0
              </a>
              <a
                href="https://youpass.vn/luyen-de-dung-cach-cung-youpass-pro"
                className="px-2.5 py-1.5 rounded-t-lg hover:text-[#FF6D3A] hover:bg-[#FFF8F2] transition"
              >
                Luyện đề PRO
              </a>
              <a
                href="/youpass"
                className="px-2.5 py-1.5 rounded-t-lg text-[#FF6D3A] bg-white border-b-2 border-[#FF6D3A] font-bold"
              >
                Luyện đề 4 kỹ năng
              </a>
              <Link
                href="/vocab"
                className="px-2.5 py-1.5 rounded-t-lg hover:text-[#FF6D3A] hover:bg-[#FFF8F2] transition"
              >
                Sổ Từ vựng
              </Link>
              <a
                href="https://youpass.vn/hanh-trinh-hoc-ielts-cung-youpass"
                className="px-2.5 py-1.5 rounded-t-lg hover:text-[#FF6D3A] hover:bg-[#FFF8F2] transition"
              >
                Kết quả học viên
              </a>
            </nav>
          </div>

          {/* Right Header: Nâng cấp PRO, Đậu points & User */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFF1E5] via-[#FFEBE0] to-[#FCE7F3] border border-[#FF6D3A]/20">
              <span className="text-xs font-extrabold text-[#FF6D3A]">Nâng cấp PRO</span>
              <span className="text-[11px] font-bold text-[#4D2600]">0 Đậu</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-[#E5E5EA]">
              <div className="w-8 h-8 rounded-full bg-[#FF6D3A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                TS
              </div>
              <span className="text-xs font-semibold text-[#1D1D1F] hidden md:inline">Trường Sơn</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8E]" />
            </div>
          </div>
        </div>

        {/* Sub-bar: Test Countdown, Tools & Settings */}
        <div className="bg-[#FFF1E5] border-t border-[#FFEDD1] px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1 text-[#8A8A8E] hover:text-[#1D1D1F] font-semibold"
              title="Thoát về trang chủ"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Thoát</span>
            </Link>

            <span className="font-bold text-[#1D1D1F] truncate max-w-xs sm:max-w-md">
              [Simulation Q4] The Lego brick
            </span>
          </div>

          {/* Center Dynamic Timer Pill */}
          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF6D3A] text-white font-mono font-bold shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          {/* Controls: Xem note, Cài đặt, Hoàn thành */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNotesOpen(!isNotesOpen)}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#E5E5EA] text-[#1D1D1F] hover:bg-[#F8F8F8] font-semibold transition"
            >
              <FileText className="w-3.5 h-3.5 text-[#FF6D3A]" />
              <span className="hidden sm:inline">Xem note</span>
            </button>

            {/* Settings Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#E5E5EA] text-[#1D1D1F] hover:bg-[#F8F8F8] font-semibold transition"
              >
                <Settings className="w-3.5 h-3.5 text-[#8A8A8E]" />
                <span className="hidden sm:inline">Cài đặt</span>
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#ECECEC] p-4 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1D1D1F] text-xs">Chế độ bảo vệ mắt</span>
                    <button
                      onClick={() => setEyeProtection(!eyeProtection)}
                      className={`w-9 h-5 rounded-full p-0.5 transition ${
                        eyeProtection ? 'bg-[#FF6D3A]' : 'bg-[#E5E5EA]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                          eyeProtection ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <span className="block font-bold text-[#1D1D1F] text-xs mb-2">Kích cỡ chữ</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['S', 'M', 'L'] as const).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setFontSize(sz)}
                          className={`py-1 rounded-lg text-xs font-bold transition border ${
                            fontSize === sz
                              ? 'bg-[#FF6D3A] text-white border-[#FF6D3A]'
                              : 'bg-[#FFF8F2] text-[#4D2600] border-[#FFEDD1] hover:bg-[#FFEBE0]'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hoàn Thành Button */}
            {!isSubmitted && (
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="px-4 py-1.5 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-extrabold text-xs shadow-sm transition"
              >
                Hoàn thành
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN WORKSPACE (SPLIT PANE: READING & QUESTIONS)          */}
      {/* ============================================================ */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Floating Tool Shortcuts Toolbar on Left Edge */}
        <div className="hidden lg:flex flex-col gap-2 absolute left-2 top-8 z-30 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl border border-[#FFEDD1] shadow-md text-[11px] font-bold text-[#4D2600]">
          <button
            onClick={() => setActiveTool((prev) => (prev === 'highlight' ? null : 'highlight'))}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition ${
              activeTool === 'highlight'
                ? 'bg-[#FF6D3A] text-white'
                : 'hover:bg-[#FFF8F2] text-[#4D2600]'
            }`}
            title="Nhấn phím H để bật/tắt"
          >
            <Highlighter className="w-4 h-4" />
            <span>Highlight</span>
            <span className="text-[9px] opacity-75 font-normal">(H)</span>
          </button>

          <button
            onClick={() => setActiveTool((prev) => (prev === 'note' ? null : 'note'))}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition ${
              activeTool === 'note' ? 'bg-[#FF6D3A] text-white' : 'hover:bg-[#FFF8F2] text-[#4D2600]'
            }`}
            title="Nhấn phím N để ghi chú"
          >
            <FileText className="w-4 h-4" />
            <span>Notes</span>
            <span className="text-[9px] opacity-75 font-normal">(N)</span>
          </button>

          <button
            onClick={() => setActiveTool((prev) => (prev === 'vocab' ? null : 'vocab'))}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition ${
              activeTool === 'vocab' ? 'bg-[#FF6D3A] text-white' : 'hover:bg-[#FFF8F2] text-[#4D2600]'
            }`}
            title="Nhấn phím T để tra từ vựng"
          >
            <BookOpen className="w-4 h-4" />
            <span>Tra từ</span>
            <span className="text-[9px] opacity-75 font-normal">(T)</span>
          </button>
        </div>

        {/* LEFT PANE: READING PASSAGE (THE LEGO BRICK) */}
        <section className="w-full md:w-1/2 h-[50vh] md:h-[calc(100vh-120px)] overflow-y-auto px-6 lg:px-12 py-6 border-r border-[#ECECEC]">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="border-b border-[#FFEDD1] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6D3A]">
                Reading Passage 2
              </span>
              <h2 className="text-2xl font-black text-[#1D1D1F] mt-1">The Lego brick</h2>
            </div>

            {/* Paragraphs with Heading Drop Zones */}
            {youpassLegoExam.parts[0].passage?.paragraphs?.map((para, idx) => {
              const qNum = 14 + idx; // Questions 14 to 20
              const userHeading = answers[qNum];

              return (
                <div key={para.id} className="space-y-2">
                  {/* Drop Zone for Matching Heading */}
                  <div
                    onClick={() => handleDropHeading(para.id, qNum)}
                    className={`p-2.5 rounded-xl border-2 border-dashed transition cursor-pointer flex items-center justify-between text-xs ${
                      userHeading
                        ? 'border-[#13A62E] bg-[#E8F8EC] text-[#13A62E] font-bold'
                        : selectedHeading
                        ? 'border-[#FF6D3A] bg-[#FFF1E5] text-[#FF6D3A] animate-pulse font-semibold'
                        : 'border-[#CBD5E1] bg-white/60 hover:bg-white text-[#8A8A8E]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#FF6D3A] text-white flex items-center justify-center font-bold text-[10px]">
                        {qNum}
                      </span>
                      <span>
                        {userHeading
                          ? `Đáp án đã chọn: ${userHeading}`
                          : selectedHeading
                          ? `Bấm vào đây để gán Heading cho Paragraph ${para.label}`
                          : `[Drop Zone ${qNum}] Kéo hoặc chọn Heading cho Paragraph ${para.label}`}
                      </span>
                    </div>
                    {userHeading && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAnswer(qNum, '');
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Hủy chọn"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Paragraph Text */}
                  <p className={`${fontSizeClasses[fontSize]} text-[#333333] text-justify font-serif`}>
                    <strong className="font-bold text-[#FF6D3A] font-sans mr-2">
                      {para.label}.
                    </strong>
                    {para.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT PANE: QUESTIONS (MATCHING HEADINGS, MCQS, GAP FILLING) */}
        <section className="w-full md:w-1/2 h-[50vh] md:h-[calc(100vh-120px)] overflow-y-auto px-6 lg:px-10 py-6 bg-white/70">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* 1. MATCHING HEADINGS SECTION (QUESTIONS 14–20) */}
            <div className="p-5 rounded-2xl bg-white border border-[#FFEDD1] shadow-xs space-y-4">
              <div className="border-b border-[#ECECEC] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6D3A]">
                  Questions 14–20
                </span>
                <h3 className="text-base font-extrabold text-[#1D1D1F]">
                  Choose the correct heading for each paragraph from the list below.
                </h3>
                <p className="text-xs text-[#8A8A8E] mt-1">
                  💡 Bấm chọn một Heading bên dưới rồi bấm vào ô trống ở đoạn văn tương ứng để điền.
                </p>
              </div>

              {/* Headings Pills */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#4D2600] uppercase tracking-wider">
                  List of Headings:
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {headingsList.map((h, i) => {
                    const isSelected = selectedHeading === h;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedHeading(isSelected ? null : h)}
                        className={`p-2.5 text-left text-xs font-semibold rounded-xl border transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FF6D3A] text-white border-[#FF6D3A] shadow-sm ring-2 ring-[#FF6D3A]/30'
                            : 'bg-[#FFF8F2] text-[#4D2600] border-[#FFEDD1] hover:bg-[#FFEBE0]'
                        }`}
                      >
                        <span>{h}</span>
                        {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. MULTIPLE CHOICE SECTION (QUESTIONS 21–23) */}
            <div className="p-5 rounded-2xl bg-white border border-[#FFEDD1] shadow-xs space-y-6">
              <div className="border-b border-[#ECECEC] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6D3A]">
                  Questions 21–23
                </span>
                <h3 className="text-base font-extrabold text-[#1D1D1F]">
                  Choose the correct letter, A, B, C or D.
                </h3>
              </div>

              {/* Question 21 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF6D3A] text-white flex items-center justify-center font-bold text-xs">
                    21
                  </span>
                  <p className="text-sm font-bold text-[#1D1D1F]">
                    What does the writer say about the brick in Paragraph B?
                  </p>
                </div>
                <div className="space-y-2 pl-8">
                  {[
                    { label: 'A', text: 'It was too difficult to use.' },
                    { label: 'B', text: 'It was badly made.' },
                    { label: 'C', text: 'It was cheaper than other toys.' },
                    { label: 'D', text: 'It was about to lose its leading position.' },
                  ].map((opt) => (
                    <label
                      key={opt.label}
                      onClick={() => handleSelectAnswer(21, opt.label)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition text-xs font-semibold ${
                        answers[21] === opt.label
                          ? 'border-[#FF6D3A] bg-[#FFF1E5] text-[#FF6D3A] ring-1 ring-[#FF6D3A]'
                          : 'border-[#ECECEC] hover:bg-[#FFF8F2] text-[#333333]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q21"
                        checked={answers[21] === opt.label}
                        onChange={() => {}}
                        className="accent-[#FF6D3A]"
                      />
                      <span className="font-bold">{opt.label}.</span>
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 22 */}
              <div className="space-y-3 pt-4 border-t border-[#ECECEC]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF6D3A] text-white flex items-center justify-center font-bold text-xs">
                    22
                  </span>
                  <p className="text-sm font-bold text-[#1D1D1F]">
                    After taking charge as chief executive, Knudstorp
                  </p>
                </div>
                <div className="space-y-2 pl-8">
                  {[
                    { label: 'A', text: 'invested in new theme parks.' },
                    { label: 'B', text: 'made the organisation smaller and simpler.' },
                    { label: 'C', text: 'moved its head office to another country.' },
                    { label: 'D', text: "changed the company's name." },
                  ].map((opt) => (
                    <label
                      key={opt.label}
                      onClick={() => handleSelectAnswer(22, opt.label)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition text-xs font-semibold ${
                        answers[22] === opt.label
                          ? 'border-[#FF6D3A] bg-[#FFF1E5] text-[#FF6D3A] ring-1 ring-[#FF6D3A]'
                          : 'border-[#ECECEC] hover:bg-[#FFF8F2] text-[#333333]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q22"
                        checked={answers[22] === opt.label}
                        onChange={() => {}}
                        className="accent-[#FF6D3A]"
                      />
                      <span className="font-bold">{opt.label}.</span>
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 23 */}
              <div className="space-y-3 pt-4 border-t border-[#ECECEC]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF6D3A] text-white flex items-center justify-center font-bold text-xs">
                    23
                  </span>
                  <p className="text-sm font-bold text-[#1D1D1F]">
                    Before Lego considers a fan&apos;s suggestion, the suggestion has to
                  </p>
                </div>
                <div className="space-y-2 pl-8">
                  {[
                    { label: 'A', text: 'be submitted from Japan.' },
                    { label: 'B', text: 'have already earned money from sales.' },
                    { label: 'C', text: "prove popular with the site's users." },
                    { label: 'D', text: "come from one of the company's employees." },
                  ].map((opt) => (
                    <label
                      key={opt.label}
                      onClick={() => handleSelectAnswer(23, opt.label)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition text-xs font-semibold ${
                        answers[23] === opt.label
                          ? 'border-[#FF6D3A] bg-[#FFF1E5] text-[#FF6D3A] ring-1 ring-[#FF6D3A]'
                          : 'border-[#ECECEC] hover:bg-[#FFF8F2] text-[#333333]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q23"
                        checked={answers[23] === opt.label}
                        onChange={() => {}}
                        className="accent-[#FF6D3A]"
                      />
                      <span className="font-bold">{opt.label}.</span>
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. SUMMARY COMPLETION SECTION (QUESTIONS 24–26) */}
            <div className="p-5 rounded-2xl bg-white border border-[#FFEDD1] shadow-xs space-y-4">
              <div className="border-b border-[#ECECEC] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6D3A]">
                  Questions 24–26
                </span>
                <h3 className="text-base font-extrabold text-[#1D1D1F]">Complete the summary below.</h3>
                <p className="text-xs text-[#8A8A8E] mt-1">
                  Choose <strong className="text-[#FF6D3A]">ONE WORD AND/OR A NUMBER</strong> from the passage for each answer.
                </p>
              </div>

              <div className="p-4 bg-[#FFF8F2] rounded-xl border border-[#FFEDD1] space-y-4 text-xs sm:text-sm leading-relaxed text-[#333333]">
                <h4 className="font-bold text-[#4D2600] text-sm uppercase tracking-wide">
                  Recent challenges
                </h4>

                <p>
                  In 2020 the pandemic led to the temporary closure of stores and factories. Nevertheless, interest in Lego increased, and its online shop received twice as many visits. By the end of the year it had raised its{' '}
                  <span className="inline-flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-[#FF6D3A] text-white flex items-center justify-center font-bold text-[10px]">
                      24
                    </span>
                    <input
                      type="text"
                      value={answers[24] || ''}
                      onChange={(e) => handleSelectAnswer(24, e.target.value)}
                      placeholder="Nhập từ..."
                      className="w-28 px-2 py-1 text-xs font-bold rounded-lg border border-[#CBD5E1] bg-white text-[#FF6D3A] outline-hidden focus:ring-2 focus:ring-[#FF6D3A]"
                    />
                  </span>
                  , and its profits had risen even more.
                </p>

                <p>
                  Attempts to make bricks from old plastic bottles have been less successful. Calculations suggested that, on average, one used bottle could supply the plastic for a total of{' '}
                  <span className="inline-flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-[#FF6D3A] text-white flex items-center justify-center font-bold text-[10px]">
                      25
                    </span>
                    <input
                      type="text"
                      value={answers[25] || ''}
                      onChange={(e) => handleSelectAnswer(25, e.target.value)}
                      placeholder="Nhập số/từ..."
                      className="w-28 px-2 py-1 text-xs font-bold rounded-lg border border-[#CBD5E1] bg-white text-[#FF6D3A] outline-hidden focus:ring-2 focus:ring-[#FF6D3A]"
                    />
                  </span>{' '}
                  bricks. However, the plan was abandoned because it would have raised emissions.
                </p>

                <p>
                  Toys that pass{' '}
                  <span className="inline-flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-[#FF6D3A] text-white flex items-center justify-center font-bold text-[10px]">
                      26
                    </span>
                    <input
                      type="text"
                      value={answers[26] || ''}
                      onChange={(e) => handleSelectAnswer(26, e.target.value)}
                      placeholder="Nhập từ..."
                      className="w-28 px-2 py-1 text-xs font-bold rounded-lg border border-[#CBD5E1] bg-white text-[#FF6D3A] outline-hidden focus:ring-2 focus:ring-[#FF6D3A]"
                    />
                  </span>{' '}
                  standards of safety can last for decades. Meanwhile, owners are encouraged to give away bricks they no longer need, and the greenest brick of all may be an old one.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* 3. BOTTOM QUESTION PALETTE & FINISH BAR                      */}
      {/* ============================================================ */}
      <footer className="h-14 bg-white border-t border-[#ECECEC] px-4 sm:px-8 flex items-center justify-between z-30 shadow-xs">
        {/* Numbers 14 to 26 */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {Array.from({ length: 13 }, (_, i) => 14 + i).map((num) => {
            const hasAnswer = Boolean(answers[num] && answers[num].trim());
            const isCurrent = currentQuestion === num;

            return (
              <button
                key={num}
                onClick={() => setCurrentQuestion(num)}
                className={`w-7 h-7 rounded-full text-xs font-bold transition flex items-center justify-center ${
                  hasAnswer
                    ? 'bg-[#FF6D3A] text-white shadow-xs'
                    : isCurrent
                    ? 'border-2 border-[#FF6D3A] bg-[#FFF1E5] text-[#FF6D3A]'
                    : 'bg-[#FFF1E5]/60 text-[#4D2600] hover:bg-[#FFEBE0]'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Right side stats & Submit */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#8A8A8E] hidden sm:inline">
            Đã làm:{' '}
            <strong className="text-[#FF6D3A]">
              {Object.keys(answers).filter((k) => answers[Number(k)]).length}
            </strong>
            /13 câu
          </span>

          {!isSubmitted && (
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="px-5 py-2 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-extrabold text-xs shadow-sm transition"
            >
              Hoàn thành
            </button>
          )}
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 4. SUBMIT CONFIRMATION MODAL                                 */}
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
                Bạn có chắc chắn muốn nộp phần bài tập đã làm chưa? Nếu chắc chắn với các đáp án đã làm hãy bấm nút hoàn thành.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="py-2.5 rounded-full border border-[#CBD5E1] text-[#1D1D1F] hover:bg-[#F8F8F8] font-bold text-xs transition"
              >
                Quay lại
              </button>
              <button
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setIsSubmitted(true);
                }}
                className="py-2.5 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-extrabold text-xs shadow-sm transition"
              >
                Hoàn thành
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. RESULT & EXPLANATION REVIEW SCREEN (1:1 YOUPASS REVIEW)   */}
      {/* ============================================================ */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FFF8F2] p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Top Score Banner */}
            <div className="bg-white rounded-2xl border border-[#FFEDD1] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6D3A]">
                  Kết quả làm bài YouPass
                </span>
                <h2 className="text-2xl font-black text-[#1D1D1F]">
                  [Simulation Q4] The Lego brick
                </h2>
                <p className="text-xs text-[#8A8A8E]">
                  Thời gian làm bài: <strong>{formatTimer(1200 - secondsRemaining)}</strong>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center px-5 py-3 rounded-2xl bg-[#FFF1E5] border border-[#FFEDD1]">
                  <span className="text-3xl font-black text-[#FF6D3A]">
                    {scoreCount}/{totalCount}
                  </span>
                  <span className="block text-[11px] font-bold text-[#4D2600] mt-0.5">
                    Câu trả lời đúng
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setAnswers({});
                    setSecondsRemaining(1200);
                  }}
                  className="p-3 rounded-xl border border-[#E5E5EA] text-[#8A8A8E] hover:text-[#1D1D1F] hover:bg-white transition"
                  title="Làm lại đề này"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Questions Detailed Solution Cards */}
            <div className="bg-white rounded-2xl border border-[#FFEDD1] p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-[#1D1D1F] border-b border-[#ECECEC] pb-3">
                Bảng Giải Thích Đáp Án & Hướng Dẫn YouPass Builder
              </h3>

              <div className="space-y-4">
                {youpassLegoExam.parts[0].questions.map((q) => {
                  const userAns = answers[q.number];
                  const isCorrect = (userAns || '').trim().toLowerCase() === (q.correctAnswer as string).trim().toLowerCase();

                  return (
                    <div
                      key={q.number}
                      className={`p-4 rounded-xl border transition ${
                        isCorrect
                          ? 'border-[#13A62E]/40 bg-[#E8F8EC]/30'
                          : 'border-[#FF3532]/40 bg-[#FFF1F1]/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-xs ${
                                isCorrect ? 'bg-[#13A62E]' : 'bg-[#FF3532]'
                              }`}
                            >
                              {q.number}
                            </span>
                            <span className="text-xs font-bold text-[#8A8A8E] uppercase">
                              {q.type.replace('_', ' ')}
                            </span>
                            <span
                              className={`text-[11px] font-extrabold ${
                                isCorrect ? 'text-[#13A62E]' : 'text-[#FF3532]'
                              }`}
                            >
                              {isCorrect ? '✓ Đúng' : '✗ Sai'}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[#1D1D1F] mt-1">{q.prompt}</p>
                          <div className="text-xs text-[#333333] pt-1">
                            Bạn chọn:{' '}
                            <strong className={isCorrect ? 'text-[#13A62E]' : 'text-[#FF3532]'}>
                              {userAns || 'Chưa làm'}
                            </strong>
                            {'  '}➔ Đáp án đúng:{' '}
                            <strong className="text-[#13A62E]">{q.correctAnswer}</strong>
                          </div>
                          <p className="text-xs text-[#8A8A8E] pt-1 italic font-serif leading-relaxed">
                            💡 {q.explanation}
                          </p>
                        </div>

                        {/* Open Builder 4-Step Solver */}
                        <button
                          onClick={() =>
                            setSelectedBuilderQuestion({
                              questionNumber: q.number,
                              prompt: q.prompt,
                              userAnswer: userAns,
                              correctAnswer: q.correctAnswer,
                              isCorrect,
                              type: q.type,
                              part: 1,
                              explanation: q.explanation,
                              evidenceSentence: q.evidenceSentence,
                              evidenceSentenceId: q.evidenceSentenceId,
                              paraphrasePairs: q.paraphrasePairs,
                              distractorExplanations: q.distractorExplanations,
                              errorTag: q.errorTag,
                            })
                          }
                          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FF6D3A] hover:bg-[#ff581d] text-white text-xs font-bold shadow-xs transition"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Builder 4 Bước</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center pb-8">
              <Link
                href="/"
                className="px-6 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-[#333333] text-white font-bold text-xs shadow-sm transition"
              >
                Quay Lại Phòng Thi Chính
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. YOUPASS NOTES DRAWER (SLIDE-OVER PANEL)                   */}
      {/* ============================================================ */}
      {isNotesOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm h-full bg-white shadow-2xl border-l border-[#ECECEC] flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#ECECEC] flex items-center justify-between bg-[#FFF8F2]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF6D3A]" />
                <h3 className="font-extrabold text-[#1D1D1F] text-sm">Ghi chú bài thi</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#FFEDD1] text-[#4D2600] text-[10px] font-bold">
                  {notesList.length}
                </span>
              </div>
              <button
                onClick={() => setIsNotesOpen(false)}
                className="p-1 rounded-lg text-[#8A8A8E] hover:text-[#1D1D1F] hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note Control Action Bar */}
            <div className="p-3 border-b border-[#ECECEC] flex items-center justify-between gap-2 bg-[#FAFAFA] text-xs">
              <button
                onClick={() => setIsNotesOpen(false)}
                className="px-3 py-1 rounded-full border border-[#CBD5E1] bg-white hover:bg-[#F8F8F8] font-bold text-[#4D2600] transition"
              >
                Ẩn note
              </button>
              {notesList.length > 0 && (
                <button
                  onClick={() => setNotesList([])}
                  className="px-3 py-1 rounded-full border border-[#FF3532]/30 bg-[#FFF1F1] hover:bg-rose-100 font-bold text-[#FF3532] transition"
                >
                  Xoá tất cả note
                </button>
              )}
            </div>

            {/* Add Note Input Area */}
            <div className="p-4 border-b border-[#ECECEC] space-y-2">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Nhập ghi chú hoặc từ vựng cần lưu ý khi làm bài..."
                className="w-full h-20 p-2.5 text-xs rounded-xl border border-[#CBD5E1] focus:border-[#FF6D3A] focus:ring-1 focus:ring-[#FF6D3A] outline-hidden resize-none bg-[#FFF8F2]"
              />
              <button
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

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {notesList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#8A8A8E] space-y-2">
                  <FileText className="w-8 h-8 stroke-1 text-[#CBD5E1]" />
                  <p className="text-xs">Chưa có ghi chú nào.</p>
                  <p className="text-[11px] text-[#A0A0A5] max-w-[200px]">
                    Bôi đen đoạn văn hoặc nhập vào ô trên để lưu lại lưu ý.
                  </p>
                </div>
              ) : (
                notesList.map((note, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-[#FFF8F2] border border-[#FFEDD1] text-xs text-[#1D1D1F] flex items-start justify-between gap-2 shadow-2xs"
                  >
                    <p className="flex-1 whitespace-pre-wrap leading-relaxed">{note}</p>
                    <button
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

      {/* ============================================================ */}
      {/* 7. YOUPASS BUILDER MODAL (FREE UNLOCKED)                     */}
      {/* ============================================================ */}
      <StepByStepBuilderModal
        result={selectedBuilderQuestion}
        onClose={() => setSelectedBuilderQuestion(null)}
      />
    </div>
  );
};
