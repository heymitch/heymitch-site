import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Agent Bootcamp | Build & Sell AI Agents',
  description:
    'Build an always-on personal AI agent that does real work for you, then package it into a productized offer. 6 live sessions over 2 weeks.',
  robots: 'noindex, nofollow',
};

export default function PabLandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Jura:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Silkscreen&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
