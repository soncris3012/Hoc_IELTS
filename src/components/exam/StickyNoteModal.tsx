'use client';

import React, { useState } from 'react';
import { X, Trash2, StickyNote, Save } from 'lucide-react';
import { useExamStore } from '@/lib/store';

export const StickyNoteModal: React.FC = () => {
  const { activeNoteModal, setActiveNoteModal, updateHighlightNote, removeHighlight } = useExamStore();
  const [noteText, setNoteText] = useState(activeNoteModal?.initialNote || '');

  // Keep state synced when modal opens
  React.useEffect(() => {
    if (activeNoteModal) {
      setNoteText(activeNoteModal.initialNote || '');
    }
  }, [activeNoteModal]);

  if (!activeNoteModal) return null;

  const handleSave = () => {
    updateHighlightNote(activeNoteModal.highlightId, noteText);
    setActiveNoteModal(null);
  };

  const handleDelete = () => {
    removeHighlight(activeNoteModal.highlightId);
    setActiveNoteModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-amber-50 dark:bg-zinc-900 border-2 border-amber-300 dark:border-amber-600/70 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-amber-100 dark:bg-zinc-800 border-b border-amber-200 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Candidate Sticky Note
            </span>
          </div>
          <button
            onClick={() => setActiveNoteModal(null)}
            className="p-1 rounded text-amber-800 dark:text-zinc-300 hover:bg-amber-200 dark:hover:bg-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Highlight quote */}
        <div className="p-4 space-y-3">
          <div className="text-xs italic bg-white/70 dark:bg-zinc-800/80 p-2.5 rounded border border-amber-200/60 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 line-clamp-3">
            &ldquo;{activeNoteModal.text}&rdquo;
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1">
              Your Annotation:
            </label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Type your notes or translation here..."
              rows={4}
              autoFocus
              className="w-full p-2.5 text-sm bg-white dark:bg-zinc-950 border border-amber-300 dark:border-zinc-700 rounded-lg text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-amber-100/60 dark:bg-zinc-800/60 border-t border-amber-200 dark:border-zinc-700">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Highlight
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveNoteModal(null)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded shadow-xs transition"
            >
              <Save className="w-3.5 h-3.5" />
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
