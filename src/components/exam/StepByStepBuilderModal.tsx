'use client';

import React, { useState } from 'react';
import {
  X,
  Zap,
  Target,
  Search,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Volume2,
  BookmarkPlus,
  Sparkles,
} from 'lucide-react';
import { QuestionScoreResult } from '@/types/ielts';
import { useExamStore } from '@/lib/store';

interface StepByStepBuilderModalProps {
  result: QuestionScoreResult | null;
  onClose: () => void;
}

export const StepByStepBuilderModal: React.FC<StepByStepBuilderModalProps> = ({
  result,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { setVocabModal, exam } = useExamStore();

  if (!result) return null;

  // Synthesize rich builder guide if not manually annotated
  const guide = result.builderGuide || {
    step1_keywords: result.paraphrasePairs?.map((p) => p.questionKeyword) || [
      'Từ khóa chính trong câu hỏi',
      'Hạn từ xác thực',
    ],
    step2_context:
      result.evidenceSentence ||
      'Thông tin đáp án nằm trực tiếp tại đoạn văn liên quan trong bài đọc hoặc mốc hội thoại trong audio.',
    step3_trap_analysis:
      result.errorTag === 'overthinking_logic'
        ? 'BẪY SUY DIỄN (Overthinking): Thí sinh hay lấy kinh nghiệm cá nhân để suy đoán thông tin ngoài bài. Trong IELTS Reading, nếu bài không viết thì dù hợp lý ngoài đời thực vẫn là NOT GIVEN.'
        : result.errorTag === 'lexical_gap'
        ? 'BẪY TỪ ĐỒNG NGHĨA (Lexical Trap): Bài thi dùng từ đồng nghĩa cao cấp (Paraphrase) thay vì từ gốc, khiến người học quét từ khóa bề mặt bị bỏ sót.'
        : result.errorTag === 'scanning_oversight'
        ? 'BẪY HẠN TỪ ĐỊNH LƯỢNG: Các từ như "only", "always", "mostly", "all" đảo ngược hoàn toàn ý nghĩa của câu so với bài đọc.'
        : 'BẪY NHIỄU (Distractor): Các phương án sai thường lặp lại nguyên văn 1-2 từ trong bài để dụ người học chọn vội mà không đối chiếu toàn câu.',
    step4_solution_summary: `Đáp án chính xác là "${
      Array.isArray(result.correctAnswer) ? result.correctAnswer.join(', ') : result.correctAnswer
    }". ${result.explanation}`,
  };

  const steps = [
    {
      num: 1,
      title: 'Xác Định Từ Khóa & Mục Tiêu',
      subtitle: 'Spotlight Keywords & Intent',
      icon: <Target className="w-4 h-4 text-orange-500" />,
    },
    {
      num: 2,
      title: 'Khoanh Vùng Bằng Chứng',
      subtitle: 'Locate Evidence & Context',
      icon: <Search className="w-4 h-4 text-sky-500" />,
    },
    {
      num: 3,
      title: 'Vạch Trần Cạm Bẫy',
      subtitle: 'Deconstruct Distractor Traps',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    },
    {
      num: 4,
      title: 'Chốt Đáp Án & Bài Học',
      subtitle: 'Final Rule & Core Strategy',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    },
  ];

  const handleLookupKeyword = (kw: string) => {
    setVocabModal({
      word: kw,
      contextSentence: guide.step2_context,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-orange-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-extrabold text-white text-sm shadow-inner">
              #{result.questionNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">
                  YouPass Builder: Phân Tích 4 Bước
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  PRO Feature Free
                </span>
              </div>
              <p className="text-xs text-orange-100">
                Câu {result.questionNumber} • {result.type.toUpperCase().replace('_', ' ')} • Part {result.part}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Step Progress Pills */}
        <div className="grid grid-cols-4 bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-200 dark:border-zinc-800">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`p-3 text-left transition flex items-center gap-2.5 border-b-2 ${
                currentStep === s.num
                  ? 'border-orange-500 bg-white dark:bg-zinc-900 shadow-xs'
                  : currentStep > s.num
                  ? 'border-emerald-500 text-slate-700 dark:text-zinc-300'
                  : 'border-transparent text-slate-400 dark:text-zinc-500 hover:text-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  currentStep === s.num
                    ? 'bg-orange-500 text-white ring-2 ring-orange-400/30'
                    : currentStep > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-400'
                }`}
              >
                {s.num}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold leading-tight line-clamp-1">{s.title}</div>
                <div className="text-[10px] text-slate-400 dark:text-zinc-500 leading-tight">Bước {s.num}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Keywords & Intent */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-orange-400">
                <Target className="w-4 h-4" />
                <span>BƯỚC 1: Xác Định Từ Khóa Định Vị & Cốt Lõi Câu Hỏi</span>
              </div>

              <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 space-y-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Nội dung câu hỏi:
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 leading-relaxed">
                  {result.prompt}
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Từ khóa cốt lõi cần quét trong bài đọc:</span>
                  <span className="text-[11px] text-orange-600 dark:text-orange-400 font-normal">
                    (Click vào từ để tra cứu & lưu vào Sổ Từ)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {guide.step1_keywords.map((kw, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleLookupKeyword(kw)}
                      className="px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 dark:bg-orange-950/50 dark:hover:bg-orange-900/50 text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-800 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-orange-600" />
                      <span>{kw}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg text-xs text-slate-600 dark:text-zinc-400">
                💡 <span className="font-semibold text-slate-800 dark:text-zinc-200">Mẹo YouPass:</span> Đừng tìm từ khóa chung chung mang tính chủ đề (topic words); hãy tập trung vào các từ khóa mang tính định lượng, danh từ riêng hoặc động từ hành động không thể bị thay thế.
              </div>
            </div>
          )}

          {/* Step 2: Locate Evidence */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-sm font-bold text-sky-600 dark:text-sky-400">
                <Search className="w-4 h-4" />
                <span>BƯỚC 2: Định Vị Đoạn Chứa Bằng Chứng (Evidence)</span>
              </div>

              {exam.module === 'listening' && (
                <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 dark:text-sky-200">
                    <Volume2 className="w-4 h-4 text-sky-600" />
                    <span>Mốc Audio liên quan: Part {result.part}</span>
                  </div>
                  <span className="text-[11px] text-sky-600 font-mono font-bold">Audio Segment Focus</span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border-l-4 border-sky-600 dark:border-sky-500 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                  Trích dẫn gốc trong bài ({exam.module === 'listening' ? 'Audio Transcript' : 'Reading Passage'}):
                </div>
                <blockquote className="italic font-serif text-slate-800 dark:text-zinc-200 text-sm leading-relaxed">
                  &ldquo;{guide.step2_context}&rdquo;
                </blockquote>
              </div>

              {result.paraphrasePairs && result.paraphrasePairs.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Cặp Paraphrase đối chiếu trực tiếp:</span>
                  </div>
                  <div className="space-y-1.5">
                    {result.paraphrasePairs.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-600 dark:text-zinc-400 font-medium">
                          Trong câu hỏi: <strong className="text-slate-900 dark:text-white">{p.questionKeyword}</strong>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                          {p.passageKeyword}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Trap Analysis */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>BƯỚC 3: Vạch Trần Bẫy & Lỗi Sai Thường Gặp (Distractor Traps)</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/50 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Cơ chế gài bẫy của người ra đề:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed font-medium">
                  {guide.step3_trap_analysis}
                </p>
              </div>

              {result.distractorExplanations && Object.keys(result.distractorExplanations).length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                    Vì sao các phương án khác bị loại:
                  </div>
                  <div className="space-y-1.5">
                    {Object.entries(result.distractorExplanations).map(([opt, reason]) => (
                      <div
                        key={opt}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs"
                      >
                        <strong className="text-rose-600 dark:text-rose-400 mr-1.5">Phương án {opt}:</strong>
                        <span className="text-slate-600 dark:text-zinc-300">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Final Solution */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>BƯỚC 4: Chốt Đáp Án Chuẩn & Chiến Thuật Ghi Nhớ</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Đáp Án Chính Thức:
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-sm shadow-xs">
                    {Array.isArray(result.correctAnswer) ? result.correctAnswer.join(', ') : result.correctAnswer}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed font-medium pt-2 border-t border-emerald-200 dark:border-emerald-900/40">
                  {guide.step4_solution_summary}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800/50 space-y-2">
                <div className="text-xs font-extrabold text-orange-700 dark:text-orange-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span>Quy Tắc Nhớ Đời Để Tránh Mất Điểm Tương Tự:</span>
                </div>
                <ul className="text-xs text-slate-700 dark:text-zinc-300 space-y-1 list-disc list-inside">
                  <li>Luôn đọc kỹ toàn bộ câu văn có chứa bằng chứng, không dừng lại ở từ khóa đầu tiên tìm thấy.</li>
                  <li>Nếu là dạng True/False/Not Given: Tuyệt đối không suy diễn dựa trên logic bên ngoài bài thi.</li>
                  <li>Lưu ngay các từ vựng gây nhầm lẫn vào Sổ Từ Vựng để ôn flashcard hàng ngày.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-zinc-800/60 border-t border-slate-200 dark:border-zinc-800">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-zinc-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Bước trước</span>
          </button>

          <div className="text-xs font-bold text-slate-500 dark:text-zinc-400">
            Bước {currentStep} / 4
          </div>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition shadow-sm"
            >
              <span>Bước tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã hiểu câu này!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
