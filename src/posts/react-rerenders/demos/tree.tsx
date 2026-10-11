import { useState } from "react"
import { useDemo } from "./use-demo"
import { Diagram, Node } from "@/components/blog/diagram"
import type { NodeSpec } from "@/components/blog/diagram"
import { Figure, Stage } from "@/components/blog/figure"

const layout: ReadonlyArray<NodeSpec> = [
  { id: "app", label: "App", x: 168, row: 0 },
  { id: "header", label: "Header", x: 88, row: 1, parent: "app" },
  { id: "main", label: "Main", x: 248, row: 1, parent: "app" },
  { id: "logo", label: "Logo", x: 44, row: 2, parent: "header" },
  { id: "menu", label: "Menu", x: 132, row: 2, parent: "header" },
  { id: "list", label: "List", x: 204, row: 2, parent: "main" },
  { id: "detail", label: "Detail", x: 292, row: 2, parent: "main" },
]

// One piece of state per component, and nothing that reads it. Updating it
// is enough to make React call the component again.
function useUpdate() {
  const [, setTick] = useState(0)

  return () => setTick((tick) => tick + 1)
}

function App() {
  const update = useUpdate()

  return (
    <Node id="app" onPress={update}>
      <Header />
      <Main />
    </Node>
  )
}

function Header() {
  const update = useUpdate()

  return (
    <Node id="header" onPress={update}>
      <Leaf id="logo" />
      <Leaf id="menu" />
    </Node>
  )
}

function Main() {
  const update = useUpdate()

  return (
    <Node id="main" onPress={update}>
      <Leaf id="list" />
      <Leaf id="detail" />
    </Node>
  )
}

function Leaf({ id }: { id: string }) {
  const update = useUpdate()

  return <Node id={id} onPress={update} />
}

export function TreeDemo() {
  const { copy, run, frame } = useDemo("tree")

  return (
    <Figure caption={copy.caption} className="max-w-[32.5rem]" {...frame}>
      <Stage>
        <Diagram key={run} layout={layout} label={copy.label}>
          <App />
        </Diagram>
      </Stage>
    </Figure>
  )
}
