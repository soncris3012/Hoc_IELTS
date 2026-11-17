'use client';

import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  PenTool,
  Sparkles,
} from 'lucide-react';
import { YouPassQuizDetail } from '@/types/youpass';
import { getYouPassAssetUrl, sanitizeYouPassHtml } from '@/lib/youpassHelpers';

interface YouPassWritingRoomProps {
  quiz: YouPassQuizDetail;
  essayText: string;
  onEssayChange: (text: string) => void;
  onSaveSubmission: (essayText: string, bandScore?: number) => void;
}

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

export const YouPassWritingRoom: React.FC<YouPassWritingRoomProps> = ({
  quiz,
  essayText,
  onEssayChange,
  onSaveSubmission,
}) => {
  const question = quiz.questions?.[0];
  const [guideTab, setGuideTab] = useState<'prompt' | 'instruction' | 'sample' | 'analysis'>(
    'prompt'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const isTask1 =
    quiz.writing_task_type === 1 ||
    Boolean(question?.writing_graph_image) ||
    quiz.tags?.some((t) => t.code === 'WRITING-TASK-1');
  const minWords = question?.min_words || (isTask1 ? 150 : 250);

  const wordCount = useMemo(
    () => essayText.trim().split(/\s+/).filter(Boolean).length,
    [essayText]
  );

  const sortedFrames = useMemo(() => {
    const frames = question?.writing_logical_frame || [];
    return [...frames].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  }, [question]);

  const handleGradeAI = async () => {
    if (wordCount < 20) {
      alert('Vui lòng viết ít nhất 20 từ trước khi chấm điểm AI.');
      return;
    }
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/ai/grade-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskNumber: isTask1 ? 1 : 2,
          prompt: question?.title || quiz.title,
          essayText,
          apiKey: apiKey.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chấm bài thất bại');
      setEvaluation(data);
      onSaveSubmission(essayText, data.overallBand);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi chấm bài');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSaveOnly = () => {
    onSaveSubmission(essayText, evaluation?.overallBand);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      {/* LEFT PANE: WRITING PROMPT + IMAGE + 3 YOUPASS TABS */}
      <section className="w-full md:w-1/2 h-[48vh] md:h-[calc(100vh-120px)] overflow-y-auto px-5 sm:px-8 py-6 border-b md:border-b-0 md:border-r border-[#ECECEC] bg-white/80">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Task Badge & Title */}
          <div className="border-b border-[#FFEDD1] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6D3A]">
              IELTS Writing {isTask1 ? 'Task 1' : 'Task 2'} • Tối thiểu {minWords} từ
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#1D1D1F] mt-1">{quiz.title}</h2>
          </div>

          {/* 4 Sub-tabs mirroring YouPass Writing Workspace */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setGuideTab('prompt')}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition flex items-center gap-1 ${
                guideTab === 'prompt'
                  ? 'bg-[#FF6D3A] text-white shadow-xs'
                  : 'bg-[#FFF8F2] text-[#4D2600] border border-[#FFEDD1] hover:bg-[#FFEBE0]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Đề bài & Biểu đồ</span>
            </button>

            <button
              type="button"
              onClick={() => setGuideTab('instruction')}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition flex items-center gap-1 ${
                guideTab === 'instruction'
                  ? 'bg-[#FF6D3A] text-white shadow-xs'
                  : 'bg-[#FFF8F2] text-[#4D2600] border border-[#FFEDD1] hover:bg-[#FFEBE0]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Hướng dẫn Team Academic</span>
            </button>

            <button
              type="button"
              onClick={() => setGuideTab('sample')}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition flex items-center gap-1 ${
                guideTab === 'sample'
                  ? 'bg-[#FF6D3A] text-white shadow-xs'
                  : 'bg-[#FFF8F2] text-[#4D2600] border border-[#FFEDD1] hover:bg-[#FFEBE0]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bài mẫu & Khung Logic ({sortedFrames.length})</span>
            </button>

            {question?.writing_graph_description && (
              <button
                type="button"
                onClick={() => setGuideTab('analysis')}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition flex items-center gap-1 ${
                  guideTab === 'analysis'
                    ? 'bg-[#FF6D3A] text-white shadow-xs'
                    : 'bg-[#FFF8F2] text-[#4D2600] border border-[#FFEDD1] hover:bg-[#FFEBE0]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Phân tích số liệu</span>
              </button>
            )}
          </div>

          {/* TAB 1: PROMPT & CHART/MAP IMAGE */}
          {guideTab === 'prompt' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFF8F2] border border-[#FFEDD1] text-sm leading-relaxed text-[#1D1D1F]">
                {question?.content_writing ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeYouPassHtml(question.content_writing),
                    }}
                  />
                ) : (
                  <p className="font-semibold">{question?.title || quiz.title}</p>
                )}
              </div>

              {question?.writing_graph_image && (
                <div className="p-3 rounded-2xl bg-white border border-[#ECECEC] shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getYouPassAssetUrl(question.writing_graph_image)}
                    alt={quiz.title}
                    className="w-full h-auto rounded-xl object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEAM ACADEMIC INSTRUCTION */}
          {guideTab === 'instruction' && (
            <div className="p-5 rounded-2xl bg-white border border-[#FFEDD1] shadow-2xs">
              {question?.instruction ? (
                <div
                  className="text-xs sm:text-sm text-[#333333] leading-relaxed space-y-2 [&_h2]:text-base [&_h2]:font-black [&_h2]:text-[#FF6D3A] [&_h4]:font-extrabold [&_h4]:text-[#1D1D1F] [&_h4]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1"
                  dangerouslySetInnerHTML={{ __html: sanitizeYouPassHtml(question.instruction) }}
                />
              ) : (
                <p className="text-xs text-[#8A8A8E]">Đề này chưa có bài hướng dẫn chi tiết.</p>
              )}
            </div>
          )}

          {/* TAB 3: SAMPLE ESSAY & LOGICAL FRAME */}
          {guideTab === 'sample' && (
            <div className="space-y-3">
              {sortedFrames.length > 0 ? (
                sortedFrames.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-2xl bg-white border border-[#FFEDD1] shadow-2xs space-y-1.5"
                  >
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF1E5] text-[#FF6D3A] font-extrabold text-[11px]">
                      {sec.name}
                    </span>
                    <div
                      className="text-xs sm:text-sm text-[#222222] leading-relaxed font-serif"
                      dangerouslySetInnerHTML={{ __html: sanitizeYouPassHtml(sec.value) }}
                    />
                  </div>
                ))
              ) : (
                <div className="p-6 text-center rounded-2xl bg-white border border-[#FFEDD1] text-xs text-[#8A8A8E]">
                  Chưa có khung bài mẫu cho đề này.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: KEY FEATURES & GRAPH ANALYSIS */}
          {guideTab === 'analysis' && question?.writing_graph_description && (
            <div className="p-5 rounded-2xl bg-[#FFF8F2] border border-[#FFEDD1] text-xs sm:text-sm text-[#333333] whitespace-pre-wrap leading-relaxed">
              {question.writing_graph_description}
            </div>
          )}
        </div>
      </section>

      {/* RIGHT PANE: WRITING EDITOR + WORD COUNTER + AI EXAMINER */}
      <section className="w-full md:w-1/2 h-[52vh] md:h-[calc(100vh-120px)] overflow-y-auto px-5 sm:px-8 py-6 bg-[#FFF8F2]/50">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#1D1D1F]">
              <PenTool className="w-4 h-4 text-[#FF6D3A]" />
              <span>Bài Làm Của Bạn</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span
                className={`px-3 py-1 rounded-full font-extrabold ${
                  wordCount >= minWords
                    ? 'bg-[#E8F8EC] text-[#13A62E]'
                    : 'bg-[#FFF1E5] text-[#4D2600]'
                }`}
              >
                Số từ: {wordCount} / {minWords}+
              </span>
            </div>
          </div>

          <textarea
            value={essayText}
            onChange={(e) => onEssayChange(e.target.value)}
            placeholder={`Bắt đầu viết bài ${isTask1 ? 'Task 1' : 'Task 2'} tại đây...\n\nGợi ý: Bạn có thể bấm tab "Hướng dẫn Team Academic" hoặc "Bài mẫu & Khung Logic" ở khung bên trái để học cấu trúc ăn điểm trước khi viết.`}
            className="w-full h-[320px] sm:h-[380px] p-4 rounded-2xl border border-[#CBD5E1] bg-white text-sm leading-relaxed text-[#1D1D1F] focus:border-[#FF6D3A] focus:ring-2 focus:ring-[#FF6D3A]/20 outline-hidden resize-y shadow-2xs font-sans"
          />

          {/* Action Toolbar */}
          <div className="p-4 rounded-2xl bg-white border border-[#FFEDD1] space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSaveOnly}
                className="px-4 py-2 rounded-full border border-[#CBD5E1] bg-white hover:bg-[#FFF8F2] text-[#1D1D1F] font-bold text-xs flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4 text-[#13A62E]" />
                <span>{savedNotice ? 'Đã lưu vào Lịch sử!' : 'Lưu & Nộp bài'}</span>
              </button>

              <button
                type="button"
                disabled={isEvaluating}
                onClick={handleGradeAI}
                className="px-5 py-2 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEvaluating ? 'AI đang chấm bài...' : 'Chấm Điểm AI Examiner'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#8A8A8E]">
              <span>Gemini API Key (tuỳ chọn):</span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Để trống để dùng AI Server / Rubric Engine"
                className="flex-1 px-2.5 py-1 rounded-lg border border-[#ECECEC] bg-[#FFF8F2] text-xs outline-hidden"
              />
            </div>
          </div>

          {/* AI Evaluation Result */}
          {evaluation && (
            <div className="p-5 rounded-2xl bg-white border border-[#FF6D3A]/30 shadow-sm space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FF6D3A]" />
                  <span className="font-extrabold text-sm text-[#1D1D1F]">
                    Kết Quả Chấm IELTS Examiner
                  </span>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#FF6D3A] text-white font-black text-base">
                  Band {evaluation.overallBand.toFixed(1)}
                </span>
              </div>

              {evaluation.criteriaBands && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#FFF8F2] border border-[#FFEDD1]">
                    <div className="text-[10px] text-[#8A8A8E]">Task Achievement</div>
                    <div className="font-black text-[#FF6D3A]">
                      {evaluation.criteriaBands.taskAchievement}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FFF8F2] border border-[#FFEDD1]">
                    <div className="text-[10px] text-[#8A8A8E]">Coherence</div>
                    <div className="font-black text-[#FF6D3A]">
                      {evaluation.criteriaBands.coherence}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FFF8F2] border border-[#FFEDD1]">
                    <div className="text-[10px] text-[#8A8A8E]">Lexical</div>
                    <div className="font-black text-[#FF6D3A]">
                      {evaluation.criteriaBands.lexical}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FFF8F2] border border-[#FFEDD1]">
                    <div className="text-[10px] text-[#8A8A8E]">Grammar</div>
                    <div className="font-black text-[#FF6D3A]">
                      {evaluation.criteriaBands.grammar}
                    </div>
                  </div>
                </div>
              )}

              {evaluation.feedback && (
                <div className="space-y-3 text-xs leading-relaxed">
                  {evaluation.feedback.strengths?.length > 0 && (
                    <div>
                      <strong className="text-[#13A62E] block mb-1">✓ Điểm mạnh:</strong>
                      <ul className="list-disc pl-4 space-y-1 text-[#333333]">
                        {evaluation.feedback.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {evaluation.feedback.improvements?.length > 0 && (
                    <div>
                      <strong className="text-[#FF6D3A] block mb-1">➜ Cần cải thiện:</strong>
                      <ul className="list-disc pl-4 space-y-1 text-[#333333]">
                        {evaluation.feedback.improvements.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
