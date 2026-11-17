'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Mic,
  Play,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react';
import { YouPassQuizDetail, YouPassSpeakingTopic } from '@/types/youpass';
import { formatSecondsHMS, getYouPassAssetUrl, sanitizeYouPassHtml } from '@/lib/youpassHelpers';

interface YouPassSpeakingStudioProps {
  topic: YouPassSpeakingTopic;
  partNumber: '1' | '2' | '3';
  onBack: () => void;
  onSaveAttempt?: (topicTitle: string, durationSec: number) => void;
}

export const YouPassSpeakingStudio: React.FC<YouPassSpeakingStudioProps> = ({
  topic,
  partNumber,
  onBack,
  onSaveAttempt,
}) => {
  const questions = topic.quizzes || [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [quizDetail, setQuizDetail] = useState<YouPassQuizDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Speaking practice recorder & timer
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [savedNotice, setSavedNotice] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const activeQuestion = questions[selectedIdx];

  useEffect(() => {
    setSelectedIdx(0);
    setRecordedUrl(null);
    setElapsedSec(0);
  }, [topic.id]);

  // Timer during practice
  useEffect(() => {
    if (!isRecording) return;
    const t = setInterval(() => setElapsedSec((prev) => prev + 1), 1000);
    return () => clearInterval(t);
  }, [isRecording]);

  // Fetch sample answer + vocabulary for the selected question
  useEffect(() => {
    if (!activeQuestion?.id) return;
    let cancelled = false;
    setIsLoadingDetail(true);
    setQuizDetail(null);

    fetch(`/api/youpass?action=quiz&id=${activeQuestion.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json?.success && json.data) {
          setQuizDetail(json.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoadingDetail(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeQuestion?.id]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((tr) => tr.stop());
      };
      mediaRecorderRef.current = recorder;
      setRecordedUrl(null);
      setElapsedSec(0);
      recorder.start();
      setIsRecording(true);
    } catch {
      alert('Không thể truy cập Micro. Bạn vẫn có thể tự bấm giờ hoặc đọc bài mẫu bên dưới!');
      setElapsedSec(0);
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const detailQuestion = quizDetail?.questions?.[0];

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Back Bar & Topic Info */}
      <div className="bg-white rounded-2xl border border-[#FFEDD1] p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-2 rounded-full bg-[#FFF1E5] hover:bg-[#FFEBE0] text-[#4D2600] font-bold text-xs flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kho Speaking</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#FF6D3A] text-white text-[10px] font-black">
                Speaking Part {partNumber}
              </span>
              {topic.tags?.map((t) => (
                <span
                  key={t.id}
                  className="px-2 py-0.5 rounded-full bg-[#FFF8F2] border border-[#FFEDD1] text-[#4D2600] text-[10px] font-bold"
                >
                  {t.title}
                </span>
              ))}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#1D1D1F] mt-1">{topic.title}</h2>
          </div>
        </div>

        {onSaveAttempt && (
          <button
            type="button"
            onClick={() => {
              onSaveAttempt(`Speaking Part ${partNumber}: ${topic.title}`, Math.max(60, elapsedSec));
              setSavedNotice(true);
              setTimeout(() => setSavedNotice(false), 2500);
            }}
            className="px-4 py-2 rounded-full bg-[#13A62E] hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedNotice ? 'Đã lưu tiến độ Speaking!' : 'Hoàn thành chủ đề này'}</span>
          </button>
        )}
      </div>

      {/* Main Split Workspace: Left Question List & Recorder | Right YouPass Sample Answers & Vocab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Question Selector + Voice Studio */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-[#FFEDD1] p-4 space-y-3 shadow-2xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#FF6D3A]">
              Danh sách câu hỏi ({questions.length} câu)
            </h3>

            {questions.length === 0 ? (
              <p className="text-xs text-[#8A8A8E] py-4">Chủ đề này chưa có câu hỏi chi tiết.</p>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const isActive = idx === selectedIdx;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-2.5 text-xs ${
                        isActive
                          ? 'bg-[#FFF1E5] border-[#FF6D3A] text-[#1D1D1F] font-bold shadow-2xs'
                          : 'bg-[#FFF8F2]/60 border-[#ECECEC] hover:border-[#FFEDD1] text-[#333333] font-medium'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                          isActive ? 'bg-[#FF6D3A] text-white' : 'bg-white border border-[#FFEDD1] text-[#4D2600]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{q.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive Recorder & Timer */}
          <div className="bg-white rounded-2xl border border-[#FFEDD1] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#4D2600]">
                <Volume2 className="w-4 h-4 text-[#FF6D3A]" />
                <span>Phòng Thu Luyện Nói</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FFF8F2] border border-[#FFEDD1] font-mono text-xs font-bold text-[#FF6D3A] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatSecondsHMS(elapsedSec).slice(3)}
              </span>
            </div>

            {activeQuestion && (
              <div className="p-3.5 rounded-xl bg-[#FFF8F2] border border-[#FFEDD1] text-sm font-bold text-[#1D1D1F] leading-relaxed">
                {activeQuestion.title}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex-1 py-2.5 px-4 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <Mic className="w-4 h-4" />
                  <span>Bắt đầu ghi âm trả lời</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex-1 py-2.5 px-4 rounded-full bg-[#FF3532] hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 animate-pulse transition"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Dừng ghi âm ({formatSecondsHMS(elapsedSec).slice(3)})</span>
                </button>
              )}
            </div>

            {recordedUrl && (
              <div className="p-3 rounded-xl bg-[#E8F8EC]/60 border border-[#13A62E]/30 space-y-1.5">
                <span className="text-[11px] font-bold text-[#13A62E] flex items-center gap-1">
                  <Play className="w-3 h-3" /> Nghe lại giọng nói của bạn:
                </span>
                <audio controls src={recordedUrl} className="w-full h-9" />
              </div>
            )}
          </div>
        </div>

        {/* Right: Official YouPass Sample Answers & Vocabulary */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#FFEDD1] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF6D3A]" />
              <h3 className="font-black text-base text-[#1D1D1F]">
                Gợi Ý Trả Lời & Từ Vựng Band 8.0+ (YouPass)
              </h3>
            </div>
            {topic.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getYouPassAssetUrl(topic.thumbnail, 120)}
                alt={topic.title}
                className="w-10 h-10 rounded-xl object-cover border border-[#FFEDD1]"
              />
            )}
          </div>

          {isLoadingDetail ? (
            <div className="space-y-3 animate-pulse py-6">
              <div className="h-4 bg-[#FFF1E5] rounded w-3/4" />
              <div className="h-3 bg-[#FFF8F2] rounded w-full" />
              <div className="h-3 bg-[#FFF8F2] rounded w-5/6" />
              <div className="h-3 bg-[#FFF8F2] rounded w-4/5" />
            </div>
          ) : detailQuestion?.instruction ? (
            <div
              className="text-xs sm:text-sm text-[#333333] leading-relaxed space-y-3 [&_strong]:text-[#1D1D1F] [&_hr]:my-4 [&_hr]:border-[#FFEDD1]"
              dangerouslySetInnerHTML={{
                __html: sanitizeYouPassHtml(detailQuestion.instruction),
              }}
            />
          ) : (
            <div className="py-10 text-center space-y-2 text-xs text-[#8A8A8E]">
              <BookOpen className="w-8 h-8 text-[#CBD5E1] mx-auto" />
              <p>Chọn một câu hỏi ở cột bên trái để xem bài mẫu và từ vựng chi tiết.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
