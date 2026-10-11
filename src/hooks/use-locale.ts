import { useParams } from "@tanstack/react-router"
import { resolveLocale } from "@/content"

export function useLocale() {
  const { locale } = useParams({ strict: false })

  return resolveLocale(locale)
}
