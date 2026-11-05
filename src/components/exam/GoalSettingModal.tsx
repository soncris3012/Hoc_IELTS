'use client';

import React, { useState } from 'react';
import { X, Target, Calendar, Flame, Trophy, Check } from 'lucide-react';
import { useExamStore } from '@/lib/store';

interface GoalSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalSettingModal: React.FC<GoalSettingModalProps> = ({ isOpen, onClose }) => {
  const { userGoal, setUserGoal } = useExamStore();
  const [targetBand, setTargetBand] = useState<number>(userGoal.targetBand || 7.5);
  const [examDate, setExamDate] = useState<string>(userGoal.examDate || '2026-12-15');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const bandOptions = [5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

  // Calculate days remaining
  const calculateDaysLeft = (dateStr?: string) => {
    if (!dateStr) return null;
    const target = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const daysLeft = calculateDaysLeft(examDate);

  const handleSave = () => {
    setUserGoal({
      targetBand,
      examDate,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-base">Thiết Lập Mục Tiêu & Ngày Thi IELTS</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* Target Band Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Mục tiêu Overall Band Score:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bandOptions.map((band) => (
                <button
                  key={band}
                  type="button"
                  onClick={() => setTargetBand(band)}
                  className={`py-2 px-1 text-sm font-bold rounded-lg border text-center transition ${
                    targetBand === band
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm ring-2 ring-sky-400/30'
                      : 'border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  Band {band.toFixed(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Ngày thi chính thức dự kiến:
            </label>
            <div className="relative">
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Real-time Motivation Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/30 border border-sky-100 dark:border-sky-900/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                Thời gian đếm ngược:
              </span>
              <span className="font-extrabold text-sky-700 dark:text-sky-300 text-sm">
                {daysLeft !== null ? `Còn ${daysLeft} ngày` : 'Chưa chọn'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-sky-200/50 dark:border-sky-800/40">
              <span className="font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                Chuỗi luyện tập liên tục (Streak):
              </span>
              <span className="font-extrabold text-orange-600 dark:text-orange-400 text-sm">
                🔥 {userGoal.streakDays} ngày
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-slate-50 dark:bg-zinc-800/60 border-t border-slate-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition shadow-sm"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã lưu!</span>
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4" />
                <span>Lưu Mục Tiêu</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
