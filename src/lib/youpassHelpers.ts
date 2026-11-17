import {
  YouPassAttemptRecord,
  YouPassGoal,
  YouPassQuestion,
  YouPassQuestionSet,
  YouPassSkill,
} from '@/types/youpass';

export const YOUPASS_ASSET_BASE = 'https://cms.youpass.vn/assets/';

export function getYouPassAssetUrl(assetId?: string | null, width?: number): string {
  if (!assetId) {
    return 'https://cms.youpass.vn/assets/2c208bb0-2194-4afa-af20-72943a79f53d?width=500&fit=cover';
  }
  if (assetId.startsWith('http://') || assetId.startsWith('https://')) {
    return assetId;
  }
  return width
    ? `${YOUPASS_ASSET_BASE}${assetId}?width=${width}&fit=cover`
    : `${YOUPASS_ASSET_BASE}${assetId}`;
}

export const YOUPASS_BOOK_TYPES = [
  { id: 'null', label: 'Tất cả nguồn' },
  { id: '180', label: 'YouPass Simulation' },
  { id: '145', label: 'YouPass Collect đề thi' },
  { id: '14', label: 'Cambridge C10 - C20' },
  { id: '15', label: 'Actual Tests' },
  { id: '153', label: 'Gói Luyện đề PRO' },
  { id: '143', label: 'Các nguồn khác' },
];

export const READING_PASSAGES = [
  { id: 'null', label: 'Tất cả Passages' },
  { id: '32', label: 'Passage 1' },
  { id: '33', label: 'Passage 2' },
  { id: '34', label: 'Passage 3' },
];

export const LISTENING_SECTIONS = [
  { id: 'null', label: 'Tất cả Sections' },
  { id: '35', label: 'Section 1' },
  { id: '36', label: 'Section 2' },
  { id: '37', label: 'Section 3' },
  { id: '38', label: 'Section 4' },
];

export const READING_QUESTION_TYPES = [
  { id: 'null', label: 'Tất cả dạng bài' },
  { id: '1', label: 'Matching Headings' },
  { id: '7', label: 'True - False - Not Given' },
  { id: '8', label: 'Yes - No - Not Given' },
  { id: '9', label: 'Multiple Choice (One Answer)' },
  { id: '3', label: 'Multiple Choice (Many Answers)' },
  { id: '2', label: 'Matching Information' },
  { id: '42', label: 'Matching Features' },
  { id: '6', label: 'Gap Filling' },
  { id: '4', label: 'Map, Diagram Label' },
  { id: '5', label: 'Other Types' },
];

export const LISTENING_QUESTION_TYPES = [
  { id: 'null', label: 'Tất cả dạng bài' },
  { id: '6', label: 'Gap Filling' },
  { id: '9', label: 'Multiple Choice (One Answer)' },
  { id: '3', label: 'Multiple Choice (Many Answers)' },
  { id: '4', label: 'Map, Diagram Label' },
  { id: '2', label: 'Matching Information' },
  { id: '148', label: 'Matching' },
  { id: '5', label: 'Other Types' },
];

export const WRITING_TASKS = [
  { id: 'null', label: 'Tất cả Writing' },
  { id: '1', label: 'Task 1 (Biểu đồ / Bản đồ / Quy trình)' },
  { id: '2', label: 'Task 2 (Essay Nghị luận)' },
];

export const WRITING_TASK1_TYPES = [
  { id: 'null', label: 'Tất cả dạng Task 1' },
  { id: '84', label: 'Line Graph' },
  { id: '85', label: 'Bar Chart' },
  { id: '86', label: 'Pie Chart' },
  { id: '89', label: 'Table' },
  { id: '90', label: 'Mixed Graph' },
  { id: '87', label: 'Map' },
  { id: '88', label: 'Process' },
];

export const WRITING_TASK2_TYPES = [
  { id: 'null', label: 'Tất cả dạng Task 2' },
  { id: '60', label: 'Agree or Disagree' },
  { id: '61', label: 'Discussion' },
  { id: '62', label: 'Advantages & Disadvantages' },
  { id: '63', label: 'Causes, Problems & Solutions' },
  { id: '64', label: 'Two-Part Question' },
  { id: '104', label: 'Positive or Negative Development' },
];

export const WRITING_TOPICS = [
  { id: 'null', label: 'Tất cả chủ đề' },
  { id: '65', label: 'Education' },
  { id: '66', label: 'Environment' },
  { id: '67', label: 'Work and Careers' },
  { id: '70', label: 'Science & Technology' },
  { id: '72', label: 'Health' },
  { id: '76', label: 'Society & Culture' },
  { id: '68', label: 'Government & Law' },
  { id: '74', label: 'Economics' },
  { id: '75', label: 'Entertainment' },
  { id: '71', label: 'Travel & Transport' },
  { id: '82', label: 'Other Topics' },
];

export const SPEAKING_BOOK_TYPES = [
  { id: 'null', label: 'Tất cả nguồn' },
  { id: '130', label: 'Đề thường gặp' },
  { id: '109', label: 'Đề mới quý này' },
  { id: '129', label: 'Đề giữ từ quý trước' },
];

