import { useEffect, useState } from "react"

export const HEADER_HEIGHT_PX = 44

// Sections count as "current" once their top edge passes this line, which
// sits just below the sticky header.
const SCROLL_OFFSET_PX = HEADER_HEIGHT_PX + 20

export type ScrollPosition = "top" | "bottom" | number

export interface ScrollSpy<TId extends string> {
  active: TId | null
  position: ScrollPosition
}

function readPosition(): ScrollPosition {
  const { scrollHeight, clientHeight } = document.documentElement
  const max = scrollHeight - clientHeight

  if (max <= 0 || window.scrollY <= 0) return "top"

  if (isAtBottom()) return "bottom"

  return Math.round((window.scrollY / max) * 100)
}

function isAtBottom() {
  const { scrollHeight, clientHeight } = document.documentElement

  return (
    scrollHeight > clientHeight &&
    window.scrollY >= scrollHeight - clientHeight - 1
  )
}

function currentSectionIndex(ids: ReadonlyArray<string>): number {
  // A short last section never reaches the header line, so the end of the
  // page always belongs to it.
  if (isAtBottom()) return ids.length - 1

  let current = -1
  ids.forEach((id, index) => {
    const top = document.getElementById(id)?.getBoundingClientRect().top

    if (top !== undefined && top <= SCROLL_OFFSET_PX) current = index
  })

  return current
}

export function useScrollSpy<TId extends string>(
  ids: ReadonlyArray<TId>
): ScrollSpy<TId> {
  const [spy, setSpy] = useState<ScrollSpy<TId>>({
    active: null,
    position: "top",
  })

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const active = ids[currentSectionIndex(ids)] ?? null
      const position = readPosition()
      setSpy((previous) =>
        previous.active === active && previous.position === position
          ? previous
          : { active, position }
      )
    }

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [ids])

  return spy
}
