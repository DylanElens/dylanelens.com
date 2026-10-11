import { createContext, useContext, useMemo, useState } from "react"
import { samples } from "../samples"
import { useDemo } from "./use-demo"
import { Code } from "@/components/blog/code"
import { Diagram, Node } from "@/components/blog/diagram"
import type { NodeSpec } from "@/components/blog/diagram"
import { Choice, Figure, Split, Stage } from "@/components/blog/figure"

type Variant = "single" | "memo" | "split"

interface Notes {
  other: string
  reads: string
  needs: string
  none: string
}

const layout: ReadonlyArray<NodeSpec> = [
  { id: "provider", label: "SidebarProvider", x: 168, row: 0 },
  { id: "toggle", label: "SidebarToggle", x: 56.5, row: 1, parent: "provider" },
  { id: "content", label: "Content", x: 143.5, row: 1, parent: "provider" },
  { id: "open", label: "OpenButton", x: 221, row: 1, parent: "provider" },
  { id: "sidebar", label: "Sidebar", x: 298.5, row: 1, parent: "provider" },
]

interface SidebarApi {
  open: () => void
  close: () => void
}

interface Sidebar extends SidebarApi {
  isOpen: boolean
}

// One context that holds everything.
const SidebarContext = createContext<Sidebar | null>(null)

// The same thing in two: what changes, and the functions that change it.
const SidebarDataContext = createContext(false)

const SidebarApiContext = createContext<SidebarApi | null>(null)

function useSidebar() {
  const sidebar = useContext(SidebarContext)

  if (!sidebar) throw new Error("useSidebar must be used inside a provider")

  return sidebar
}

function useSidebarApi() {
  const api = useContext(SidebarApiContext)

  if (!api) throw new Error("useSidebarApi must be used inside a provider")

  return api
}

interface ProviderProps {
  other: string
  children: React.ReactNode
}

// Each provider also holds a second piece of state that no consumer reads.
// Pressing the provider updates it: a stand-in for any reason a provider
// renders without the sidebar changing.
function useOtherState() {
  const [, setOther] = useState(0)

  return () => setOther((other) => other + 1)
}

// A new object on every render, so every render is a new value.
function PlainProvider({ other, children }: ProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const updateOther = useOtherState()

  const value = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }

  return (
    <SidebarContext.Provider value={value}>
      <Node id="provider" held="isOpen" side={other} onPress={updateOther}>
        {children}
      </Node>
    </SidebarContext.Provider>
  )
}

// The value only changes when isOpen does.
function MemoProvider({ other, children }: ProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const updateOther = useOtherState()

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen]
  )

  return (
    <SidebarContext.Provider value={value}>
      <Node id="provider" held="isOpen" side={other} onPress={updateOther}>
        {children}
      </Node>
    </SidebarContext.Provider>
  )
}

// The functions never change, so their context never notifies anyone.
function SplitProvider({ other, children }: ProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const updateOther = useOtherState()

  const api = useMemo(
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    []
  )

  return (
    <SidebarApiContext.Provider value={api}>
      <SidebarDataContext.Provider value={isOpen}>
        <Node id="provider" held="isOpen" side={other} onPress={updateOther}>
          {children}
        </Node>
      </SidebarDataContext.Provider>
    </SidebarApiContext.Provider>
  )
}

// The consumers of the single context. All three subscribe to the whole
// value, whatever part of it they use.
function SidebarToggle({ note }: { note: string }) {
  const { isOpen, open, close } = useSidebar()

  return <Node id="toggle" note={note} onPress={isOpen ? close : open} />
}

function OpenButton({ note }: { note: string }) {
  const { open } = useSidebar()

  return <Node id="open" note={note} onPress={open} />
}

function SidebarPanel() {
  const { isOpen } = useSidebar()

  return <Node id="sidebar" note={`isOpen: ${isOpen}`} />
}

// The consumers of the split contexts. Each subscribes to what it uses.
function SplitToggle({ note }: { note: string }) {
  const isOpen = useContext(SidebarDataContext)
  const { open, close } = useSidebarApi()

  return <Node id="toggle" note={note} onPress={isOpen ? close : open} />
}

function SplitOpenButton({ note }: { note: string }) {
  const { open } = useSidebarApi()

  return <Node id="open" note={note} onPress={open} />
}

function SplitPanel() {
  const isOpen = useContext(SidebarDataContext)

  return <Node id="sidebar" note={`isOpen: ${isOpen}`} />
}

// Reads no context at all.
function Content({ note }: { note: string }) {
  return <Node id="content" note={note} />
}

const providers = {
  single: PlainProvider,
  memo: MemoProvider,
  split: SplitProvider,
}

function App({ variant, notes }: { variant: Variant; notes: Notes }) {
  const Provider = providers[variant]

  return (
    <Provider other={notes.other}>
      {variant === "split" ? (
        <>
          <SplitToggle note={notes.reads} />
          <Content note={notes.none} />
          <SplitOpenButton note={notes.needs} />
          <SplitPanel />
        </>
      ) : (
        <>
          <SidebarToggle note={notes.reads} />
          <Content note={notes.none} />
          <OpenButton note={notes.needs} />
          <SidebarPanel />
        </>
      )}
    </Provider>
  )
}

export function ContextDemo() {
  const { copy, run, frame } = useDemo("context")
  const [variant, setVariant] = useState<Variant>("single")

  return (
    <Figure
      caption={copy.caption}
      controls={
        <Choice
          label={copy.choose}
          value={variant}
          onChange={setVariant}
          options={[
            { id: "single", label: copy.single },
            { id: "memo", label: copy.memo },
            { id: "split", label: copy.split },
          ]}
        />
      }
      {...frame}
    >
      <Split code={<Code bare>{samples.context[variant]}</Code>}>
        <Stage>
          <Diagram key={`${variant}-${run}`} layout={layout} label={copy.label}>
            <App variant={variant} notes={copy} />
          </Diagram>
        </Stage>
      </Split>
    </Figure>
  )
}
