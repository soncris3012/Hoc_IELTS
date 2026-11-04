'use client';

import React, { useState, useEffect } from 'react';
import { Highlighter, StickyNote } from 'lucide-react';
import { useExamStore } from '@/lib/store';

export const HighlightMenu: React.FC = () => {
  const { addHighlight, setActiveNoteModal, currentPartNumber } = useExamStore();
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setCoords(null);
        setSelectedText('');
        return;
      }

      const text = selection.toString().trim();
      if (text.length < 2) {
        setCoords(null);
        setSelectedText('');
        return;
      }

      // Check if selection is inside an allowed area (passage or questions)
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        setSelectedText(text);
        setCoords({
          x: Math.max(10, rect.left + rect.width / 2 - 90),
          y: Math.max(10, rect.top - 46),
        });
      }
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setCoords(null);
        setSelectedText('');
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  if (!coords || !selectedText) return null;

  const handleHighlight = () => {
    addHighlight({
      passageId: `passage-${currentPartNumber}`,
      targetType: 'passage',
      text: selectedText,
      color: 'yellow',
    });
    setCoords(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleNote = () => {
    const hlId = addHighlight({
      passageId: `passage-${currentPartNumber}`,
      targetType: 'passage',
      text: selectedText,
      color: 'blue',
      note: '',
    });
    setActiveNoteModal({
      highlightId: hlId,
      text: selectedText,
      initialNote: '',
    });
    setCoords(null);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div
      style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
      className="fixed z-40 flex items-center gap-1 bg-slate-900/95 dark:bg-zinc-800/95 text-white p-1 rounded-lg shadow-xl border border-slate-700/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        onClick={handleHighlight}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-amber-400 hover:bg-amber-300 text-amber-950 transition"
      >
        <Highlighter className="w-3.5 h-3.5" />
        <span>Highlight</span>
      </button>

      <button
        onClick={handleNote}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-sky-500 hover:bg-sky-400 text-white transition"
      >
        <StickyNote className="w-3.5 h-3.5" />
        <span>Note</span>
      </button>
    </div>
  );
};
