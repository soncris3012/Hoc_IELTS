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

export interface ParaphrasePair {
  questionKeyword: string;
  passageKeyword: string;
  notes?: string;
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
  correctAnswer: string | string[]; // Can be single answer or array
  acceptableAnswers?: string[]; // Extra valid synonyms/spellings
  explanation: string;
  evidenceSentence?: string; // Exact quote from passage for solution view
  evidenceSentenceId?: string; // Anchor ID to scroll & highlight in passage
  paraphrasePairs?: ParaphrasePair[]; // Matching keywords in question vs passage
  distractorExplanations?: Record<string, string>; // Why options A, B, C, D are wrong
  errorTag?: 'lexical_gap' | 'overthinking_logic' | 'scanning_oversight' | 'acoustic_distractor';
  headingList?: { id: string; roman: string; text: string }[];
  paragraphRef?: string;
  gapLabel?: string;
}

export interface VocabAnnotation {
  term: string;
  ipa?: string;
  meaningVi: string;
  level?: 'B2' | 'C1' | 'C2';
  exampleSentence?: string;
}

export interface Paragraph {
  id: string;
  label?: string; // e.g., "A", "B", "C"
  text: string;
  vocabList?: VocabAnnotation[];
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
  audioUrl?: string;
  audioTitle?: string;
  questions: Question[];
}

export interface IELTSExam {
  id: string;
  title: string;
  module: ExamModule;
  category: 'Academic' | 'General Training';
  durationMinutes: number;
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
  evidenceSentenceId?: string;
  paraphrasePairs?: ParaphrasePair[];
  distractorExplanations?: Record<string, string>;
  errorTag?: 'lexical_gap' | 'overthinking_logic' | 'scanning_oversight' | 'acoustic_distractor';
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
