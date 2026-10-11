import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { cn } from "@/lib/utils"

// A diagram of real components. Every `Node` is drawn by the component it
// stands for, so when React calls that component, the node finds out and
// lights up. Nothing here simulates React: the tracer only watches which
// nodes rendered in a commit, then animates what it saw.

// All sizes are in viewBox units. Diagrams are drawn 336 wide, which is about
// one unit per pixel on a phone.
export const DIAGRAM_WIDTH = 336

const TOP = 16

const ROW_PITCH = 66

const BOTTOM = 18

const NODE_HEIGHT = 24

// JetBrains Mono is 0.6em wide and labels are 10.5 units tall.
const LABEL_CHAR = 6.3

const LABEL_PAD = 8

// How far above a node its edge turns towards it.
const TURN = 14

const PACKET = 6

// One hop from a parent to its child.
const STEP_MS = 280

const FLASH_MS = 700

const SVG_NS = "http://www.w3.org/2000/svg"

const STROKE = "[vector-effect:non-scaling-stroke]"

const LIT_EDGE = `fill-none stroke-primary ${STROKE}`

export interface NodeSpec {
  id: string
  label: string
  // Centre of the box.
  x: number
  row: number
  parent?: string
  // A node that is not a component: it never reports a render, and only
  // lights up when a diagram's `extend` says so.
  silent?: true
}

// What the tracer does with one commit, in hops from the first render:
// "light" a node, let a packet "pass" along the edge into a node, or let it
// "stop" short because React bailed out there.
export type Step =
  | { kind: "light"; id: string; at: number; count: boolean }
  | { kind: "pass" | "stop"; id: string; at: number }

export interface Trace {
  // The hop at which a node rendered in this commit, if it did.
  wave: (id: string) => number | undefined
  // Whether the DOM under a watched node was written to in this commit.
  wrote: (id: string) => boolean
}

export type Extend = (trace: Trace) => ReadonlyArray<Step>

interface Box {
  x: number
  y: number
  width: number
  cx: number
}

type Point = readonly [number, number]

function boxOf(spec: NodeSpec, label = spec.label): Box {
  const width = Math.round(label.length * LABEL_CHAR) + LABEL_PAD * 2

  return {
    x: spec.x - width / 2,
    y: TOP + spec.row * ROW_PITCH,
    width,
    cx: spec.x,
  }
}

// Down from the parent, across, and down into the child.
function edgePoints(from: NodeSpec, to: NodeSpec): ReadonlyArray<Point> {
  const start: Point = [from.x, TOP + from.row * ROW_PITCH + NODE_HEIGHT]
  const end: Point = [to.x, TOP + to.row * ROW_PITCH]

  if (from.x === to.x) return [start, end]
  const turn = end[1] - TURN

  return [start, [from.x, turn], [to.x, turn], end]
}

