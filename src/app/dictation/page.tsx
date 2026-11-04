'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface DictationSentence {
  id: number;
  audioUrl: string;
  transcript: string;
  translationVi: string;
  keyVocabulary: { word: string; meaning: string }[];
}

const DICTATION_DATASET: DictationSentence[] = [
  {
    id: 1,
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/rainforest_birds.ogg',
    transcript: 'The Red Rock Wildlife Sanctuary was originally founded in nineteen eighty-four to rehabilitate injured local animals.',
    translationVi: 'Khu bảo tồn động vật hoang dã Red Rock ban đầu được thành lập vào năm 1984 để phục hồi sức khỏe cho các loài động vật địa phương bị thương.',
    keyVocabulary: [
      { word: 'sanctuary', meaning: 'khu bảo tồn thiên nhiên' },
      { word: 'rehabilitate', meaning: 'phục hồi chức năng / cứu hộ' },
      { word: 'indigenous', meaning: 'bản địa' },
    ],
  },
  {
    id: 2,
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_market.ogg',
    transcript: 'Visitors must strictly remain on the wooden boardwalk to protect ground nesting sites.',
    translationVi: 'Khách tham quan bắt buộc phải đi đúng trên lối đi lót ván gỗ để bảo vệ các tổ chim trên mặt đất.',
    keyVocabulary: [
      { word: 'boardwalk', meaning: 'lối đi lát ván gỗ' },
      { word: 'nesting sites', meaning: 'địa điểm làm tổ' },
      { word: 'strictly', meaning: 'một cách nghiêm ngặt' },
    ],
  },
  {
    id: 3,
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/rainforest_birds.ogg',
    transcript: 'The monthly bus pass for full-time students is discounted to forty-five pounds per month.',
    translationVi: 'Vé xe buýt tháng dành cho sinh viên chính quy được giảm giá xuống còn 45 bảng mỗi tháng.',
    keyVocabulary: [
      { word: 'discounted', meaning: 'được chiết khấu / giảm giá' },
      { word: 'commuter', meaning: 'người đi làm / đi học hàng ngày' },
    ],
  },
];

export default function DictationPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isChecked, setIsChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSentence = DICTATION_DATASET[currentIndex];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // String comparison engine
  const cleanWord = (w: string) =>
    w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').trim();

  const targetTokens = currentSentence.transcript.split(/\s+/).filter(Boolean);
  const userTokens = userInput.trim().split(/\s+/).filter(Boolean);

  let correctCount = 0;
  const tokenComparison = targetTokens.map((tWord, idx) => {
    const uWord = userTokens[idx];
    const isMatched = uWord && cleanWord(uWord) === cleanWord(tWord);
    if (isMatched) correctCount += 1;
    return {
      target: tWord,
      userWord: uWord || '',
      isCorrect: Boolean(isMatched),
    };
  });

  const accuracy = Math.round((correctCount / targetTokens.length) * 100);

  const handleNext = () => {
    if (currentIndex < DICTATION_DATASET.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setIsChecked(false);
      setShowHint(false);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserInput('');
      setIsChecked(false);
      setShowHint(false);
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 flex flex-col">
      {/* Header */}
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
              IELTS Dictation Engine (Nghe Chép Chính Tả)
            </span>
            <span className="ml-2 text-xs text-sky-600 font-semibold">
              Cambridge Actual Sentences
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-500">Sentence:</span>
          <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-zinc-800 font-bold">
            {currentIndex + 1} / {DICTATION_DATASET.length}
          </span>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 space-y-6">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Audio Player Controls */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <audio
              ref={audioRef}
              src={currentSentence.audioUrl}
              onEnded={() => setIsPlaying(false)}
            />

            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-md transition"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(console.error);
                    setIsPlaying(true);
                  }
                }}
                title="Replay from start"
                className="p-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="text-xs">
                <div className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>Audio Track #{currentSentence.id}</span>
                </div>
                <div className="text-slate-500 text-[11px]">Shortcut: Click Play or press Enter</div>
              </div>
            </div>

            {/* Speed Controller */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 p-1 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-bold">
              {[0.75, 1.0, 1.25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => changeSpeed(rate)}
                  className={`px-2.5 py-1 rounded transition ${
                    playbackRate === rate
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* User Typing Area */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
              Type what you hear:
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Listen carefully and write down every word here..."
              rows={4}
              className="w-full p-4 text-sm font-sans bg-slate-50 dark:bg-zinc-950 border-2 border-slate-300 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 leading-relaxed"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showHint ? 'Hide Vietnamese Translation' : 'View Vietnamese Translation'}
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsChecked(true)}
                disabled={!userInput.trim()}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white shadow-sm transition"
              >
                <CheckCircle className="w-4 h-4" />
                Check Accuracy
              </button>
            </div>
          </div>

          {/* Translation Hint */}
          {showHint && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 italic">
              Bản dịch gợi ý: &ldquo;{currentSentence.translationVi}&rdquo;
            </div>
          )}

          {/* Diff Check Results */}
          {isChecked && (
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Word-by-Word Phonetic & Spelling Diff
                </div>
                <div className="text-sm font-black text-sky-600 dark:text-sky-400">
                  Accuracy: {accuracy}%
                </div>
              </div>

              {/* Render Diff Tokens */}
              <div className="p-4 bg-white dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800 flex flex-wrap gap-2 text-sm leading-relaxed">
                {tokenComparison.map((token, i) => (
                  <span
                    key={i}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      token.isCorrect
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 line-through'
                    }`}
                    title={token.isCorrect ? 'Correct!' : `Expected: "${token.target}" | You typed: "${token.userWord || '(omitted)'}"`}
                  >
                    {token.isCorrect ? token.target : `${token.userWord || '___'} ➔ ${token.target}`}
                  </span>
                ))}
              </div>

              {/* Key Collocations / Vocabulary */}
              <div className="pt-2 border-t border-slate-200 dark:border-zinc-700 text-xs">
                <span className="font-bold text-slate-700 dark:text-zinc-300">
                  Key Vocabulary in this sentence:
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentSentence.keyVocabulary.map((v, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-semibold"
                    >
                      {v.word}: <span className="font-normal italic">{v.meaning}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Next / Previous sentence footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Sentence
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex >= DICTATION_DATASET.length - 1}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-30 transition"
            >
              Next Sentence
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
