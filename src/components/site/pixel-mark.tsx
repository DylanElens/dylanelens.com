import { cn } from "@/lib/utils"

const CELL = 10

// How much later each row starts when the cells are animated, so a wave runs
// from the top of the mark to the bottom.
const ROW_DELAY_MS = 90

// A mark drawn the way a fetch tool draws a distro logo: one block per cell.
// "#" is foreground, "@" is the accent. `cellClassName` goes on the "#" cells,
// which is where an animation belongs.
export function PixelMark({
  rows,
  className,
  cellClassName,
}: {
  rows: ReadonlyArray<string>
  className?: string
  cellClassName?: string
}) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${rows[0].length * CELL} ${rows.length * CELL}`}
      className={cn("shrink-0", className)}
    >
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x * CELL}
              y={y * CELL}
              width={CELL - 1}
              height={CELL - 1}
              style={{ animationDelay: `${y * ROW_DELAY_MS}ms` }}
              className={
                cell === "@"
                  ? "fill-primary"
                  : cn("fill-foreground", cellClassName)
              }
            />
          )
        )
      )}
    </svg>
  )
}
