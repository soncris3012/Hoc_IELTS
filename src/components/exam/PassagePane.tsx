'use client';

import React from 'react';
import { useExamStore } from '@/lib/store';
import { Trash2, MessageSquare, BookOpen } from 'lucide-react';

export const PassagePane: React.FC = () => {
  const {
    exam,
    currentPartNumber,
    highlights,
    clearPassageHighlights,
    setActiveNoteModal,
  } = useExamStore();

  const currentPart = exam.parts.find((p) => p.partNumber === currentPartNumber);
  const passage = currentPart?.passage;
  const passageId = passage?.id || `passage-${currentPartNumber}`;

  const currentPassageHighlights = highlights.filter((h) => h.passageId === passageId);

  if (!passage) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-zinc-400">
        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="font-semibold">No reading passage for this section.</p>
        <p className="text-xs mt-1">Please refer directly to the audio track and questions.</p>
      </div>
    );
  }

  // Render text paragraph with active highlights
  const renderParagraphText = (text: string) => {
    if (!currentPassageHighlights.length) {
      return text;
    }

    // Sort highlights by occurrence or length
    const relevantHls = currentPassageHighlights.filter((h) => text.includes(h.text));
    if (!relevantHls.length) return text;

    // Build replacement segments
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Find closest matching highlight
      let bestIndex = -1;
      let matchedHl: (typeof relevantHls)[0] | null = null;

      for (const hl of relevantHls) {
        const idx = remaining.indexOf(hl.text);
        if (idx !== -1 && (bestIndex === -1 || idx < bestIndex)) {
          bestIndex = idx;
          matchedHl = hl;
        }
      }

      if (bestIndex === -1 || !matchedHl) {
        parts.push(remaining);
        break;
      }

      // Add text before match
      if (bestIndex > 0) {
        parts.push(remaining.substring(0, bestIndex));
      }

      // Add highlighted span
      const currentHl = matchedHl;
      parts.push(
        <span
          key={`hl-${keyIdx++}`}
          onClick={(e) => {
            e.stopPropagation();
            if (currentHl.note) {
              setActiveNoteModal({
                highlightId: currentHl.id,
                text: currentHl.text,
                initialNote: currentHl.note,
              });
            } else {
              // Clicked yellow highlight -> allow deleting or adding note
              setActiveNoteModal({
                highlightId: currentHl.id,
                text: currentHl.text,
                initialNote: '',
              });
            }
          }}
          title={currentHl.note ? `Note: "${currentHl.note}"` : 'Click to edit or remove highlight'}
          className={`${
            currentHl.color === 'yellow' ? 'ielts-hl-yellow' : 'ielts-hl-blue'
          } inline-flex items-center gap-1 cursor-pointer`}
        >
          {currentHl.text}
          {currentHl.note && (
            <MessageSquare className="w-3.5 h-3.5 inline text-sky-700 dark:text-sky-300" />
          )}
        </span>
      );

      remaining = remaining.substring(bestIndex + matchedHl.text.length);
    }

    return parts;
  };

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6 select-text text-slate-800 dark:text-zinc-100">
      {/* Passage Header */}
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-sky-600 dark:text-sky-400">
            {currentPart?.title}
          </span>
          {currentPassageHighlights.length > 0 && (
            <button
              onClick={() => clearPassageHighlights(passageId)}
              className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all highlights ({currentPassageHighlights.length})
            </button>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {passage.title}
        </h1>
        {passage.subtitle && (
          <p className="text-sm italic text-slate-500 dark:text-zinc-400 mt-1">
            {passage.subtitle}
          </p>
        )}
      </div>

      {/* Paragraphs */}
      <div className="space-y-6 text-base leading-relaxed">
        {passage.paragraphs.map((p) => (
          <div key={p.id} className="relative group">
            <div className="flex gap-4 items-start">
              {p.label && (
                <span className="shrink-0 w-7 h-7 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-zinc-300 mt-0.5 select-none">
                  {p.label}
                </span>
              )}
              <div className="flex-1 text-justify">
                {renderParagraphText(p.text)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
