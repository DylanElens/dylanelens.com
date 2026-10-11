import { useState } from "react"
import { samples } from "../samples"
import { useDemo } from "./use-demo"
import { Code } from "@/components/blog/code"
import { Diagram, Node, Slot } from "@/components/blog/diagram"
import type { NodeSpec } from "@/components/blog/diagram"
import { Choice, Figure, Split, Stage } from "@/components/blog/figure"

type Owner = "high" | "low"

const layouts: Record<Owner, ReadonlyArray<NodeSpec>> = {
  high: [
    { id: "screen", label: "AccountScreen", x: 168, row: 0 },
    { id: "button", label: "Button", x: 35, row: 1, parent: "screen" },
    { id: "modal", label: "EditModal", x: 127, row: 1, parent: "screen" },
    { id: "overview", label: "Overview", x: 225, row: 1, parent: "screen" },
    { id: "feed", label: "Feed", x: 308, row: 1, parent: "screen" },
  ],
  low: [
    { id: "screen", label: "AccountScreen", x: 168, row: 0 },
    { id: "edit", label: "EditProfile", x: 82, row: 1, parent: "screen" },
    { id: "overview", label: "Overview", x: 204, row: 1, parent: "screen" },
    { id: "feed", label: "Feed", x: 290, row: 1, parent: "screen" },
    { id: "button", label: "Button", x: 40, row: 2, parent: "edit" },
    { id: "modal", label: "EditModal", x: 124, row: 2, parent: "edit" },
  ],
}

// The obvious place: the screen owns the state, so the screen renders.
function ScreenOwnsState({ press }: { press: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Node id="screen" held="isOpen">
      <Node id="button" note={press} onPress={() => setIsOpen(!isOpen)} />
      {isOpen ? <Node id="modal" /> : <Slot id="modal" />}
      <Overview />
      <Feed />
    </Node>
  )
}

// The same screen, with the state moved into a component that holds only
// the button and the modal.
function AccountScreen({ press }: { press: string }) {
  return (
    <Node id="screen">
      <EditProfile press={press} />
      <Overview />
      <Feed />
    </Node>
  )
}

function EditProfile({ press }: { press: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Node id="edit" held="isOpen">
      <Node id="button" note={press} onPress={() => setIsOpen(!isOpen)} />
      {isOpen ? <Node id="modal" /> : <Slot id="modal" />}
    </Node>
  )
}

function Overview() {
  return <Node id="overview" />
}

function Feed() {
  return <Node id="feed" />
}

export function OwnershipDemo() {
  const { copy, run, frame } = useDemo("ownership")
  const [owner, setOwner] = useState<Owner>("high")

  return (
    <Figure
      caption={copy.caption}
      controls={
        <Choice
          label={copy.choose}
          value={owner}
          onChange={setOwner}
          options={[
            { id: "high", label: copy.high },
            { id: "low", label: copy.low },
          ]}
        />
      }
      {...frame}
    >
      <Split code={<Code bare>{samples.ownership[owner]}</Code>}>
        <Stage>
          <Diagram
            key={`${owner}-${run}`}
            layout={layouts[owner]}
            rows={3}
            label={copy.label}
          >
            {owner === "high" ? (
              <ScreenOwnsState press={copy.press} />
            ) : (
              <AccountScreen press={copy.press} />
            )}
          </Diagram>
        </Stage>
      </Split>
    </Figure>
  )
}
