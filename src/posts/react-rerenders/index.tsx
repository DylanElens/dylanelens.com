import { En } from "./en"
import { Nl } from "./nl"
import type { Locale } from "@/content"
import { useLocale } from "@/hooks/use-locale"

const articles: Record<Locale, React.ComponentType> = { en: En, nl: Nl }

export function ReactRerenders() {
  const Article = articles[useLocale()]

  return <Article />
}
