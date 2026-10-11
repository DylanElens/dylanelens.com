import { Link } from "@tanstack/react-router"
import { Prose } from "./prose"
import { Page } from "@/components/site/page"
import { PixelMark } from "@/components/site/pixel-mark"
import { Section } from "@/components/site/primitives"
import type { Locale } from "@/content"
import { getContent, localeParam } from "@/content"
import type { PostMeta } from "@/posts/types"

// The page around a post: its mark and title on top, then one numbered
// section per entry in `order`, laid out like the sections on the home page.
export function Post<TId extends string>({
  locale,
  meta,
  order,
  labels,
  lead,
  bodies,
}: {
  locale: Locale
  meta: PostMeta
  // Both must keep their identity between renders, see Page.
  order: ReadonlyArray<TId>
  labels: Record<TId, string>
  lead: React.ReactNode
  bodies: Record<TId, React.ReactNode>
}) {
  const { blog } = getContent(locale)
  const { title, summary } = meta.copy[locale]

  return (
    <Page
      locale={locale}
      path={`/blog/${meta.slug}`}
      sections={order}
      labels={labels}
    >
      <article>
        <header
          id="top"
          className="flex scroll-mt-11 flex-col gap-8 px-5 py-10 md:px-8 md:py-14"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <PixelMark
              rows={meta.mark}
              className="w-24 md:w-28"
              cellClassName="animate-wave motion-reduce:animate-none"
            />
            <div className="flex max-w-[60ch] flex-col gap-2">
              <p className="text-xs text-muted-foreground tabular-nums">
                <time dateTime={meta.date}>{meta.date}</time>
              </p>
              <h1 className="text-xl font-medium md:text-2xl">{title}</h1>
              <p className="text-base text-muted-foreground">{summary}</p>
            </div>
          </div>
          <Prose>{lead}</Prose>
        </header>

        {order.map((id, index) => (
          <Section key={id} id={id} index={index + 1} label={labels[id]}>
            <div className="flex flex-col gap-8">{bodies[id]}</div>
          </Section>
        ))}
      </article>

      <nav className="border-t px-5 py-8 md:px-8">
        <Link
          to="/{-$locale}/blog"
          params={{ locale: localeParam(locale) }}
          className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
        >
          <span aria-hidden className="mr-1 text-muted-foreground">
            ←
          </span>
          {blog.back}
        </Link>
      </nav>
    </Page>
  )
}
