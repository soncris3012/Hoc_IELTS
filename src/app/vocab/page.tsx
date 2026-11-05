'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCw,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Download,
  Upload,
  BrainCircuit,
  Headphones,
  PenTool,
} from 'lucide-react';
import { useExamStore } from '@/lib/store';
import { VocabItem } from '@/types/ielts';

export default function VocabBookPage() {
  const { vocabList, addVocab, updateVocabStatus, removeVocab } = useExamStore();
  const [filter, setFilter] = useState<'all' | 'unlearned' | 'learning' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Flashcard mode state
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // New word form state
  const [newWord, setNewWord] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newSentence, setNewSentence] = useState('');
  const [newStatus, setNewStatus] = useState<'unlearned' | 'learning' | 'mastered'>('learning');

  // Stats calculation
  const totalCount = vocabList.length;
  const unlearnedCount = vocabList.filter((v) => v.status === 'unlearned').length;
  const learningCount = vocabList.filter((v) => v.status === 'learning').length;
  const masteredCount = vocabList.filter((v) => v.status === 'mastered').length;
  const masteryRate = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  // Filtered words
  const filteredList = vocabList.filter((v) => {
    if (filter !== 'all' && v.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.word.toLowerCase().includes(q) ||
        v.meaningVi.toLowerCase().includes(q) ||
        (v.contextSentence && v.contextSentence.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSpeak = (word: string) => {
    if ('speechSynthesis' in window && word) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    addVocab({
      word: newWord.trim(),
      ipa: newIpa.trim(),
      meaningVi: newMeaning.trim() || 'Từ vựng quan trọng',
      contextSentence: newSentence.trim(),
      status: newStatus,
    });
    setNewWord('');
    setNewIpa('');
    setNewMeaning('');
    setNewSentence('');
    setIsAddModalOpen(false);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vocabList, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'youpass_vocab_book.json');
    dlAnchorElem.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: VocabItem) => {
              if (item.word && item.meaningVi) {
                addVocab({
                  word: item.word,
                  ipa: item.ipa || '',
                  meaningVi: item.meaningVi,
                  contextSentence: item.contextSentence || '',
                  status: item.status || 'learning',
                });
              }
            });
            alert(`Đã nhập thành công ${parsed.length} từ vựng!`);
          }
        } catch {
          alert('File JSON không hợp lệ!');
        }
      };
    }
  };

  const activeCard = filteredList[flashcardIndex] || filteredList[0];

  return (
    <div className="min-h-screen bg-[#fffaf5] dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-14 px-4 sm:px-8 bg-white dark:bg-zinc-900 border-b border-orange-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-orange-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Phòng Thi</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                Sổ Từ Vựng YouPass (Vocab Book)
              </h1>
              <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">
                Kho từ vựng & Flashcards tự động lưu trong quá trình làm đề thi
              </p>
            </div>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/dictation"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 transition"
          >
            <Headphones className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dictation</span>
          </Link>
          <Link
            href="/writing"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 transition"
          >
            <PenTool className="w-3.5 h-3.5 text-sky-600" />
            <span>Writing</span>
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Từ Mới</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Top Summary & Metric Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-orange-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng số từ</span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {totalCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Từ đã lưu vào sổ</span>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-rose-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-rose-600 uppercase tracking-wider">
              <span>Chưa thuộc</span>
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-3xl font-extrabold text-rose-600 mt-2">
              {unlearnedCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Cần học lại gấp</span>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-amber-600 uppercase tracking-wider">
              <span>Nhớ sơ</span>
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="text-3xl font-extrabold text-amber-600 mt-2">
              {learningCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Đang trong tiến trình ôn</span>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <span>Đã thuộc</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-2">
              {masteredCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">Nắm vững ngữ cảnh</span>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-orange-300 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
            <div className="flex items-center justify-between text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
              <span>Tỉ lệ thuộc</span>
              <Sparkles className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-3xl font-extrabold text-orange-600 mt-2">
              {masteryRate}%
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden mt-1">
              <div
                style={{ width: `${masteryRate}%` }}
                className="bg-orange-600 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* View Mode Toggle: List vs Flashcards */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-orange-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFlashcardMode(false)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                !isFlashcardMode
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              Danh Sách Từ ({filteredList.length})
            </button>
            <button
              onClick={() => {
                setIsFlashcardMode(true);
                setFlashcardIndex(0);
                setIsFlipped(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition ${
                isFlashcardMode
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Chế Độ Flashcard Ôn Tập</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm từ, nghĩa, câu ví dụ..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Import / Export JSON */}
            <button
              onClick={handleExportJSON}
              title="Xuất file JSON"
              className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              <Download className="w-4 h-4" />
            </button>
            <label
              title="Nhập file JSON"
              className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Filter Pills */}
        {!isFlashcardMode && (
          <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto pb-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg border transition ${
                filter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50'
              }`}
            >
              Tất cả ({totalCount})
            </button>
            <button
              onClick={() => setFilter('unlearned')}
              className={`px-3 py-1.5 rounded-lg border transition ${
                filter === 'unlearned'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50'
              }`}
            >
              🔴 Chưa thuộc ({unlearnedCount})
            </button>
            <button
              onClick={() => setFilter('learning')}
              className={`px-3 py-1.5 rounded-lg border transition ${
                filter === 'learning'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50'
              }`}
            >
              🟡 Nhớ sơ ({learningCount})
            </button>
            <button
              onClick={() => setFilter('mastered')}
              className={`px-3 py-1.5 rounded-lg border transition ${
                filter === 'mastered'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50'
              }`}
            >
              🟢 Đã thuộc ({masteredCount})
            </button>
          </div>
        )}

        {/* FLASHCARD INTERACTIVE MODE */}
        {isFlashcardMode && activeCard && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
              <span>
                Thẻ {flashcardIndex + 1} / {filteredList.length}
              </span>
              <span>Bấm vào thẻ để lật xem mặt sau</span>
            </div>

            {/* 3D Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer min-h-[300px] w-full rounded-3xl bg-white dark:bg-zinc-900 border-2 border-orange-300 dark:border-orange-800 shadow-xl p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl"
            >
              {!isFlipped ? (
                // Card Front: Word + IPA + Audio
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-orange-600">
                    Flashcard IELTS
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {activeCard.word}
                  </div>
                  {activeCard.ipa && (
                    <div className="text-base text-slate-500 font-mono">
                      {activeCard.ipa}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(activeCard.word);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-semibold transition"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Phát âm</span>
                  </button>
                  <p className="text-xs text-slate-400 mt-6 italic">
                    (Click vào bất kỳ đâu trên thẻ để lật xem nghĩa)
                  </p>
                </div>
              ) : (
                // Card Back: Meaning + Context
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-600">
                        Nghĩa Tiếng Việt
                      </span>
                      <span className="text-xs font-bold text-slate-400">{activeCard.word}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      {activeCard.meaningVi}
                    </div>
                    {activeCard.contextSentence && (
                      <div className="p-3 bg-orange-50/60 dark:bg-zinc-800 rounded-xl border border-orange-200 dark:border-zinc-700 text-xs italic text-slate-700 dark:text-zinc-300 leading-relaxed font-serif">
                        &ldquo;{activeCard.contextSentence}&rdquo;
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Trạng thái: <strong>{activeCard.status}</strong></span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(false);
                      }}
                      className="flex items-center gap-1 text-orange-600 font-bold hover:underline"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Lật lại mặt trước</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Status Setter for Current Card */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  updateVocabStatus(activeCard.id, 'unlearned');
                  if (flashcardIndex < filteredList.length - 1) {
                    setFlashcardIndex(flashcardIndex + 1);
                    setIsFlipped(false);
                  }
                }}
                className="px-4 py-2 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>🔴 Chưa nhớ</span>
              </button>

              <button
                onClick={() => {
                  updateVocabStatus(activeCard.id, 'learning');
                  if (flashcardIndex < filteredList.length - 1) {
                    setFlashcardIndex(flashcardIndex + 1);
                    setIsFlipped(false);
                  }
                }}
                className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>🟡 Nhớ sơ</span>
              </button>

              <button
                onClick={() => {
                  updateVocabStatus(activeCard.id, 'mastered');
                  if (flashcardIndex < filteredList.length - 1) {
                    setFlashcardIndex(flashcardIndex + 1);
                    setIsFlipped(false);
                  }
                }}
                className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>🟢 Thuộc làu</span>
              </button>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between px-2">
              <button
                disabled={flashcardIndex === 0}
                onClick={() => {
                  setFlashcardIndex((i) => Math.max(0, i - 1));
                  setIsFlipped(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-zinc-700 disabled:opacity-30 hover:bg-slate-100 transition"
              >
                Thẻ trước
              </button>
              <button
                disabled={flashcardIndex >= filteredList.length - 1}
                onClick={() => {
                  setFlashcardIndex((i) => Math.min(filteredList.length - 1, i + 1));
                  setIsFlipped(false);
                }}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-orange-600 text-white disabled:opacity-30 hover:bg-orange-700 transition"
              >
                Thẻ tiếp theo
              </button>
            </div>
          </div>
        )}

        {/* LIST TABLE VIEW */}
        {!isFlashcardMode && (
          <div className="bg-white dark:bg-zinc-900 border border-orange-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
            {filteredList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-semibold text-sm">Không tìm thấy từ vựng nào.</p>
                <p className="text-xs text-slate-400">
                  Hãy tra từ khi làm bài thi hoặc bấm &quot;Thêm Từ Mới&quot; ở trên.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {filteredList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-orange-50/30 dark:hover:bg-zinc-800/40 transition"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-bold text-slate-900 dark:text-white">
                          {item.word}
                        </span>
                        {item.ipa && (
                          <span className="text-xs font-mono text-slate-500">
                            {item.ipa}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSpeak(item.word)}
                          className="p-1 text-slate-400 hover:text-orange-600 transition"
                          title="Phát âm"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
                        {item.meaningVi}
                      </div>

                      {item.contextSentence && (
                        <p className="text-xs text-slate-500 dark:text-zinc-400 italic font-serif">
                          &ldquo;{item.contextSentence}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Status selector & Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateVocabStatus(
                            item.id,
                            e.target.value as 'unlearned' | 'learning' | 'mastered'
                          )
                        }
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border outline-hidden transition ${
                          item.status === 'mastered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : item.status === 'learning'
                            ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                      >
                        <option value="unlearned">🔴 Chưa thuộc</option>
                        <option value="learning">🟡 Nhớ sơ</option>
                        <option value="mastered">🟢 Đã thuộc</option>
                      </select>

                      <button
                        onClick={() => removeVocab(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                        title="Xóa từ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add New Word Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-orange-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 bg-orange-600 text-white">
              <h3 className="font-bold text-base">Thêm Từ Vựng Mới</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Từ vựng (Tiếng Anh):
                </label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Ví dụ: detrimental"
                  className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Phiên âm IPA:
                </label>
                <input
                  type="text"
                  value={newIpa}
                  onChange={(e) => setNewIpa(e.target.value)}
                  placeholder="/ˌdet.rɪˈmen.təl/"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nghĩa tiếng Việt:
                </label>
                <input
                  type="text"
                  required
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="Có hại, gây bất lợi..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Câu ví dụ:
                </label>
                <textarea
                  rows={2}
                  value={newSentence}
                  onChange={(e) => setNewSentence(e.target.value)}
                  placeholder="Excessive screen time has a detrimental effect on sleep quality."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Trạng thái ban đầu:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as 'unlearned' | 'learning' | 'mastered')}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-hidden"
                >
                  <option value="unlearned">🔴 Chưa thuộc</option>
                  <option value="learning">🟡 Nhớ sơ</option>
                  <option value="mastered">🟢 Đã thuộc</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition"
                >
                  Lưu Vào Sổ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
