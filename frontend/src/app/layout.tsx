import type { Metadata } from "next";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";
import { CopilotKit } from "@copilotkit/react-core";

export const metadata: Metadata = {
  title: "TraceAnvaya — Agentic Incident Investigation & Replay Platform",
  description:
    "Trace the failure. Connect the evidence. Real-time incident intelligence powered by Pydantic AI, AG-UI, and CopilotKit.",
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
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col font-sans">
        <CopilotKit runtimeUrl="/api/copilotkit" agent="incidentAgent">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
