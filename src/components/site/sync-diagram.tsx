import { useEffect, useReducer } from "react"
import type { Content } from "@/content"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const OUTBOX_CAPACITY = 8

const SEND_DELAY_MS = 150

// Keep in sync with --animate-packet in styles.css.
const TRANSIT_MS = 500

const LOG_LINES = 4

const INITIAL_ROWS = 3

// A visit runs from check-in to check-out. The app is offline for all of it
// and only talks to the backend while checking out.
type Phase = "idle" | "visit" | "syncing"

type LogEvent =
  | { kind: "checkIn" | "checkOutEmpty" | "done" }
  | { kind: "checkOut"; count: number }
  | { kind: "write" | "ack"; op: number }

interface SyncState {
  phase: Phase
  nextOp: number
  outbox: ReadonlyArray<number>
  inFlight: number | null
  localRows: number
  serverRows: number
  log: ReadonlyArray<LogEvent & { seq: number }>
  logSeq: number
}

type SyncAction =
  | { type: "check-in" }
  | { type: "write" }
  | { type: "check-out" }
  | { type: "send" }
  | { type: "ack" }

const initialState: SyncState = {
  phase: "idle",
  nextOp: INITIAL_ROWS + 1,
  outbox: [],
  inFlight: null,
  localRows: INITIAL_ROWS,
  serverRows: INITIAL_ROWS,
  log: [],
  logSeq: 0,
}

function withLog(state: SyncState, ...events: Array<LogEvent>): SyncState {
  const entries = events.map((event, index) => ({
    ...event,
    seq: state.logSeq + index,
  }))

  return {
    ...state,
    log: [...state.log, ...entries].slice(-LOG_LINES),
    logSeq: state.logSeq + events.length,
  }
}

function reduce(state: SyncState, action: SyncAction): SyncState {
  switch (action.type) {
    case "check-in": {
      if (state.phase !== "idle") return state

      return withLog({ ...state, phase: "visit" }, { kind: "checkIn" })
    }

    // Writes only ever touch the local store; the network is not on this path.
    case "write": {
      if (state.phase !== "visit") return state

      if (state.outbox.length >= OUTBOX_CAPACITY) return state
      const op = state.nextOp

      return withLog(
        {
          ...state,
          nextOp: op + 1,
          localRows: state.localRows + 1,
          outbox: [...state.outbox, op],
        },
        { kind: "write", op }
      )
    }

    case "check-out": {
      if (state.phase !== "visit") return state

      if (state.outbox.length === 0) {
        return withLog({ ...state, phase: "idle" }, { kind: "checkOutEmpty" })
      }

      return withLog(
        { ...state, phase: "syncing" },
        { kind: "checkOut", count: state.outbox.length }
      )
    }

    case "send": {
      if (state.phase !== "syncing" || state.inFlight !== null) return state

      if (state.outbox.length === 0) return state
      const [op, ...rest] = state.outbox

      return { ...state, inFlight: op, outbox: rest }
    }

    case "ack": {
      if (state.inFlight === null) return state

      const acked = {
        ...state,
        inFlight: null,
        serverRows: state.serverRows + 1,
      }

      const event = { kind: "ack", op: state.inFlight } as const

      if (state.outbox.length > 0) return withLog(acked, event)

      return withLog({ ...acked, phase: "idle" }, event, { kind: "done" })
    }
  }
}

type DiagramCopy = Content["frontline"]["diagram"]

function formatLog(event: LogEvent, copy: DiagramCopy): string {
  switch (event.kind) {
    case "write":
    case "ack":
      return copy.log[event.kind](event.op)
    case "checkOut":
      return copy.log.checkOut(event.count)
    default:
      return copy.log[event.kind]
  }
}

const wireStyles: Record<Phase, { line: string; label: string }> = {
  idle: { line: "border-foreground/40", label: "text-muted-foreground" },
  visit: { line: "border-foreground/15", label: "text-foreground" },
  syncing: { line: "border-primary", label: "text-primary" },
}

