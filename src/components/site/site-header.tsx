import { Link } from "@tanstack/react-router"
import type { Content, Locale, SectionId } from "@/content"
import { localeParam, locales, sectionIds } from "@/content"
import { toggleTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"

export function SiteHeader({
  locale,
  content,
  active,
}: {
  locale: Locale
  content: Content
  active: SectionId | null
}) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur-sm">
      <div className="flex h-11 items-center justify-between gap-4 px-5 text-xs md:px-8">
        <a href="#top" className="shrink-0 font-medium">
          <span className="text-muted-foreground">~/</span>dylanelens
        </a>

        <nav
          aria-label="Sections"
          className="hidden items-center gap-5 lg:flex"
        >
          {sectionIds.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className={cn(
                "transition-colors hover:text-foreground",
                active === id ? "text-primary" : "text-muted-foreground"
              )}
            >
              {content.nav[id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <nav
            aria-label={content.ui.switchLanguage}
            className="flex items-center gap-1.5"
          >
            {locales.map((option, index) => (
              <span key={option} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span className="text-muted-foreground/50">/</span>
                )}
                <Link
                  to="/{-$locale}"
                  params={{ locale: localeParam(option) }}
                  resetScroll={false}
                  hrefLang={option}
                  aria-current={option === locale ? "true" : undefined}
                  className={cn(
                    "uppercase transition-colors hover:text-foreground",
                    option === locale
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {option}
                </Link>
              </span>
            ))}
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={content.ui.toggleTheme}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            [<span className="hidden dark:inline">{content.ui.dark}</span>
            <span className="dark:hidden">{content.ui.light}</span>]
          </button>
        </div>
      </div>
    </header>
  )
}
