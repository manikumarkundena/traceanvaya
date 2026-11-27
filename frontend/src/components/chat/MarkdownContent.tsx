"use client";

import React from "react";

interface MarkdownContentProps {
  content: string;
  onCitationClick: (evidenceId: string) => void;
}

interface ParsedListNode {
  text: string;
  children: ParsedListBlock[];
}

interface ParsedListBlock {
  ordered: boolean;
  start: number;
  items: ParsedListNode[];
}

/**
 * Safe, zero-HTML-injection Markdown renderer tailored for incident investigation chat.
 * Supports H1-H6 headings, paragraphs, bold, italic, inline code, fenced code blocks,
 * nested ordered/unordered lists, blockquotes, dividers, tables, safe http(s) links,
 * and interactive [ev-XXX] citation badges.
 */
export function MarkdownContent({ content, onCitationClick }: MarkdownContentProps) {
  const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
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
            className="px-1.5 py-0.5 rounded bg-black/50 border border-white/[0.08] font-mono text-[0.84em] text-accent break-words"
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
            className="inline-flex items-center whitespace-nowrap mx-0.5 px-1.5 py-0.5 rounded bg-accent/15 hover:bg-accent/30 text-accent font-mono text-[11px] font-semibold border border-accent/35 cursor-pointer transition-colors duration-150 align-baseline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            title={`Inspect ${evId} in Evidence Explorer`}
          >
            {token}
          </button>
        );
      } else if (match[2]) {
        const labelMatch = /^\[([^\]]+)\]/.exec(token);
        const label = labelMatch ? labelMatch[1] : match[2];
        nodes.push(
          <a
            key={`${keyPrefix}-link-${idx++}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors break-words"
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

  const getListLineInfo = (rawLine: string) => {
    const m = /^(\s*)(?:([-*+])|(\d+)\.)\s+(.*)$/.exec(rawLine);
    if (!m) return null;
    return {
      indent: m[1].replace(/\t/g, "  ").length,
      ordered: Boolean(m[3]),
      start: m[3] ? Number(m[3]) : 1,
      text: m[4],
    };
  };

  const lines = content.split("\n");

  const parseListBlock = (startIdx: number): { block: ParsedListBlock; nextIdx: number } => {
    const first = getListLineInfo(lines[startIdx])!;
    const baseIndent = first.indent;
    const ordered = first.ordered;
    const start = first.start;
    const items: ParsedListNode[] = [];
    let idx = startIdx;

    while (idx < lines.length) {
      // Allow a single blank line inside a multi-item list if followed by another list item at >= baseIndent
      if (!lines[idx].trim()) {
        if (idx + 1 < lines.length) {
          const nextInfo = getListLineInfo(lines[idx + 1]);
          if (nextInfo && nextInfo.indent >= baseIndent && (nextInfo.indent > baseIndent || nextInfo.ordered === ordered)) {
            idx++;
            continue;
          }
        }
        break;
      }

      const info = getListLineInfo(lines[idx]);
      if (!info) break;

      if (info.indent < baseIndent) break;

      if (info.indent === baseIndent) {
        if (info.ordered !== ordered) break;
        items.push({ text: info.text, children: [] });
        idx++;
      } else {
        // Nested list under the previous item
        if (items.length === 0) break;
        const nested = parseListBlock(idx);
        items[items.length - 1].children.push(nested.block);
        idx = nested.nextIdx;
      }
    }

    return { block: { ordered, start, items }, nextIdx: idx };
  };

  const renderListBlock = (block: ParsedListBlock, keyPrefix: string, depth = 0): React.ReactNode => {
    const Tag = block.ordered ? "ol" : "ul";
    const listClass = block.ordered
      ? `list-decimal ${depth === 0 ? "pl-5 my-2.5" : "pl-5 mt-1.5"} space-y-1.5 text-slate-200`
      : `list-disc ${depth === 0 ? "pl-5 my-2.5" : "pl-5 mt-1.5"} space-y-1.5 text-slate-200`;

    return (
      <Tag key={keyPrefix} start={block.ordered && block.start !== 1 ? block.start : undefined} className={listClass}>
        {block.items.map((item, idx) => (
          <li key={`${keyPrefix}-li-${idx}`} className="leading-[1.7] pl-0.5">
            <span>{renderInline(item.text, `${keyPrefix}-li-${idx}`)}</span>
            {item.children.map((childBlock, cIdx) =>
              renderListBlock(childBlock, `${keyPrefix}-li-${idx}-sub-${cIdx}`, depth + 1)
            )}
          </li>
        ))}
      </Tag>
    );
  };

  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Fenced code block
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push(
        <div
          key={`codeblock-${i}`}
          className="rounded-lg border border-white/[0.08] bg-[#060908] overflow-hidden my-3"
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
    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal divider
    if (/^(?:---|\*\*\*|___)\s*$/.test(trimmed)) {
      blocks.push(<hr key={`hr-${i}`} className="my-3.5 border-white/[0.08]" />);
      i++;
      continue;
    }

    // Headings H1 through H6
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const headingClasses: Record<number, string> = {
        1: "text-lg font-bold text-white mt-3.5 mb-1.5 font-display tracking-tight",
        2: "text-base font-semibold text-white mt-3 mb-1.5 font-display tracking-tight",
        3: "text-[15px] font-semibold text-accent mt-2.5 mb-1 font-sans",
        4: "text-sm font-semibold text-slate-100 mt-2.5 mb-1 font-sans",
        5: "text-xs font-semibold uppercase tracking-wider text-accent/90 mt-2 mb-1 font-sans",
        6: "text-xs font-semibold text-slate-300 mt-2 mb-1 font-sans",
      };
      const HeadingTag = (`h${level}` as keyof React.JSX.IntrinsicElements);
      blocks.push(
        <HeadingTag key={`h-${i}`} className={headingClasses[level]}>
          {renderInline(text, `h-${i}`)}
        </HeadingTag>
      );
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote
          key={`bq-${i}`}
          className="border-l-2 border-accent/50 pl-3.5 my-2.5 text-slate-300 italic leading-[1.7]"
        >
          {renderInline(quoteLines.join(" "), `bq-${i}`)}
        </blockquote>
      );
      continue;
    }

    // Table
    if (trimmed.startsWith("|") && i + 1 < lines.length && /^\|[\s\-:|]+\|/.test(lines[i + 1].trim())) {
      const parseRow = (r: string) =>
        r
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((c) => c.trim());

      const headers = parseRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(parseRow(lines[i]));
        i++;
      }

      blocks.push(
        <div key={`table-${i}`} className="overflow-x-auto my-3 rounded-lg border border-white/[0.08]">
          <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
            <thead className="bg-white/[0.04] border-b border-white/[0.08]">
              <tr>
                {headers.map((h, hIdx) => (
                  <th key={hIdx} className="px-3 py-2 font-semibold text-slate-200">
                    {renderInline(h, `th-${i}-${hIdx}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.02]">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 text-slate-300">
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

    // Ordered or unordered list (including nested lists)
    if (getListLineInfo(line)) {
      const { block, nextIdx } = parseListBlock(i);
      blocks.push(renderListBlock(block, `list-${i}`, 0));
      i = nextIdx;
      continue;
    }

    // Paragraph (collect consecutive non-special lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !/^(#{1,6})\s+/.test(lines[i].trim()) &&
      !/^(?:---|\*\*\*|___)\s*$/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith(">") &&
      !getListLineInfo(lines[i]) &&
      !lines[i].trim().startsWith("|")
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    blocks.push(
      <p key={`p-${i}`} className="leading-[1.7] text-slate-200 break-words">
        {renderInline(paraLines.join(" "), `p-${i}`)}
      </p>
    );
  }

  return <div className="space-y-2.5 text-[15px] leading-[1.7] font-sans">{blocks}</div>;
}
