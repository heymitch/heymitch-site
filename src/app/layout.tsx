import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "heymitch — Build .skills",
  description:
    "Beginner-friendly AI skills, Claude Cowork, and agent workflows. Build your first AI skill today.",
  openGraph: {
    title: "heymitch — Build .skills",
    description:
      "Beginner-friendly AI skills, Claude Cowork, and agent workflows.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "heymitch — Build .skills",
    description:
      "Beginner-friendly AI skills, Claude Cowork, and agent workflows.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;1,400&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter bg-void text-white">{children}</body>
    </html>
  );
}