export function formatSecondsHMS(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
    .toString()
    .padStart(2, '0')}`;
}

export function sanitizeYouPassHtml(html?: string | null): string {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '');
}

function normalizeAns(val: string): string {
  return val
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"()]/g, '')
    .replace(/\s+/g, ' ');
}

export interface QuestionEvalResult {
  questionOrder: number;
  isCorrect: boolean;
  userAnswerText: string;
  correctAnswerText: string;
}

/**
 * Computes normalized question slots across a question_set.
 * Note: For MULTIPLE_CHOICE_MANY, a single YouPassQuestion with max_selections > 1 (e.g. order 23, correct_answers ['B', 'E'])
 * represents N question numbers: order, order+1, ..., order+N-1.
 */
export function expandQuestionSetSlots(qs: YouPassQuestionSet): Array<{
  order: number;
  question: YouPassQuestion;
  multiGroupOrders?: number[];
}> {
  const slots: Array<{
    order: number;
    question: YouPassQuestion;
    multiGroupOrders?: number[];
  }> = [];

  for (const q of qs.questions || []) {
    if (qs.question_type === 'MULTIPLE_CHOICE_MANY') {
      const count = Math.max(
        1,
        qs.max_selections || (q.correct_answers ? q.correct_answers.length : 1) || qs.question_count || 1
      );
      const groupOrders = Array.from({ length: count }, (_, idx) => q.order + idx);
      for (const ord of groupOrders) {
        slots.push({ order: ord, question: q, multiGroupOrders: groupOrders });
      }
    } else {
      slots.push({ order: q.order, question: q });
    }
  }
  return slots;
}

export function getAcceptedAnswersForQuestion(q: YouPassQuestion): string[] {
  const candidates: string[] = [];
  if (q.correct_answers && q.correct_answers.length > 0) {
    q.correct_answers.forEach((a) => {
      if (a && a.trim()) candidates.push(a.trim());
    });
  }
  if (q.correct_answer && q.correct_answer.trim()) {
    q.correct_answer.split('/').forEach((seg) => {
      if (seg.trim()) candidates.push(seg.trim());
    });
  }
  return Array.from(new Set(candidates));
}

export function evaluateQuestionSlot(
  q: YouPassQuestion,
  userRaw: string | string[] | undefined,
  qsType?: string,
  slotOrder?: number,
  allAnswers?: Record<number, string | string[]>
): { isCorrect: boolean; userText: string; correctText: string } {
  const accepted = getAcceptedAnswersForQuestion(q);

  if (qsType === 'MULTIPLE_CHOICE_MANY' || q.question_type === 'MULTIPLE_CHOICE_MANY') {
    const slotIdx = slotOrder !== undefined ? Math.max(0, slotOrder - q.order) : 0;
    const expectedArr = accepted.map((x) => normalizeAns(x));

    // Support both per-slot string storage (answers[23]='B', answers[24]='E') and array on q.order
    let slotVal = '';
    if (typeof userRaw === 'string' && userRaw.trim()) {
      slotVal = normalizeAns(userRaw);
    } else if (allAnswers && Array.isArray(allAnswers[q.order])) {
      slotVal = normalizeAns((allAnswers[q.order] as string[])[slotIdx] || '');
    }

    const isCorrect = Boolean(slotVal) && expectedArr.includes(slotVal);
    return {
      isCorrect,
      userText: slotVal ? slotVal.toUpperCase() : 'Chưa làm',
      correctText: accepted.join(', '),
    };
  }

  const userStr = Array.isArray(userRaw) ? userRaw.join(', ') : userRaw || '';
  const normUser = normalizeAns(userStr);
  const isCorrect =
    Boolean(normUser) &&
    accepted.some((ans) => {
      const normAns = normalizeAns(ans);
      return normAns === normUser;
    });

  return {
    isCorrect,
    userText: userStr.trim() || 'Chưa làm',
    correctText: accepted.join(' / '),
  };
}

export function inferSkillFromQuizType(type: number): YouPassSkill {
  if (type === 2 || type === 10) return 'listening';
  if (type === 7) return 'writing';
  if (type === 8) return 'speaking';
  return 'reading';
}

const HISTORY_STORAGE_KEY = 'hoc_ielts_youpass_history_v1';
const GOAL_STORAGE_KEY = 'hoc_ielts_youpass_goal_v1';

export const DEFAULT_YOUPASS_GOAL: YouPassGoal = {
  overall: 7.5,
  reading: 8.0,
  listening: 8.0,
  writing: 7.0,
  speaking: 7.0,
  examDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
};

export function loadYouPassHistory(): YouPassAttemptRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveYouPassAttempt(record: YouPassAttemptRecord): YouPassAttemptRecord[] {
  const existing = loadYouPassHistory();
  const next = [record, ...existing].slice(0, 100);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota errors
    }
  }
  return next;
}

export function loadYouPassGoal(): YouPassGoal {
  if (typeof window === 'undefined') return DEFAULT_YOUPASS_GOAL;
  try {
    const raw = window.localStorage.getItem(GOAL_STORAGE_KEY);
    if (!raw) return DEFAULT_YOUPASS_GOAL;
    return { ...DEFAULT_YOUPASS_GOAL, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_YOUPASS_GOAL;
  }
}

export function saveYouPassGoal(goal: YouPassGoal): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(goal));
  } catch {
    // Ignore quota errors
  }
}
