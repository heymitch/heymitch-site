import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Hunter — Paste Your Copy, Find the Robot',
  description: 'Free tool. Paste any text. Get a 0–100 human score, letter grade, and every AI pattern flagged with a name and a fix. No API. No account. Instant.',
  openGraph: {
    title: 'AI Hunter — Paste Your Copy, Find the Robot',
    description: 'Free tool. Paste any text. Get a 0–100 human score, letter grade, and every AI pattern flagged with a name and a fix.',
  },
};

export default function AIHunterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
