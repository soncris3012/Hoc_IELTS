import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  IELTSExam,
  ExamTheme,
  FontSize,
  TextHighlight,
  ExamScoreSummary,
  VocabItem,
  UserGoal,
} from '@/types/ielts';
import { mockReadingExam } from '@/data/mockReadingTest';
import { gradeExam } from '@/lib/bandCalculator';
import { saveTestAttempt } from '@/lib/supabase';

const initialVocabList: VocabItem[] = [
  {
    id: 'voc_1',
    word: 'anaerobic',
    ipa: '/ˌæn.eəˈrəʊ.bɪk/',
    meaningVi: 'Hiếu khí / kỵ khí (môi trường không có khí oxy)',
    contextSentence: 'Submerged timber survived due to anaerobic sediment preventing bacterial decay.',
    status: 'learning',
    addedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'voc_2',
    word: 'dendrochronology',
    ipa: '/ˌden.drəʊ.krəˈnɒl.ə.dʒi/',
    meaningVi: 'Phương pháp định tuổi cây qua vòng sinh trưởng (niên luân học)',
    contextSentence: 'Dendrochronology enabled archaeologists to date ship timbers with seasonal precision.',
    status: 'unlearned',
    addedAt: Date.now() - 86400000,
  },
  {
    id: 'voc_3',
    word: 'preservation',
    ipa: '/ˌprez.əˈveɪ.ʃən/',
    meaningVi: 'Sự bảo tồn, giữ gìn nguyên trạng',
    contextSentence: 'The exceptional preservation of Roman hull planks baffled maritime experts.',
    status: 'mastered',
    addedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'voc_4',
    word: 'distractor',
    ipa: '/dɪˈstræk.tər/',
    meaningVi: 'Phương án gây nhiễu, bẫy trắc nghiệm trong bài thi',
    contextSentence: 'Recognizing distractor options is critical to securing Band 8.0+ in IELTS Reading.',
    status: 'mastered',
    addedAt: Date.now() - 86400000 * 5,
  },
];

interface ExamState {
  candidateName: string;
  candidateNumber: string;
  exam: IELTSExam;
  answers: Record<number, string | string[]>;
  reviewed: Record<number, boolean>;
  highlights: TextHighlight[];
  currentQuestionNumber: number;
  currentPartNumber: number;
  timeRemaining: number;
  isTimerHidden: boolean;
  theme: ExamTheme;
  fontSize: FontSize;
  splitRatio: number; // percentage, e.g. 50
  isSubmitted: boolean;
  scoreSummary: ExamScoreSummary | null;
  activeNoteModal: { highlightId: string; text: string; initialNote?: string } | null;

  // YouPass Feature Parity: Vocabulary Book & User Goals
  vocabList: VocabItem[];
  vocabModal: { word: string; defaultMeaning?: string; contextSentence?: string } | null;
  userGoal: UserGoal;

  // Actions
  setCandidateInfo: (name: string, number: string) => void;
  setAnswer: (questionNumber: number, answer: string | string[]) => void;
  toggleReview: (questionNumber: number) => void;
  setCurrentQuestion: (questionNumber: number) => void;
  setCurrentPart: (partNumber: number) => void;
  setTheme: (theme: ExamTheme) => void;
  setFontSize: (size: FontSize) => void;
  setSplitRatio: (ratio: number) => void;
  toggleTimerHidden: () => void;
  decrementTime: () => void;
  addHighlight: (highlight: Omit<TextHighlight, 'id' | 'createdAt'>) => string;
  removeHighlight: (id: string) => void;
  updateHighlightNote: (id: string, note: string) => void;
  clearPassageHighlights: (passageId: string) => void;
  setActiveNoteModal: (modal: { highlightId: string; text: string; initialNote?: string } | null) => void;
  submitExam: () => Promise<void>;
  retakeExam: () => void;
  loadExam: (newExam: IELTSExam) => void;

  // Vocab Actions
  addVocab: (item: Omit<VocabItem, 'id' | 'addedAt'>) => void;
  updateVocabStatus: (id: string, status: 'unlearned' | 'learning' | 'mastered') => void;
  removeVocab: (id: string) => void;
  setVocabModal: (modal: { word: string; defaultMeaning?: string; contextSentence?: string } | null) => void;

  // Goal Actions
  setUserGoal: (goal: Partial<UserGoal>) => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      candidateName: 'Nguyen Van A',
      candidateNumber: 'VN102-884920',
      exam: mockReadingExam,
      answers: {},
      reviewed: {},
      highlights: [],
      currentQuestionNumber: 1,
      currentPartNumber: 1,
      timeRemaining: mockReadingExam.durationMinutes * 60,
      isTimerHidden: false,
      theme: 'standard',
      fontSize: 'standard',
      splitRatio: 50,
      isSubmitted: false,
      scoreSummary: null,
      activeNoteModal: null,

      vocabList: initialVocabList,
      vocabModal: null,
      userGoal: {
        targetBand: 7.5,
        examDate: '2026-12-15',
        streakDays: 3,
      },

      setCandidateInfo: (name, number) =>
        set({ candidateName: name, candidateNumber: number }),

