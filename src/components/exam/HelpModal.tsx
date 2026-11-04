'use client';

import React from 'react';
import { X, HelpCircle, Highlighter, MessageSquare, Flag, ArrowLeftRight, Clock } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100">
              Official IELTS Computer-Delivered Test Instructions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-slate-700 dark:text-zinc-300 text-sm leading-relaxed">
          <div className="flex items-start gap-3">
            <Highlighter className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-zinc-100">Highlighter & Notes</p>
              <p>
                Select any text on the passage or question stems with your mouse. A context popup will appear allowing you to <strong>Highlight</strong> in yellow or create a <strong>Note</strong> in blue with a sticky popup attached.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ArrowLeftRight className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-zinc-100">Resizable Split-Screen</p>
              <p>
                Drag the vertical divider in the middle of your screen to expand the passage reading pane or the questions pane to your preferred reading width.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-zinc-100">Countdown Timer</p>
              <p>
                The timer in the top bar counts down from 60 minutes (Reading/Writing) or 30 minutes (Listening). You can toggle the <strong>Hide / Show</strong> button at any time. When 10 minutes and 5 minutes remain, the timer changes color to remind you.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Flag className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-zinc-100">Review Questions</p>
              <p>
                Check the <strong>Review</strong> checkbox next to any question you want to reconsider later. A distinct dot appears on that question number in the bottom bar.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-zinc-100">Bottom Question Palette</p>
              <p>
                Click any numbered button (1 to 40) in the bottom navigation bar to jump directly to that question. Answered questions will be underlined/filled.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
