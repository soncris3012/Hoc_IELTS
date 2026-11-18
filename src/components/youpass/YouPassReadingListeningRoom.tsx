'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  Headphones,
  Highlighter,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import {
  YouPassLocateInfo,
  YouPassQuestion,
  YouPassQuizDetail,
  YouPassVocabParagraph,
} from '@/types/youpass';
import {
  evaluateQuestionSlot,
  expandQuestionSetSlots,
  formatSecondsHMS,
  getYouPassAssetUrl,
  sanitizeYouPassHtml,
} from '@/lib/youpassHelpers';
import { YouPassQuestionSetRenderer } from './YouPassQuestionSetRenderer';

interface YouPassReadingListeningRoomProps {
  quiz: YouPassQuizDetail;
  isSubmitted: boolean;
  answers: Record<number, string | string[]>;
  onAnswerChange: (order: number, value: string) => void;
  onMultiAnswerChange: (orders: number[], selectedValues: string[]) => void;
  fontSize: 'S' | 'M' | 'L';
  activeTool: 'highlight' | 'note' | 'vocab' | null;
  onSelectTool: (tool: 'highlight' | 'note' | 'vocab' | null) => void;
  activeQuestionOrder: number;
  onFocusQuestion: (order: number) => void;
  onAddNote: (noteText: string) => void;
  initialMode?: 'normal' | 'dictation';
  onRetake?: () => void;
  onBackToCatalog?: () => void;
}

interface FlattenedDictationLine {
  index: number;
  text: string;
  speaker?: string;
  from: number;
  to: number;
}

