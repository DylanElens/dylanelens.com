import type { Locale } from "@/content"
import { localePath, locales, site } from "@/content"
import type { PostMeta } from "@/posts/types"

interface PageMeta {
  // The page without its locale prefix: "" for home, "/blog" for the blog.
  path: string
  title: string
  description: string
  published?: string
}

// The tags every page has: title, description, Open Graph, a canonical URL
// and one alternate per language.
export function pageHead(locale: Locale, page: PageMeta) {
  const url = site.url + localePath(locale, page.path)

  return {
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      {
        property: "og:type",
        content: page.published === undefined ? "website" : "article",
      },
      { property: "og:title", content: page.title },
      { property: "og:description", content: page.description },
      { property: "og:url", content: url },
      { property: "og:locale", content: locale },
      { name: "twitter:card", content: "summary" },
      ...(page.published === undefined
        ? []
        : [{ property: "article:published_time", content: page.published }]),
    ],
    links: [
      { rel: "canonical", href: url },
      ...locales.map((option) => ({
        rel: "alternate",
        hrefLang: option,
        href: site.url + localePath(option, page.path),
      })),
    ],
  }
}

export function postHead(locale: Locale, post: PostMeta) {
  const { title, summary } = post.copy[locale]

  return pageHead(locale, {
    path: `/blog/${post.slug}`,
    title: `${title} · ${site.name}`,
    description: summary,
    published: post.date,
  })
}
