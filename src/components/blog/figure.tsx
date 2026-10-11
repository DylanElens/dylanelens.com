import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// The frame around a live example: controls on top, the example itself, and
// a caption with a reset underneath.
export function Figure({
  controls,
  caption,
  reset,
  onReset,
  className,
  children,
}: {
  controls?: React.ReactNode
  caption: React.ReactNode
  reset: string
  onReset: () => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <figure className={cn("border bg-card text-xs", className)}>
      {controls && (
        <div className="flex flex-wrap items-center gap-2 border-b p-3 sm:px-5">
          {controls}
        </div>
      )}
      {children}
      <figcaption className="flex items-start justify-between gap-4 border-t p-3 text-muted-foreground sm:px-5">
        <span className="max-w-[68ch]">{caption}</span>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 transition-colors hover:text-foreground"
        >
          [{reset}]
        </button>
      </figcaption>
    </figure>
  )
}

// Where a diagram sits inside a figure.
export function Stage({ children }: { children: React.ReactNode }) {
  return <div className="p-2 sm:p-5">{children}</div>
}

// Code and the thing it does, next to each other. On a phone the diagram
// comes first, because that is the part you touch.
export function Split({
  code,
  children,
}: {
  code: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid lg:grid-cols-2">
      <div className="order-2 min-w-0 border-t lg:order-1 lg:border-t-0 lg:border-r">
        {code}
      </div>
      <div className="order-1 min-w-0 lg:order-2">{children}</div>
    </div>
  )
}

// Pick one of a few variants.
export function Choice<TId extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: TId
  options: ReadonlyArray<{ id: TId; label: string }>
  onChange: (id: TId) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option.id}
          size="sm"
          variant={option.id === value ? "default" : "outline"}
          aria-pressed={option.id === value}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

// A checkbox, drawn the way a terminal draws one.
export function Check({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
}) {
  return (
    <Button
      size="sm"
      variant="outline"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
    >
      <span className={checked ? "text-primary" : "text-muted-foreground"}>
        {checked ? "[x]" : "[ ]"}
      </span>
      {children}
    </Button>
  )
}
