export type YouPassSkill = 'reading' | 'listening' | 'writing' | 'speaking';

export interface YouPassTag {
  id: number;
  title: string;
  code: string;
  color?: string;
}

export interface YouPassTagPositionItem {
  id: number;
  tag_position_id: number;
  sort: number;
  tag_search_id: YouPassTag;
}

export interface YouPassTagPosition {
  id: number;
  title: string;
  position: string;
  tags: YouPassTagPositionItem[];
}

export interface YouPassQuizListItem {
  id: number;
  type: number; // 1,9 = reading; 2,10 = listening; 7 = writing; 8 = speaking
  mode?: number;
  title: string;
  status: string;
  time?: number | null;
  thumbnail?: string | null;
  tags?: YouPassTag[] | null;
  total_submitted?: number;
  vote_count?: number;
  writing_task_type?: number | null;
  speaking_part_type?: number | null;
  date_updated?: string;
  has_guided_retry?: boolean;
}

export interface YouPassQuestionOption {
  text: string;
  option: string;
  is_correct?: boolean;
}

export interface YouPassParagraphRange {
  start: { paragraph: number; sentence: number; index: number };
  end: { paragraph: number; sentence: number; index: number };
}

export interface YouPassLocateInfo {
  paragraph_ranges?: YouPassParagraphRange[];
}

export interface YouPassWritingFrameSection {
  id: number;
  sort: number;
  name: string;
  value: string;
  is_toggle_on?: boolean;
}

export interface YouPassQuestion {
  id: number;
  quiz_id?: number;
  type?: string;
  question_type: string;
  title?: string;
  content?: string;
  content_writing?: string;
  order: number;
  sort?: number;
  text: string;
  explain?: string | null;
  instruction?: string | null;
  options?: YouPassQuestionOption[] | null;
  correct_answer?: string | null;
  correct_answers?: string[] | null;
  locate_info?: YouPassLocateInfo | null;
  matching_heading_paragraph?: number | null;
  writing_logical_frame?: YouPassWritingFrameSection[] | null;
  writing_graph_image?: string | null;
  writing_graph_description?: string | null;
  writing_graph_type?: number | null;
  min_words?: number | null;
  max_words?: number | null;
  time_limit?: number | null;
  sample_answers?: unknown;
}

export interface YouPassQuestionSet {
  id: number;
  title: string;
  description?: string | null;
  part_id?: number;
  question_type: string;
  question_count: number;
  content?: string | null;
  option_title?: string | null;
  options?: YouPassQuestionOption[] | null;
  allow_reuse?: boolean;
  max_selections?: number;
  sort?: number;
  questions: YouPassQuestion[];
}

export interface YouPassVocabSentence {
  id: number;
  level: number;
  value: string;
  meta?: {
    from?: number;
    to?: number;
    speaker?: string;
  } | null;
}

export interface YouPassVocabParagraph {
  id: number;
  level: number;
  value: string;
  children?: YouPassVocabSentence[];
}

export interface YouPassPart {
  id: number;
  quiz_id: number;
  passage?: number | null;
  title?: string | null;
  sort?: number;
  content?: string | null;
  file_id?: string | null;
  listen_from?: number | null;
  listen_to?: number | null;
  instruction?: string | null;
  transcription?: string | null;
  vocabs?: YouPassVocabParagraph[] | null;
  question_sets?: YouPassQuestionSet[] | null;
}

export interface YouPassQuizDetail extends YouPassQuizListItem {
  parts?: YouPassPart[];
  questions?: YouPassQuestion[];
}

export interface YouPassMockTestItem {
  id: number;
  title: string;
  thumbnail?: string | null;
  book_code?: string;
  skill_id: number;
  source?: string;
  has_guided_retry?: boolean;
}

export interface YouPassMockTestGroup {
  title: string;
  mock_tests: YouPassMockTestItem[];
}

export interface YouPassMockTestDetail {
  id: number;
  title: string;
  skill_id: number;
  quizzes: {
    full?: { id: number; time: number; question_count: number };
    part_1?: { id: number; time: number; question_count: number };
    part_2?: { id: number; time: number; question_count: number };
    part_3?: { id: number; time: number; question_count: number };
    part_4?: { id: number; time: number; question_count: number };
  };
}

export interface YouPassSpeakingTopic {
  id: number;
  title: string;
  thumbnail?: string | null;
  tags?: YouPassTag[];
  quizzes: YouPassQuizListItem[];
}

export interface YouPassAttemptRecord {
  id: string;
  quizId: number;
  title: string;
  skill: YouPassSkill;
  correct: number;
  total: number;
  bandScore?: number;
  durationSeconds: number;
  answers: Record<number, string | string[]>;
  essayText?: string;
  submittedAt: string; // ISO string
}

export interface YouPassGoal {
  overall: number;
  reading: number;
  listening: number;
  writing: number;
  speaking: number;
  examDate: string; // YYYY-MM-DD
}
