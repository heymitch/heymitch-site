import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import AiHunterCTA from "@/components/AiHunterCTA";
import ThemeToggle from "@/components/ThemeToggle";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "heymitch — AI. AI. Substack.",
  description:
    "Level up your AI skills. Join the next Cowork Bootcamp, read the newsletters, grab free resources.",
  openGraph: {
    title: "heymitch — AI. AI. Substack.",
    description: "Level up your AI skills. Join the next Cowork Bootcamp.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "heymitch — AI. AI. Substack.",
    description: "Level up your AI skills. Join the next Cowork Bootcamp.",
  },
};

// Runs before first paint: applies a stored manual theme choice so there's no
// flash. When nothing is stored we leave data-theme unset and let the CSS
// prefers-color-scheme media query follow the OS (and keep following it live).
const noFlashTheme = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <ThemeToggle />
        {children}
        <AiHunterCTA />
        <Analytics />
      </body>
    </html>
  );
}