function pathOf(points: ReadonlyArray<Point>) {
  return points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`)
    .join(" ")
}

function createTracer(layout: ReadonlyArray<NodeSpec>, extend?: Extend) {
  const specs = new Map(layout.map((spec) => [spec.id, spec]))
  const order = [...layout].sort((a, b) => a.row - b.row)
  const batch = new Set<string>()
  const counts = new Map<string, number>()
  const observers = new Map<string, MutationObserver>()
  const written = new Set<string>()
  let timers: Array<ReturnType<typeof setTimeout>> = []
  let animations: Array<Animation> = []
  let root: SVGSVGElement | null = null
  let armed = false

  const find = (id: string) => root?.querySelector(`[data-node="${id}"]`)

  const points = (id: string) => {
    const spec = specs.get(id)
    const parent = spec?.parent === undefined ? null : specs.get(spec.parent)

    return spec && parent ? edgePoints(parent, spec) : null
  }

  const clear = () => {
    timers.forEach(clearTimeout)
    animations.forEach((animation) => animation.cancel())
    timers = []
    animations = []
    root?.querySelector("[data-overlay]")?.replaceChildren()
    root
      ?.querySelectorAll("[data-lit]")
      .forEach((part) => part.removeAttribute("data-lit"))
  }

  const light = (id: string, count: boolean, still: boolean) => {
    const node = find(id)

    if (!node) return
    node
      .querySelectorAll("[data-part]")
      .forEach((part) => part.setAttribute("data-lit", ""))

    if (count) {
      const next = (counts.get(id) ?? 0) + 1
      counts.set(id, next)
      const counter = node.querySelector("[data-count]")

      if (counter) counter.textContent = `×${next}`
    }

    const flash = still ? null : node.querySelector("[data-flash]")

    if (flash) {
      animations.push(
        flash.animate([{ opacity: 0.45 }, { opacity: 0 }], {
          duration: FLASH_MS,
          easing: "ease-out",
        })
      )
    }
  }

  // Lit edges go in the overlay, on top of everything, so an unlit sibling
  // drawn later cannot cover the part of the line they share.
  const lightEdge = (id: string) => {
    const route = points(id)

    if (!route) return
    const edge = document.createElementNS(SVG_NS, "path")
    edge.setAttribute("d", pathOf(route))
    edge.setAttribute("class", LIT_EDGE)
    root?.querySelector("[data-overlay]")?.append(edge)
  }

  const travel = (id: string, delay: number, stops: boolean) => {
    const route = points(id)
    const overlay = root?.querySelector("[data-overlay]")

    if (!route || !overlay) return
    let total = 0

    const travelled = route.map(([x, y], index) => {
      if (index > 0) {
        const [fromX, fromY] = route[index - 1]
        total += Math.abs(x - fromX) + Math.abs(y - fromY)
      }

      return total
    })

    const packet = document.createElementNS(SVG_NS, "rect")
    packet.setAttribute("x", String(-PACKET / 2))
    packet.setAttribute("y", String(-PACKET / 2))
    packet.setAttribute("width", String(PACKET))
    packet.setAttribute("height", String(PACKET))
    packet.setAttribute(
      "class",
      stops ? "fill-muted-foreground opacity-0" : "fill-primary opacity-0"
    )
    overlay.append(packet)

    animations.push(
      packet.animate(
        route.map(([x, y], index) => {
          const offset = travelled[index] / total

          return {
            offset,
            transform: `translate(${x}px, ${y}px)`,
            // A packet that stops fades out on the way.
            opacity: stops ? 1 - offset * offset : 1,
          }
        }),
        { delay, duration: STEP_MS, easing: "linear" }
      )
    )
  }

  const run = (steps: ReadonlyArray<Step>) => {
    clear()
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const later = (hops: number, action: () => void) => {
      if (still || hops === 0) action()
      else timers.push(setTimeout(action, hops * STEP_MS))
    }

    for (const step of steps) {
      switch (step.kind) {
        case "light":
          later(step.at, () => light(step.id, step.count, still))
          break
        case "pass":
          later(step.at, () => lightEdge(step.id))

          if (!still) travel(step.id, step.at * STEP_MS, false)

          break
        case "stop":
          if (!still) travel(step.id, step.at * STEP_MS, true)

          break
      }
    }
  }

  const flush = () => {
    const rendered = new Set(batch)
    batch.clear()
    const waves = new Map<string, number>()
    const steps: Array<Step> = []

    for (const spec of order) {
      if (spec.silent) continue

      const from =
        spec.parent === undefined ? undefined : waves.get(spec.parent)

      if (rendered.has(spec.id)) {
        const wave = from === undefined ? 0 : from + 1
        waves.set(spec.id, wave)

        if (from !== undefined)
          steps.push({ kind: "pass", id: spec.id, at: from })
        steps.push({ kind: "light", id: spec.id, at: wave, count: true })
      } else if (from !== undefined && find(spec.id)) {
        // The parent rendered and this child did not: React bailed out.
        steps.push({ kind: "stop", id: spec.id, at: from })
      }
    }

    const extra = extend?.({
      wave: (id) => waves.get(id),
      wrote: (id) => {
        const pending = observers.get(id)?.takeRecords().length ?? 0

        return written.delete(id) || pending > 0
      },
    })

    run(extra ? [...steps, ...extra] : steps)
  }

  return {
    specs,
    attach: (element: SVGSVGElement | null) => {
      root = element
    },
    // Renders only count once the diagram is on screen, so mounting it does
    // not light everything up.
    arm: () => {
      armed = true

      return () => {
        armed = false
        clear()
      }
    },
    // Called from an effect, so once per committed render. Every report from
    // one commit lands in the same batch.
    report: (id: string) => {
      if (!armed) return

      if (batch.size === 0) queueMicrotask(flush)
      batch.add(id)
    },
    // Counts real DOM writes under `target`, which is how a node can tell
    // rendering from committing.
    watch: (id: string, target: Element) => {
      const observer = new MutationObserver(() => written.add(id))
      observer.observe(target, {
        characterData: true,
        childList: true,
        subtree: true,
      })
      observers.set(id, observer)
      const counter = find(id)?.querySelector("[data-count]")

      if (counter) counter.textContent = `×${counts.get(id) ?? 0}`

      return () => {
        observer.disconnect()
        observers.delete(id)
      }
    },
  }
}

type Tracer = ReturnType<typeof createTracer>

const TracerContext = createContext<Tracer | null>(null)

function useTracer() {
  const tracer = useContext(TracerContext)

  if (!tracer) throw new Error("Node must be rendered inside a Diagram")

  return tracer
}

function specOf(tracer: Tracer, id: string) {
  const spec = tracer.specs.get(id)

  if (!spec) throw new Error(`No node "${id}" in this diagram's layout`)

  return spec
}

