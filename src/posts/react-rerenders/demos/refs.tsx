import { useRef, useState } from "react"
import { samples } from "../samples"
import { useDemo } from "./use-demo"
import { Code } from "@/components/blog/code"
import { Diagram, Held, Node } from "@/components/blog/diagram"
import type { NodeSpec } from "@/components/blog/diagram"
import { Figure, Split, Stage } from "@/components/blog/figure"

const layout: ReadonlyArray<NodeSpec> = [
  { id: "counter", label: "Counter", x: 168, row: 0 },
  { id: "state", label: "StateButton", x: 58, row: 1, parent: "counter" },
  { id: "ref", label: "RefButton", x: 168, row: 1, parent: "counter" },
  { id: "screen", label: "Screen", x: 278, row: 1, parent: "counter" },
]

// The two values sit level with the middle of the Counter box: state on its
// left, the ref on its right.
const STATE_X = 68

const REF_X = 206

const VALUES_Y = 28

function Counter() {
  const [count, setCount] = useState(0)
  const clicks = useRef(0)
  const actual = useRef<SVGTextElement>(null)

  const bumpRef = () => {
    clicks.current += 1

    // Nothing renders after this, so the diagram has to be told by hand.
    // That is the other thing refs are for: reaching into the DOM.
    if (!actual.current) return
    actual.current.textContent = `clicks.current = ${clicks.current}`
    actual.current.animate([{ opacity: 0.2 }, { opacity: 1 }], 400)
  }

  // Reading a ref while rendering is the mistake this example is here to
  // show, so the linter is right and is overruled.
  // oxlint-disable-next-line react/refs
  const stale = clicks.current

  return (
    <Node id="counter">
      <Held x={STATE_X} y={VALUES_Y} label={`count = ${count}`} />
      <Held
        hollow
        ref={actual}
        x={REF_X}
        y={VALUES_Y}
        label={`clicks.current = ${stale}`}
      />
      <Node
        id="state"
        note="setCount(count + 1)"
        onPress={() => setCount(count + 1)}
      />
      <Node id="ref" note="clicks.current += 1" onPress={bumpRef} />
      <Screen count={count} clicks={stale} />
    </Node>
  )
}

// Shows what it was given the last time it rendered.
function Screen({ count, clicks }: { count: number; clicks: number }) {
  return <Node id="screen" note={`count ${count} · clicks ${clicks}`} />
}

export function RefsDemo() {
  const { copy, run, frame } = useDemo("refs")

  return (
    <Figure caption={copy.caption} {...frame}>
      <Split code={<Code bare>{samples.refs}</Code>}>
        <Stage>
          <Diagram key={run} layout={layout} label={copy.label}>
            <Counter />
          </Diagram>
        </Stage>
      </Split>
    </Figure>
  )
}
