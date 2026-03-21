import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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
    description:
      "Level up your AI skills. Join the next Cowork Bootcamp.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "heymitch — AI. AI. Substack.",
    description:
      "Level up your AI skills. Join the next Cowork Bootcamp.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