export const YouPassReadingListeningRoom: React.FC<YouPassReadingListeningRoomProps> = ({
  quiz,
  isSubmitted,
  answers,
  onAnswerChange,
  onMultiAnswerChange,
  fontSize,
  activeTool,
  onSelectTool,
  activeQuestionOrder,
  onFocusQuestion,
  onAddNote,
  initialMode = 'normal',
  onRetake,
  onBackToCatalog,
}) => {
  const parts = useMemo(() => quiz.parts || [], [quiz.parts]);
  const [activePartIdx, setActivePartIdx] = useState(0);
  const currentPart = parts[activePartIdx] || parts[0];

  const isListening = quiz.type === 2 || quiz.type === 10 || Boolean(currentPart?.file_id);

  // Heading selection state (for MATCHING_HEADINGS Drop Zones)
  const [selectedHeading, setSelectedHeading] = useState<{ option: string; text: string } | null>(
    null
  );

  // Passage highlights & vocab popup state
  const [highlightSnippets, setHighlightSnippets] = useState<string[]>([]);
  const [vocabPopup, setVocabPopup] = useState<{ word: string; note: string } | null>(null);

  // Locate evidence state (for scrolling left pane to exact sentence)
  const [locatedTarget, setLocatedTarget] = useState<{
    order: number;
    ranges: Array<{ start: { paragraph: number; sentence: number }; end: { paragraph: number; sentence: number } }>;
  } | null>(null);

  // Audio player state for Listening
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(isSubmitted);
  const [listeningTab, setListeningTab] = useState<'transcript' | 'dictation'>(
    initialMode === 'dictation' ? 'dictation' : 'transcript'
  );

  // Dictation state
  const [dictationIdx, setDictationIdx] = useState(0);
  const [dictationInput, setDictationInput] = useState('');
  const [dictationChecked, setDictationChecked] = useState(false);
  const [dictationStopAt, setDictationStopAt] = useState<number | null>(null);

  useEffect(() => {
    setActivePartIdx(0);
    setSelectedHeading(null);
    setLocatedTarget(null);
    setHighlightSnippets([]);
    setAudioCurrentTime(0);
    setIsPlaying(false);
    setDictationIdx(0);
    setDictationInput('');
    setDictationChecked(false);
  }, [quiz.id]);

  useEffect(() => {
    if (isSubmitted) {
      setShowTranscript(true);
    }
  }, [isSubmitted]);

  // Reset part-level dictation index when switching parts
  useEffect(() => {
    setDictationIdx(0);
    setDictationInput('');
    setDictationChecked(false);
    setDictationStopAt(null);
    setIsPlaying(false);
    setAudioCurrentTime(0);
  }, [activePartIdx]);

  // Font sizing map matching YouPass tokens
  const fontSizeClasses = {
    S: 'text-xs leading-5',
    M: 'text-[15px] leading-6',
    L: 'text-[17px] leading-7',
  };

  // Find MATCHING_HEADINGS set on currentPart (if any) for Drop Zones on Reading paragraphs
  const matchingHeadingsSet = useMemo(() => {
    return (currentPart?.question_sets || []).find(
      (qs) => qs.question_type === 'MATCHING_HEADINGS'
    );
  }, [currentPart]);

  // Flatten timed dictation lines from listening vocabs
  const dictationLines = useMemo<FlattenedDictationLine[]>(() => {
    if (!currentPart?.vocabs) return [];
    const lines: FlattenedDictationLine[] = [];
    currentPart.vocabs.forEach((blk) => {
      if (blk.children && blk.children.length > 0) {
        blk.children.forEach((child) => {
          if (child.value && child.value.trim()) {
            lines.push({
              index: lines.length,
              text: child.value.trim(),
              speaker: child.meta?.speaker,
              from: child.meta?.from ?? 0,
              to: child.meta?.to ?? (child.meta?.from ?? 0) + 6,
            });
          }
        });
      } else if (blk.value && blk.value.trim()) {
        lines.push({
          index: lines.length,
          text: blk.value.trim(),
          from: 0,
          to: 8,
        });
      }
    });
    return lines;
  }, [currentPart]);

  // Build map from (paragraph, sentence) -> question orders with locate_info (when submitted)
  const locateBadgeMap = useMemo(() => {
    const map = new Map<string, number[]>();
    if (!isSubmitted || !currentPart?.question_sets) return map;
    currentPart.question_sets.forEach((qs) => {
      (qs.questions || []).forEach((q) => {
        (q.locate_info?.paragraph_ranges || []).forEach((r) => {
          const key = `${r.start.paragraph}-${r.start.sentence}`;
          const prev = map.get(key) || [];
          if (!prev.includes(q.order)) {
            map.set(key, [...prev, q.order]);
          }
        });
      });
    });
    return map;
  }, [isSubmitted, currentPart]);

  // Handle mouse selection in Reading Passage (H / N / T tools)
  const handlePassageMouseUp = () => {
    if (typeof window === 'undefined' || !activeTool) return;
    const sel = window.getSelection();
    const selectedText = sel ? sel.toString().trim() : '';
    if (!selectedText || selectedText.length < 2) return;

    if (activeTool === 'highlight') {
      if (!highlightSnippets.includes(selectedText)) {
        setHighlightSnippets((prev) => [...prev, selectedText]);
      }
    } else if (activeTool === 'note') {
      onAddNote(`"${selectedText}"`);
    } else if (activeTool === 'vocab') {
      const cleanWord = selectedText.split(/\s+/)[0].replace(/[^a-zA-Z'-]/g, '');
      if (cleanWord) {
        setVocabPopup({
          word: cleanWord,
          note: selectedText,
        });
      }
    }
    sel?.removeAllRanges();
  };

  // Scroll left pane to located evidence sentence
  const handleLocateEvidence = (order: number, locate?: YouPassLocateInfo | null) => {
    if (!locate?.paragraph_ranges?.length) return;
    setLocatedTarget({ order, ranges: locate.paragraph_ranges });
    const first = locate.paragraph_ranges[0].start;
    const el = document.getElementById(`yp-para-${first.paragraph}-sent-${first.sentence}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Check if a sentence falls inside currently highlighted locate range
  const isSentenceLocated = (pNum: number, sNum: number): boolean => {
    if (!locatedTarget) return false;
    return locatedTarget.ranges.some((r) => {
      if (pNum < r.start.paragraph || pNum > r.end.paragraph) return false;
      if (pNum === r.start.paragraph && sNum < r.start.sentence) return false;
      if (pNum === r.end.paragraph && sNum > r.end.sentence) return false;
      return true;
    });
  };

  // Audio playback controls
  const seekAudio = (seconds: number, stopAt?: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, seconds);
    audioRef.current.playbackRate = playbackRate;
    setDictationStopAt(stopAt ?? null);
    audioRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = playbackRate;
      setDictationStopAt(null);
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const t = audioRef.current.currentTime;
    setAudioCurrentTime(t);
    if (dictationStopAt !== null && t >= dictationStopAt) {
      audioRef.current.pause();
      setIsPlaying(false);
      setDictationStopAt(null);
    }
  };

  // Calculate score summary across ALL parts of current quiz
  const overallScore = useMemo(() => {
    let correct = 0;
    let total = 0;
    const allSlots: Array<{ order: number; question: YouPassQuestion; qsType: string }> = [];
    parts.forEach((p) => {
      (p.question_sets || []).forEach((qs) => {
        const slots = expandQuestionSetSlots(qs);
        slots.forEach((sl) => {
          total += 1;
          allSlots.push({ order: sl.order, question: sl.question, qsType: qs.question_type });
          const ev = evaluateQuestionSlot(
            sl.question,
            answers[sl.order],
            qs.question_type,
            sl.order,
            answers
          );
          if (ev.isCorrect) correct += 1;
        });
      });
    });
    return { correct, total, allSlots };
  }, [parts, answers]);

  // Render highlighted user snippets inside sentence text
  const renderSentenceText = (text: string) => {
    if (highlightSnippets.length === 0) return text;
    let nodes: (string | React.ReactNode)[] = [text];
    highlightSnippets.forEach((snippet, sIdx) => {
      if (!snippet || snippet.length < 2) return;
      const nextNodes: (string | React.ReactNode)[] = [];
      nodes.forEach((part, pIdx) => {
        if (typeof part !== 'string') {
          nextNodes.push(part);
          return;
        }
        const splitIdx = part.toLowerCase().indexOf(snippet.toLowerCase());
        if (splitIdx === -1) {
          nextNodes.push(part);
        } else {
          nextNodes.push(part.slice(0, splitIdx));
          nextNodes.push(
            <mark
              key={`hl-${sIdx}-${pIdx}`}
              onClick={(e) => {
                e.stopPropagation();
                setHighlightSnippets((prev) => prev.filter((s) => s !== snippet));
              }}
              className="bg-yellow-200 text-[#1D1D1F] px-0.5 rounded cursor-pointer hover:bg-rose-200 transition"
              title="Bấm để bỏ Highlight"
            >
              {part.slice(splitIdx, splitIdx + snippet.length)}
            </mark>
          );
          nextNodes.push(part.slice(splitIdx + snippet.length));
        }
      });
      nodes = nextNodes;
    });
    return nodes;
  };

  // Word-by-word comparison for Dictation mode
  const renderDictationComparison = (targetText: string, typedText: string) => {
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, '');
    const targetWords = targetText.split(/\s+/).filter(Boolean);
    const typedWords = typedText.trim().split(/\s+/).filter(Boolean);

    return (
      <div className="p-3 rounded-xl bg-white border border-[#FFEDD1] space-y-2 text-xs">
        <div className="font-bold text-[#4D2600]">Đáp án chuẩn & đối chiếu từng từ:</div>
        <div className="flex flex-wrap gap-1.5 leading-relaxed">
          {targetWords.map((w, idx) => {
            const matched = typedWords[idx] && clean(typedWords[idx]) === clean(w);
            const matchedAnywhere =
              matched || typedWords.some((tw) => clean(tw) === clean(w));
            return (
              <span
                key={idx}
                className={`px-1.5 py-0.5 rounded font-semibold ${
                  matched
                    ? 'bg-[#E8F8EC] text-[#13A62E]'
                    : matchedAnywhere
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-[#FFF1F1] text-[#FF3532]'
                }`}
              >
                {w}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Multi-Part Tabs Bar (Full Mock Test Support OR Submission Review Banner) */}
      {(parts.length > 1 || isSubmitted) && (
        <div className="bg-white border-b border-[#ECECEC] px-4 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Part Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {parts.map((p, idx) => (
              <button
                key={p.id || idx}
                type="button"
                onClick={() => setActivePartIdx(idx)}
                className={`px-3 py-1 rounded-full text-xs font-extrabold transition shrink-0 ${
                  activePartIdx === idx
                    ? 'bg-[#FF6D3A] text-white shadow-xs'
                    : 'bg-[#FFF8F2] text-[#4D2600] border border-[#FFEDD1] hover:bg-[#FFEBE0]'
                }`}
              >
                {isListening ? `Section ${idx + 1}` : `Passage ${p.passage || idx + 1}`}
                {p.title ? `: ${p.title.slice(0, 24)}${p.title.length > 24 ? '…' : ''}` : ''}
              </button>
            ))}
          </div>

          {/* Review Score Banner right in the workspace so Split-Pane stays interactive */}
          {isSubmitted && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#FFF1E5] border border-[#FFEDD1] font-black text-[#FF6D3A]">
                Kết quả: {overallScore.correct}/{overallScore.total} câu đúng
              </span>
              {onRetake && (
                <button
                  type="button"
                  onClick={onRetake}
                  className="flex items-center gap-1 px-3 py-1 rounded-full border border-[#CBD5E1] bg-white hover:bg-[#F8F8F8] font-bold text-[#1D1D1F] transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại</span>
                </button>
              )}
              {onBackToCatalog && (
                <button
                  type="button"
                  onClick={onBackToCatalog}
                  className="px-3 py-1 rounded-full bg-[#1D1D1F] hover:bg-[#333333] text-white font-bold transition"
                >
                  Kho đề
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Split Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">


        {/* Quick Dictionary Popover (Tool T) */}
        {vocabPopup && (
          <div className="fixed bottom-20 left-6 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-[#FFEDD1] p-4 space-y-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-[#FF6D3A]">{vocabPopup.word}</span>
              <button
                type="button"
                onClick={() => setVocabPopup(null)}
                className="text-[#8A8A8E] hover:text-[#1D1D1F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#333333] italic line-clamp-2">&quot;{vocabPopup.note}&quot;</p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://dictionary.cambridge.org/dictionary/english-vietnamese/${encodeURIComponent(
                  vocabPopup.word.toLowerCase()
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 rounded-xl bg-[#FF6D3A] hover:bg-[#ff581d] text-white text-center text-xs font-bold transition"
              >
                Tra Cambridge
              </a>
              <button
                type="button"
                onClick={() => {
                  onAddNote(`[Vocab] ${vocabPopup.word}: ${vocabPopup.note}`);
                  setVocabPopup(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FFF1E5] text-[#4D2600] text-xs font-bold hover:bg-[#FFEBE0]"
              >
                + Note
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* LEFT PANE: READING PASSAGE OR LISTENING AUDIO + TRANSCRIPT   */}
        {/* ============================================================ */}
        <section
          onMouseUp={!isListening ? handlePassageMouseUp : undefined}
          className="w-full md:w-1/2 h-[45vh] md:h-[calc(100vh-172px)] overflow-y-auto relative px-5 sm:px-8 lg:pl-10 lg:pr-10 py-6 border-b md:border-b-0 md:border-r border-[#ECECEC]"
        >
          {/* Floating Tool Shortcuts Toolbar — inside left pane, so it doesn't overlap right pane */}
          {!isListening && (
            <div className="hidden lg:flex flex-col gap-2 absolute left-2 top-6 z-20 bg-white/95 backdrop-blur-sm p-1.5 rounded-xl border border-[#FFEDD1] shadow-md text-[11px] font-bold text-[#4D2600]">
              <button
                type="button"
                onClick={() => onSelectTool(activeTool === 'highlight' ? null : 'highlight')}
                className={`p-2 rounded-lg flex flex-col items-center gap-1 transition ${
                  activeTool === 'highlight'
                    ? 'bg-[#FF6D3A] text-white'
                    : 'hover:bg-[#FFF8F2] text-[#4D2600]'
                }`}
                title="Bôi đen chữ trên bài đọc để Highlight (Phím H)"
              >
                <Highlighter className="w-4 h-4" />
                <span>Highlight</span>
                <span className="text-[9px] opacity-75 font-normal">(H)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTool(activeTool === 'note' ? null : 'note')}
                className={`p-2 rounded-lg flex flex-col items-center gap-1 transition ${
                  activeTool === 'note'
                    ? 'bg-[#FF6D3A] text-white'
                    : 'hover:bg-[#FFF8F2] text-[#4D2600]'
                }`}
                title="Bôi đen chữ để lưu vào Ghi chú (Phím N)"
              >
                <FileText className="w-4 h-4" />
                <span>Notes</span>
                <span className="text-[9px] opacity-75 font-normal">(N)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTool(activeTool === 'vocab' ? null : 'vocab')}
                className={`p-2 rounded-lg flex flex-col items-center gap-1 transition ${
                  activeTool === 'vocab'
                    ? 'bg-[#FF6D3A] text-white'
                    : 'hover:bg-[#FFF8F2] text-[#4D2600]'
                }`}
                title="Bôi đen từ để tra cứu Cambridge Dictionary (Phím T)"
              >
                <BookOpen className="w-4 h-4" />
                <span>Tra từ</span>
                <span className="text-[9px] opacity-75 font-normal">(T)</span>
              </button>

              {highlightSnippets.length > 0 && (
                <button
                  type="button"
                  onClick={() => setHighlightSnippets([])}
                  className="p-1.5 rounded-lg text-[10px] text-[#FF3532] hover:bg-[#FFF1F1] transition"
                  title="Xóa toàn bộ highlight"
                >
                  Xóa HL
                </button>
              )}
            </div>
          )}

          <div className="max-w-2xl mx-auto space-y-5 lg:pl-12">
            {/* Title Header — YouPass.vn style: label left-aligned, title centered */}
            <div className="border-b border-[#FFEDD1] pb-4">
              <div className="flex items-start justify-between gap-3 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6D3A]">
                  {isListening
                    ? `Listening Section ${currentPart?.passage || activePartIdx + 1}`
                    : `Reading Passage ${currentPart?.passage || activePartIdx + 1}`}
                </span>
                {locatedTarget && (
                  <button
                    type="button"
                    onClick={() => setLocatedTarget(null)}
                    className="px-2.5 py-1 rounded-full bg-[#FFF1E5] text-[#FF6D3A] text-[11px] font-bold shrink-0"
                  >
                    Đang định vị Câu {locatedTarget.order} ✕
                  </button>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1D1D1F] text-center leading-snug">
                {currentPart?.title || quiz.title}
              </h2>
            </div>

            {/* LISTENING LEFT PANE */}
            {isListening ? (
              <div className="space-y-5">
                {/* Real YouPass CMS Audio Player */}
                {currentPart?.file_id ? (
                  <div className="p-4 rounded-2xl bg-white border border-[#FFEDD1] shadow-xs space-y-3">
                    <audio
                      ref={audioRef}
                      src={getYouPassAssetUrl(currentPart.file_id)}
                      onTimeUpdate={handleAudioTimeUpdate}
                      onLoadedMetadata={() => {
                        if (audioRef.current) setAudioDuration(audioRef.current.duration || 0);
                      }}
                      onEnded={() => setIsPlaying(false)}
                    />

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#4D2600]">
                        <Headphones className="w-4 h-4 text-[#FF6D3A]" />
                        <span>Audio Chuẩn YouPass</span>
                      </div>

                      {/* Speed pills */}
                      <div className="flex items-center gap-1">
                        {[0.75, 1, 1.25, 1.5].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              setPlaybackRate(r);
                              if (audioRef.current) audioRef.current.playbackRate = r;
                            }}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                              playbackRate === r
                                ? 'bg-[#FF6D3A] text-white'
                                : 'bg-[#FFF8F2] text-[#4D2600] hover:bg-[#FFEBE0]'
                            }`}
                          >
                            {r}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Controls & Scrubber */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlayAudio}
                        className="w-10 h-10 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white flex items-center justify-center shadow-xs shrink-0 transition"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => seekAudio(audioCurrentTime - 5)}
                        className="px-2 py-1 rounded-lg bg-[#FFF8F2] border border-[#FFEDD1] text-[11px] font-bold text-[#4D2600] hover:bg-[#FFEBE0]"
                      >
                        -5s
                      </button>

                      <input
                        type="range"
                        min={0}
                        max={audioDuration || currentPart.listen_to || 360}
                        step={0.1}
                        value={audioCurrentTime}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setAudioCurrentTime(val);
                          if (audioRef.current) audioRef.current.currentTime = val;
                        }}
                        className="flex-1 accent-[#FF6D3A]"
                      />

                      <button
                        type="button"
                        onClick={() => seekAudio(audioCurrentTime + 5)}
                        className="px-2 py-1 rounded-lg bg-[#FFF8F2] border border-[#FFEDD1] text-[11px] font-bold text-[#4D2600] hover:bg-[#FFEBE0]"
                      >
                        +5s
                      </button>

                      <span className="text-[11px] font-mono font-bold text-[#4D2600] shrink-0">
                        {formatSecondsHMS(audioCurrentTime).slice(3)} /{' '}
                        {formatSecondsHMS(audioDuration || currentPart.listen_to || 0).slice(3)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#FFF1E5] text-xs text-[#4D2600]">
                    Đề Listening này chưa đính kèm file audio trên hệ thống.
                  </div>
                )}

                {/* Mode Tabs: Interactive Transcript vs Luyện Dictation */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setListeningTab('transcript')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
                      listeningTab === 'transcript'
                        ? 'bg-[#FF6D3A] text-white shadow-xs'
                        : 'bg-white border border-[#FFEDD1] text-[#4D2600] hover:bg-[#FFF8F2]'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Transcript ({dictationLines.length} câu)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setListeningTab('dictation')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
                      listeningTab === 'dictation'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-[#FFEDD1] text-[#4D2600] hover:bg-[#FFF8F2]'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Luyện Dictation (Nghe & Gõ)</span>
                  </button>
                </div>

                {/* Transcript Panel */}
                {listeningTab === 'transcript' && (
                  <div className="bg-white rounded-2xl border border-[#FFEDD1] p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#ECECEC] pb-2">
                      <span className="text-xs font-bold text-[#4D2600]">
                        Bấm vào từng câu để tua audio tới đúng giây đó
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8F2] border border-[#FFEDD1] text-[11px] font-bold text-[#FF6D3A]"
                      >
                        {showTranscript ? (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Ẩn Transcript</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Hiện Transcript</span>
                          </>
                        )}
                      </button>
                    </div>

                    {!showTranscript ? (
                      <div className="py-8 text-center space-y-2 text-xs text-[#8A8A8E]">
                        <Headphones className="w-8 h-8 text-[#CBD5E1] mx-auto" />
                        <p>Transcript đang được ẩn để bạn tập trung nghe như thi thật.</p>
                        <button
                          type="button"
                          onClick={() => setShowTranscript(true)}
                          className="px-4 py-1.5 rounded-full bg-[#FFF1E5] text-[#FF6D3A] font-bold"
                        >
                          Mở Transcript để kiểm tra
                        </button>
                      </div>
                    ) : dictationLines.length > 0 ? (
                      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                        {dictationLines.map((line) => {
                          const isActive =
                            audioCurrentTime >= line.from && audioCurrentTime <= line.to;
                          return (
                            <button
                              key={line.index}
                              type="button"
                              onClick={() => seekAudio(line.from)}
                              className={`w-full text-left p-2.5 rounded-xl border transition text-xs leading-relaxed flex items-start gap-2.5 ${
                                isActive
                                  ? 'bg-[#FFF1E5] border-[#FF6D3A] text-[#1D1D1F] shadow-2xs'
                                  : 'bg-[#FFF8F2]/50 border-transparent hover:border-[#FFEDD1] text-[#333333]'
                              }`}
                            >
                              <span className="px-1.5 py-0.5 rounded bg-white border border-[#FFEDD1] font-mono text-[10px] font-bold text-[#FF6D3A] shrink-0">
                                {formatSecondsHMS(line.from).slice(3)}
                              </span>
                              <div className="flex-1">
                                {line.speaker && (
                                  <strong className="text-[#4D2600] mr-1.5">{line.speaker}:</strong>
                                )}
                                <span>{line.text}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-[#8A8A8E] py-4 text-center">
                        Chưa có transcript tách câu cho phần này.
                      </p>
                    )}
                  </div>
                )}

                {/* Dictation Practice Panel */}
                {listeningTab === 'dictation' && (
                  <div className="bg-white rounded-2xl border border-emerald-200 p-4 space-y-4">
                    {dictationLines.length === 0 ? (
                      <p className="text-xs text-[#8A8A8E]">
                        Bài nghe này chưa có dữ liệu câu tách mốc thời gian để luyện Dictation.
                      </p>
                    ) : (
                      (() => {
                        const cur = dictationLines[dictationIdx] || dictationLines[0];
                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-emerald-700">
                                Câu {dictationIdx + 1} / {dictationLines.length}
                                {cur.speaker ? ` • ${cur.speaker}` : ''}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={dictationIdx <= 0}
                                  onClick={() => {
                                    setDictationIdx((i) => Math.max(0, i - 1));
                                    setDictationInput('');
                                    setDictationChecked(false);
                                  }}
                                  className="p-1.5 rounded-lg border border-[#E5E5EA] disabled:opacity-40"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={dictationIdx >= dictationLines.length - 1}
                                  onClick={() => {
                                    setDictationIdx((i) =>
                                      Math.min(dictationLines.length - 1, i + 1)
                                    );
                                    setDictationInput('');
                                    setDictationChecked(false);
                                  }}
                                  className="p-1.5 rounded-lg border border-[#E5E5EA] disabled:opacity-40"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => seekAudio(cur.from, cur.to)}
                              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                            >
                              <Play className="w-4 h-4" />
                              <span>
                                Nghe đoạn [{formatSecondsHMS(cur.from).slice(3)} –{' '}
                                {formatSecondsHMS(cur.to).slice(3)}]
                              </span>
                            </button>

                            <textarea
                              value={dictationInput}
                              onChange={(e) => setDictationInput(e.target.value)}
                              placeholder="Gõ lại chính xác câu tiếng Anh bạn vừa nghe được..."
                              className="w-full h-24 p-3 rounded-xl border border-[#CBD5E1] bg-[#FFF8F2] text-xs sm:text-sm outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                            />

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setDictationChecked(true)}
                                className="px-4 py-2 rounded-xl bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-bold text-xs flex items-center gap-1.5 transition"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Kiểm tra đáp án</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (dictationIdx < dictationLines.length - 1) {
                                    const nextLine = dictationLines[dictationIdx + 1];
                                    setDictationIdx(dictationIdx + 1);
                                    setDictationInput('');
                                    setDictationChecked(false);
                                    seekAudio(nextLine.from, nextLine.to);
                                  }
                                }}
                                className="px-4 py-2 rounded-xl bg-white border border-[#E5E5EA] text-[#1D1D1F] hover:bg-[#F8F8F8] font-bold text-xs transition"
                              >
                                Câu tiếp theo →
                              </button>
                            </div>

                            {dictationChecked && renderDictationComparison(cur.text, dictationInput)}
                          </>
                        );
                      })()
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* READING LEFT PANE */
              <div className="space-y-5">
                {currentPart?.vocabs && currentPart.vocabs.length > 0 ? (
                  currentPart.vocabs.map((para: YouPassVocabParagraph, pIdx: number) => {
                    const paraNum = pIdx + 1;
                    // Check if a MATCHING_HEADINGS question maps to this paragraph
                    const matchingQ = matchingHeadingsSet?.questions?.find(
                      (mq) => mq.matching_heading_paragraph === paraNum
                    );
                    const assignedOption = matchingQ
                      ? typeof answers[matchingQ.order] === 'string'
                        ? (answers[matchingQ.order] as string)
                        : ''
                      : '';
                    const assignedObj = matchingHeadingsSet?.options?.find(
                      (o) => o.option === assignedOption
                    );
                    const matchingEval =
                      matchingQ && isSubmitted
                        ? evaluateQuestionSlot(
                            matchingQ,
                            answers[matchingQ.order],
                            'MATCHING_HEADINGS',
                            matchingQ.order,
                            answers
                          )
                        : null;

                    return (
                      <div key={para.id || pIdx} className="space-y-2.5">
                        {/* Drop Zone above matching paragraphs */}
                        {matchingQ && (
                          <div
                            onClick={() => {
                              if (isSubmitted || !selectedHeading) return;
                              onAnswerChange(matchingQ.order, selectedHeading.option);
                              setSelectedHeading(null);
                            }}
                            className={`p-2.5 rounded-xl border-2 border-dashed transition flex items-center justify-between gap-2 text-xs ${
                              isSubmitted && matchingEval
                                ? matchingEval.isCorrect
                                  ? 'border-[#13A62E] bg-[#E8F8EC] text-[#13A62E] font-bold'
                                  : 'border-[#FF3532] bg-[#FFF1F1] text-[#FF3532] font-bold'
                                : assignedOption
                                ? 'border-[#13A62E] bg-[#E8F8EC] text-[#13A62E] font-bold cursor-pointer'
                                : selectedHeading
                                ? 'border-[#FF6D3A] bg-[#FFF1E5] text-[#FF6D3A] animate-pulse font-semibold cursor-pointer'
                                : 'border-[#CBD5E1] bg-white/70 hover:bg-white text-[#8A8A8E] cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#FF6D3A] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                {matchingQ.order}
                              </span>
                              <span>
                                {assignedOption
                                  ? `${assignedOption}. ${assignedObj?.text || ''}`
                                  : selectedHeading
                                  ? `Bấm để gán "${selectedHeading.option}. ${selectedHeading.text}" vào đây`
                                  : `[Drop Zone ${matchingQ.order}] Chọn 1 Heading bên phải rồi bấm vào đây (${matchingQ.text})`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isSubmitted && matchingEval && !matchingEval.isCorrect && (
                                <span className="px-1.5 py-0.5 rounded bg-[#E8F8EC] text-[#13A62E] text-[10px] font-extrabold">
                                  Đúng: {matchingEval.correctText}
                                </span>
                              )}
                              {!isSubmitted && assignedOption && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAnswerChange(matchingQ.order, '');
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-600"
                                  title="Hủy chọn"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Render Paragraph Sentences — with YouPass-style letter label (A, B, C…) */}
                        <div className={`${fontSizeClasses[fontSize]} text-[#222222] text-justify flex gap-3`}>
                          {/* Paragraph letter label — only for top-level paragraphs */}
                          {para.level === 1 && (
                            <span className="shrink-0 w-6 h-6 mt-0.5 rounded-full bg-[#FF6D3A] text-white font-black text-[11px] flex items-center justify-center font-sans select-none">
                              {String.fromCharCode(64 + paraNum)}
                            </span>
                          )}
                          <p className="flex-1 leading-relaxed">
                            {para.children && para.children.length > 0 ? (
                              para.children.map((sent, sIdx) => {
                                const sentNum = sIdx + 1;
                                const isLoc = isSentenceLocated(paraNum, sentNum);
                                const badges = locateBadgeMap.get(`${paraNum}-${sentNum}`);
                                return (
                                  <span
                                    key={sent.id || sIdx}
                                    id={`yp-para-${paraNum}-sent-${sentNum}`}
                                    className={`transition-colors duration-300 ${
                                      isLoc
                                        ? 'bg-[#FFE5B4] text-[#1D1D1F] px-1 rounded border-b-2 border-[#FF6D3A]'
                                        : badges
                                        ? 'bg-[#FFF8DC] rounded px-0.5'
                                        : ''
                                    }`}
                                  >
                                    {badges && (
                                      <span className="inline-flex items-center gap-0.5 mr-1 px-1.5 py-0.5 rounded bg-[#FF6D3A] text-white font-sans font-extrabold text-[10px] align-middle">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        Câu {badges.join(', ')}
                                      </span>
                                    )}
                                    {renderSentenceText(sent.value)}{' '}
                                  </span>
                                );
                              })
                            ) : (
                              <span>{renderSentenceText(para.value)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : currentPart?.content ? (
                  <div
                    className={`${fontSizeClasses[fontSize]} text-[#222222] space-y-3`}
                    dangerouslySetInnerHTML={{ __html: sanitizeYouPassHtml(currentPart.content) }}
                  />
                ) : (
                  <p className="text-xs text-[#8A8A8E]">Đang tải nội dung bài đọc...</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* RIGHT PANE: ALL 9 YOUPASS QUESTION SET TYPES + EXPLANATIONS  */}
        {/* ============================================================ */}
        <section className="w-full md:w-1/2 h-[45vh] md:h-[calc(100vh-170px)] overflow-y-auto px-5 sm:px-8 py-6 bg-white/75">
          <div className="max-w-2xl mx-auto space-y-6 pb-8">
            {(currentPart?.question_sets || []).length > 0 ? (
              currentPart.question_sets!.map((qs) => (
                <YouPassQuestionSetRenderer
                  key={qs.id}
                  questionSet={qs}
                  answers={answers}
                  onAnswerChange={onAnswerChange}
                  onMultiAnswerChange={onMultiAnswerChange}
                  selectedHeading={selectedHeading}
                  onSelectHeading={setSelectedHeading}
                  isSubmitted={isSubmitted}
                  activeQuestionOrder={activeQuestionOrder}
                  onFocusQuestion={onFocusQuestion}
                  onLocateEvidence={handleLocateEvidence}
                />
              ))
            ) : (
              <div className="p-8 text-center rounded-2xl bg-white border border-[#FFEDD1] text-xs text-[#8A8A8E]">
                Chưa có nhóm câu hỏi nào trong phần thi này.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
