export type ExamModule = 'reading' | 'listening' | 'writing';

export type QuestionType =
  | 'tfng'
  | 'ynng'
  | 'mcq_single'
  | 'mcq_multiple'
  | 'gap_fill'
  | 'matching_headings'
  | 'matching_information'
  | 'fill_in_blanks'
  | 'multiple_choice'
  | 'true_false_not_given'
  | 'yes_no_not_given';

export type ExamTheme = 'standard' | 'dark' | 'yellow' | 'youpass_orange';
export type FontSize = 'standard' | 'large' | 'extralarge';

export interface StepByStepGuide {
  step1_keywords: string[];
  step2_context: string;
  step3_trap_analysis: string;
  step4_solution_summary: string;
}

export interface VocabItem {
  id: string;
  word: string;
  ipa?: string;
  meaningVi: string;
  contextSentence?: string;
  status: 'unlearned' | 'learning' | 'mastered'; // Chưa thuộc, Nhớ sơ, Đã thuộc
  addedAt: number;
}

export interface UserGoal {
  targetBand: number; // e.g. 7.5
  examDate?: string; // YYYY-MM-DD
  streakDays: number;
}

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
  builderGuide?: StepByStepGuide; // Step-by-step problem solver (YouPass Listening/Reading Builder)
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
  instructions?: string;
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
  prompt?: string;
  userAnswer: string | string[] | undefined;
  correctAnswer: string | string[];
  isCorrect: boolean;
  type: QuestionType;
  part: number;
  explanation: string;
  evidenceSentence?: string;
  evidenceSentenceId?: string;
  builderGuide?: StepByStepGuide;
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
