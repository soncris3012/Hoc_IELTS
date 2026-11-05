'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Copy,
  BookOpen,
  Headphones,
} from 'lucide-react';
import { mockReadingExam } from '@/data/mockReadingTest';
import { mockListeningExam } from '@/data/mockListeningTest';
import { youpassLegoExam } from '@/data/youpassLegoTest';
import { useExamStore } from '@/lib/store';
import { IELTSExam } from '@/types/ielts';

export default function AdminImportPage() {
  const router = useRouter();
  const { loadExam } = useExamStore();

  const [rawText, setRawText] = useState('');
  const [examModule, setExamModule] = useState<'reading' | 'listening'>('reading');
  const [apiKey, setApiKey] = useState('');
  const [parsedExam, setParsedExam] = useState<IELTSExam | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Preset 1: Cambridge 18 Reading
  const handleLoadReadingPreset = () => {
    setParsedExam(mockReadingExam);
    setStatusMsg({
      type: 'success',
      text: 'Loaded preset: Cambridge IELTS 18 Academic Reading Test 1 (40 Questions, 3 Passages).',
    });
  };

  // Preset 2: Cambridge 18 Listening
  const handleLoadListeningPreset = () => {
    setParsedExam(mockListeningExam);
    setStatusMsg({
      type: 'success',
      text: 'Loaded preset: Cambridge IELTS 18 Listening Test 1 (Audio tracks & questions).',
    });
  };

  // Preset 3: YouPass Lego Simulation
  const handleLoadYouPassLegoPreset = () => {
    setParsedExam(youpassLegoExam);
    setStatusMsg({
      type: 'success',
      text: 'Loaded preset: [Simulation Q4] The Lego brick (YouPass Authentic 13 Questions).',
    });
  };

  // Parse raw text via API route
  const handleParse = async () => {
    if (!rawText.trim()) {
      setStatusMsg({ type: 'error', text: 'Please paste some raw IELTS exam text first.' });
      return;
    }

    setIsLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/ai/parse-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          module: examModule,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Parsing failed');
      }

      setParsedExam(data.exam);
      setStatusMsg({
        type: 'success',
        text: data.note || 'Successfully parsed exam into IELTS standard JSON schema!',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error parsing test content';
      setStatusMsg({ type: 'error', text: message });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload JSON directly
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.parts || !json.module) {
          throw new Error('Invalid JSON format: missing "parts" or "module" property.');
        }
        setParsedExam(json);
        setStatusMsg({ type: 'success', text: `Loaded JSON: ${json.title || file.name}` });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Invalid JSON format';
        setStatusMsg({ type: 'error', text: `Invalid JSON file: ${message}` });
      }
    };
    reader.readAsText(file);
  };

  // Launch test in exam simulator
  const handleLaunch = () => {
    if (!parsedExam) return;
    loadExam(parsedExam);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exam Room
          </Link>
          <div className="text-xs px-2.5 py-1 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-mono">
            Hoc_IELTS Admin Studio
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Smart IELTS Exam Importer & Parser
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Convert raw IELTS test passages, PDFs, questions, and keys from Cambridge 1-19 into our structured CDT schema.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm text-sky-950 dark:text-sky-200">
                Quick Start with Verified Cambridge Presets
              </div>
              <div className="text-xs text-sky-700 dark:text-sky-400">
                One-click load full Cambridge tests into the testing engine:
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadReadingPreset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Load Cam 18 Reading (40 Qs)
              </button>
              <button
                onClick={handleLoadListeningPreset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
              >
                <Headphones className="w-3.5 h-3.5" />
                Load Cam 18 Listening
              </button>
              <button
                onClick={handleLoadYouPassLegoPreset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load YouPass Lego Test
              </button>
            </div>
          </div>

          {/* Input Controls */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  Target Exam Module:
                </span>
                <div className="flex rounded-lg border border-slate-300 dark:border-zinc-700 p-0.5 bg-slate-100 dark:bg-zinc-800 text-xs font-semibold">
                  <button
                    onClick={() => setExamModule('reading')}
                    className={`px-3 py-1 rounded-md transition ${
                      examModule === 'reading'
                        ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    Reading
                  </button>
                  <button
                    onClick={() => setExamModule('listening')}
                    className={`px-3 py-1 rounded-md transition ${
                      examModule === 'listening'
                        ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    Listening
                  </button>
                </div>
              </div>

              {/* Upload JSON file */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-sky-600" />
                <span>Upload .JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Optional Gemini API Key */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Gemini API Key (Optional for AI parsing; falls back to heuristic parser if empty):
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use built-in smart parser)"
                className="w-full sm:max-w-md p-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Raw Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Paste Raw Cambridge Exam Text / HTML:
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste reading passages, questions, and answers here..."
                rows={7}
                className="w-full p-3 text-xs font-mono bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Parse Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleParse}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white shadow-sm transition"
              >
                <Sparkles className="w-4 h-4" />
                {isLoading ? 'Parsing with AI Engine...' : 'Parse Raw Exam Text'}
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>{statusMsg.text}</div>
            </div>
          )}

          {/* Parsed JSON Preview */}
          {parsedExam && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Parsed JSON Schema Preview ({parsedExam.parts.length} Parts,{' '}
                    {parsedExam.parts.reduce((acc, p) => acc + p.questions.length, 0)} Questions)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Title: {parsedExam.title} • Module: {parsedExam.module}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(parsedExam, null, 2));
                      alert('JSON schema copied to clipboard!');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy JSON
                  </button>

                  <button
                    onClick={handleLaunch}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Launch in Exam Room Now
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono max-h-80 overflow-y-auto">
                {JSON.stringify(parsedExam, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
