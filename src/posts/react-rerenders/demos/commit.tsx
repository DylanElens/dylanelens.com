import { useState } from "react"
import { samples } from "../samples"
import { useDemo } from "./use-demo"
import { Code } from "@/components/blog/code"
import { Diagram, Node } from "@/components/blog/diagram"
import type { Extend, NodeSpec, Step } from "@/components/blog/diagram"
import { Figure, Split, Stage } from "@/components/blog/figure"

const layout: ReadonlyArray<NodeSpec> = [
  { id: "counter", label: "Counter", x: 168, row: 0 },
  { id: "value", label: "Value", x: 84, row: 1, parent: "counter" },
  { id: "label", label: "Label", x: 244, row: 1, parent: "counter" },
  {
    id: "valueDiff",
    label: "diff",
    x: 84,
    row: 2,
    parent: "value",
    silent: true,
  },
  {
    id: "labelDiff",
    label: "diff",
    x: 244,
    row: 2,
    parent: "label",
    silent: true,
  },
  {
    id: "valueDom",
    label: "",
    x: 84,
    row: 3,
    parent: "valueDiff",
    silent: true,
  },
  {
    id: "labelDom",
    label: "",
    x: 244,
    row: 3,
    parent: "labelDiff",
    silent: true,
  },
]

const lanes = [
  { component: "value", diff: "valueDiff", dom: "valueDom" },
  { component: "label", diff: "labelDiff", dom: "labelDom" },
]

// What React does after calling a component: compare the result with the
// previous one, and only write to the DOM when they differ. The diff always
// happens. Whether the write happened is read from the real DOM.
const extend: Extend = (trace) =>
  lanes.flatMap((lane): Array<Step> => {
    const wave = trace.wave(lane.component)

    if (wave === undefined) return []

    const compared: Array<Step> = [
      { kind: "pass", id: lane.diff, at: wave },
      { kind: "light", id: lane.diff, at: wave + 1, count: false },
    ]

    if (!trace.wrote(lane.dom)) {
      return [...compared, { kind: "stop", id: lane.dom, at: wave + 1 }]
    }

    return [
      ...compared,
      { kind: "pass", id: lane.dom, at: wave + 1 },
      { kind: "light", id: lane.dom, at: wave + 2, count: true },
    ]
  })

function Counter({ dom }: { dom: string }) {
  const [count, setCount] = useState(0)

  return (
    <Node id="counter" held="count" onPress={() => setCount(count + 1)}>
      <Value count={count} dom={dom} />
      <Label dom={dom} />
    </Node>
  )
}

// Its output depends on the count, so every render changes the DOM.
function Value({ count, dom }: { count: number; dom: string }) {
  return (
    <Node id="value">
      <Node id="valueDiff" />
      <Node id="valueDom" watch label={`<b>${count}</b>`} note={dom} />
    </Node>
  )
}

// Its output is always the same. It renders anyway, because its parent did.
function Label({ dom }: { dom: string }) {
  return (
    <Node id="label">
      <Node id="labelDiff" />
      <Node id="labelDom" watch label="<span>Clicks</span>" note={dom} />
    </Node>
  )
}

export function CommitDemo() {
  const { copy, run, frame } = useDemo("commit")

  return (
    <Figure caption={copy.caption} {...frame}>
      <Split code={<Code bare>{samples.commit}</Code>}>
        <Stage>
          <Diagram key={run} layout={layout} extend={extend} label={copy.label}>
            <Counter dom={copy.dom} />
          </Diagram>
        </Stage>
      </Split>
    </Figure>
  )
}
