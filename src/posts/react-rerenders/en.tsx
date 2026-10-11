import { CommitDemo } from "./demos/commit"
import { ContextDemo } from "./demos/context"
import { MemoDemo } from "./demos/memo"
import { OwnershipDemo } from "./demos/ownership"
import { RefsDemo } from "./demos/refs"
import { TreeDemo } from "./demos/tree"
import { meta } from "./meta"
import { samples } from "./samples"
import { sectionIds } from "./sections"
import type { SectionId } from "./sections"
import { Code } from "@/components/blog/code"
import { Post } from "@/components/blog/post"
import { Lead, Point, Points, Prose } from "@/components/blog/prose"

const labels: Record<SectionId, string> = {
  model: "model",
  rule: "the rule",
  commit: "commit",
  state: "state",
  memo: "memo",
  context: "context",
  refs: "refs",
  recap: "recap",
}

export function En() {
  return (
    <Post
      locale="en"
      meta={meta}
      order={sectionIds}
      labels={labels}
      lead={
        <>
          <p>
            This started as slides for a talk about React. Slides can only show
            a picture of a render, so here the pictures are real: every box in a
            diagram below is drawn by an actual component on this page.
          </p>
          <p>
            A box lights up when React calls that component, and the number
            above it counts how often that has happened. Underlined boxes can be
            clicked.
          </p>
        </>
      }
      bodies={{
        model: <Model />,
        rule: <Rule />,
        commit: <Commit />,
        state: <State />,
        memo: <Memo />,
        context: <Context />,
        refs: <Refs />,
        recap: <Recap />,
      }}
    />
  )
}

function Model() {
  return (
    <>
      <Lead>React is not a template engine.</Lead>
      <Prose>
        <p>
          A template is filled with data once. Anything that happens after that
          is separate JavaScript, which finds elements and changes them.
        </p>
      </Prose>
      <Code>{samples.template}</Code>
      <Code>{samples.listener}</Code>
      <Prose>
        <p>
          React asks for a different way of thinking. A component is a function.
          It is handed the current state and returns what the UI should look
          like for that state.
        </p>
      </Prose>
      <Code>{samples.component}</Code>
      <Prose>
        <p>
          You never write the code that changes the page. You describe the UI
          for one state, and when the state changes, React calls the function
          again and works out the difference: <code>UI = fn(state)</code>.
        </p>
        <p>
          The rest of this post is about that one step. Which functions does
          React call again, and why those?
        </p>
      </Prose>
    </>
  )
}

function Rule() {
  return (
    <>
      <Prose>
        <p>
          State is data that React keeps for you between renders. You get at it
          through <code>useState</code>, <code>useReducer</code>,{" "}
          <code>useSyncExternalStore</code> or <code>useContext</code>. Because
          React hands it to you, React also knows when you change it, and a
          change schedules a render.
        </p>
        <p>What happens next is the whole reactivity model:</p>
        <ol>
          <li>state changes</li>
          <li>the component that owns it renders again</li>
          <li>its children render along</li>
        </ol>
      </Prose>
      <TreeDemo />
      <Prose>
        <p>
          Renders go down the tree. They never go up and they never go sideways.
          Update <code>App</code> and all seven components render. Update{" "}
          <code>Logo</code> and one does.
        </p>
        <p>
          React does not check whether a child got different props. The parent
          rendered, so the child renders. Nothing about the two updates differs
          except where the state lives.
        </p>
      </Prose>
    </>
  )
}

function Commit() {
  return (
    <>
      <Prose>
        <p>
          "Re-render" sounds expensive, because it sounds like the browser is
          doing work. Mostly it is not. A render is React calling your function.
          After that it compares the result with the previous one, and only the
          differences are written to the DOM. That second step is the commit.
        </p>
      </Prose>
      <CommitDemo />
      <Prose>
        <p>
          <code>Label</code> renders on every click and its DOM node is never
          touched. A render that changes nothing costs a function call and a
          comparison, which is why most re-renders are fine.
        </p>
        <p>
          It becomes a problem when the function itself is slow, or when there
          are a great many of them. That is worth knowing before reaching for a
          fix.
        </p>
      </Prose>
    </>
  )
}

function State() {
  return (
    <>
      <Lead>Which component really needs this state?</Lead>
      <Prose>
        <p>
          If renders flow down from wherever the state lives, then the place you
          put state decides how much renders. Take an account screen with a
          button that opens a modal. The obvious home for <code>isOpen</code> is
          the screen.
        </p>
      </Prose>
      <OwnershipDemo />
      <Prose>
        <p>
          With the state in <code>AccountScreen</code>, opening the modal also
          renders <code>Overview</code> and <code>Feed</code>, which have
          nothing to do with it. Move the state into a component that holds only
          the button and the modal, and the same click renders just those.
        </p>
        <p>
          So state goes as low as it can. Buttons, dropdowns, modals and inputs
          can nearly always own theirs. Lift it only when several components
          really share it, and then only as far as their lowest shared parent.
        </p>
        <p>
          Nothing was optimised here. The state moved, and the render boundary
          moved with it.
        </p>
      </Prose>
    </>
  )
}

