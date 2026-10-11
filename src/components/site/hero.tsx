import { PixelMark } from "./pixel-mark"
import { Cursor, Prompt } from "./primitives"
import type { Content } from "@/content"

// The site's mark: a "d" and a cursor.
const MARK = [
  "....#.....",
  "....#.....",
  "....#.....",
  ".####..@@@",
  "#...#..@@@",
  "#...#..@@@",
  "#...#..@@@",
  "#...#..@@@",
  ".####..@@@",
]

const swatches = [
  "bg-background",
  "bg-muted",
  "bg-muted-foreground",
  "bg-foreground",
  "bg-primary",
  "bg-destructive",
]

export function Hero({ content }: { content: Content }) {
  const { hero } = content

  return (
    <div
      id="top"
      className="flex scroll-mt-11 flex-col gap-8 px-5 py-10 md:px-8 md:py-14"
    >
      <p>
        <Prompt>fastfetch</Prompt>
      </p>

      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
        <PixelMark rows={MARK} className="w-32 md:w-40" />
        <div className="flex flex-col gap-3">
          <p>
            <span className="text-primary">dylan</span>
            <span className="text-muted-foreground">@</span>
            <span className="text-primary">deventer</span>
          </p>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 border-t border-dashed pt-3">
            {hero.facts.map((fact) => (
              <div key={fact.key} className="col-span-2 grid grid-cols-subgrid">
                <dt className="text-primary">{fact.key}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div aria-hidden className="flex">
            {swatches.map((swatch) => (
              <span key={swatch} className={`h-3 w-5 border-y ${swatch}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex max-w-[60ch] flex-col gap-2">
        <h1 className="text-xl font-medium md:text-2xl">{hero.greeting}</h1>
        <p className="text-base text-muted-foreground">{hero.tagline}</p>
      </div>

      <p>
        <Prompt>
          <Cursor />
        </Prompt>
      </p>
    </div>
  )
}
