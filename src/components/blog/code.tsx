import { parse } from "sugar-high/core"
import type { TokenType } from "sugar-high/core"
import { tokenize } from "sugar-high/lang/javascript"

import { cn } from "@/lib/utils"

// End a line with this to mark it. The marker itself is not shown.
const MARK = /\s*\/\/!$/

// Samples are JavaScript and JSX. The preset takes no options of its own.
const javascript = { tokenize: (code: string) => tokenize(code, undefined) }

// The syntax colours are gruvbox, see styles.css. Punctuation and comments
// step back to grey.
const TONE: Partial<Record<TokenType, string>> = {
  keyword: "text-code-keyword",
  entity: "text-code-name",
  class: "text-code-name",
  string: "text-code-string",
  property: "text-code-property",
  sign: "text-muted-foreground",
  comment: "text-muted-foreground",
}

// A code sample. The accent is kept for marked lines, and the rest steps
// back, so the eye lands on the line that matters.
export function Code({
  children,
  bare,
  className,
}: {
  children: string
  // Inside a figure, which already draws the box.
  bare?: boolean
  className?: string
}) {
  const source = children.replace(/^\n+|\s+$/g, "").split("\n")
  const marks = source.map((line) => MARK.test(line))
  const focused = marks.some(Boolean)

  // Parsed as one piece, so JSX and strings that span lines stay intact.
  const lines = parse(
    source.map((line) => line.replace(MARK, "")).join("\n"),
    javascript
  ).lines

  return (
    <pre
      className={cn(
        "overflow-x-auto py-3 text-xs leading-relaxed",
        !bare && "max-w-[80ch] border bg-card",
        className
      )}
    >
      <code className="grid min-w-max">
        {lines.map((line) => (
          <span
            // Lines never move within one sample.
            key={line.index}
            className={cn(
              "px-3 sm:px-5",
              marks[line.index] && "bg-primary/10",
              focused && !marks[line.index] && "opacity-60"
            )}
          >
            {line.tokens.map((token, index) => (
              // Nor do tokens within a line.
              <span key={index} className={TONE[token.type]}>
                {token.value}
              </span>
            ))}
            {"\n"}
          </span>
        ))}
      </code>
    </pre>
  )
}
