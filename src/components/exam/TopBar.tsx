'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Eye,
  EyeOff,
  HelpCircle,
  Settings2,
  Send,
  User,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useExamStore } from '@/lib/store';
import { HelpModal } from './HelpModal';
import { SettingsModal } from './SettingsModal';
import { SubmitConfirmModal } from './SubmitConfirmModal';

export const TopBar: React.FC = () => {
  const {
    candidateName,
    candidateNumber,
    exam,
    timeRemaining,
    isTimerHidden,
    isSubmitted,
    toggleTimerHidden,
    decrementTime,
  } = useExamStore();

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Audio state for Listening mode
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer interval
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      decrementTime();
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, decrementTime]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isLowTime = timeRemaining <= 300; // Under 5 minutes
  const isWarningTime = timeRemaining <= 600 && timeRemaining > 300; // Under 10 minutes

  // Audio controls for Listening
  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (isMuted && newVol > 0) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
      }
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <header className="h-16 px-4 sm:px-6 border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm flex items-center justify-between select-none shrink-0 z-30">
        {/* Candidate Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 flex items-center justify-center text-slate-700 dark:text-zinc-200">
            <User className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-zinc-100">
                {candidateName}
              </span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400">
                {candidateNumber}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400 truncate max-w-[200px] sm:max-w-xs">
              {exam.title}
            </div>
          </div>
        </div>

        {/* Center: Audio Player (if Listening) or Dynamic Timer */}
        <div className="flex items-center gap-4">
          {exam.module === 'listening' && (
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-xs">
              <audio
                ref={audioRef}
                src="https://actions.google.com/sounds/v1/ambiences/rainforest_birds.ogg"
                onEnded={() => setIsPlaying(false)}
              />
              <button
                onClick={toggleAudioPlay}
                className="p-1 rounded-full bg-sky-600 hover:bg-sky-700 text-white transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
              <span className="font-semibold text-slate-700 dark:text-zinc-200">
                {isPlaying ? 'Exam Audio Playing' : 'Exam Audio Ready'}
              </span>
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-300 dark:border-zinc-700">
                <button
                  onClick={toggleMute}
                  className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 h-1.5 accent-sky-600 cursor-pointer"
                  title="Adjust audio volume"
                />
              </div>
            </div>
          )}

          {/* Timer Display */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm tracking-wide transition ${
                isLowTime
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 animate-pulse'
                  : isWarningTime
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-zinc-800/80 border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{isTimerHidden ? '••:••' : `${timeFormatted} left`}</span>
            </div>

            <button
              onClick={toggleTimerHidden}
              title={isTimerHidden ? 'Show time remaining' : 'Hide time remaining'}
              className="p-2 rounded-md border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              {isTimerHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right Actions: Fullscreen, Help, Settings, Submit */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (Exam Mode)'}
            className="p-2 rounded-md border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsHelpOpen(true)}
            title="Examination Help & Shortcuts"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Help</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Theme & Font Size Settings"
            className="p-2 rounded-md border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {!isSubmitted && (
            <button
              onClick={() => setIsSubmitConfirmOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-md bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Finish Test</span>
            </button>
          )}
        </div>
      </header>

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SubmitConfirmModal
        isOpen={isSubmitConfirmOpen}
        onClose={() => setIsSubmitConfirmOpen(false)}
      />
    </>
  );
};
