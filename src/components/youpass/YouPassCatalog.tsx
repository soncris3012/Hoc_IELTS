'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Headphones,
  Layers,
  Mic,
  Monitor,
  PenTool,
  Play,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import {
  YouPassMockTestDetail,
  YouPassMockTestGroup,
  YouPassMockTestItem,
  YouPassQuizListItem,
  YouPassSkill,
  YouPassSpeakingTopic,
} from '@/types/youpass';
import {
  getYouPassAssetUrl,
  LISTENING_QUESTION_TYPES,
  LISTENING_SECTIONS,
  READING_PASSAGES,
  READING_QUESTION_TYPES,
  SPEAKING_BOOK_TYPES,
  WRITING_TASK1_TYPES,
  WRITING_TASK2_TYPES,
  WRITING_TASKS,
  WRITING_TOPICS,
  YOUPASS_BOOK_TYPES,
} from '@/lib/youpassHelpers';

interface YouPassCatalogProps {
  activeSkill: YouPassSkill;
  onChangeSkill: (skill: YouPassSkill) => void;
  completedQuizIds: Set<number>;
  onLaunchQuiz: (quizId: number, mode?: 'normal' | 'dictation') => void;
  onLaunchSpeakingTopic: (topic: YouPassSpeakingTopic, part: '1' | '2' | '3') => void;
  onTotalsLoaded?: (totals: Partial<Record<YouPassSkill, number>>) => void;
}

