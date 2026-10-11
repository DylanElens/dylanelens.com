import { cn } from "@/lib/utils"

const INLINE_CODE =
  "[&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.92em]"

// Running text in a post. Plain elements inside get the site's type: capped
// line length, inline code on a tint, underlined links.
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex max-w-[68ch] flex-col gap-4",
        INLINE_CODE,
        "[&_a]:underline [&_a]:decoration-foreground/30 [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-primary hover:[&_a]:decoration-primary",
        "[&_ol]:flex [&_ol]:list-inside [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-1 [&_ol]:marker:text-primary"
      )}
    >
      {children}
    </div>
  )
}

// One line that carries a section, set larger than the text around it.
export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-[34ch] text-xl leading-snug text-balance md:text-2xl">
      {children}
    </p>
  )
}

// A list of short points, marked the way the experience timeline marks them.
export function Points({ children }: { children: React.ReactNode }) {
  return (
    <ul className={cn("flex max-w-[68ch] flex-col gap-1.5", INLINE_CODE)}>
      {children}
    </ul>
  )
}

export function Point({ children }: { children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[1rem_minmax(0,1fr)]">
      <span aria-hidden className="text-primary">
        +
      </span>
      <span>{children}</span>
    </li>
  )
}
