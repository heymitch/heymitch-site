import localFont from "next/font/local";

const dotMatrix = localFont({
  src: [
    {
      path: "./fonts/dot-matrix-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/dot-matrix-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-dot-matrix",
  display: "swap",
});

export default function DispatchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={dotMatrix.variable}>{children}</div>;
}
