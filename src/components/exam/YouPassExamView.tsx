'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  Headphones,
  PenTool,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Filter,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import {
  youpassReadingCatalog,
  youpassListeningCatalog,
  youpassWritingCatalog,
  getYouPassExamById,
  YouPassTestItem,
} from '@/data/youpassCatalog';
import { youpassLegoExam } from '@/data/youpassLegoTest';
import { StepByStepBuilderModal } from '@/components/exam/StepByStepBuilderModal';
import { QuestionScoreResult, IELTSExam } from '@/types/ielts';

export const YouPassExamView: React.FC = () => {
  // Navigation & View Mode ('catalog' for test library, 'exam' for active exam room)
  const [viewMode, setViewMode] = useState<'catalog' | 'exam'>('catalog');
  const [activeExam, setActiveExam] = useState<IELTSExam>(youpassLegoExam);

  // Catalog State
  const [activeSkill, setActiveSkill] = useState<'reading' | 'listening' | 'writing'>('reading');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [catalogStatus, setCatalogStatus] = useState<'unfinished' | 'finished'>('unfinished');

  // Exam Room Settings & UI States
  const [fontSize, setFontSize] = useState<'S' | 'M' | 'L'>('M');
  const [eyeProtection, setEyeProtection] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedBuilderQuestion, setSelectedBuilderQuestion] = useState<QuestionScoreResult | null>(null);

  // Exam Answers State
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [selectedHeading, setSelectedHeading] = useState<string | null>(null);
  const [notesList, setNotesList] = useState<string[]>([]);
  const [newNoteText, setNewNoteText] = useState('');

  // Active Tool Mode (H: Highlight, N: Note, T: Tra từ vựng)
  const [activeTool, setActiveTool] = useState<'highlight' | 'note' | 'vocab' | null>(null);

  // Timer State (starts at durationMinutes * 60)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1200);

  useEffect(() => {
    if (isSubmitted || viewMode !== 'exam') return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, viewMode]);

  // Keyboard Shortcuts (H for Highlight, N for Notes, T for Vocab)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
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
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `00:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qNum: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [qNum]: value }));
  };

  const handleDropHeading = (_paraId: string, qNum: number) => {
    if (selectedHeading) {
      handleSelectAnswer(qNum, selectedHeading);
      setSelectedHeading(null);
    }
  };

  const handleLaunchTest = (testItem: YouPassTestItem) => {
    const examData = getYouPassExamById(testItem.id + ' ' + testItem.title);
    setActiveExam(examData);
    setAnswers({});
    setIsSubmitted(false);
    setSecondsRemaining((examData.durationMinutes || 20) * 60);
    setCurrentQuestion(examData.parts[0]?.questions[0]?.number || 1);
    setViewMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateScore = () => {
    let correct = 0;
    const questions = activeExam.parts[0]?.questions || [];
    questions.forEach((q) => {
      const userAns = (answers[q.number] || '').trim().toLowerCase();
      const targetAns = (q.correctAnswer as string).trim().toLowerCase();
      if (userAns === targetAns) correct += 1;
    });
    return correct;
  };

  const scoreCount = calculateScore();
  const totalCount = activeExam.parts[0]?.questions?.length || 0;

  // Filter Catalog Data
  const currentCatalogList = useMemo(() => {
    let list: YouPassTestItem[] = [];
    if (activeSkill === 'reading') list = youpassReadingCatalog;
    else if (activeSkill === 'listening') list = youpassListeningCatalog;
    else list = youpassWritingCatalog;

    return list.filter((item) => {
      const matchSource = selectedSource === 'ALL' || item.source === selectedSource;
      const matchType =
        selectedType === 'ALL' ||
        item.questionTypes.some((t) => t.toLowerCase().includes(selectedType.toLowerCase()));
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.passage && item.passage.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSource && matchType && matchSearch;
    });
  }, [activeSkill, selectedSource, selectedType, searchQuery]);

  const headingsList = [
    'i. Amateur designers create successful products',
    'ii. An early design fault is put right',
    'iii. An unexpected answer to an environmental problem',
    'iv. A slimmer, more profitable company finally wins praise',
    'v. A promising alternative is rejected',
    'vi. A worldwide emergency tests the business',
    'vii. Changing habits and new competitors cause a decline',
    'viii. A sad farewell for online players',
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
      {/* 1. TOP HEADER NAVIGATION (AUTHENTIC YOUPASS 1984 BAR)        */}
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
              <button
                onClick={() => setViewMode('catalog')}
                className={`px-2.5 py-1.5 rounded-t-lg font-bold transition ${
                  viewMode === 'catalog'
                    ? 'text-[#FF6D3A] bg-[#FFF8F2] border-b-2 border-[#FF6D3A]'
                    : 'text-[#8A8A8E] hover:text-[#FF6D3A]'
                }`}
              >
                Luyện đề 4 kỹ năng ({youpassReadingCatalog.length + youpassListeningCatalog.length} đề)
              </button>
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

        {/* Sub-bar: Exam Controls or Catalog Switcher */}
        {viewMode === 'exam' ? (
          <div className="bg-[#FFF1E5] border-t border-[#FFEDD1] px-4 py-1.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('catalog')}
                className="flex items-center gap-1 text-[#8A8A8E] hover:text-[#1D1D1F] font-bold"
                title="Quay lại kho đề"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kho đề</span>
              </button>

              <span className="font-bold text-[#1D1D1F] truncate max-w-xs sm:max-w-md">
                {activeExam.title}
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
        ) : (
          <div className="bg-[#FFF1E5] border-t border-[#FFEDD1] px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="font-bold text-[#4D2600]">Kỹ năng luyện tập:</span>
              <button
                onClick={() => setActiveSkill('reading')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition ${
                  activeSkill === 'reading'
                    ? 'bg-[#FF6D3A] text-white shadow-xs'
                    : 'bg-white text-[#4D2600] hover:bg-[#FFEBE0]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Reading ({youpassReadingCatalog.length})</span>
              </button>

              <button
                onClick={() => setActiveSkill('listening')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition ${
                  activeSkill === 'listening'
                    ? 'bg-[#FF6D3A] text-white shadow-xs'
                    : 'bg-white text-[#4D2600] hover:bg-[#FFEBE0]'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Listening ({youpassListeningCatalog.length})</span>
              </button>

              <button
                onClick={() => setActiveSkill('writing')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition ${
                  activeSkill === 'writing'
                    ? 'bg-[#FF6D3A] text-white shadow-xs'
                    : 'bg-white text-[#4D2600] hover:bg-[#FFEBE0]'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Writing ({youpassWritingCatalog.length})</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-[#8A8A8E]">Đang chọn:</span>
              <strong className="text-[#FF6D3A]">{currentCatalogList.length} đề thi sẵn sàng</strong>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* 2. MODE: CATALOG BROWSER (THƯ VIỆN ĐỀ THI ĐẦY ĐỦ YOUPASS)    */}
      {/* ============================================================ */}
      {viewMode === 'catalog' && (
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
          {/* Left Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0 space-y-6">
            {/* Practice Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FF6D3A] to-[#FFA41B] text-white shadow-sm space-y-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider">
                  YouPass Practice Plan
                </span>
              </div>
              <h3 className="text-sm font-black leading-snug">
                Phá đảo tất cả dạng đề IELTS cùng YouPass!
              </h3>
              <p className="text-[11px] text-orange-100 leading-relaxed">
                Đề thi cào trực tiếp từ YouPass Collect, YouPass Simulation và Actual Tests.
              </p>
            </div>

            {/* Filter: Nguồn tài liệu */}
            <div className="p-4 rounded-2xl bg-white border border-[#FFEDD1] shadow-2xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4D2600] uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-[#FF6D3A]" />
                <span>Nguồn tài liệu</span>
              </div>
              <div className="space-y-1 text-xs">
                {[
                  { label: 'Tất cả nguồn', val: 'ALL' },
                  { label: 'YouPass Collect (Đề thi thật)', val: 'YouPass Collect' },
                  { label: 'YouPass Simulation', val: 'YouPass Simulation' },
                  { label: 'Actual Tests', val: 'Actual Tests' },
                  { label: 'Cambridge C10-C20', val: 'C10-C20' },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => setSelectedSource(s.val)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl font-semibold transition flex items-center justify-between ${
                      selectedSource === s.val
                        ? 'bg-[#FFF1E5] text-[#FF6D3A] font-bold'
                        : 'text-[#333333] hover:bg-[#FFF8F2]'
                    }`}
                  >
                    <span>{s.label}</span>
                    {selectedSource === s.val && <Check className="w-3.5 h-3.5 text-[#FF6D3A]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Loại câu hỏi */}
            <div className="p-4 rounded-2xl bg-white border border-[#FFEDD1] shadow-2xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4D2600] uppercase tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6D3A]" />
                <span>Loại câu hỏi</span>
              </div>
              <div className="space-y-1 text-xs">
                {[
                  { label: 'Tất cả dạng bài', val: 'ALL' },
                  { label: 'Matching Headings', val: 'Matching Headings' },
                  { label: 'Gap Filling (Điền từ)', val: 'Gap Filling' },
                  { label: 'True / False / Not Given', val: 'True - False' },
                  { label: 'Yes / No / Not Given', val: 'Yes - No' },
                  { label: 'Multiple Choice (Trắc nghiệm)', val: 'Multiple Choice' },
                  { label: 'Matching Information', val: 'Matching Information' },
                  { label: 'Matching Features', val: 'Matching Features' },
                  { label: 'Map / Diagram Label', val: 'Diagram' },
                ].map((t) => (
                  <button
                    key={t.val}
                    onClick={() => setSelectedType(t.val)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl font-semibold transition flex items-center justify-between ${
                      selectedType === t.val
                        ? 'bg-[#FFF1E5] text-[#FF6D3A] font-bold'
                        : 'text-[#333333] hover:bg-[#FFF8F2]'
                    }`}
                  >
                    <span>{t.label}</span>
                    {selectedType === t.val && <Check className="w-3.5 h-3.5 text-[#FF6D3A]" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Main Content: Search Bar, Status Tabs & Test Grid */}
          <section className="flex-1 space-y-5">
            {/* Top Toolbar: Status Pills & Search Box */}
            <div className="p-4 rounded-2xl bg-white border border-[#FFEDD1] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Status Switcher Tabs */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setCatalogStatus('unfinished')}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition ${
                    catalogStatus === 'unfinished'
                      ? 'bg-[#FF6D3A] text-white shadow-xs'
                      : 'bg-[#FFF8F2] text-[#4D2600] hover:bg-[#FFEBE0]'
                  }`}
                >
                  Bài chưa làm ({currentCatalogList.length})
                </button>
                <button
                  onClick={() => setCatalogStatus('finished')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                    catalogStatus === 'finished'
                      ? 'bg-[#FF6D3A] text-white shadow-xs'
                      : 'bg-[#FFF8F2] text-[#8A8A8E] hover:bg-[#FFEBE0]'
                  }`}
                >
                  Bài đã làm (0)
                </button>
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#8A8A8E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm đề thi..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#CBD5E1] bg-[#FFF8F2] text-xs font-semibold focus:border-[#FF6D3A] focus:ring-1 focus:ring-[#FF6D3A] outline-hidden text-[#1D1D1F]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8A8A8E] hover:text-[#1D1D1F]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Test Cards Grid (3 Columns) */}
            {currentCatalogList.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#FFEDD1] space-y-3">
                <Search className="w-10 h-10 text-[#CBD5E1] mx-auto" />
                <h4 className="font-bold text-sm text-[#1D1D1F]">
                  Không tìm thấy đề thi phù hợp với bộ lọc
                </h4>
                <p className="text-xs text-[#8A8A8E]">
                  Thử đổi từ khóa tìm kiếm hoặc chọn &quot;Tất cả nguồn&quot; để xem toàn bộ đề.
                </p>
                <button
                  onClick={() => {
                    setSelectedSource('ALL');
                    setSelectedType('ALL');
                    setSearchQuery('');
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#FF6D3A] text-white font-bold text-xs"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentCatalogList.map((test) => (
                  <div
                    key={test.id}
                    className="group bg-white rounded-2xl border border-[#FFEDD1] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col relative"
                  >
                    {/* Top Image & Badge */}
                    <div className="aspect-[342/195] relative w-full overflow-hidden bg-slate-100">
                      {/* Views Badge */}
                      <div className="absolute left-2 top-2 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                        <Eye className="w-3 h-3 text-amber-300" />
                        <span>{test.views}</span>
                      </div>

                      {/* Passage / Part Label */}
                      <div className="absolute left-0 bottom-0 z-10 px-3 py-1 rounded-tr-xl bg-purple-600 text-white text-xs font-black">
                        {test.passage || test.part || test.task}
                      </div>

                      {/* Test Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={test.img}
                        alt={test.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF6D3A]">
                          {test.source}
                        </span>
                        <h4 className="font-extrabold text-sm text-[#1D1D1F] line-clamp-2 mt-0.5 group-hover:text-[#FF6D3A] transition">
                          {test.title}
                        </h4>
                      </div>

                      {/* Question Type Pills */}
                      <div className="space-y-1">
                        {test.questionTypes.slice(0, 3).map((type, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 text-[11px] text-[#4D2600]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6D3A]" />
                            <span className="truncate font-medium">{type}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 grid grid-cols-2 gap-2 border-t border-[#ECECEC]">
                        <button
                          onClick={() => handleLaunchTest(test)}
                          className="py-1.5 px-3 rounded-full bg-[#FFF1E5] hover:bg-[#FFEBE0] text-[#FF6D3A] font-black text-xs transition border border-[#FFEDD1] flex items-center justify-center gap-1"
                        >
                          <span>Luyện đề</span>
                          <span className="text-[9px] bg-blue-500 text-white px-1 rounded-full">
                            FREE
                          </span>
                        </button>

                        <button
                          onClick={() => handleLaunchTest(test)}
                          className="py-1.5 px-3 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-extrabold text-xs transition shadow-xs flex items-center justify-center gap-1"
                        >
                          <span>Phòng thi</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* ============================================================ */}
      {/* 3. MODE: 1:1 EXAM ROOM (SPLIT SCREEN WORKSPACE)              */}
      {/* ============================================================ */}
      {viewMode === 'exam' && (
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
              onClick={() => {
                setActiveTool((prev) => (prev === 'note' ? null : 'note'));
                setIsNotesOpen((prev) => !prev);
              }}
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

          {/* LEFT PANE: READING PASSAGE / LISTENING AUDIO */}
          <section className="w-full md:w-1/2 h-[50vh] md:h-[calc(100vh-120px)] overflow-y-auto px-6 lg:px-12 py-6 border-r border-[#ECECEC]">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="border-b border-[#FFEDD1] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6D3A]">
                  {activeExam.parts[0]?.title || 'Reading Passage'}
                </span>
                <h2 className="text-2xl font-black text-[#1D1D1F] mt-1">
                  {activeExam.parts[0]?.passage?.title || activeExam.title}
                </h2>
              </div>

              {/* Listening Audio Player if available */}
              {activeExam.parts[0]?.audioUrl && (
                <div className="p-4 rounded-2xl bg-[#FFF1E5] border border-[#FFEDD1] space-y-2">
                  <span className="text-xs font-bold text-[#4D2600] flex items-center gap-1.5">
                    <Headphones className="w-4 h-4 text-[#FF6D3A]" />
                    <span>IELTS Official Audio Stream (Strict Exam Mode)</span>
                  </span>
                  <audio controls className="w-full" src={activeExam.parts[0].audioUrl}>
                    Trình duyệt không hỗ trợ audio player.
                  </audio>
                </div>
              )}

              {/* Paragraphs with Drop Zones */}
              {activeExam.parts[0]?.passage?.paragraphs ? (
                activeExam.parts[0].passage.paragraphs.map((para, idx) => {
                  const qNum = (activeExam.parts[0]?.questions[0]?.number || 1) + idx;
                  const userHeading = answers[qNum];
                  const hasMatchingHeading = activeExam.parts[0]?.questions?.some(
                    (q) => q.type === 'matching_headings'
                  );

                  return (
                    <div key={para.id} className="space-y-2">
                      {/* Drop Zone for Matching Heading if applicable */}
                      {hasMatchingHeading && idx < 7 && (
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
                      )}

                      {/* Paragraph Text */}
                      <p className={`${fontSizeClasses[fontSize]} text-[#333333] text-justify font-serif`}>
                        <strong className="font-bold text-[#FF6D3A] font-sans mr-2">
                          {para.label}.
                        </strong>
                        {para.text}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 bg-white rounded-2xl border border-[#FFEDD1] text-xs text-[#8A8A8E] space-y-2">
                  <p>Lắng nghe audio bên trên và hoàn thành câu hỏi ở khung bên phải.</p>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT PANE: QUESTIONS CONTAINER */}
          <section className="w-full md:w-1/2 h-[50vh] md:h-[calc(100vh-120px)] overflow-y-auto px-6 lg:px-10 py-6 bg-white/70">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Optional: Headings Selector for Matching Headings */}
              {activeExam.parts[0]?.questions?.some((q) => q.type === 'matching_headings') && (
                <div className="p-5 rounded-2xl bg-white border border-[#FFEDD1] shadow-xs space-y-4">
                  <div className="border-b border-[#ECECEC] pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF6D3A]">
                      List of Headings
                    </span>
                    <h3 className="text-base font-extrabold text-[#1D1D1F]">
                      Choose the correct heading for each paragraph from the list below.
                    </h3>
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
              )}

              {/* Dynamic Questions List */}
              <div className="space-y-6">
                {activeExam.parts[0]?.questions?.map((q) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-white border border-[#FFEDD1] shadow-xs space-y-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#FF6D3A] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {q.number}
                      </span>
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A8E]">
                          {q.type.replace(/_/g, ' ')}
                        </span>
                        <p className="text-sm font-bold text-[#1D1D1F] leading-snug">{q.prompt}</p>
                      </div>
                    </div>

                    {/* Radio Options for Multiple Choice or True/False */}
                    {q.options && q.options.length > 0 && q.type !== 'matching_headings' && (
                      <div className="space-y-2 pl-10">
                        {q.options.map((opt: unknown, i: number) => {
                          const isStr = typeof opt === 'string';
                          const optLabel = isStr ? (opt as string).slice(0, 1) : (opt as { label: string }).label;
                          const optText = isStr ? (opt as string) : `${(opt as { label: string; text: string }).label}. ${(opt as { label: string; text: string }).text}`;
                          const optVal = isStr ? (opt as string) : (opt as { label: string }).label;
                          const isChecked = answers[q.number] === optVal || answers[q.number] === optText || answers[q.number] === optLabel;
                          return (
                            <label
                              key={i}
                              onClick={() => handleSelectAnswer(q.number, optVal)}
                              className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition text-xs font-semibold ${
                                isChecked
                                  ? 'border-[#FF6D3A] bg-[#FFF1E5] text-[#FF6D3A] ring-1 ring-[#FF6D3A]'
                                  : 'border-[#ECECEC] hover:bg-[#FFF8F2] text-[#333333]'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q_${q.number}`}
                                checked={isChecked}
                                onChange={() => {}}
                                className="accent-[#FF6D3A]"
                              />
                              <span>{optText}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Text Input for Fill in Blanks */}
                    {(q.type === 'fill_in_blanks' || q.type === 'gap_fill') && (
                      <div className="pl-10">
                        <input
                          type="text"
                          value={answers[q.number] || ''}
                          onChange={(e) => handleSelectAnswer(q.number, e.target.value)}
                          placeholder="Nhập câu trả lời..."
                          className="w-full max-w-sm px-3 py-2 text-xs font-bold rounded-xl border border-[#CBD5E1] bg-[#FFF8F2] text-[#FF6D3A] outline-hidden focus:ring-2 focus:ring-[#FF6D3A]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================================ */}
      {/* 4. BOTTOM QUESTION PALETTE & SUBMIT BAR                      */}
      {/* ============================================================ */}
      {viewMode === 'exam' && (
        <footer className="h-14 bg-white border-t border-[#ECECEC] px-4 sm:px-8 flex items-center justify-between z-30 shadow-xs">
          {/* Numbers Palette */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {activeExam.parts[0]?.questions?.map((q) => {
              const hasAnswer = Boolean(answers[q.number] && answers[q.number].trim());
              const isCurrent = currentQuestion === q.number;

              return (
                <button
                  key={q.number}
                  onClick={() => setCurrentQuestion(q.number)}
                  className={`w-7 h-7 rounded-full text-xs font-bold transition flex items-center justify-center shrink-0 ${
                    hasAnswer
                      ? 'bg-[#FF6D3A] text-white shadow-xs'
                      : isCurrent
                      ? 'border-2 border-[#FF6D3A] bg-[#FFF1E5] text-[#FF6D3A]'
                      : 'bg-[#FFF1E5]/60 text-[#4D2600] hover:bg-[#FFEBE0]'
                  }`}
                >
                  {q.number}
                </button>
              );
            })}
          </div>

          {/* Right side stats & Submit */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-xs text-[#8A8A8E] hidden sm:inline">
              Đã làm:{' '}
              <strong className="text-[#FF6D3A]">
                {Object.keys(answers).filter((k) => answers[Number(k)]).length}
              </strong>
              /{totalCount} câu
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
      )}

      {/* ============================================================ */}
      {/* 5. SUBMIT CONFIRMATION MODAL                                 */}
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
      {/* 6. RESULT & EXPLANATION REVIEW SCREEN (1:1 YOUPASS REVIEW)   */}
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
                <h2 className="text-2xl font-black text-[#1D1D1F]">{activeExam.title}</h2>
                <p className="text-xs text-[#8A8A8E]">
                  Thời gian làm bài: <strong>{formatTimer((activeExam.durationMinutes || 20) * 60 - secondsRemaining)}</strong>
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
                    setSecondsRemaining((activeExam.durationMinutes || 20) * 60);
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
                Bảng Giải Thích Đáp Án & Hướng Dẫn YouPass Builder (Mở Khóa Miễn Phí)
              </h3>

              <div className="space-y-4">
                {activeExam.parts[0]?.questions?.map((q) => {
                  const userAns = answers[q.number];
                  const isCorrect =
                    (userAns || '').trim().toLowerCase() === (q.correctAnswer as string).trim().toLowerCase();

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
                              {q.type.replace(/_/g, ' ')}
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
                          {q.explanation && (
                            <p className="text-xs text-[#8A8A8E] pt-1 italic font-serif leading-relaxed">
                              💡 {q.explanation}
                            </p>
                          )}
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

            <div className="flex justify-center gap-4 pb-8">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setViewMode('catalog');
                }}
                className="px-6 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-[#333333] text-white font-bold text-xs shadow-sm transition"
              >
                Quay Lại Thư Viện Đề
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. YOUPASS NOTES DRAWER (SLIDE-OVER PANEL)                   */}
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
      {/* 8. YOUPASS BUILDER MODAL (FREE UNLOCKED)                     */}
      {/* ============================================================ */}
      <StepByStepBuilderModal
        result={selectedBuilderQuestion}
        onClose={() => setSelectedBuilderQuestion(null)}
      />
    </div>
  );
};
