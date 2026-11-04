'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useExamStore } from '@/lib/store';
import { GripVertical } from 'lucide-react';

interface ResizableSplitPaneProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
}

export const ResizableSplitPane: React.FC<ResizableSplitPaneProps> = ({ leftPane, rightPane }) => {
  const { splitRatio, setSplitRatio } = useExamStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;

      // Constrain ratio between 25% and 75%
      if (newRatio >= 25 && newRatio <= 75) {
        setSplitRatio(Math.round(newRatio));
      }
    },
    [isDragging, setSplitRatio]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !containerRef.current || !e.touches[0]) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newRatio = ((e.touches[0].clientX - rect.left) / rect.width) * 100;

      if (newRatio >= 25 && newRatio <= 75) {
        setSplitRatio(Math.round(newRatio));
      }
    },
    [isDragging, setSplitRatio]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div
      ref={containerRef}
      className={`flex-1 flex overflow-hidden select-none ${
        isDragging ? 'cursor-col-resize select-none pointer-events-none' : ''
      }`}
    >
      {/* Left Pane (Passage / Prompt) */}
      <div
        style={{ width: `${splitRatio}%` }}
        className="h-full overflow-y-auto border-r border-slate-200 dark:border-zinc-800 pointer-events-auto bg-white dark:bg-zinc-950 transition-none"
      >
        {leftPane}
      </div>

      {/* Draggable Divider */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="w-2.5 h-full relative z-20 flex items-center justify-center cursor-col-resize bg-slate-200 hover:bg-sky-500 active:bg-sky-600 dark:bg-zinc-800 dark:hover:bg-sky-500 transition-colors pointer-events-auto shrink-0 group"
        title="Drag to resize passage and questions"
      >
        <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-white dark:text-zinc-500 transition" />
      </div>

      {/* Right Pane (Questions / Writing Area) */}
      <div
        style={{ width: `${100 - splitRatio}%` }}
        className="h-full overflow-y-auto pointer-events-auto bg-slate-50/50 dark:bg-zinc-900/40 transition-none"
      >
        {rightPane}
      </div>
    </div>
  );
};
