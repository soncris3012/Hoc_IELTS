import { Metadata } from 'next';
import { YouPassExamView } from '@/components/exam/YouPassExamView';

export const metadata: Metadata = {
  title: 'YouPass CDT Exam Room - 1:1 Pixel-Perfect Simulation',
  description: 'Giao diện phòng thi mô phỏng IELTS YouPass chuẩn 1:1 với đề thực tế [Simulation Q4] The Lego brick.',
};

export default function YouPassPage() {
  return <YouPassExamView />;
}