function Memo() {
  return (
    <>
      <Prose>
        <p>
          <code>memo</code> gives a component a way out. When its parent
          renders, React first compares the new props with the previous ones. If
          each of them is the same, the component is skipped, along with
          everything below it.
        </p>
        <p>
          The comparison is by reference. An object or a function created while
          the parent renders is a new one every time, so <code>memo</code>{" "}
          seldom comes alone: the object needs <code>useMemo</code> and the
          callback needs <code>useCallback</code>.
        </p>
      </Prose>
      <MemoDemo />
      <Prose>
        <p>
          Switch on <code>memo</code> by itself and nothing changes, because{" "}
          <code>filters</code> and <code>onSelect</code> are new on every
          render. It only starts skipping once both are stable. Take either one
          away again and it stops working, without an error or a warning.
        </p>
        <p>
          That is what makes memoization fragile. And there are renders it never
          stops: the component's own state, a context it reads, and props that
          really did change.
        </p>
        <p>
          The hooks have a price as well. They keep a value around and compare
          dependencies on every render, which for this costs more than it saves:
        </p>
      </Prose>
      <Code>{samples.cheap}</Code>
      <Prose>
        <p>
          <code>useCallback</code> on its own prevents nothing. It only pays off
          when something compares the reference: a <code>memo</code> component,
          the dependencies of a <code>useEffect</code>, or a library that
          expects stable references.
        </p>
        <p>
          So before memoizing anything, I ask why the component renders at all,
          and then work in this order:
        </p>
        <ol>
          <li>find where the render starts</li>
          <li>move the state as low as it will go</li>
          <li>use composition</li>
          <li>memoize what is still expensive</li>
        </ol>
        <p>
          The React Compiler writes the <code>useMemo</code> and{" "}
          <code>useCallback</code> for you. It does not decide where your state
          lives, so the first three steps stay yours.
        </p>
      </Prose>
    </>
  )
}

function Context() {
  return (
    <>
      <Lead>Context is a subscription.</Lead>
      <Prose>
        <p>
          Context exists to end prop drilling. A provider makes a value
          available, and any component below it can read that value without the
          components in between passing it along.
        </p>
        <p>
          For rendering, it helps to see <code>useContext</code> as subscribing
          to the provider's value. When the value changes, every component that
          reads the context renders. The rest is left alone.
        </p>
      </Prose>
      <ContextDemo />
      <Prose>
        <p>
          Start with one context and toggle the sidebar. All three consumers
          render, including <code>OpenButton</code>, which only wants a
          function. A context works on the whole value: you subscribe to the
          object, not to a field in it.
        </p>
        <p>
          <code>Content</code> does not render. It reads no context, and it was
          passed to the provider as <code>children</code>, so the provider
          rendering again does not create it again. That is the composition from
          the list above.
        </p>
        <p>
          Now click the provider. Nothing about the sidebar changes, but the
          value object is built again, so every consumer renders for nothing.{" "}
          <code>useMemo</code> fixes that case and only that case: toggle the
          sidebar and it is as before.
        </p>
        <p>
          Splitting does the rest. The data goes in one context and the
          functions in another. The functions never change, so a component that
          only opens the sidebar never renders again.
        </p>
      </Prose>
      <Code>{samples.consumer}</Code>
      <Prose>
        <p>
          Context is not free global state. One large context ties every
          consumer to every update, and each consumer gets to choose only which
          context it follows.
        </p>
      </Prose>
    </>
  )
}

function Refs() {
  return (
    <>
      <Prose>
        <p>
          A ref also keeps a value between renders. It differs from state in one
          way: changing it tells React nothing, so no render follows.
        </p>
      </Prose>
      <RefsDemo />
      <Prose>
        <p>
          The filled square is state, the hollow one is the ref. Click{" "}
          <code>RefButton</code> and the value goes up, but no box lights up and{" "}
          <code>Screen</code> keeps showing the old number. The next state
          update renders, and only then does the screen catch up.
        </p>
        <p>
          That makes refs both handy and dangerous. The question to ask is
          whether the value has to be visible in the UI. If it does, it is
          state. If not, a ref is right: a timer id, a previous value, a flag in
          an event handler, a render count. The counts in these diagrams are
          kept outside of state too, because counting a render must not cause
          one.
        </p>
        <p>The other use is the DOM node itself, for things like focus:</p>
      </Prose>
      <Code>{samples.focus}</Code>
      <Prose>
        <p>State is for the UI. Refs are the escape hatch.</p>
      </Prose>
    </>
  )
}

function Recap() {
  return (
    <Points>
      <Point>
        <code>UI = fn(state)</code>
      </Point>
      <Point>A state update runs component functions again.</Point>
      <Point>Whoever owns the state decides where the rendering starts.</Point>
      <Point>Move state down before you memoize.</Point>
      <Point>Context is a subscription, not free global state.</Point>
      <Point>Refs keep a value without triggering a render.</Point>
    </Points>
  )
}
