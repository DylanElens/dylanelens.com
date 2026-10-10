import type { SectionId } from "@/content"
import { cn } from "@/lib/utils"

export function Prompt({ children }: { children?: React.ReactNode }) {
  return (
    <span aria-hidden>
      <span className="text-muted-foreground">~</span>{" "}
      <span className="text-primary">$</span> {children}
    </span>
  )
}

export function Cursor() {
  return (
    <span
      aria-hidden
      className="inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] animate-blink bg-primary motion-reduce:animate-none"
    />
  )
}

export function Section({
  id,
  index,
  label,
  children,
}: {
  id: SectionId
  index: number
  label: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="grid scroll-mt-11 border-t md:grid-cols-[13rem_minmax(0,1fr)]"
    >
      <div className="px-5 pt-8 md:border-r md:px-8 md:py-12">
        <h2
          id={`${id}-heading`}
          className="flex gap-3 text-xs font-normal tracking-widest uppercase md:sticky md:top-20"
        >
          <span className="text-primary tabular-nums">
            {String(index).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground">{label}</span>
        </h2>
      </div>
      <div className="min-w-0 px-5 pt-5 pb-10 md:px-8 md:py-12">
        <div className="max-w-5xl">{children}</div>
      </div>
    </section>
  )
}

export function ExternalLink({
  className,
  children,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      className={cn(
        "underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary",
        className
      )}
      {...props}
    >
      {children}
      <span aria-hidden className="ml-1 text-muted-foreground">
        ↗
      </span>
    </a>
  )
}

export function Prose({ paragraphs }: { paragraphs: ReadonlyArray<string> }) {
  return (
    <div className="flex max-w-[68ch] flex-col gap-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}