export const YouPassCatalog: React.FC<YouPassCatalogProps> = ({
  activeSkill,
  onChangeSkill,
  completedQuizIds,
  onLaunchQuiz,
  onLaunchSpeakingTopic,
  onTotalsLoaded,
}) => {
  // Mode & Filters
  const [practiceMode, setPracticeMode] = useState<'single' | 'full' | 'dictation'>('single');
  const [partFilter, setPartFilter] = useState<string>('null'); // passage/section/writing_task/speaking_part
  const [qTypeFilter, setQTypeFilter] = useState<string>('null');
  const [bookTypeFilter, setBookTypeFilter] = useState<string>('null');
  const [topicFilter, setTopicFilter] = useState<string>('null');

  // Interface chooser modal state (YouPass.vn "Chọn giao diện làm bài")
  const [interfaceModalQuizId, setInterfaceModalQuizId] = useState<number | null>(null);
  const [selectedInterface, setSelectedInterface] = useState<'practice' | 'exam'>('practice');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unfinished' | 'finished'>('all');
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // Loaded Data States
  const [items, setItems] = useState<YouPassQuizListItem[]>([]);
  const [mockGroups, setMockGroups] = useState<YouPassMockTestGroup[]>([]);
  const [speakingTopics, setSpeakingTopics] = useState<YouPassSpeakingTopic[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mock Test Detail Modal State (Full Test vs Single Part chooser)
  const [selectedMockItem, setSelectedMockItem] = useState<YouPassMockTestItem | null>(null);
  const [mockDetail, setMockDetail] = useState<YouPassMockTestDetail | null>(null);
  const [isLoadingMockDetail, setIsLoadingMockDetail] = useState<boolean>(false);

  // Track exact totals across skills
  const [skillTotals, setSkillTotals] = useState({
    reading: 533,
    listening: 707,
    writing: 901,
    speaking: 399,
  });

  // Load totals once from tags endpoint
  useEffect(() => {
    fetch('/api/youpass?action=tags')
      .then((r) => r.json())
      .then((json) => {
        if (json?.totals) {
          const next = {
            reading: json.totals.reading || 533,
            listening: json.totals.listening || 707,
            writing: json.totals.writingAll || 901,
            speaking:
              (json.totals.speakingPart1 || 139) +
              (json.totals.speakingPart2 || 12) +
              (json.totals.speakingPart3 || 248),
          };
          setSkillTotals(next);
          onTotalsLoaded?.(next);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search query
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset filters when changing main skill
  useEffect(() => {
    setPracticeMode('single');
    setPartFilter(activeSkill === 'speaking' ? '1' : 'null');
    setQTypeFilter('null');
    setBookTypeFilter('null');
    setTopicFilter('null');
    setSearchInput('');
    setDebouncedSearch('');
    setPage(1);
  }, [activeSkill]);

  // Fetch data whenever query dependencies change
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setErrorMsg(null);

    let url = '';
    if (activeSkill === 'speaking') {
      const spPart = ['1', '2', '3'].includes(partFilter) ? partFilter : '1';
      const qs = new URLSearchParams({
        action: 'speaking',
        part: spPart,
        bookType: bookTypeFilter,
        page: String(page),
      });
      if (debouncedSearch) qs.set('search', debouncedSearch);
      url = `/api/youpass?${qs.toString()}`;
    } else if (practiceMode === 'full' && (activeSkill === 'reading' || activeSkill === 'listening')) {
      url = `/api/youpass?action=mock-list&skill=${
        activeSkill === 'reading' ? '1' : '2'
      }&page=${page}`;
    } else {
      const qs = new URLSearchParams({
        action: 'list',
        skill: activeSkill,
        page: String(page),
        part: partFilter,
        qType: qTypeFilter,
        bookType: bookTypeFilter,
        topic: topicFilter,
      });
      if (debouncedSearch) qs.set('search', debouncedSearch);
      url = `/api/youpass?${qs.toString()}`;
    }

    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (!json?.success || !json.data) {
          throw new Error(json?.error || 'Không thể tải danh sách đề thi');
        }
        const d = json.data;
        if (activeSkill === 'speaking') {
          setSpeakingTopics(d.topics || []);
          setTotalCount(d.total || (d.topics || []).length);
        } else if (practiceMode === 'full') {
          setMockGroups(d.items || []);
          setTotalCount(d.total || (d.items || []).length);
        } else {
          setItems(d.items || []);
          setTotalCount(d.total || (d.items || []).length);
        }
      })
      .catch((err) => {
        if (!cancelled) setErrorMsg(err instanceof Error ? err.message : 'Lỗi kết nối API');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeSkill, practiceMode, partFilter, qTypeFilter, bookTypeFilter, topicFilter, debouncedSearch, page]);

  // Apply client-side status filter ('unfinished' vs 'finished') over current page items
  const displayedItems = useMemo(() => {
    if (statusFilter === 'all') return items;
    if (statusFilter === 'finished') return items.filter((it) => completedQuizIds.has(it.id));
    return items.filter((it) => !completedQuizIds.has(it.id));
  }, [items, statusFilter, completedQuizIds]);

  const pageSize = practiceMode === 'full' ? 4 : 20;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const openMockTestChooser = (mockItem: YouPassMockTestItem) => {
    setSelectedMockItem(mockItem);
    setMockDetail(null);
    setIsLoadingMockDetail(true);
    fetch(`/api/youpass?action=mock-detail&id=${mockItem.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && json.data) {
          setMockDetail(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingMockDetail(false));
  };

  // Pick sidebar filter definitions for the active skill
  const questionTypeOptions = useMemo(() => {
    if (activeSkill === 'reading') return READING_QUESTION_TYPES;
    if (activeSkill === 'listening') return LISTENING_QUESTION_TYPES;
    if (activeSkill === 'writing') {
      return partFilter === '1'
        ? WRITING_TASK1_TYPES
        : partFilter === '2'
        ? WRITING_TASK2_TYPES
        : [...WRITING_TASK1_TYPES, ...WRITING_TASK2_TYPES.slice(1)];
    }
    return [];
  }, [activeSkill, partFilter]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Sub-bar Skill Tabs & Mode Selector — YouPass.vn style: white bg, text tabs with underline */}
      <div className="bg-white border-t border-b border-[#ECECEC] px-4">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between">
          {/* 4 Skills Selector — simple tab with orange underline */}
          <div className="flex items-center overflow-x-auto">
            {(
              [
                {
                  key: 'reading',
                  label: 'Reading',
                  count: skillTotals.reading,
                  icon: <BookOpen className="w-3.5 h-3.5" />,
                },
                {
                  key: 'listening',
                  label: 'Listening',
                  count: skillTotals.listening,
                  icon: <Headphones className="w-3.5 h-3.5" />,
                },
                {
                  key: 'writing',
                  label: 'Writing',
                  count: skillTotals.writing,
                  icon: <PenTool className="w-3.5 h-3.5" />,
                },
                {
                  key: 'speaking',
                  label: 'Speaking',
                  count: skillTotals.speaking,
                  icon: <Mic className="w-3.5 h-3.5" />,
                },
              ] as const
            ).map((sk) => (
              <button
                key={sk.key}
                type="button"
                onClick={() => onChangeSkill(sk.key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold transition-all shrink-0 border-b-2 ${
                  activeSkill === sk.key
                    ? 'border-[#FF6D3A] text-[#FF6D3A]'
                    : 'border-transparent text-[#6B7280] hover:text-[#1D1D1F] hover:border-[#D1D5DB]'
                }`}
              >
                {sk.icon}
                <span>{sk.label}</span>
                <span className={`text-[11px] font-normal ${activeSkill === sk.key ? 'text-[#FF6D3A]' : 'text-[#9CA3AF]'}`}>
                  ({sk.count})
                </span>
              </button>
            ))}
          </div>

          {/* Sub-mode pills (Bài lẻ / Full đề / Dictation) */}
          <div className="flex items-center gap-1.5 py-2">
            {(activeSkill === 'reading' || activeSkill === 'listening') && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setPracticeMode('single');
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-full font-bold transition ${
                    practiceMode === 'single'
                      ? 'bg-[#4D2600] text-white'
                      : 'bg-white text-[#4D2600] border border-[#FFEDD1]'
                  }`}
                >
                  Bài lẻ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPracticeMode('full');
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1 ${
                    practiceMode === 'full'
                      ? 'bg-[#4D2600] text-white'
                      : 'bg-white text-[#4D2600] border border-[#FFEDD1]'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Full đề Mock Test</span>
                </button>
                {activeSkill === 'listening' && (
                  <button
                    type="button"
                    onClick={() => {
                      setPracticeMode('dictation');
                      setPage(1);
                    }}
                    className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1 ${
                      practiceMode === 'dictation'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>Dictation</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Catalog Body */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        {/* LEFT SIDEBAR FILTERS */}
        <aside className="w-full md:w-60 shrink-0 space-y-4 md:sticky md:top-[88px] md:self-start md:max-h-[calc(100vh-100px)] md:overflow-y-auto">
          {/* YouPass Collect Card */}
          <div className="p-3 rounded-2xl bg-white border border-[#E5E7EB] flex items-center gap-3 cursor-pointer hover:bg-[#F9FAFB] hover:border-[#FF6D3A]/40 transition">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6D3A] to-[#FFA41B] flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white text-[11px] font-black">YP</span>
            </div>
            <div>
              <div className="text-xs font-black text-[#1D1D1F]">YouPass Collect</div>
              <div className="text-[11px] text-[#6B7280]">Review đề thi thật</div>
            </div>
          </div>

          {/* Promo Practice Plan */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FF6D3A] to-[#FFA41B] text-white shadow-sm space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider">
                YouPass Data Engine
              </span>
            </div>
            <h3 className="text-sm font-black leading-snug">
              Kho {skillTotals.reading + skillTotals.listening + skillTotals.writing + skillTotals.speaking}+ Đề IELTS Thực Tế
            </h3>
            <p className="text-[11px] text-orange-50 leading-relaxed">
              Đồng bộ trực tiếp với YouPass API: đầy đủ bài đọc, audio MP3/M4A, transcript & giải thích 4 bước.
            </p>
          </div>

          {/* Part / Passage / Section / Writing Task / Speaking Part Selector */}
          {practiceMode !== 'full' && (
            <div className="p-4 rounded-2xl bg-white border border-[#FFEDD1] shadow-2xs space-y-2.5">
              <div className="text-xs font-bold text-[#4D2600] uppercase tracking-wider">
                {activeSkill === 'reading'
                  ? 'Chọn Passage'
                  : activeSkill === 'listening'
                  ? 'Chọn Section'
                  : activeSkill === 'writing'
                  ? 'Chọn Task'
                  : 'Chọn Speaking Part'}
              </div>
              <div className="space-y-1 text-xs">
                {(activeSkill === 'reading'
                  ? READING_PASSAGES
                  : activeSkill === 'listening'
                  ? LISTENING_SECTIONS
                  : activeSkill === 'writing'
                  ? WRITING_TASKS
                  : [
                      { id: '1', label: 'Speaking Part 1' },
                      { id: '2', label: 'Speaking Part 2 (Cue Card)' },
                      { id: '3', label: 'Speaking Part 3' },
                    ]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setPartFilter(opt.id);
                      if (activeSkill === 'writing') setQTypeFilter('null');
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl font-semibold transition flex items-center justify-between ${
                      partFilter === opt.id
                        ? 'bg-[#FFF1E5] text-[#FF6D3A] font-bold'
                        : 'text-[#333333] hover:bg-[#FFF8F2]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {partFilter === opt.id && <Check className="w-3.5 h-3.5 text-[#FF6D3A]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Source Book Type Filter */}
          {practiceMode !== 'full' && (
            <div className="p-4 rounded-2xl bg-white border border-[#FFEDD1] shadow-2xs space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4D2600] uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-[#FF6D3A]" />
                <span>Nguồn tài liệu</span>
              </div>
              <div className="space-y-1 text-xs">
                {(activeSkill === 'speaking' ? SPEAKING_BOOK_TYPES : YOUPASS_BOOK_TYPES).map(
                  (s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setBookTypeFilter(s.id);
                        setPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl font-semibold transition flex items-center justify-between ${
                        bookTypeFilter === s.id
                          ? 'bg-[#FFF1E5] text-[#FF6D3A] font-bold'
                          : 'text-[#333333] hover:bg-[#FFF8F2]'
                      }`}
                    >
                      <span>{s.label}</span>
                      {bookTypeFilter === s.id && <Check className="w-3.5 h-3.5 text-[#FF6D3A]" />}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Question Type Filter */}
          {practiceMode !== 'full' && questionTypeOptions.length > 0 && (
            <div className="p-4 rounded-2xl bg-white border border-[#FFEDD1] shadow-2xs space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4D2600] uppercase tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6D3A]" />
                <span>{activeSkill === 'writing' ? 'Dạng đề Writing' : 'Loại câu hỏi'}</span>
              </div>
              <div className="space-y-1 text-xs max-h-64 overflow-y-auto pr-1">
                {questionTypeOptions.map((t) => (
                  <button
                    key={`${t.id}-${t.label}`}
                    type="button"
                    onClick={() => {
                      setQTypeFilter(t.id);
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl font-semibold transition flex items-center justify-between ${
                      qTypeFilter === t.id
                        ? 'bg-[#FFF1E5] text-[#FF6D3A] font-bold'
                        : 'text-[#333333] hover:bg-[#FFF8F2]'
                    }`}
                  >
                    <span className="truncate">{t.label}</span>
                    {qTypeFilter === t.id && <Check className="w-3.5 h-3.5 text-[#FF6D3A]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Writing Topic Filter */}
          {activeSkill === 'writing' && (
            <div className="p-4 rounded-2xl bg-white border border-[#FFEDD1] shadow-2xs space-y-2.5">
              <div className="text-xs font-bold text-[#4D2600] uppercase tracking-wider">
                Chủ đề (Topics)
              </div>
              <div className="space-y-1 text-xs max-h-56 overflow-y-auto pr-1">
                {WRITING_TOPICS.map((tp) => (
                  <button
                    key={tp.id}
                    type="button"
                    onClick={() => {
                      setTopicFilter(tp.id);
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl font-semibold transition flex items-center justify-between ${
                      topicFilter === tp.id
                        ? 'bg-[#FFF1E5] text-[#FF6D3A] font-bold'
                        : 'text-[#333333] hover:bg-[#FFF8F2]'
                    }`}
                  >
                    <span>{tp.label}</span>
                    {topicFilter === tp.id && <Check className="w-3.5 h-3.5 text-[#FF6D3A]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT CONTENT GRID */}
        <section className="flex-1 space-y-5">
          {/* Status Pills + Live Search Bar */}
          <div className="p-4 rounded-2xl bg-white border border-[#FFEDD1] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {(
                [
                  { id: 'all', label: `Tất cả (${totalCount})` },
                  { id: 'unfinished', label: 'Bài chưa làm' },
                  { id: 'finished', label: `Đã làm (${completedQuizIds.size})` },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
                    statusFilter === st.id
                      ? 'bg-[#FF6D3A] text-white shadow-xs'
                      : 'bg-[#FFF8F2] text-[#4D2600] hover:bg-[#FFEBE0]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {practiceMode !== 'full' && (
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#8A8A8E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tìm đề thi theo tên (VD: Lego, Popcorn, C20...)"
                  className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-[#CBD5E1] bg-[#FFF8F2] text-xs font-semibold focus:border-[#FF6D3A] focus:ring-1 focus:ring-[#FF6D3A] outline-hidden text-[#1D1D1F]"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8A8A8E] hover:text-[#1D1D1F]"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#FFEDD1] overflow-hidden animate-pulse"
                >
                  <div className="aspect-[342/195] bg-[#FFF1E5]" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-[#FFF1E5] rounded w-1/3" />
                    <div className="h-4 bg-[#FFF8F2] rounded w-5/6" />
                    <div className="h-8 bg-[#FFF1E5] rounded-full w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : errorMsg ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-[#FF3532]/30 space-y-3">
              <p className="text-sm font-bold text-[#FF3532]">{errorMsg}</p>
              <button
                type="button"
                onClick={() => setPage((p) => p)}
                className="px-4 py-1.5 rounded-full bg-[#FF6D3A] text-white text-xs font-bold"
              >
                Thử lại
              </button>
            </div>
          ) : activeSkill === 'speaking' ? (
            /* SPEAKING TOPICS GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {speakingTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="group bg-white rounded-2xl border border-[#FFEDD1] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-[342/175] relative bg-[#FFF1E5] overflow-hidden">
                    <div className="absolute left-0 bottom-0 z-10 px-3 py-1 rounded-tr-xl bg-emerald-600 text-white text-xs font-black">
                      Speaking Part {partFilter} • {topic.quizzes?.length || 0} câu
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getYouPassAssetUrl(topic.thumbnail, 500)}
                      alt={topic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex flex-wrap gap-1 mb-1">
                        {topic.tags?.map((tg) => (
                          <span
                            key={tg.id}
                            className="text-[10px] font-extrabold text-[#FF6D3A] uppercase"
                          >
                            {tg.title}
                          </span>
                        ))}
                      </div>
                      <h4 className="font-extrabold text-sm text-[#1D1D1F] line-clamp-2">
                        {topic.title}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onLaunchSpeakingTopic(
                          topic,
                          (['1', '2', '3'].includes(partFilter) ? partFilter : '1') as
                            | '1'
                            | '2'
                            | '3'
                        )
                      }
                      className="w-full py-2 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Luyện Speaking & Xem Sample</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : practiceMode === 'full' ? (
            /* FULL MOCK TEST GROUPS */
            <div className="space-y-6">
              {mockGroups.map((grp, gIdx) => (
                <div
                  key={gIdx}
                  className="bg-white rounded-2xl border border-[#FFEDD1] p-5 shadow-2xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#ECECEC] pb-2">
                    <h3 className="font-black text-base text-[#1D1D1F] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#FF6D3A]" />
                      <span>{grp.title}</span>
                    </h3>
                    <span className="text-xs font-bold text-[#8A8A8E]">
                      {grp.mock_tests?.length || 0} đề Full Test
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(grp.mock_tests || []).map((mt) => (
                      <div
                        key={mt.id}
                        className="group rounded-xl border border-[#FFEDD1] bg-[#FFF8F2]/60 hover:bg-white hover:shadow-md overflow-hidden transition flex flex-col"
                      >
                        <div className="aspect-[342/195] relative bg-[#FFF1E5] overflow-hidden">
                          <span className="absolute left-2 top-2 z-10 px-2 py-0.5 rounded-full bg-[#FF6D3A] text-white text-[10px] font-black">
                            {mt.book_code || 'FULL TEST'}
                          </span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getYouPassAssetUrl(mt.thumbnail, 400)}
                            alt={mt.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                          <h4 className="font-extrabold text-xs text-[#1D1D1F] line-clamp-2">
                            {mt.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => openMockTestChooser(mt)}
                            className="w-full py-1.5 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-extrabold text-xs transition flex items-center justify-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            <span>Chọn Làm Full Đề / Part</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#FFEDD1] space-y-3">
              <Search className="w-10 h-10 text-[#CBD5E1] mx-auto" />
              <h4 className="font-bold text-sm text-[#1D1D1F]">
                Không tìm thấy đề thi phù hợp
              </h4>
              <button
                type="button"
                onClick={() => {
                  setPartFilter('null');
                  setQTypeFilter('null');
                  setBookTypeFilter('null');
                  setTopicFilter('null');
                  setStatusFilter('all');
                  setSearchInput('');
                }}
                className="px-4 py-1.5 rounded-full bg-[#FF6D3A] text-white font-bold text-xs"
              >
                Xóa toàn bộ bộ lọc
              </button>
            </div>
          ) : (
            /* STANDARD SINGLE QUIZZES GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedItems.map((test) => {
                const isDone = completedQuizIds.has(test.id);
                const partTag = (test.tags || []).find((t) =>
                  /passage|section|task/i.test(t.code || t.title)
                );
                const sourceTag = (test.tags || []).find((t) =>
                  /simulation|collect|cambridge|actual|pro|cam/i.test(t.code || t.title)
                );
                const qTypeTags = (test.tags || []).filter(
                  (t) => t.id !== partTag?.id && t.id !== sourceTag?.id
                );

                // Color by passage/section number — matching YouPass.vn exact colors
                // P1=orange, P2=blue-indigo, P3=purple, P4=emerald (Sections: S1=emerald, S2=sky, S3=violet, S4=orange)
                const isListeningSkill = activeSkill === 'listening';
                const partBgColor = partTag?.title?.includes('1')
                  ? isListeningSkill ? 'bg-emerald-600' : 'bg-[#FF6D3A]'
                  : partTag?.title?.includes('2')
                  ? isListeningSkill ? 'bg-sky-500' : 'bg-indigo-500'
                  : partTag?.title?.includes('3')
                  ? isListeningSkill ? 'bg-violet-600' : 'bg-purple-500'
                  : partTag?.title?.includes('4')
                  ? 'bg-[#FF6D3A]'
                  : 'bg-[#4D2600]';

                return (
                  <div
                    key={test.id}
                    className="group bg-white rounded-2xl border border-[#FFEDD1] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer"
                    onClick={() => setInterfaceModalQuizId(test.id)}
                  >
                    <div className="aspect-[342/190] relative w-full overflow-hidden bg-[#FFF1E5]">
                      {/* Views badge */}
                      <div className="absolute left-2 top-2 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                        <Eye className="w-3 h-3 text-amber-300" />
                        <span>{(test.total_submitted || 0).toLocaleString('vi-VN')} lượt làm bài</span>
                      </div>

                      {isDone && (
                        <div className="absolute right-2 top-2 z-10 px-2 py-0.5 rounded-full bg-[#13A62E] text-white text-[10px] font-extrabold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Đã làm</span>
                        </div>
                      )}

                      {partTag && (
                        <div className={`absolute left-0 bottom-0 z-10 px-3 py-1 rounded-tr-xl ${partBgColor} text-white text-[11px] font-black`}>
                          {partTag.title}
                        </div>
                      )}

                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getYouPassAssetUrl(test.thumbnail, 500)}
                        alt={test.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                      <div>
                        <h4 className="font-extrabold text-[13px] text-[#1D1D1F] line-clamp-2 leading-snug group-hover:text-[#FF6D3A] transition mb-2">
                          {test.title}
                        </h4>
                        {/* Question type bullet list — YouPass.vn style */}
                        <div className="space-y-0.5">
                          {sourceTag && (
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6D3A] inline-block shrink-0" />
                              <span className="font-semibold text-[#FF6D3A]">{sourceTag.title}</span>
                            </div>
                          )}
                          {qTypeTags.slice(0, 3).map((tg) => (
                            <div key={tg.id} className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] inline-block shrink-0" />
                              <span>{tg.title}</span>
                            </div>
                          ))}
                          {test.time && (
                            <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] inline-block shrink-0" />
                              <span>⏱ {test.time} phút</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setInterfaceModalQuizId(test.id)}
                        className="w-full py-2.5 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-extrabold text-xs transition shadow-sm flex items-center justify-center gap-1.5 mt-2 border-t border-[#F3F4F6] pt-3"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{practiceMode === 'dictation' ? 'Luyện Dictation' : 'Chọn giao diện'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#FFEDD1] text-xs">
              <span className="text-[#8A8A8E] font-semibold">
                Trang <strong className="text-[#1D1D1F]">{page}</strong> / {totalPages} • Tổng{' '}
                <strong className="text-[#FF6D3A]">{totalCount}</strong> mục
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-full bg-white border border-[#CBD5E1] disabled:opacity-40 font-bold flex items-center gap-1 hover:bg-[#FFF8F2]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Trước</span>
                </button>

                {[page - 1, page, page + 1]
                  .filter((p) => p >= 1 && p <= totalPages)
                  .map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPage(p);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-8 h-8 rounded-full font-extrabold transition ${
                        p === page
                          ? 'bg-[#FF6D3A] text-white shadow-xs'
                          : 'bg-white border border-[#ECECEC] text-[#4D2600] hover:bg-[#FFF1E5]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-full bg-white border border-[#CBD5E1] disabled:opacity-40 font-bold flex items-center gap-1 hover:bg-[#FFF8F2]"
                >
                  <span>Sau</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Interface Chooser Modal — YouPass.vn "Chọn giao diện làm bài" */}
      {interfaceModalQuizId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setInterfaceModalQuizId(null)}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-[#1D1D1F]">Chọn giao diện làm bài</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Chọn giao diện phù hợp với mục tiêu luyện tập của bạn</p>
              </div>
              <button onClick={() => setInterfaceModalQuizId(null)} className="p-1 text-[#8A8A8E] hover:text-[#1D1D1F] transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedInterface('practice')}
                className={`p-4 rounded-2xl border-2 text-left transition space-y-2 ${selectedInterface === 'practice' ? 'border-[#13A62E] bg-[#F0FDF4]' : 'border-[#E5E7EB] hover:border-[#13A62E]/40'}`}
              >
                <div className="aspect-video rounded-xl bg-[#F0FDF4] border-2 border-[#13A62E]/30 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-[#13A62E]" />
                </div>
                <div className="font-extrabold text-sm text-[#1D1D1F]">Giao diện Luyện tập</div>
                <p className="text-[11px] text-[#6B7280] leading-relaxed">Hỗ trợ tra từ vựng, gợi ý, giải thích chi tiết. Phù hợp để luyện tập hàng ngày.</p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedInterface('exam')}
                className={`p-4 rounded-2xl border-2 text-left transition space-y-2 ${selectedInterface === 'exam' ? 'border-[#4B63E6] bg-[#EEF2FF]' : 'border-[#E5E7EB] hover:border-[#4B63E6]/40'}`}
              >
                <div className="aspect-video rounded-xl bg-[#F5F5F5] border border-[#D1D5DB] flex items-center justify-center">
                  <Monitor className="w-8 h-8 text-[#6B7280]" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm text-[#1D1D1F]">Giao diện Thi thật</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#FF6D3A] text-white text-[10px] font-bold leading-none">Giống 100%</span>
                </div>
                <p className="text-[11px] text-[#6B7280] leading-relaxed">Mô phỏng 100% giao diện thi máy CDT, giúp làm quen môi trường thi thật.</p>
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                onLaunchQuiz(interfaceModalQuizId, practiceMode === 'dictation' ? 'dictation' : 'normal');
                setInterfaceModalQuizId(null);
              }}
              className="w-full py-3 rounded-full bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-extrabold text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Bắt đầu làm bài</span>
            </button>
          </div>
        </div>
      )}

      {/* Mock Test Part Selector Modal */}
      {selectedMockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#FFEDD1] p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-extrabold uppercase text-[#FF6D3A]">
                  {selectedMockItem.book_code || 'Mock Test'}
                </span>
                <h3 className="text-lg font-black text-[#1D1D1F] mt-0.5">
                  {selectedMockItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMockItem(null)}
                className="p-1 text-[#8A8A8E] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingMockDetail ? (
              <div className="py-6 text-center text-xs text-[#8A8A8E] animate-pulse">
                Đang tải cấu trúc Full Test & các Part lẻ...
              </div>
            ) : mockDetail?.quizzes ? (
              <div className="space-y-2.5">
                {mockDetail.quizzes.full && (
                  <button
                    type="button"
                    onClick={() => {
                      const qid = mockDetail.quizzes.full!.id;
                      setSelectedMockItem(null);
                      onLaunchQuiz(qid);
                    }}
                    className="w-full p-3.5 rounded-2xl bg-[#FF6D3A] hover:bg-[#ff581d] text-white font-black text-xs flex items-center justify-between shadow-sm transition"
                  >
                    <span>Làm Full Đề ({mockDetail.quizzes.full.question_count} câu)</span>
                    <span>{mockDetail.quizzes.full.time} phút →</span>
                  </button>
                )}

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {(['part_1', 'part_2', 'part_3', 'part_4'] as const).map((pk, idx) => {
                    const partObj = mockDetail.quizzes[pk];
                    if (!partObj) return null;
                    return (
                      <button
                        key={pk}
                        type="button"
                        onClick={() => {
                          setSelectedMockItem(null);
                          onLaunchQuiz(partObj.id);
                        }}
                        className="p-3 rounded-xl bg-[#FFF8F2] hover:bg-[#FFEBE0] border border-[#FFEDD1] text-left flex items-center justify-between text-xs font-bold text-[#4D2600] transition"
                      >
                        <span>
                          {activeSkill === 'reading' ? `Passage ${idx + 1}` : `Section ${idx + 1}`}{' '}
                          ({partObj.question_count} câu)
                        </span>
                        <span className="text-[#FF6D3A]">{partObj.time} phút →</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#8A8A8E]">Không tải được chi tiết Mock Test.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
