import { useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import { SiteHeader } from "./site-header"
import { Statusline } from "./statusline"
import type { Locale } from "@/content"
import { getContent, localeParam, locales, site } from "@/content"
import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { useVimKeys } from "@/hooks/use-vim-keys"

const year = new Date().getFullYear()

// The chrome every page shares: header, footer, statusline and the vim keys.
// The scroll position lives here and not in the page, so scrolling re-renders
// the two bars and leaves the content alone.
export function Page<TId extends string>({
  locale,
  path,
  sections,
  labels,
  children,
}: {
  locale: Locale
  // The page without its locale prefix: "" for home, "/blog" for the blog.
  path: string
  // Both must keep their identity between renders: the scroll spy and the
  // vim keys subscribe to them.
  sections: ReadonlyArray<TId>
  labels: Record<TId, string>
  children: React.ReactNode
}) {
  const content = getContent(locale)
  const navigate = useNavigate()
  const { active, position } = useScrollSpy(sections)

  const toggleLocale = useCallback(() => {
    const next = locales[(locales.indexOf(locale) + 1) % locales.length]
    void navigate({
      to: ".",
      params: (previous) => ({ ...previous, locale: localeParam(next) }),
      resetScroll: false,
    })
  }, [locale, navigate])

  useVimKeys(sections, toggleLocale)

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-30 focus:bg-primary focus:px-3 focus:py-1.5 focus:text-primary-foreground"
      >
        {content.ui.skipToContent}
      </a>
      <SiteHeader
        locale={locale}
        content={content}
        path={path}
        sections={sections}
        labels={labels}
        active={active}
      />
      <main id="content" className="flex-1 scroll-mt-11">
        {children}
      </main>
      <footer className="border-t pb-7">
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-xs text-muted-foreground md:px-8">
          <span>
            © {year} {site.name}
          </span>
          <span>{content.ui.footer}</span>
        </div>
      </footer>
      <Statusline
        locale={locale}
        content={content}
        path={path}
        active={active}
        position={position}
      />
    </div>
  )
}
