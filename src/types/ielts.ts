export type ExamModule = 'reading' | 'listening' | 'writing';

export type QuestionType =
  | 'tfng'
  | 'ynng'
  | 'mcq_single'
  | 'mcq_multiple'
  | 'gap_fill'
  | 'matching_headings'
  | 'matching_information';

export type ExamTheme = 'standard' | 'dark' | 'yellow';
export type FontSize = 'standard' | 'large' | 'extralarge';

export interface TextHighlight {
  id: string;
  passageId: string;
  targetType: 'passage' | 'question';
  questionNumber?: number;
  text: string;
  color: 'yellow' | 'blue';
  note?: string;
  createdAt: number;
}

export interface QuestionOption {
  label: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface Question {
  id: string;
  number: number; // 1 to 40
  part: number; // 1, 2, or 3 (or 4 for listening)
  type: QuestionType;
  prompt: string;
  instruction?: string;
  options?: QuestionOption[];
  maxSelections?: number; // e.g. 2 for "Choose TWO letters"
  correctAnswer: string | string[]; // Can be single answer or array (for multi-choice or gap fills)
  acceptableAnswers?: string[]; // Extra valid synonyms/spellings
  explanation: string;
  evidenceSentence?: string; // Exact quote from passage for solution view
  headingList?: { id: string; roman: string; text: string }[]; // For matching headings
  paragraphRef?: string; // e.g. "Paragraph A"
  gapLabel?: string; // for inline inputs e.g. "(1) ________"
}

export interface Paragraph {
  id: string;
  label?: string; // e.g., "A", "B", "C"
  text: string;
}

export interface Part {
  partNumber: number; // 1, 2, 3
  title: string;
  subtitle?: string;
  instructions: string;
  passage?: {
    id: string;
    title: string;
    subtitle?: string;
    paragraphs: Paragraph[];
  };
  audioUrl?: string; // For Listening tests
  audioTitle?: string;
  questions: Question[];
}

export interface IELTSExam {
  id: string;
  title: string;
  module: ExamModule;
  category: 'Academic' | 'General Training';
  durationMinutes: number; // 60 for Reading/Writing, 30-40 for Listening
  parts: Part[];
  writingPrompts?: {
    task1: {
      title: string;
      prompt: string;
      imageUrl?: string;
      minWords: number;
    };
    task2: {
      title: string;
      prompt: string;
      minWords: number;
    };
  };
}

export interface QuestionScoreResult {
  questionNumber: number;
  userAnswer: string | string[] | undefined;
  correctAnswer: string | string[];
  isCorrect: boolean;
  type: QuestionType;
  part: number;
  explanation: string;
  evidenceSentence?: string;
}

export interface ExamScoreSummary {
  rawScore: number;
  totalQuestions: number;
  bandScore: number;
  percentage: number;
  partBreakdown: Record<number, { correct: number; total: number }>;
  typeBreakdown: Record<string, { correct: number; total: number }>;
  detailedResults: QuestionScoreResult[];
  timeSpentSeconds: number;
}
