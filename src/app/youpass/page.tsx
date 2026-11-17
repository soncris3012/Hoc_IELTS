import { Metadata } from 'next';
import { YouPassExamView } from '@/components/exam/YouPassExamView';

export const metadata: Metadata = {
  title: 'YouPass 1984 Exam Platform - 2,540+ Real IELTS Tests',
  description:
    'Kho luyện đề 4 kỹ năng Reading, Listening, Writing, Speaking chuẩn YouPass với lời giải 4 bước, transcript tương tác và Dictation.',
};

export default function YouPassPage() {
  return <YouPassExamView />;
}
