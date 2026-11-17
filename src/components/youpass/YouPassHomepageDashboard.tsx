'use client';

import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Edit3,
  Eye,
  Flame,
  Headphones,
  Mic,
  PenTool,
  RotateCcw,
  Save,
  Sparkles,
  Target,
} from 'lucide-react';
import { YouPassAttemptRecord, YouPassGoal, YouPassSkill } from '@/types/youpass';
import { formatSecondsHMS } from '@/lib/youpassHelpers';

interface YouPassHomepageDashboardProps {
  history: YouPassAttemptRecord[];
  goal: YouPassGoal;
  onUpdateGoal: (nextGoal: YouPassGoal) => void;
  onOpenCatalog: (skill?: YouPassSkill) => void;
  onReviewAttempt: (record: YouPassAttemptRecord) => void;
  onRetakeAttempt: (record: YouPassAttemptRecord) => void;
}

export const YouPassHomepageDashboard: React.FC<YouPassHomepageDashboardProps> = ({
  history,
  goal,
  onUpdateGoal,
  onOpenCatalog,
  onReviewAttempt,
  onRetakeAttempt,
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [draftGoal, setDraftGoal] = useState<YouPassGoal>(goal);

  const daysRemaining = useMemo(() => {
    if (!goal.examDate) return null;
    const diff = Math.ceil(
      (new Date(goal.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  }, [goal.examDate]);

  // Aggregate attempts by YYYY-MM-DD
  const statsByDate = useMemo(() => {
    const map = new Map<
      string,
      { reading: number; listening: number; writing: number; speaking: number; seconds: number }
    >();
    history.forEach((rec) => {
      const dateKey = rec.submittedAt.slice(0, 10);
      const cur = map.get(dateKey) || {
        reading: 0,
        listening: 0,
        writing: 0,
        speaking: 0,
        seconds: 0,
      };
      cur[rec.skill] += 1;
      cur.seconds += rec.durationSeconds || 0;
      map.set(dateKey, cur);
    });
    return map;
  }, [history]);

  // Current 7 days (Mon-Sun of current week)
  const weeklyRows = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun..6=Sat
    const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMon);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      const label = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${d.getFullYear()}`;
      const stats = statsByDate.get(iso) || {
        reading: 0,
        listening: 0,
        writing: 0,
        speaking: 0,
        seconds: 0,
      };
      return { iso, label, ...stats };
    });
  }, [statsByDate]);

  const weeklyTotals = useMemo(() => {
    return weeklyRows.reduce(
      (acc, r) => ({
        reading: acc.reading + r.reading,
        listening: acc.listening + r.listening,
        writing: acc.writing + r.writing,
        speaking: acc.speaking + r.speaking,
        seconds: acc.seconds + r.seconds,
      }),
      { reading: 0, listening: 0, writing: 0, speaking: 0, seconds: 0 }
    );
  }, [weeklyRows]);

  // Build 3-month calendar grid (2 previous months + current month)
  const threeMonths = useMemo(() => {
    const now = new Date();
    const result: Array<{
      title: string;
      year: number;
      month: number;
      cells: Array<{ day: number | null; iso?: string; count: number }>;
    }> = [];

    for (let offset = -2; offset <= 0; offset++) {
      const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const year = target.getFullYear();
      const month = target.getMonth();
      const firstWeekday = (target.getDay() + 6) % 7; // Mon=0..Sun=6
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const cells: Array<{ day: number | null; iso?: string; count: number }> = [];
      for (let pad = 0; pad < firstWeekday; pad++) {
        cells.push({ day: null, count: 0 });
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const st = statsByDate.get(iso);
        const count = st ? st.reading + st.listening + st.writing + st.speaking : 0;
        cells.push({ day: d, iso, count });
      }
      result.push({
        title: `Tháng ${String(month + 1).padStart(2, '0')} / ${year}`,
        year,
        month,
        cells,
      });
    }
    return result;
  }, [statsByDate]);

  const handleSaveGoal = () => {
    onUpdateGoal(draftGoal);
    setIsEditingGoal(false);
  };

  const skillMeta: Record<YouPassSkill, { label: string; color: string; icon: React.ReactNode }> = {
    reading: {
      label: 'Reading',
      color: 'bg-orange-100 text-[#FF6D3A]',
      icon: <BookOpen className="w-3 h-3" />,
    },
    listening: {
      label: 'Listening',
      color: 'bg-sky-100 text-sky-700',
      icon: <Headphones className="w-3 h-3" />,
    },
    writing: {
      label: 'Writing',
      color: 'bg-purple-100 text-purple-700',
      icon: <PenTool className="w-3 h-3" />,
    },
    speaking: {
      label: 'Speaking',
      color: 'bg-emerald-100 text-emerald-700',
      icon: <Mic className="w-3 h-3" />,
    },
  };

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Practice Plan Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FF6D3A] via-[#FF8548] to-[#FFA41B] p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>YouPass My Homepage • Kho 2,540+ Đề Thực Tế</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Phá đảo tất cả dạng đề IELTS cùng YouPass!
          </h2>
          <p className="text-xs sm:text-sm text-orange-50 max-w-2xl">
            Theo dõi mục tiêu band điểm, lịch sử làm bài và luyện trực tiếp 533 đề Reading, 707 đề Listening, 901 đề Writing & 399 chủ đề Speaking.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenCatalog('reading')}
          className="px-5 py-2.5 rounded-full bg-white text-[#FF6D3A] hover:bg-[#FFF8F2] font-black text-xs shadow-sm transition shrink-0"
        >
          Vào Kho Luyện Đề →
        </button>
      </div>

      {/* Row 1: Mục tiêu & Lịch thi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mục tiêu của bạn */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#FFEDD1] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#FF6D3A]" />
              <h3 className="font-black text-base text-[#1D1D1F]">Mục tiêu của bạn</h3>
            </div>
            {!isEditingGoal ? (
              <button
                type="button"
                onClick={() => {
                  setDraftGoal(goal);
                  setIsEditingGoal(true);
                }}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF1E5] hover:bg-[#FFEBE0] text-[#FF6D3A] text-xs font-bold transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh mục tiêu</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveGoal}
                className="flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#13A62E] text-white text-xs font-bold transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu mục tiêu</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(
              [
                { key: 'overall', label: 'Overall score', highlight: true },
                { key: 'reading', label: 'Reading', highlight: false },
                { key: 'listening', label: 'Listening', highlight: false },
                { key: 'writing', label: 'Writing', highlight: false },
                { key: 'speaking', label: 'Speaking', highlight: false },
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                className={`p-3 rounded-2xl border text-center space-y-1 ${
                  item.highlight
                    ? 'bg-[#FFF1E5] border-[#FF6D3A]/40'
                    : 'bg-[#FFF8F2] border-[#FFEDD1]'
                }`}
              >
                <div className="text-[11px] font-bold text-[#4D2600]">{item.label}</div>
                {isEditingGoal ? (
                  <input
                    type="number"
                    min={1}
                    max={9}
                    step={0.5}
                    value={draftGoal[item.key]}
                    onChange={(e) =>
                      setDraftGoal((prev) => ({
                        ...prev,
                        [item.key]: Math.min(9, Math.max(0, Number(e.target.value))),
                      }))
                    }
                    className="w-16 mx-auto text-center px-2 py-1 rounded-lg border border-[#FF6D3A] bg-white font-black text-base text-[#FF6D3A] outline-hidden"
                  />
                ) : (
                  <div className="text-2xl font-black text-[#FF6D3A]">
                    {goal[item.key].toFixed(1)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lịch thi & Đếm ngược */}
        <div className="bg-white rounded-2xl border border-[#FFEDD1] p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 border-b border-[#ECECEC] pb-3">
            <Calendar className="w-5 h-5 text-[#FF6D3A]" />
            <h3 className="font-black text-base text-[#1D1D1F]">Lịch thi dự kiến</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#FFF8F2] border border-[#FFEDD1] space-y-1">
              <div className="text-[11px] font-bold text-[#8A8A8E]">Ngày dự thi</div>
              {isEditingGoal ? (
                <input
                  type="date"
                  value={draftGoal.examDate}
                  onChange={(e) =>
                    setDraftGoal((prev) => ({ ...prev, examDate: e.target.value }))
                  }
                  className="w-full px-2 py-1 rounded-lg border border-[#FF6D3A] bg-white text-xs font-bold text-[#1D1D1F]"
                />
              ) : (
                <div className="text-sm font-black text-[#1D1D1F]">
                  {goal.examDate.split('-').reverse().join('/')}
                </div>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-[#FFF1E5] border border-[#FFEDD1] space-y-1 text-center">
              <div className="text-[11px] font-bold text-[#4D2600]">Số ngày còn lại</div>
              <div className="text-xl font-black text-[#FF6D3A] flex items-center justify-center gap-1">
                <Flame className="w-4 h-4" />
                <span>{daysRemaining ?? '--'} ngày</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1 text-[11px] font-bold">
            {(['reading', 'listening', 'writing', 'speaking'] as const).map((sk) => (
              <button
                key={sk}
                type="button"
                onClick={() => onOpenCatalog(sk)}
                className="py-1.5 rounded-xl bg-[#FFF8F2] hover:bg-[#FF6D3A] hover:text-white text-[#4D2600] border border-[#FFEDD1] capitalize transition"
              >
                {sk}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Biểu đồ chăm chỉ (3-month calendar) + Thống kê tuần */}
      <div className="bg-white rounded-2xl border border-[#FFEDD1] p-5 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECECEC] pb-3">
          <div>
            <h3 className="font-black text-base text-[#1D1D1F]">Biểu đồ “chăm chỉ” của bạn</h3>
            <p className="text-xs text-[#8A8A8E]">
              Theo dõi số bài đã nộp mỗi ngày across Reading, Listening, Writing & Speaking
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#FFF1E5] border border-[#FFEDD1]" />
              Chưa làm bài
            </span>
            <span className="flex items-center gap-1.5 font-bold text-[#FF6D3A]">
              <span className="w-3 h-3 rounded bg-[#FF6D3A]" />
              Có nộp bài
            </span>
          </div>
        </div>

        {/* 3-Month Heatmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {threeMonths.map((m) => (
            <div
              key={m.title}
              className="p-4 rounded-2xl bg-[#FFF8F2]/70 border border-[#FFEDD1] space-y-2.5"
            >
              <div className="text-xs font-black text-[#4D2600] text-center">{m.title}</div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#8A8A8E]">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span>CN</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {m.cells.map((cell, idx) =>
                  cell.day === null ? (
                    <div key={`pad-${idx}`} className="h-7" />
                  ) : (
                    <div
                      key={cell.iso}
                      title={`${cell.iso}: ${cell.count} bài đã nộp`}
                      className={`h-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition ${
                        cell.count > 0
                          ? 'bg-[#FF6D3A] text-white shadow-2xs'
                          : 'bg-white border border-[#ECECEC] text-[#333333]'
                      }`}
                    >
                      {cell.day}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Summary Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse border border-[#ECECEC] rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-[#FFF1E5] text-[#4D2600] font-extrabold">
                <th className="p-2.5 text-left border border-[#ECECEC]">Ngày</th>
                <th className="p-2.5 text-center border border-[#ECECEC]">Reading</th>
                <th className="p-2.5 text-center border border-[#ECECEC]">Listening</th>
                <th className="p-2.5 text-center border border-[#ECECEC]">Writing</th>
                <th className="p-2.5 text-center border border-[#ECECEC]">Speaking</th>
                <th className="p-2.5 text-right border border-[#ECECEC]">Thời gian học</th>
              </tr>
            </thead>
            <tbody>
              {weeklyRows.map((row) => (
                <tr key={row.iso} className="hover:bg-[#FFF8F2]/60">
                  <td className="p-2.5 font-semibold text-[#1D1D1F] border border-[#ECECEC]">
                    {row.label}
                  </td>
                  <td className="p-2.5 text-center border border-[#ECECEC]">
                    {row.reading || '-'}
                  </td>
                  <td className="p-2.5 text-center border border-[#ECECEC]">
                    {row.listening || '-'}
                  </td>
                  <td className="p-2.5 text-center border border-[#ECECEC]">
                    {row.writing || '-'}
                  </td>
                  <td className="p-2.5 text-center border border-[#ECECEC]">
                    {row.speaking || '-'}
                  </td>
                  <td className="p-2.5 text-right font-mono border border-[#ECECEC]">
                    {Math.round(row.seconds / 60)}m
                  </td>
                </tr>
              ))}
              <tr className="bg-[#FFF8F2] font-black text-[#FF6D3A]">
                <td className="p-2.5 border border-[#ECECEC]">Tổng cộng tuần này</td>
                <td className="p-2.5 text-center border border-[#ECECEC]">{weeklyTotals.reading}</td>
                <td className="p-2.5 text-center border border-[#ECECEC]">
                  {weeklyTotals.listening}
                </td>
                <td className="p-2.5 text-center border border-[#ECECEC]">{weeklyTotals.writing}</td>
                <td className="p-2.5 text-center border border-[#ECECEC]">
                  {weeklyTotals.speaking}
                </td>
                <td className="p-2.5 text-right font-mono border border-[#ECECEC]">
                  {Math.round(weeklyTotals.seconds / 60)}m
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Lịch sử nộp bài */}
      <div className="bg-white rounded-2xl border border-[#FFEDD1] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FF6D3A]" />
            <h3 className="font-black text-base text-[#1D1D1F]">
              Lịch sử nộp bài ({history.length})
            </h3>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <Clock className="w-10 h-10 text-[#CBD5E1] mx-auto" />
            <p className="text-sm font-bold text-[#1D1D1F]">Bạn chưa nộp bài tập nào trong phiên này.</p>
            <p className="text-xs text-[#8A8A8E]">
              Hãy chọn một đề thi trong Kho Luyện đề 4 kỹ năng, kết quả và giải thích chi tiết sẽ được lưu tại đây!
            </p>
            <button
              type="button"
              onClick={() => onOpenCatalog('reading')}
              className="px-5 py-2 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-bold text-xs transition"
            >
              Khám phá kho 2,540+ đề ngay
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {history.map((rec) => {
              const sm = skillMeta[rec.skill];
              return (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl border border-[#ECECEC] hover:border-[#FF6D3A]/40 bg-[#FFF8F2]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${sm.color}`}
                      >
                        {sm.icon}
                        <span>{sm.label}</span>
                      </span>
                      <span className="text-[11px] text-[#8A8A8E]">
                        {new Date(rec.submittedAt).toLocaleString('vi-VN')}
                      </span>
                      <span className="text-[11px] font-mono text-[#4D2600]">
                        • {formatSecondsHMS(rec.durationSeconds).slice(3)}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-[#1D1D1F]">{rec.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-[#FFF1E5] border border-[#FFEDD1] font-black text-xs text-[#FF6D3A]">
                      {rec.skill === 'writing' && rec.bandScore
                        ? `Band ${rec.bandScore.toFixed(1)}`
                        : rec.skill === 'speaking'
                        ? 'Đã luyện'
                        : `${rec.correct}/${rec.total} câu`}
                    </span>

                    {rec.skill !== 'speaking' && (
                      <button
                        type="button"
                        onClick={() => onReviewAttempt(rec)}
                        className="px-3 py-1.5 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-bold text-xs flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem lại giải thích</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onRetakeAttempt(rec)}
                      className="px-3 py-1.5 rounded-full border border-[#CBD5E1] bg-white hover:bg-[#F8F8F8] text-[#1D1D1F] font-bold text-xs flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Làm lại</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
