import type { Locale } from "@/content"

// The words inside the live examples. The prose around them lives in en.tsx
// and nl.tsx.
export interface DemoCopy {
  tree: { label: string; caption: string }
  commit: { label: string; caption: string; dom: string }
  ownership: {
    label: string
    caption: string
    choose: string
    high: string
    low: string
    press: string
  }
  memo: {
    label: string
    caption: string
    press: string
    passes: string
    same: string
    fresh: string
    plain: string
    broken: string
    works: string
  }
  context: {
    label: string
    caption: string
    choose: string
    single: string
    memo: string
    split: string
    other: string
    reads: string
    needs: string
    none: string
  }
  refs: { label: string; caption: string }
}

export const demoCopy: Record<Locale, DemoCopy> = {
  en: {
    tree: {
      label: "A component tree in which every component has its own state",
      caption:
        "Every box is a component with its own state. Click one to update it and watch where the render goes.",
    },
    commit: {
      label: "A counter with two children, and what reaches the DOM",
      caption:
        "Click Counter. Both children render every time. The bottom row is the real DOM, watched by a MutationObserver: only one of the two is ever written.",
      dom: "in the DOM",
    },
    ownership: {
      label: "The components that render when the modal opens",
      caption:
        "Click Button to open and close the modal. Then move the state and click again.",
      choose: "Where the state lives",
      high: "state in AccountScreen",
      low: "state in EditProfile",
      press: "click",
    },
    memo: {
      label: "A memoized component and the props it is given",
      caption:
        "Click Button. A grey packet that fades out is React stopping at a component it can skip.",
      press: "click",
      passes: "AccountScreen passes",
      same: "same every render",
      fresh: "new every render",
      plain: "Overview renders along with its parent.",
      broken: "memo compares, finds a new prop and renders.",
      works: "memo compares, finds nothing new and skips.",
    },
    context: {
      label: "A provider with four children, three of which read the context",
      caption:
        "Click SidebarToggle or OpenButton to change the sidebar. Click the provider to update some other state it holds.",
      choose: "Provider",
      single: "one context",
      memo: "one context + useMemo",
      split: "data and API split",
      other: "unrelated setState",
      reads: "reads isOpen",
      needs: "needs open()",
      none: "no context",
    },
    refs: {
      label: "A counter that keeps one value in state and one in a ref",
      caption:
        "Click RefButton a few times, then StateButton. The ref changes right away. Screen only finds out at the next render.",
    },
  },
  nl: {
    tree: {
      label: "Een component tree waarin elk component zijn eigen state heeft",
      caption:
        "Elk blok is een component met eigen state. Klik er een aan om die te updaten en kijk waar de render heen gaat.",
    },
    commit: {
      label: "Een counter met twee children, en wat de DOM bereikt",
      caption:
        "Klik op Counter. Beide children renderen elke keer. De onderste rij is de echte DOM, gevolgd door een MutationObserver: maar één van de twee wordt ooit aangepast.",
      dom: "in de DOM",
    },
    ownership: {
      label: "De components die renderen als de modal opent",
      caption:
        "Klik op Button om de modal te openen en te sluiten. Verplaats daarna de state en klik opnieuw.",
      choose: "Waar de state leeft",
      high: "state in AccountScreen",
      low: "state in EditProfile",
      press: "klik",
    },
    memo: {
      label: "Een memoized component en de props die het krijgt",
      caption:
        "Klik op Button. Een grijs pakketje dat vervaagt is React die stopt bij een component dat het kan overslaan.",
      press: "klik",
      passes: "AccountScreen geeft door",
      same: "elke render hetzelfde",
      fresh: "elke render nieuw",
      plain: "Overview rendert mee met zijn parent.",
      broken: "memo vergelijkt, vindt een nieuwe prop en rendert.",
      works: "memo vergelijkt, vindt niets nieuws en slaat over.",
    },
    context: {
      label: "Een provider met vier children, waarvan er drie de context lezen",
      caption:
        "Klik op SidebarToggle of OpenButton om de sidebar te veranderen. Klik op de provider om andere state te updaten die hij ook bijhoudt.",
      choose: "Provider",
      single: "één context",
      memo: "één context + useMemo",
      split: "data en API gesplitst",
      other: "andere setState",
      reads: "leest isOpen",
      needs: "gebruikt open()",
      none: "geen context",
    },
    refs: {
      label: "Een counter die één waarde in state houdt en één in een ref",
      caption:
        "Klik een paar keer op RefButton en daarna op StateButton. De ref verandert meteen. Screen merkt het pas bij de volgende render.",
    },
  },
}
