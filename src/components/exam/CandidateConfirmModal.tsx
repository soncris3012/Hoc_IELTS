'use client';

import React, { useState } from 'react';
import { User, Volume2, ShieldCheck, Play, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { useExamStore } from '@/lib/store';

interface CandidateConfirmModalProps {
  isOpen: boolean;
  onStart: () => void;
}

export const CandidateConfirmModal: React.FC<CandidateConfirmModalProps> = ({ isOpen, onStart }) => {
  const { candidateName, candidateNumber, exam, setCandidateInfo } = useExamStore();
  const [name, setName] = useState(candidateName);
  const [candNum, setCandNum] = useState(candidateNumber);
  const [hasTestedSound, setHasTestedSound] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  if (!isOpen) return null;

  const testAudio = () => {
    setIsPlayingSound(true);
    const audio = new Audio('https://actions.google.com/sounds/v1/ambiences/outdoor_market.ogg');
    audio.volume = 0.5;
    audio.play().catch(console.error);
    setTimeout(() => {
      audio.pause();
      setIsPlayingSound(false);
      setHasTestedSound(true);
    }, 3000);
  };

  const handleConfirm = () => {
    setCandidateInfo(name, candNum);
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Official Header */}
        <div className="px-8 py-5 border-b border-slate-200 dark:border-zinc-800 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center font-black text-lg">
              IDP
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">IELTS on Computer</h2>
              <p className="text-xs text-slate-300">Official Candidate Verification & Setup</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-sky-400 border border-slate-700">
            {exam.category} {exam.module.toUpperCase()}
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-700 dark:text-zinc-300">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
              Confirm Your Candidate Details
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Please verify your personal information before the invigilator releases the exam questions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Candidate Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Candidate Number
              </label>
              <input
                type="text"
                value={candNum}
                onChange={(e) => setCandNum(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg font-mono font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* If Listening: Sound Check */}
          {exam.module === 'listening' && (
            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-900 dark:text-sky-300 font-bold text-xs">
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>Headphone Sound Check</span>
                </div>
                {hasTestedSound && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ Sound Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-sky-800 dark:text-sky-300">
                Put on your headphones. Click below to confirm you hear the audio clearly.
              </p>
              <button
                type="button"
                onClick={testAudio}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition"
              >
                <Play className="w-3.5 h-3.5" />
                {isPlayingSound ? 'Playing test audio (3s)...' : 'Play Test Sound'}
              </button>
            </div>
          )}

          {/* Test Specs */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-xs text-slate-500">Duration</div>
                <div className="font-bold text-slate-900 dark:text-white">{exam.durationMinutes} Minutes</div>
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-sky-500" />
              <div>
                <div className="text-xs text-slate-500">Total Items</div>
                <div className="font-bold text-slate-900 dark:text-white">40 Questions (3 Parts)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-8 py-4 bg-slate-50 dark:bg-zinc-800/60 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Official IDP & British Council Simulation
          </span>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-sky-600 hover:bg-sky-700 text-white shadow-md transition"
          >
            <span>Start Test Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
