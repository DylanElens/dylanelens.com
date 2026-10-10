import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
  useParams,
} from "@tanstack/react-router"

import appCss from "../styles.css?url"
import { getContent, localeParam, resolveLocale, site } from "@/content"
import { themeScript } from "@/lib/theme"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "author",
        content: site.name,
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function useLocale() {
  const { locale } = useParams({ strict: false })

  return resolveLocale(locale)
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const locale = useLocale()

  return (
    // The theme script may drop the class before hydration.
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  const locale = useLocale()
  const { ui } = getContent(locale)

  return (
    <main className="flex min-h-svh flex-col justify-center gap-4 px-5 md:px-8">
      <p className="text-xs tracking-widest text-primary uppercase">404</p>
      <h1 className="text-3xl leading-none font-medium tracking-tight">
        {ui.notFoundTitle}
      </h1>
      <p className="text-muted-foreground">{ui.notFoundBody}</p>
      <Link
        to="/{-$locale}"
        params={{ locale: localeParam(locale) }}
        className="w-fit underline decoration-foreground/30 underline-offset-4 hover:text-primary hover:decoration-primary"
      >
        <span className="text-primary">$</span> {ui.notFoundLink}
      </Link>
    </main>
  )
}
