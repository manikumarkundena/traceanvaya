"use client";

import React from "react";

interface MarkdownContentProps {
  content: string;
  onCitationClick: (evidenceId: string) => void;
}

/**
 * Safe, zero-HTML-injection Markdown renderer tailored for incident investigation chat.
 * Supports headings, paragraphs, bold, italic, inline code, fenced code blocks,
 * ordered/unordered lists, tables, safe http(s) links, and interactive [ev-XXX] badges.
 */
export function MarkdownContent({ content, onCitationClick }: MarkdownContentProps) {
  const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
    // Tokenize inline code, bold, italic, markdown links, and evidence references [ev-123]
    const pattern =
      /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\((https?:\/\/[^\s)]+)\)|\[ev-\d+\])/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let idx = 0;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(text.slice(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith("`") && token.endsWith("`")) {
        nodes.push(
          <code
            key={`${keyPrefix}-code-${idx++}`}
            className="px-1.5 py-0.5 rounded bg-black/50 border border-white/[0.08] font-mono text-[0.85em] text-accent"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith("**") && token.endsWith("**")) {
        nodes.push(
          <strong key={`${keyPrefix}-bold-${idx++}`} className="font-semibold text-white">
            {renderInline(token.slice(2, -2), `${keyPrefix}-b-${idx}`)}
          </strong>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        nodes.push(
          <em key={`${keyPrefix}-italic-${idx++}`} className="italic text-slate-200">
            {renderInline(token.slice(1, -1), `${keyPrefix}-i-${idx}`)}
          </em>
        );
      } else if (/^\[ev-\d+\]$/.test(token)) {
        const evId = token.slice(1, -1);
        nodes.push(
          <button
            key={`${keyPrefix}-ev-${idx++}`}
            type="button"
            onClick={() => onCitationClick(evId)}
            className="inline-flex items-center mx-0.5 px-1.5 py-0.5 rounded bg-accent/15 hover:bg-accent/30 text-accent font-mono text-[11px] font-semibold border border-accent/35 cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            title={`Inspect ${evId} in Evidence Explorer`}
          >
            {token}
          </button>
        );
      } else if (match[2]) {
        // Safe http(s) link
        const labelMatch = /^\[([^\]]+)\]/.exec(token);
        const label = labelMatch ? labelMatch[1] : match[2];
        nodes.push(
          <a
            key={`${keyPrefix}-link-${idx++}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
          >
            {label}
          </a>
        );
      } else {
        nodes.push(token);
      }

      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }

    return nodes;
  };

  // Split into block-level chunks (fenced code blocks vs normal lines)
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push(
        <div
          key={`codeblock-${i}`}
          className="rounded-lg border border-white/[0.08] bg-[#060908] overflow-hidden my-2"
        >
          {lang && (
            <div className="px-3 py-1 bg-white/[0.03] border-b border-white/[0.06] text-[10px] font-mono text-muted uppercase tracking-wider">
              {lang}
            </div>
          )}
          <pre className="p-3 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Blank line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Headings
    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const cls =
        level === 1
          ? "text-base font-bold text-white mt-2 mb-1 font-display"
          : level === 2
          ? "text-sm font-bold text-white mt-2 mb-1 font-display"
          : "text-xs sm:text-sm font-semibold text-accent mt-1.5 mb-1 font-sans";
      blocks.push(
        <h4 key={`h-${i}`} className={cls}>
          {renderInline(text, `h-${i}`)}
        </h4>
      );
      i++;
      continue;
    }

    // Table
    if (line.trim().startsWith("|") && i + 1 < lines.length && /^\|[\s\-:|]+\|/.test(lines[i + 1].trim())) {
      const parseRow = (r: string) =>
        r
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((c) => c.trim());

      const headers = parseRow(line);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(parseRow(lines[i]));
        i++;
      }

      blocks.push(
        <div key={`table-${i}`} className="overflow-x-auto my-2 rounded-lg border border-white/[0.08]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-white/[0.04] border-b border-white/[0.08]">
              <tr>
                {headers.map((h, hIdx) => (
                  <th key={hIdx} className="px-3 py-1.5 font-semibold text-slate-200">
                    {renderInline(h, `th-${i}-${hIdx}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.02]">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-1.5 text-slate-300">
                      {renderInline(cell, `td-${i}-${rIdx}-${cIdx}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1 text-slate-200">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item, `ul-${i}-${idx}`)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={`ol-${i}`} className="list-decimal pl-5 space-y-1 text-slate-200">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item, `ol-${i}-${idx}`)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph (collect consecutive non-special lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !/^(#{1,3})\s+/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith("|")
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={`p-${i}`} className="leading-relaxed text-slate-200 break-words">
        {renderInline(paraLines.join(" "), `p-${i}`)}
      </p>
    );
  }

  return <div className="space-y-2.5 font-sans">{blocks}</div>;
}
