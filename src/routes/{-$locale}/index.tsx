import { createFileRoute } from "@tanstack/react-router"
import type { Content, SectionId } from "@/content"
import { getContent, resolveLocale, sectionIds } from "@/content"
import { Hero } from "@/components/site/hero"
import { Page } from "@/components/site/page"
import { Section } from "@/components/site/primitives"
import {
  About,
  Agents,
  Contact,
  Experience,
  Frontline,
  Projects,
} from "@/components/site/sections"
import { pageHead } from "@/lib/head"

export const Route = createFileRoute("/{-$locale}/")({
  head: ({ params }) => {
    const locale = resolveLocale(params.locale)

    return pageHead(locale, { path: "", ...getContent(locale).meta })
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

  return (
    <Page locale={locale} path="" sections={sectionIds} labels={content.nav}>
      <Hero content={content} />
      {sectionIds.map((id, index) => {
        const Body = sections[id]

        return (
          <Section key={id} id={id} index={index + 1} label={content.nav[id]}>
            <Body content={content} />
          </Section>
        )
      })}
    </Page>
  )
}