export function Diagram({
  layout,
  rows,
  label,
  extend,
  className,
  children,
}: {
  // Must keep its identity between renders, like `extend`.
  layout: ReadonlyArray<NodeSpec>
  // Reserve this many rows, so two layouts can share a height.
  rows?: number
  label: string
  extend?: Extend
  className?: string
  children: React.ReactNode
}) {
  const tracer = useMemo(() => createTracer(layout, extend), [layout, extend])

  const attach = useCallback(
    (element: SVGSVGElement | null) => tracer.attach(element),
    [tracer]
  )

  useEffect(() => tracer.arm(), [tracer])

  const lastRow = Math.max((rows ?? 1) - 1, ...layout.map((spec) => spec.row))

  const height = TOP + lastRow * ROW_PITCH + NODE_HEIGHT + BOTTOM

  return (
    <svg
      ref={attach}
      role="group"
      aria-label={label}
      viewBox={`0 0 ${DIAGRAM_WIDTH} ${height}`}
      className={cn(
        "w-full max-w-[30rem] [touch-action:manipulation] font-mono select-none [shape-rendering:crispEdges]",
        className
      )}
    >
      <TracerContext value={tracer}>{children}</TracerContext>
      <g data-overlay className="pointer-events-none" />
    </svg>
  )
}

