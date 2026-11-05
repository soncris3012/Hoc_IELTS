'use client';

import React from 'react';
import { X, Settings2, Check } from 'lucide-react';
import { useExamStore } from '@/lib/store';
import { ExamTheme, FontSize } from '@/types/ielts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, fontSize, setTheme, setFontSize } = useExamStore();

  if (!isOpen) return null;

  const fontOptions: { id: FontSize; label: string; desc: string }[] = [
    { id: 'standard', label: 'Standard', desc: 'Default examination font size' },
    { id: 'large', label: 'Large', desc: 'Slightly enlarged text (+15%)' },
    { id: 'extralarge', label: 'Extra Large', desc: 'Maximum readability (+30%)' },
  ];

  const themeOptions: {
    id: ExamTheme;
    label: string;
    bg: string;
    text: string;
    border: string;
    desc: string;
  }[] = [
    {
      id: 'standard',
      label: 'Standard',
      bg: 'bg-white',
      text: 'text-slate-900',
      border: 'border-slate-300',
      desc: 'Black text on white background',
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      bg: 'bg-zinc-950',
      text: 'text-white',
      border: 'border-zinc-700',
      desc: 'White text on black background',
    },
    {
      id: 'yellow',
      label: 'High Contrast',
      bg: 'bg-black',
      text: 'text-yellow-400',
      border: 'border-yellow-400',
      desc: 'Yellow text on black (Official IELTS Accessibility)',
    },
    {
      id: 'youpass_orange',
      label: 'YouPass Signature Orange (Modern Learning)',
      bg: 'bg-[#fffaf5]',
      text: 'text-[#1e293b]',
      border: 'border-[#ea580c]',
      desc: 'Warm cream & signature orange brand theme for relaxed study',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100">
              Exam Display Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Font Size */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-zinc-200 mb-2">
              Font Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {fontOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFontSize(opt.id)}
                  className={`p-3 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                    fontSize === opt.id
                      ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold ring-2 ring-sky-500/30'
                      : 'border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-sm">{opt.label}</span>
                  {fontSize === opt.id && <Check className="w-4 h-4 text-sky-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Color Themes */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-zinc-200 mb-2">
              Color Theme
            </label>
            <div className="space-y-2.5">
              {themeOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`w-full p-3.5 rounded-lg border flex items-center justify-between text-left transition ${t.bg} ${t.text} ${t.border} ${
                    theme === t.id
                      ? 'ring-2 ring-sky-500 shadow-md'
                      : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm">{t.label}</div>
                    <div className="text-xs opacity-75">{t.desc}</div>
                  </div>
                  {theme === t.id && (
                    <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
