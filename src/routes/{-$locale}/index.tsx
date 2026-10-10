import { useCallback } from "react"
import {
  createFileRoute,
  notFound,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import type { Content, SectionId } from "@/content"
import {
  defaultLocale,
  getContent,
  isLocale,
  localeParam,
  localePath,
  locales,
  resolveLocale,
  sectionIds,
  site,
} from "@/content"
import { Hero } from "@/components/site/hero"
import { Section } from "@/components/site/primitives"
import {
  About,
  Agents,
  Contact,
  Experience,
  Frontline,
  Projects,
} from "@/components/site/sections"
import { SiteHeader } from "@/components/site/site-header"
import { Statusline } from "@/components/site/statusline"
import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { useVimKeys } from "@/hooks/use-vim-keys"

export const Route = createFileRoute("/{-$locale}/")({
  beforeLoad: ({ params }) => {
    if (params.locale === undefined) return
    // The default locale has no prefix, so "/en" is just "/".
    if (params.locale === defaultLocale) {
      throw redirect({ to: "/{-$locale}", params: { locale: undefined } })
    }
    if (!isLocale(params.locale)) throw notFound()
  },
  head: ({ params }) => {
    const locale = resolveLocale(params.locale)
    const { meta } = getContent(locale)
    const url = site.url + localePath(locale)

    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:type", content: "website" },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
        { property: "og:url", content: url },
        { property: "og:locale", content: locale },
        { name: "twitter:card", content: "summary" },
      ],
      links: [
        { rel: "canonical", href: url },
        ...locales.map((option) => ({
          rel: "alternate",
          hrefLang: option,
          href: site.url + localePath(option),
        })),
      ],
    }
  },
  component: Home,
})

const sections: Record<SectionId, React.ComponentType<{ content: Content }>> = {
  about: About,
  frontline: Frontline,
  agents: Agents,
  experience: Experience,
  projects: Projects,
  contact: Contact,
}

function Home() {
  const locale = resolveLocale(Route.useParams().locale)
  const content = getContent(locale)
  const navigate = useNavigate()
  const { active, position } = useScrollSpy(sectionIds)

  const toggleLocale = useCallback(() => {
    const next = locales[(locales.indexOf(locale) + 1) % locales.length]
    void navigate({
      to: "/{-$locale}",
      params: { locale: localeParam(next) },
      resetScroll: false,
    })
  }, [locale, navigate])
  useVimKeys(sectionIds, toggleLocale)

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-30 focus:bg-primary focus:px-3 focus:py-1.5 focus:text-primary-foreground"
      >
        {content.ui.skipToContent}
      </a>
      <SiteHeader locale={locale} content={content} active={active} />
      <main>
        <Hero content={content} />
        {sectionIds.map((id, index) => {
          const Body = sections[id]

          return (
            <Section key={id} id={id} index={index + 1} label={content.nav[id]}>
              <Body content={content} />
            </Section>
          )
        })}
      </main>
      <footer className="border-t pb-7">
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-xs text-muted-foreground md:px-8">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>{content.ui.footer}</span>
        </div>
      </footer>
      <Statusline
        locale={locale}
        content={content}
        active={active}
        position={position}
      />
    </>
  )
}