export function SyncDiagram({ copy }: { copy: DiagramCopy }) {
  const [state, dispatch] = useReducer(reduce, initialState)
  const { phase, outbox, inFlight, localRows, serverRows, log } = state

  const readyToSend =
    phase === "syncing" && inFlight === null && outbox.length > 0

  useEffect(() => {
    if (!readyToSend) return
    const timer = setTimeout(() => dispatch({ type: "send" }), SEND_DELAY_MS)

    return () => clearTimeout(timer)
  }, [readyToSend])

  useEffect(() => {
    if (inFlight === null) return
    const timer = setTimeout(() => dispatch({ type: "ack" }), TRANSIT_MS)

    return () => clearTimeout(timer)
  }, [inFlight])

  const behind = localRows - serverRows
  const wire = wireStyles[phase]

  return (
    <figure className="border bg-card text-xs">
      <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] p-3 sm:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] sm:p-5">
        <Node title={copy.tablet}>
          <Stat label={copy.localStore} value={copy.rows(localRows)} />
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground">{copy.outbox}</span>
            <div
              className="flex flex-wrap gap-1"
              role="img"
              aria-label={`${copy.outbox}: ${outbox.length}/${OUTBOX_CAPACITY}`}
            >
              {Array.from({ length: OUTBOX_CAPACITY }, (_, slot) => (
                <span
                  key={slot}
                  className={cn(
                    "size-2 border transition-colors",
                    slot < outbox.length
                      ? "border-primary bg-primary"
                      : "border-foreground/25"
                  )}
                />
              ))}
            </div>
          </div>
        </Node>

        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className={cn(
              "relative w-full border-t border-dashed transition-colors",
              wire.line
            )}
          >
            {inFlight !== null && (
              <span
                key={inFlight}
                className="absolute -top-1 -ml-1 size-2 animate-packet bg-primary motion-reduce:left-1/2 motion-reduce:animate-none"
              />
            )}
            {phase === "visit" && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-1 leading-none text-muted-foreground">
                ×
              </span>
            )}
          </div>
          <span className={wire.label}>{copy.phase[phase]}</span>
        </div>

        <Node title={copy.backend}>
          <Stat label={copy.database} value={copy.rows(serverRows)} />
          <span
            className={behind === 0 ? "text-primary" : "text-muted-foreground"}
          >
            {behind === 0 ? `✓ ${copy.inSync}` : copy.behind(behind)}
          </span>
        </Node>
      </div>

      <div className="flex flex-wrap gap-2 border-t p-3 sm:px-5">
        <Button
          size="sm"
          disabled={phase === "syncing"}
          onClick={() =>
            dispatch({ type: phase === "idle" ? "check-in" : "check-out" })
          }
        >
          {phase === "idle" ? copy.checkIn : copy.checkOut}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={phase !== "visit" || outbox.length >= OUTBOX_CAPACITY}
          onClick={() => dispatch({ type: "write" })}
        >
          + {copy.write}
        </Button>
      </div>

      <ol
        aria-label={copy.logLabel}
        aria-live="polite"
        className="flex h-24 flex-col justify-end gap-0.5 overflow-hidden border-t p-3 text-muted-foreground sm:px-5"
      >
        {log.length === 0 && <li>{copy.logEmpty}</li>}
        {log.map((event, index) => (
          <li
            key={event.seq}
            className={cn(
              "truncate",
              index === log.length - 1 && "text-foreground"
            )}
          >
            <span className="text-primary">›</span> {formatLog(event, copy)}
          </li>
        ))}
      </ol>

      <figcaption className="border-t p-3 text-muted-foreground sm:px-5">
        {copy.caption}
      </figcaption>
    </figure>
  )
}

function Node({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border bg-background p-3">
      <span className="tracking-widest text-muted-foreground uppercase">
        {title}
      </span>
      {children}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}