      setAnswer: (questionNumber, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionNumber]: answer },
        })),

      toggleReview: (questionNumber) =>
        set((state) => ({
          reviewed: {
            ...state.reviewed,
            [questionNumber]: !state.reviewed[questionNumber],
          },
        })),

      setCurrentQuestion: (questionNumber) => {
        const { exam } = get();
        // Find which part this question belongs to
        let targetPart = 1;
        for (const part of exam.parts) {
          if (part.questions.some((q) => q.number === questionNumber)) {
            targetPart = part.partNumber;
            break;
          }
        }
        set({ currentQuestionNumber: questionNumber, currentPartNumber: targetPart });
      },

      setCurrentPart: (partNumber) => {
        const { exam } = get();
        const part = exam.parts.find((p) => p.partNumber === partNumber);
        const firstQNum = part?.questions[0]?.number || 1;
        set({ currentPartNumber: partNumber, currentQuestionNumber: firstQNum });
      },

      setTheme: (theme) => set({ theme }),

      setFontSize: (fontSize) => set({ fontSize }),

      setSplitRatio: (splitRatio) => set({ splitRatio }),

      toggleTimerHidden: () =>
        set((state) => ({ isTimerHidden: !state.isTimerHidden })),

      decrementTime: () =>
        set((state) => {
          if (state.isSubmitted || state.timeRemaining <= 0) return state;
          const nextTime = state.timeRemaining - 1;
          if (nextTime <= 0) {
            // Auto submit when time reaches 0
            setTimeout(() => {
              get().submitExam();
            }, 0);
          }
          return { timeRemaining: nextTime };
        }),

      addHighlight: (hl) => {
        const id = `hl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const newHighlight: TextHighlight = {
          ...hl,
          id,
          createdAt: Date.now(),
        };
        set((state) => ({
          highlights: [...state.highlights, newHighlight],
        }));
        return id;
      },

      removeHighlight: (id) =>
        set((state) => ({
          highlights: state.highlights.filter((h) => h.id !== id),
        })),

      updateHighlightNote: (id, note) =>
        set((state) => ({
          highlights: state.highlights.map((h) =>
            h.id === id ? { ...h, note } : h
          ),
        })),

      clearPassageHighlights: (passageId) =>
        set((state) => ({
          highlights: state.highlights.filter((h) => h.passageId !== passageId),
        })),

      setActiveNoteModal: (activeNoteModal) => set({ activeNoteModal }),

      submitExam: async () => {
        const { exam, answers, timeRemaining, candidateName, candidateNumber } = get();
        const totalDuration = exam.durationMinutes * 60;
        const timeSpent = Math.max(0, totalDuration - timeRemaining);

        const summary = gradeExam(exam, answers, timeSpent);
        set({ isSubmitted: true, scoreSummary: summary });

        // Asynchronously save to Supabase / LocalStorage attempt history
        try {
          await saveTestAttempt({
            candidateName,
            candidateNumber,
            testId: exam.id,
            module: exam.module,
            scoreSummary: summary,
            submittedAt: new Date().toISOString(),
          });
        } catch (err) {
          console.error('Failed to log test attempt:', err);
        }
      },

      retakeExam: () => {
        const { exam } = get();
        set({
          answers: {},
          reviewed: {},
          highlights: [],
          currentQuestionNumber: 1,
          currentPartNumber: 1,
          timeRemaining: exam.durationMinutes * 60,
          isSubmitted: false,
          scoreSummary: null,
          activeNoteModal: null,
        });
      },

      loadExam: (newExam) => {
        set({
          exam: newExam,
          answers: {},
          reviewed: {},
          highlights: [],
          currentQuestionNumber: 1,
          currentPartNumber: 1,
          timeRemaining: newExam.durationMinutes * 60,
          isSubmitted: false,
          scoreSummary: null,
          activeNoteModal: null,
        });
      },

      addVocab: (item) => {
        const id = `voc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const newItem: VocabItem = {
          ...item,
          id,
          addedAt: Date.now(),
        };
        set((state) => ({
          vocabList: [newItem, ...state.vocabList.filter((v) => v.word.toLowerCase() !== item.word.toLowerCase())],
        }));
      },

      updateVocabStatus: (id, status) => {
        set((state) => ({
          vocabList: state.vocabList.map((v) => (v.id === id ? { ...v, status } : v)),
        }));
      },

      removeVocab: (id) => {
        set((state) => ({
          vocabList: state.vocabList.filter((v) => v.id !== id),
        }));
      },

      setVocabModal: (vocabModal) => set({ vocabModal }),

      setUserGoal: (goalUpdate) => {
        set((state) => ({
          userGoal: { ...state.userGoal, ...goalUpdate },
        }));
      },
    }),
    {
      name: 'hoc_ielts_exam_store_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        candidateName: state.candidateName,
        candidateNumber: state.candidateNumber,
        exam: state.exam,
        answers: state.answers,
        reviewed: state.reviewed,
        highlights: state.highlights,
        currentQuestionNumber: state.currentQuestionNumber,
        currentPartNumber: state.currentPartNumber,
        timeRemaining: state.timeRemaining,
        isTimerHidden: state.isTimerHidden,
        theme: state.theme,
        fontSize: state.fontSize,
        splitRatio: state.splitRatio,
        isSubmitted: state.isSubmitted,
        scoreSummary: state.scoreSummary,
        vocabList: state.vocabList,
        userGoal: state.userGoal,
      }),
    }
  )
);
