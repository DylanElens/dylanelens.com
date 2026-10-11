import { cn } from "@/lib/utils"

// End a line with this to mark it. The marker itself is not shown.
const MARK = /\s*\/\/!$/

const COMMENT = /^(.*?)((?:^|\s)\/\/.*)$/

// A code sample. There is no syntax colouring: marked lines carry the accent
// and the rest steps back, so the eye lands on the line that matters.
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
  const lines = children
    .replace(/^\n+|\s+$/g, "")
    .split("\n")
    .map((line) => ({
      text: line.replace(MARK, ""),
      marked: MARK.test(line),
    }))

  const focused = lines.some((line) => line.marked)

  return (
    <pre
      className={cn(
        "overflow-x-auto py-3 text-xs leading-relaxed",
        !bare && "max-w-[80ch] border bg-card",
        className
      )}
    >
      <code className="grid min-w-max">
        {lines.map((line, index) => {
          const [, code = line.text, comment = ""] =
            COMMENT.exec(line.text) ?? []

          return (
            <span
              // Lines never move within one sample.
              key={index}
              className={cn(
                "px-3 sm:px-5",
                line.marked && "bg-primary/10 text-foreground",
                focused && !line.marked && "text-muted-foreground"
              )}
            >
              {code}
              <span className="text-muted-foreground">{comment}</span>
              {"\n"}
            </span>
          )
        })}
      </code>
    </pre>
  )
}
