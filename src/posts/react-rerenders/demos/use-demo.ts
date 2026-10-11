import { useState } from "react"
import { demoCopy } from "../copy"
import type { DemoCopy } from "../copy"
import { getContent } from "@/content"
import { useLocale } from "@/hooks/use-locale"

// What every example needs: its words, and a counter that remounts the
// diagram when the reader asks for a clean slate.
export function useDemo<TName extends keyof DemoCopy>(name: TName) {
  const locale = useLocale()
  const [run, setRun] = useState(0)

  return {
    copy: demoCopy[locale][name],
    run,
    frame: {
      reset: getContent(locale).blog.reset,
      onReset: () => setRun((current) => current + 1),
    },
  }
}
