import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { defaultLocale, isLocale } from "@/content"

// Every page lives under the optional locale prefix, so the prefix is checked
// here once.
export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params, location }) => {
    if (params.locale === undefined) return

    // The default locale has no prefix, so "/en/blog" is just "/blog".
    if (params.locale === defaultLocale) {
      const rest = location.pathname.slice(defaultLocale.length + 1)

      throw redirect({ href: rest || "/" })
    }

    if (!isLocale(params.locale)) throw notFound()
  },
})
