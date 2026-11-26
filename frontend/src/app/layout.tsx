import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "TraceAnvaya — Agentic Incident Investigation & Replay Platform",
  description:
    "Every failure leaves a trace. Find the connection. Real-time incident intelligence powered by Pydantic AI, AG-UI, and CopilotKit.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col font-sans font-normal">
        {children}
      </body>
    </html>
  );
}
