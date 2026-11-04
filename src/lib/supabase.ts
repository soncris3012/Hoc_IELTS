import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ExamScoreSummary } from '@/types/ielts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface TestAttemptRecord {
  id?: string;
  candidateName: string;
  candidateNumber: string;
  testId: string;
  module: string;
  scoreSummary: ExamScoreSummary;
  submittedAt: string;
}

export interface WritingEvaluationRecord {
  id?: string;
  candidateName: string;
  taskNumber: number;
  promptTitle: string;
  essayText: string;
  wordCount: number;
  overallBand: number;
  criteriaBands: {
    taskAchievement: number;
    coherence: number;
    lexical: number;
    grammar: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    grammarCorrections: { original: string; corrected: string; explanation: string }[];
    advancedVocabulary: { word: string; context: string }[];
  };
  sampleRewrite: string;
  createdAt: string;
}

/**
 * Save test attempt to Supabase or fallback to LocalStorage
 */
export async function saveTestAttempt(record: TestAttemptRecord): Promise<string> {
  const attemptId = record.id || `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (supabase && isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('test_attempts').insert([
        {
          id: attemptId,
          candidate_name: record.candidateName,
          candidate_number: record.candidateNumber,
          test_id: record.testId,
          module: record.module,
          raw_score: record.scoreSummary.rawScore,
          total_questions: record.scoreSummary.totalQuestions,
          band_score: record.scoreSummary.bandScore,
          percentage: record.scoreSummary.percentage,
          time_spent_seconds: record.scoreSummary.timeSpentSeconds,
          answers: {},
          detailed_results: record.scoreSummary.detailedResults,
          part_breakdown: record.scoreSummary.partBreakdown,
          type_breakdown: record.scoreSummary.typeBreakdown,
          submitted_at: record.submittedAt,
        },
      ]);
      if (!error) return attemptId;
      console.warn('Supabase save error, falling back to localStorage:', error);
    } catch (err) {
      console.warn('Supabase connection failed, using localStorage:', err);
    }
  }

  // Fallback to LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem('hoc_ielts_attempts') || '[]');
      existing.unshift({ ...record, id: attemptId });
      localStorage.setItem('hoc_ielts_attempts', JSON.stringify(existing.slice(0, 50)));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  }

  return attemptId;
}

/**
 * Get test attempts history
 */
export async function getTestAttempts(): Promise<TestAttemptRecord[]> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('test_attempts')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        return data.map((d: Record<string, unknown>) => ({
          id: d.id as string,
          candidateName: d.candidate_name as string,
          candidateNumber: d.candidate_number as string,
          testId: d.test_id as string,
          module: d.module as string,
          submittedAt: d.submitted_at as string,
          scoreSummary: {
            rawScore: Number(d.raw_score),
            totalQuestions: Number(d.total_questions),
            bandScore: Number(d.band_score),
            percentage: Number(d.percentage),
            timeSpentSeconds: Number(d.time_spent_seconds),
            partBreakdown: (d.part_breakdown as Record<number, { correct: number; total: number }>) || {},
            typeBreakdown: (d.type_breakdown as Record<string, { correct: number; total: number }>) || {},
            detailedResults: (d.detailed_results as TestAttemptRecord['scoreSummary']['detailedResults']) || [],
          },
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, reading localStorage:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem('hoc_ielts_attempts') || '[]');
    } catch {
      return [];
    }
  }

  return [];
}
