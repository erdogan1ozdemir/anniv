"use client";

// Inline-only renderer for memory story strings. Renders the chat
// quote markers — *italic* and **bold** — as proper <em>/<strong>
// while keeping output safe to embed inside <p> or <div>. Single
// newlines render as <br> so multi-line paragraphs survive intact.
//
// IMPORTANT: this component MUST NOT emit any <p> or <div> elements,
// otherwise React HTML validation flags <p>-inside-<p> hydration
// errors when a parent wraps each paragraph in its own <p>.

import React from "react";

interface StoryTextProps {
  text: string;
}

// Tokenize a single line into plain + italic + bold runs.
// Pattern priority: **bold** > *italic*.
function tokenize(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const re = /(\*\*([^*]+?)\*\*|\*([^*]+?)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(line.slice(lastIndex, match.index));
    }
    const bold = match[2];
    const italic = match[3];
    if (bold) {
      tokens.push(
        <strong key={`b-${key++}`} style={{ fontWeight: 700 }}>
          {bold}
        </strong>,
      );
    } else if (italic) {
      tokens.push(
        <em
          key={`i-${key++}`}
          style={{
            fontStyle: "italic",
            fontFamily: "var(--font-heading)",
            color: "var(--accent)",
          }}
        >
          {italic}
        </em>,
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) {
    tokens.push(line.slice(lastIndex));
  }
  return tokens;
}

export function StoryText({ text }: StoryTextProps) {
  const lines = text.split(/\n/);
  return (
    <>
      {lines.map((line, j) => (
        <React.Fragment key={j}>
          {tokenize(line)}
          {j < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}
