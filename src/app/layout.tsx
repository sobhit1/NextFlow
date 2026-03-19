import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextFlow | AI Workflow Builder",
  description: "Pixel-perfect UI clone of Krea.ai workflow builder for LLMs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