export function Node({
  id,
  label,
  held,
  note,
  side,
  memo,
  watch,
  onPress,
  children,
}: {
  id: string
  // Overrides the label from the layout.
  label?: string
  // The state this component owns, marked with a filled square.
  held?: string
  // A line under the box. Only for nodes without children: a parent's edges
  // leave from there.
  note?: string
  // A line to the right of the box, for a node that has its row to itself.
  side?: string
  // Draws the boundary a memoized component puts around itself.
  memo?: boolean
  // Count DOM writes to the label instead of renders.
  watch?: boolean
  onPress?: () => void
  children?: React.ReactNode
}) {
  const tracer = useTracer()
  const spec = specOf(tracer, id)
  const text = useRef<SVGTextElement>(null)

  // No dependency list: this runs after every render of the component that
  // drew this node, which is exactly what the diagram shows.
  useEffect(() => {
    if (!spec.silent) tracer.report(id)
  })

  useEffect(() => {
    if (!watch || !text.current) return

    return tracer.watch(id, text.current)
  }, [id, tracer, watch])

  const box = boxOf(spec, label)

  const edge =
    spec.parent === undefined
      ? null
      : pathOf(edgePoints(specOf(tracer, spec.parent), spec))

  return (
    <>
      <g
        data-node={id}
        role={onPress ? "button" : undefined}
        tabIndex={onPress ? 0 : undefined}
        onClick={onPress}
        onKeyDown={
          onPress &&
          ((event) => {
            if (event.key !== "Enter" && event.key !== " ") return
            event.preventDefault()
            onPress()
          })
        }
        className={cn("group outline-none", onPress && "cursor-pointer")}
      >
        {edge && (
          <path d={edge} className={cn("fill-none stroke-wire", STROKE)} />
        )}
        {memo && (
          <rect
            x={box.x - 3}
            y={box.y - 3}
            width={box.width + 6}
            height={NODE_HEIGHT + 6}
            className={cn(
              "fill-none stroke-wire [stroke-dasharray:3_2]",
              STROKE
            )}
          />
        )}
        <rect
          data-part
          x={box.x}
          y={box.y}
          width={box.width}
          height={NODE_HEIGHT}
          className={cn(
            "fill-background stroke-wire transition-colors data-[lit]:stroke-primary",
            STROKE,
            onPress &&
              "group-hover:fill-muted group-focus-visible:stroke-foreground"
          )}
        />
        <rect
          data-flash
          x={box.x}
          y={box.y}
          width={box.width}
          height={NODE_HEIGHT}
          className="pointer-events-none fill-primary opacity-0"
        />
        <text
          ref={text}
          data-part
          x={box.cx}
          y={box.y + 15.5}
          textAnchor="middle"
          className={cn(
            "fill-foreground text-[10.5px] transition-colors data-[lit]:fill-primary",
            onPress && "underline"
          )}
        >
          {label ?? spec.label}
        </text>
        <text
          data-part
          data-count
          x={box.x + box.width}
          y={box.y - 4}
          textAnchor="end"
          className="fill-muted-foreground text-[8.5px] transition-colors data-[lit]:fill-primary"
        />
        {held && <Held x={box.x - 3} y={box.y - 7} label={held} />}
        {side && (
          <text
            x={box.x + box.width + 8}
            y={box.y + 15.5}
            className="fill-muted-foreground text-[8.5px]"
          >
            {side}
          </text>
        )}
        {note && (
          <text
            x={box.cx}
            y={box.y + NODE_HEIGHT + 11}
            textAnchor="middle"
            className="fill-muted-foreground text-[8.5px]"
          >
            {note}
          </text>
        )}
      </g>
      {children}
    </>
  )
}

// The place of a node that is not mounted right now.
export function Slot({ id }: { id: string }) {
  const tracer = useTracer()
  const spec = specOf(tracer, id)
  const box = boxOf(spec)
  const dashed = cn("fill-none stroke-wire [stroke-dasharray:2_3]", STROKE)

  return (
    <g>
      {spec.parent !== undefined && (
        <path
          d={pathOf(edgePoints(specOf(tracer, spec.parent), spec))}
          className={dashed}
        />
      )}
      <rect
        x={box.x}
        y={box.y}
        width={box.width}
        height={NODE_HEIGHT}
        className={dashed}
      />
      <text
        x={box.cx}
        y={box.y + 15.5}
        textAnchor="middle"
        className="fill-muted-foreground/60 text-[10.5px]"
      >
        {spec.label}
      </text>
    </g>
  )
}

// A value a component keeps between renders, drawn as a square with a label
// to its right. Filled is state, hollow is a ref: only one of them tells
// React to render. `x` and `y` are the middle of the square's left side.
export function Held({
  x,
  y,
  label,
  hollow,
  ref,
}: {
  x: number
  y: number
  label: string
  hollow?: boolean
  ref?: React.Ref<SVGTextElement>
}) {
  return (
    <>
      <rect
        x={x}
        y={y - 3}
        width={6}
        height={6}
        className={cn(
          "stroke-primary",
          STROKE,
          hollow ? "fill-background" : "fill-primary"
        )}
      />
      <text ref={ref} x={x + 9} y={y + 3} className="fill-primary text-[8.5px]">
        {label}
      </text>
    </>
  )
}
