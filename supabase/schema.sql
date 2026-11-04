-- Hoc_IELTS Database Schema for Supabase (PostgreSQL)

-- 1. Tests Table (stores Reading, Listening, and Writing exam templates)
CREATE TABLE IF NOT EXISTS public.tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  module TEXT NOT NULL CHECK (module IN ('reading', 'listening', 'writing')),
  category TEXT DEFAULT 'Academic' CHECK (category IN ('Academic', 'General Training')),
  duration_minutes INTEGER DEFAULT 60,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Test Attempts Table (stores candidate test submissions, scores, and detailed item responses)
CREATE TABLE IF NOT EXISTS public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name TEXT DEFAULT 'Candidate',
  candidate_number TEXT,
  test_id TEXT REFERENCES public.tests(id) ON DELETE SET NULL,
  module TEXT NOT NULL,
  raw_score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  band_score NUMERIC(3, 1) NOT NULL,
  percentage INTEGER NOT NULL,
  time_spent_seconds INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  detailed_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  part_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  type_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Writing Submissions & AI Evaluations
CREATE TABLE IF NOT EXISTS public.writing_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name TEXT DEFAULT 'Candidate',
  task_number INTEGER NOT NULL CHECK (task_number IN (1, 2)),
  prompt_title TEXT NOT NULL,
  essay_text TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  overall_band NUMERIC(3, 1) NOT NULL,
  task_achievement_band NUMERIC(3, 1) NOT NULL,
  coherence_band NUMERIC(3, 1) NOT NULL,
  lexical_band NUMERIC(3, 1) NOT NULL,
  grammar_band NUMERIC(3, 1) NOT NULL,
  feedback_json JSONB NOT NULL,
  sample_rewrite TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) with open read/write for practice users
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_evaluations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to tests
CREATE POLICY "Allow public read access to tests" ON public.tests
  FOR SELECT USING (true);

-- Allow public insert/read for test attempts
CREATE POLICY "Allow public insert to attempts" ON public.test_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select to attempts" ON public.test_attempts
  FOR SELECT USING (true);

-- Allow public insert/read for writing submissions
CREATE POLICY "Allow public insert to writing" ON public.writing_evaluations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select to writing" ON public.writing_evaluations
  FOR SELECT USING (true);
