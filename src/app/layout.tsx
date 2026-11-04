import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hoc_IELTS - Official Computer-Delivered IELTS Simulation',
  description: 'Pixel-perfect IELTS on Computer simulation with real-time scoring, highlight & sticky notes, and AI examiner.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-sky-200">
        {children}
      </body>
    </html>
  );
}
