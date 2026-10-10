import { useEffect } from "react"
import { HEADER_HEIGHT_PX } from "./use-scroll-spy"
import { toggleTheme } from "@/lib/theme"

const DOUBLE_TAP_MS = 500

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  )
}

// Scroll positions worth stopping at: the top, the start of every section,
// and the bottom. Sections near the end are clamped, since they can never
// reach the header on a tall screen.
function scrollStops(ids: ReadonlyArray<string>) {
  const max = document.documentElement.scrollHeight - window.innerHeight

  const starts = ids.flatMap((id) => {
    const top = document.getElementById(id)?.getBoundingClientRect().top

    if (top === undefined) return []

    return [Math.min(top + window.scrollY - HEADER_HEIGHT_PX, max)]
  })

  return [0, ...starts, max]
}

function stepSection(ids: ReadonlyArray<string>, direction: 1 | -1) {
  const stops = scrollStops(ids)

  const target =
    direction === 1
      ? stops.find((stop) => stop > window.scrollY + 1)
      : stops.reverse().find((stop) => stop < window.scrollY - 1)

  if (target !== undefined) window.scrollTo({ top: target })
}

// j/k step through sections, gg/G jump to the ends, t and l toggle theme and
// language. The same keys as the hints in the statusline.
export function useVimKeys(
  ids: ReadonlyArray<string>,
  onToggleLocale: () => void
) {
  useEffect(() => {
    let lastG = -Infinity

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return

      if (isTyping(event.target)) return

      switch (event.key) {
        case "j":
          stepSection(ids, 1)
          break
        case "k":
          stepSection(ids, -1)
          break
        case "g":
          if (event.timeStamp - lastG < DOUBLE_TAP_MS) {
            window.scrollTo({ top: 0 })
            lastG = -Infinity
          } else {
            lastG = event.timeStamp
          }

          break
        case "G":
          window.scrollTo({ top: document.documentElement.scrollHeight })
          break
        case "t":
          toggleTheme()
          break
        case "l":
          onToggleLocale()
          break
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => window.removeEventListener("keydown", onKeyDown)
  }, [ids, onToggleLocale])
}
