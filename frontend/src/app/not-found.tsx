import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050807] text-foreground flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full rounded-2xl border border-white/[0.1] bg-[#0D1411] p-8 text-center space-y-5 shadow-2xl">
        <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center mx-auto text-accent">
          <Compass className="w-5 h-5" />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-mono text-accent uppercase tracking-widest">404 &bull; Trace Not Found</p>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Investigation route not found
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            The requested page does not exist or has been moved. Return to the landing page or open the investigation workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white/[0.05] border border-white/[0.1] text-foreground hover:bg-white/[0.09] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back Home</span>
          </Link>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-accent text-[#050807] hover:brightness-105 transition-all"
          >
            <span>Open Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
