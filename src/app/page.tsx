import { Metadata } from 'next';
import { YouPassExamView } from '@/components/exam/YouPassExamView';

export const metadata: Metadata = {
  title: 'Hoc_IELTS • YouPass 1984 Platform (2,540+ Real IELTS Tests)',
  description:
    'Nền tảng tự học và thi thử IELTS chuẩn YouPass với 533 đề Reading, 707 đề Listening (Audio + Dictation), 901 đề Writing và 399 chủ đề Speaking.',
};

export default function HomePage() {
  return <YouPassExamView />;
}
