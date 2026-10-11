// The code shown in the post. It is the same in every language. A line that
// ends in //! is marked, see Code.

export const samples = {
  template: `
<h1>{{ account.name }}</h1>
<button data-modal-button>Edit profile</button>
`,
  listener: `
document.querySelector('[data-modal-button]')
  .addEventListener('click', openModal)
`,
  component: `
function AccountHeader({ account }) {
  const statusLabel = account.isActive ? 'Active' : 'Inactive'

  return (
    <header>
      <h1>{account.name}</h1>
      <p>{statusLabel}</p>
      <button>Edit profile</button>
    </header>
  )
}
`,
  commit: `
function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      <Value count={count} />
      <Label />
    </button>
  )
}

function Value({ count }) {
  return <b>{count}</b>
}

function Label() {
  return <span>Clicks</span>
}
`,
  ownership: {
    high: `
function AccountScreen() {
  const [isOpen, setIsOpen] = useState(false) //!

  return (
    <main>
      <Button onClick={() => setIsOpen(!isOpen)}>
        Edit profile
      </Button>
      {isOpen && <EditModal />}
      <Overview />
      <Feed />
    </main>
  )
}
`,
    low: `
function AccountScreen() {
  return (
    <main>
      <EditProfile />
      <Overview />
      <Feed />
    </main>
  )
}

function EditProfile() {
  const [isOpen, setIsOpen] = useState(false) //!

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>
        Edit profile
      </Button>
      {isOpen && <EditModal />}
    </>
  )
}
`,
  },
  cheap: `
const fullName = useMemo(() => {
  return firstName + ' ' + lastName
}, [firstName, lastName])
`,
  context: {
    single: `
const SidebarContext = createContext(null)

function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const value = { //!
    isOpen, //!
    open: () => setIsOpen(true), //!
    close: () => setIsOpen(false), //!
  } //!

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}
`,
    memo: `
const SidebarContext = createContext(null)

function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const value = useMemo(() => ({ //!
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }), [isOpen]) //!

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}
`,
    split: `
const SidebarDataContext = createContext(false) //!
const SidebarApiContext = createContext(null) //!

function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const api = useMemo(() => ({ //!
    open: () => setIsOpen(true), //!
    close: () => setIsOpen(false), //!
  }), []) //!

  return (
    <SidebarApiContext.Provider value={api}>
      <SidebarDataContext.Provider value={isOpen}>
        {children}
      </SidebarDataContext.Provider>
    </SidebarApiContext.Provider>
  )
}
`,
  },
  consumer: `
function OpenButton() {
  const { open } = useContext(SidebarApiContext)

  return <Button onClick={open}>Open</Button>
}
`,
  refs: `
function Counter() {
  const [count, setCount] = useState(0)
  const clicks = useRef(0)

  return (
    <>
      <StateButton
        onClick={() => setCount(count + 1)} //!
      />
      <RefButton
        onClick={() => { clicks.current += 1 }} //!
      />
      <Screen count={count} clicks={clicks.current} />
    </>
  )
}
`,
  focus: `
function NameField() {
  const inputRef = useRef(null)

  return (
    <>
      <input ref={inputRef} />
      <Button onClick={() => inputRef.current?.focus()}>
        Focus
      </Button>
    </>
  )
}
`,
}

export interface MemoConfig {
  memo: boolean
  filters: boolean
  onSelect: boolean
}

// The memo example, written out for whichever of the three are switched on.
export function memoSample(config: MemoConfig) {
  const component = config.memo
    ? `const Overview = memo(function Overview(props) { //!
  // ...
}) //!`
    : `function Overview(props) {
  // ...
}`

  const hooks = [
    config.filters &&
      "  const filters = useMemo(() => ({ status: 'active' }), []) //!",
    config.onSelect &&
      "  const onSelect = useCallback((id) => openAccount(id), []) //!",
  ].flatMap((line) => (line ? [line] : []))

  return `
${component}

function AccountScreen({ account }) {
  const [isOpen, setIsOpen] = useState(false)
${hooks.join("\n")}${hooks.length > 0 ? "\n" : ""}
  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>
        Edit profile
      </Button>
      {isOpen && <EditModal />}
      <Overview
        account={account}
        filters={${config.filters ? "filters" : "{ status: 'active' }"}}
        onSelect={${config.onSelect ? "onSelect" : "(id) => openAccount(id)"}}
      />
      <Feed />
    </>
  )
}
`
}
