"use client";

// Renders a memory story string with proper italic styling for chat
// quotes wrapped in *asterisks*, **double-asterisks** for strong, and
// preserves paragraph breaks. Replaces the prior naive "show as text"
// approach where users saw literal stars.

import React from "react";

interface StoryTextProps {
  text: string;
  /** Tailwind/inline base style applied to the wrapping container. */
  style?: React.CSSProperties;
  /** Style applied to italic chat quote spans. */
  italicStyle?: React.CSSProperties;
}

// Tokenize a single line into plain + italic + bold runs.
// Pattern priority: **bold** > *italic*. Newlines split paragraphs.
function tokenize(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  // Match either **...** or *...*
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
          className="memory-quote"
          style={{ fontStyle: "italic" }}
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

export function StoryText({ text, style, italicStyle }: StoryTextProps) {
  // Split into paragraphs on \n\n; lines on single \n become <br>.
  const paragraphs = text.split(/\n\n+/);
  return (
    <div
      style={style}
      className="memory-story"
      // Inject inline rules for the italic chat quote color via a
      // scoped style child — tags inside dangerouslySetInnerHTML are
      // tricky, but we want this to inherit properly.
    >
      <style jsx>{`
        .memory-story :global(.memory-quote) {
          color: var(--accent);
          font-family: var(--font-heading);
          font-style: italic;
        }
      `}</style>
      {paragraphs.map((para, i) => {
        const lines = para.split(/\n/);
        return (
          <p
            key={i}
            style={{
              margin: 0,
              marginBottom: i < paragraphs.length - 1 ? "0.85em" : 0,
              ...(italicStyle ? {} : {}),
            }}
          >
            {lines.map((line, j) => (
              <React.Fragment key={j}>
                {tokenize(line)}
                {j < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
