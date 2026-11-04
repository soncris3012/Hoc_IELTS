import { IELTSExam, ExamScoreSummary, QuestionScoreResult } from '@/types/ielts';

/**
 * Official IELTS Academic Reading Band Score Table (out of 40)
 */
const ACADEMIC_READING_BANDS: [number, number][] = [
  [39, 9.0],
  [37, 8.5],
  [35, 8.0],
  [33, 7.5],
  [30, 7.0],
  [27, 6.5],
  [23, 6.0],
  [19, 5.5],
  [15, 5.0],
  [13, 4.5],
  [10, 4.0],
  [8, 3.5],
  [6, 3.0],
  [4, 2.5],
  [3, 2.0],
  [1, 1.0],
  [0, 0.0],
];

/**
 * Official IELTS Listening Band Score Table (out of 40)
 */
const LISTENING_BANDS: [number, number][] = [
  [39, 9.0],
  [37, 8.5],
  [35, 8.0],
  [32, 7.5],
  [30, 7.0],
  [26, 6.5],
  [23, 6.0],
  [18, 5.5],
  [16, 5.0],
  [13, 4.5],
  [10, 4.0],
  [8, 3.5],
  [6, 3.0],
  [4, 2.5],
  [3, 2.0],
  [1, 1.0],
  [0, 0.0],
];

export function calculateBandScore(rawScore: number, module: 'reading' | 'listening' | 'writing' = 'reading'): number {
  const table = module === 'listening' ? LISTENING_BANDS : ACADEMIC_READING_BANDS;
  for (const [minScore, band] of table) {
    if (rawScore >= minScore) {
      return band;
    }
  }
  return 0.0;
}

/**
 * Clean & normalize a string answer
 */
function cleanString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate all variations for answers with optional words in parentheses
 * e.g., "(the) car" -> ["the car", "car"]
 * e.g., "steam (engine)" -> ["steam engine", "steam"]
 */
function expandParentheses(pattern: string): string[] {
  const matches = pattern.match(/\(([^)]+)\)/);
  if (!matches) {
    return [pattern.trim()];
  }

  const optionalContent = matches[1];
  const withContent = pattern.replace(/\(([^)]+)\)/, optionalContent);
  const withoutContent = pattern.replace(/\(([^)]+)\)/, '');

  return [
    ...expandParentheses(withContent),
    ...expandParentheses(withoutContent),
  ].map((s) => s.replace(/\s+/g, ' ').trim());
}

/**
 * Compare user's answer with official answer key
 * Supports:
 * - Case-insensitivity
 * - Whitespace trimming
 * - Slash alternatives: "color/colour" or "15/fifteen"
 * - Parentheses optional words: "(the) bus" or "heavy (rain)"
 * - Array-based answers (e.g. choose 2 options in MCQ)
 * - Roman numerals: iv vs IV vs 4
 */
export function compareAnswer(
  userAns: string | string[] | undefined,
  correctAns: string | string[],
  acceptableList: string[] = []
): boolean {
  if (userAns === undefined || userAns === null) return false;

  // Handle multiple selection (array of choices, e.g. ['A', 'C'])
  if (Array.isArray(correctAns)) {
    const userArr = Array.isArray(userAns) ? userAns : [userAns];
    if (userArr.length !== correctAns.length) return false;

    const normUser = userArr.map((a) => cleanString(a)).sort();
    const normCorrect = correctAns.map((a) => cleanString(a)).sort();

    return normUser.every((val, index) => val === normCorrect[index]);
  }

  // Handle single answer comparison
  const rawUser = Array.isArray(userAns) ? userAns.join('') : userAns;
  const userClean = cleanString(rawUser);

  if (!userClean) return false;

  // Split possible slash alternatives in correct answer: e.g. "colour / color"
  const slashAlternatives = correctAns.split('/').map((s) => s.trim());

  // Expand each alternative for parentheses: "(the) car"
  const allAccepted: string[] = [...acceptableList];
  for (const alt of slashAlternatives) {
    const expanded = expandParentheses(alt);
    allAccepted.push(...expanded);
  }

  // Also handle Roman Numeral equivalents for matching headings:
  // e.g. "iv" <-> "4", "ix" <-> "9", "vii" <-> "7"
  const romanMap: Record<string, string> = {
    i: '1', ii: '2', iii: '3', iv: '4', v: '5',
    vi: '6', vii: '7', viii: '8', ix: '9', x: '10',
    xi: '11', xii: '12', xiii: '13', xiv: '14'
  };

  const cleanAccepted = allAccepted.map((ans) => cleanString(ans));

  // Check direct matches
  for (const accepted of cleanAccepted) {
    if (userClean === accepted) return true;

    // Check roman conversion
    if (romanMap[userClean] && (romanMap[userClean] === accepted || romanMap[userClean] === romanMap[accepted])) {
      return true;
    }
  }

  return false;
}

/**
 * Score an entire IELTS Exam attempt
 */
export function gradeExam(
  exam: IELTSExam,
  userAnswers: Record<number, string | string[]>,
  timeSpentSeconds: number
): ExamScoreSummary {
  let rawScore = 0;
  let totalQuestions = 0;
  const detailedResults: QuestionScoreResult[] = [];
  const partBreakdown: Record<number, { correct: number; total: number }> = {};
  const typeBreakdown: Record<string, { correct: number; total: number }> = {};

  // Initialize breakdowns
  exam.parts.forEach((part) => {
    partBreakdown[part.partNumber] = { correct: 0, total: 0 };
  });

  exam.parts.forEach((part) => {
    part.questions.forEach((q) => {
      totalQuestions += 1;
      partBreakdown[part.partNumber].total += 1;

      if (!typeBreakdown[q.type]) {
        typeBreakdown[q.type] = { correct: 0, total: 0 };
      }
      typeBreakdown[q.type].total += 1;

      const userAns = userAnswers[q.number];
      const isCorrect = compareAnswer(userAns, q.correctAnswer, q.acceptableAnswers);

      if (isCorrect) {
        rawScore += 1;
        partBreakdown[part.partNumber].correct += 1;
        typeBreakdown[q.type].correct += 1;
      }

      detailedResults.push({
        questionNumber: q.number,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        type: q.type,
        part: part.partNumber,
        explanation: q.explanation,
        evidenceSentence: q.evidenceSentence,
      });
    });
  });

  const bandScore = calculateBandScore(rawScore, exam.module);
  const percentage = totalQuestions > 0 ? Math.round((rawScore / totalQuestions) * 100) : 0;

  return {
    rawScore,
    totalQuestions,
    bandScore,
    percentage,
    partBreakdown,
    typeBreakdown,
    detailedResults,
    timeSpentSeconds,
  };
}
