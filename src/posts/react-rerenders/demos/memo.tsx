import { memo, useCallback, useMemo, useState } from "react"
import { memoSample } from "../samples"
import type { MemoConfig } from "../samples"
import { useDemo } from "./use-demo"
import { Code } from "@/components/blog/code"
import { Diagram, Node, Slot } from "@/components/blog/diagram"
import type { NodeSpec } from "@/components/blog/diagram"
import { Check, Figure, Split, Stage } from "@/components/blog/figure"
import { cn } from "@/lib/utils"

const layout: ReadonlyArray<NodeSpec> = [
  { id: "screen", label: "AccountScreen", x: 168, row: 0 },
  { id: "button", label: "Button", x: 31, row: 1, parent: "screen" },
  { id: "modal", label: "EditModal", x: 99, row: 1, parent: "screen" },
  { id: "overview", label: "Overview", x: 203, row: 1, parent: "screen" },
  { id: "feed", label: "Feed", x: 298, row: 1, parent: "screen" },
  { id: "stats", label: "Stats", x: 170, row: 2, parent: "overview" },
  { id: "chart", label: "Chart", x: 236, row: 2, parent: "overview" },
]

interface OverviewProps {
  account: { name: string }
  filters: { status: string }
  onSelect: (id: string) => void
}

const account = { name: "Dylan" }

function openAccount(_id: string) {}

function Overview(_props: OverviewProps) {
  return (
    <Node id="overview">
      <Node id="stats" />
      <Node id="chart" />
    </Node>
  )
}

// The same component behind memo: React compares the three props with the
// previous ones and skips the whole subtree when none of them changed.
const MemoOverview = memo(function MemoOverview(_props: OverviewProps) {
  return (
    <Node id="overview" label="memo(Overview)" memo>
      <Node id="stats" />
      <Node id="chart" />
    </Node>
  )
})

function AccountScreen({
  config,
  press,
}: {
  config: MemoConfig
  press: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const stableFilters = useMemo(() => ({ status: "active" }), [])
  const stableSelect = useCallback((id: string) => openAccount(id), [])
  const Body = config.memo ? MemoOverview : Overview

  return (
    <Node id="screen" held="isOpen">
      <Node id="button" note={press} onPress={() => setIsOpen(!isOpen)} />
      {isOpen ? <Node id="modal" /> : <Slot id="modal" />}
      <Body
        account={account}
        // Without the hook, each of these is a new value on every render.
        filters={config.filters ? stableFilters : { status: "active" }}
        onSelect={config.onSelect ? stableSelect : (id) => openAccount(id)}
      />
      <Node id="feed" />
    </Node>
  )
}

export function MemoDemo() {
  const { copy, run, frame } = useDemo("memo")

  const [config, setConfig] = useState<MemoConfig>({
    memo: false,
    filters: false,
    onSelect: false,
  })

  const stable = config.filters && config.onSelect

  const props = [
    { name: "account", stable: true },
    { name: "filters", stable: config.filters },
    { name: "onSelect", stable: config.onSelect },
  ]

  return (
    <Figure
      caption={copy.caption}
      controls={
        <>
          <Check
            checked={config.memo}
            onChange={(on) => setConfig({ ...config, memo: on })}
          >
            memo(Overview)
          </Check>
          <Check
            checked={config.filters}
            onChange={(on) => setConfig({ ...config, filters: on })}
          >
            useMemo filters
          </Check>
          <Check
            checked={config.onSelect}
            onChange={(on) => setConfig({ ...config, onSelect: on })}
          >
            useCallback onSelect
          </Check>
        </>
      }
      {...frame}
    >
      <Split code={<Code bare>{memoSample(config)}</Code>}>
        <Stage>
          <Diagram
            key={`${config.memo}-${config.filters}-${config.onSelect}-${run}`}
            layout={layout}
            label={copy.label}
          >
            <AccountScreen config={config} press={copy.press} />
          </Diagram>
          <dl className="grid max-w-[30rem] grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 border-t border-dashed px-1 pt-3">
            <dt className="col-span-2 text-muted-foreground">{copy.passes}</dt>
            {props.map((prop) => (
              <div
                key={prop.name}
                className="col-span-2 grid grid-cols-subgrid"
              >
                <dt>{prop.name}</dt>
                <dd className={cn(prop.stable && "text-muted-foreground")}>
                  {prop.stable ? copy.same : copy.fresh}
                </dd>
              </div>
            ))}
            <dd
              className={cn(
                "col-span-2 pt-2",
                config.memo && stable && "text-primary"
              )}
            >
              {config.memo ? (stable ? copy.works : copy.broken) : copy.plain}
            </dd>
          </dl>
        </Stage>
      </Split>
    </Figure>
  )
}
