'use client';

import React, { useState, useEffect } from 'react';
import { X, Volume2, Bookmark, Check, Sparkles, BookOpen } from 'lucide-react';
import { useExamStore } from '@/lib/store';

export const VocabLookupModal: React.FC = () => {
  const { vocabModal, setVocabModal, addVocab, vocabList } = useExamStore();
  const [word, setWord] = useState('');
  const [ipa, setIpa] = useState('');
  const [meaningVi, setMeaningVi] = useState('');
  const [contextSentence, setContextSentence] = useState('');
  const [status, setStatus] = useState<'unlearned' | 'learning' | 'mastered'>('learning');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (vocabModal) {
      const cleanWord = vocabModal.word.trim();
      setWord(cleanWord);
      setContextSentence(vocabModal.contextSentence || '');
      setSavedSuccess(false);

      // Check if word is already in user's vocab list
      const existing = vocabList.find(
        (v) => v.word.toLowerCase() === cleanWord.toLowerCase()
      );
      if (existing) {
        setIpa(existing.ipa || '');
        setMeaningVi(existing.meaningVi || '');
        setStatus(existing.status);
        return;
      }

      // Quick offline dictionary lookup for frequent IELTS words
      const quickDict: Record<string, { ipa: string; vi: string }> = {
        anaerobic: { ipa: '/ˌæn.eəˈrəʊ.bɪk/', vi: 'Kỵ khí, không có oxy' },
        dendrochronology: { ipa: '/ˌden.drəʊ.krəˈnɒl.ə.dʒi/', vi: 'Đo niên đại bằng vòng sinh trưởng gỗ' },
        preservation: { ipa: '/ˌprez.əˈveɪ.ʃən/', vi: 'Sự bảo tồn, giữ gìn' },
        submerged: { ipa: '/səbˈmɜːdʒd/', vi: 'Bị chìm, ngập dưới nước' },
        timber: { ipa: '/ˈtɪm.bər/', vi: 'Gỗ xây dựng, thanh gỗ đóng tàu' },
        vessel: { ipa: '/ˈves.əl/', vi: 'Thuyền, tàu thủy lớn' },
        sediment: { ipa: '/ˈsed.ɪ.mənt/', vi: 'Trầm tích, lớp bùn đáy' },
        distractor: { ipa: '/dɪˈstræk.tər/', vi: 'Phương án gây nhiễu, bẫy' },
        overthinking: { ipa: '/ˌəʊ.vəˈθɪŋ.kɪŋ/', vi: 'Suy nghĩ quá mức, tự suy diễn' },
        paraphrase: { ipa: '/ˈpær.ə.freɪz/', vi: 'Diễn giải lại bằng từ đồng nghĩa' },
      };

      const lower = cleanWord.toLowerCase();
      if (quickDict[lower]) {
        setIpa(quickDict[lower].ipa);
        setMeaningVi(quickDict[lower].vi);
        return;
      }

      // Fetch definition from public dictionary API
      setLoading(true);
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lower)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data[0]) {
            const firstEntry = data[0];
            const foundIpa = firstEntry.phonetic || firstEntry.phonetics?.find((p: { text?: string }) => p.text)?.text || '';
            const definition = firstEntry.meanings?.[0]?.definitions?.[0]?.definition || '';
            setIpa(foundIpa);
            setMeaningVi((prev) => prev || definition);
          }
        })
        .catch(() => {
          // ignore network failure
        })
        .finally(() => setLoading(false));
    }
  }, [vocabModal, vocabList]);

  if (!vocabModal) return null;

  const handleSpeak = () => {
    if ('speechSynthesis' in window && word) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSave = () => {
    if (!word.trim()) return;
    addVocab({
      word: word.trim(),
      ipa: ipa.trim(),
      meaningVi: meaningVi.trim() || 'Từ vựng quan trọng trong bài đọc/nghe',
      contextSentence: contextSentence.trim(),
      status,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setVocabModal(null);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-orange-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-bold text-base">YouPass Sổ Từ Vựng (Vocab Book)</h3>
          </div>
          <button
            onClick={() => setVocabModal(null)}
            className="p-1 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Word & IPA with pronunciation audio */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Từ vựng / Cụm từ:
              </label>
              <button
                type="button"
                onClick={handleSpeak}
                className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe phát âm</span>
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="flex-1 px-3 py-2 text-base font-bold rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-hidden"
              />
              <input
                type="text"
                value={ipa}
                onChange={(e) => setIpa(e.target.value)}
                placeholder="/Phát âm IPA/"
                className="w-36 px-2.5 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
              />
            </div>
          </div>

          {/* Meaning / Translation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Nghĩa tiếng Việt & Ghi nhớ:
              </label>
              {loading && (
                <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin" /> Đang tra từ...
                </span>
              )}
            </div>
            <textarea
              rows={2}
              value={meaningVi}
              onChange={(e) => setMeaningVi(e.target.value)}
              placeholder="Nhập nghĩa tiếng Việt hoặc giải thích bối cảnh..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-hidden"
            />
          </div>

          {/* Context Sentence */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Câu ví dụ trong đề bài:
            </label>
            <input
              type="text"
              value={contextSentence}
              onChange={(e) => setContextSentence(e.target.value)}
              placeholder="Ngữ cảnh trong bài thi..."
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 focus:ring-2 focus:ring-orange-500 outline-hidden"
            />
          </div>

          {/* 3 Status Tiers (YouPass Vocab Status) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              Trạng thái thuộc từ:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('unlearned')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition flex flex-col items-center gap-0.5 ${
                  status === 'unlearned'
                    ? 'bg-rose-50 border-rose-400 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-2 ring-rose-400/30'
                    : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                <span>🔴 Chưa thuộc</span>
                <span className="text-[10px] font-normal opacity-80">Cần học lại</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('learning')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition flex flex-col items-center gap-0.5 ${
                  status === 'learning'
                    ? 'bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-2 ring-amber-400/30'
                    : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                <span>🟡 Nhớ sơ</span>
                <span className="text-[10px] font-normal opacity-80">Ôn tập thêm</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('mastered')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition flex flex-col items-center gap-0.5 ${
                  status === 'mastered'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-400/30'
                    : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                <span>🟢 Đã thuộc</span>
                <span className="text-[10px] font-normal opacity-80">Nắm vững</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 dark:bg-zinc-800/60 border-t border-slate-200 dark:border-zinc-800">
          <span className="text-xs text-slate-500">
            {savedSuccess ? '✅ Đã lưu vào sổ từ!' : 'Đồng bộ tự động vào kho flashcard'}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setVocabModal(null)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg text-white transition shadow-sm ${
                savedSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã lưu!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Lưu vào Sổ Từ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
