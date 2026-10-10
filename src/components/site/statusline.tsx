import type { Content, Locale, SectionId } from "@/content"
import type { ScrollPosition } from "@/hooks/use-scroll-spy"
import { Kbd } from "@/components/ui/kbd"

function formatPosition(position: ScrollPosition, ui: Content["ui"]) {
  if (position === "top") return ui.top
  if (position === "bottom") return ui.bottom
  return `${position}%`
}

// A vim-style statusline pinned to the bottom: where you are on the page, and
// which keys move you around.
export function Statusline({
  locale,
  content,
  active,
  position,
}: {
  locale: Locale
  content: Content
  active: SectionId | null
  position: ScrollPosition
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex h-7 items-stretch border-t bg-card text-[11px] leading-none">
      <span className="flex items-center bg-primary px-2.5 font-semibold text-primary-foreground">
        NORMAL
      </span>
      <span className="flex min-w-0 items-center truncate px-2.5 text-muted-foreground">
        dylanelens.com
        {active && <span className="text-foreground">/#{active}</span>}
      </span>

      <div
        aria-hidden
        className="ml-auto hidden items-center gap-4 px-2.5 text-muted-foreground lg:flex"
      >
        {content.ui.hints.map((hint) => (
          <span key={hint.label} className="flex items-center gap-1.5">
            {hint.keys.map((key) => (
              <Kbd key={key} className="h-4 min-w-4 font-mono text-[10px]">
                {key}
              </Kbd>
            ))}
            {hint.label}
          </span>
        ))}
      </div>

      <span className="ml-auto flex items-center border-l px-2.5 text-muted-foreground uppercase lg:ml-0">
        {locale}
      </span>
      <span className="flex w-12 items-center justify-center border-l text-foreground tabular-nums">
        {formatPosition(position, content.ui)}
      </span>
    </div>
  )
}
