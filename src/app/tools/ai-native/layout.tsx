import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How AI-Native Are You? — The 3D Archetype Quiz',
  description:
    'A 10-question, ungameable self-assessment that plots how AI-native you are in 3D — then names your archetype. Free, instant, shareable. No account.',
  openGraph: {
    title: 'How AI-Native Are You? — The 3D Archetype Quiz',
    description:
      'Plot your AI-native location in 3D and find your archetype. 10 questions, no wrong answers, instant result.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How AI-Native Are You?',
    description: 'Plot your AI-native location in 3D and find your archetype. Free, instant.',
  },
};

export default function AINativeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
