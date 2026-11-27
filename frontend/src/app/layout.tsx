import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { MotionProvider } from "@/components/providers/MotionProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050807",
};

export const metadata: Metadata = {
  title: "TraceAnvaya — Agentic Incident Investigation & Replay Platform",
  description:
    "Every failure leaves a trace. Find the connection. Investigate software failures with evidence-grounded AI, timeline replay, and human-gated remediation.",
  openGraph: {
    title: "TraceAnvaya — Agentic Incident Investigation & Replay Platform",
    description:
      "Investigate software failures with evidence-grounded AI, chronological timeline replay, and human-gated remediation.",
    type: "website",
    images: [
      {
        url: "/og-preview.png",
        width: 1440,
        height: 900,
        alt: "TraceAnvaya Incident Investigation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TraceAnvaya — Agentic Incident Investigation & Replay Platform",
    description:
      "Every failure leaves a trace. Find the connection.",
    images: ["/og-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col font-sans font-normal">
        <noscript>
          <style>{`.motion-safe-reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
