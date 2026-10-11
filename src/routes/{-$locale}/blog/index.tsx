import { Link, createFileRoute } from "@tanstack/react-router"
import { getContent, localeParam, resolveLocale } from "@/content"
import { Page } from "@/components/site/page"
import { PixelMark } from "@/components/site/pixel-mark"
import { pageHead } from "@/lib/head"
import { posts } from "@/posts"

export const Route = createFileRoute("/{-$locale}/blog/")({
  head: ({ params }) => {
    const locale = resolveLocale(params.locale)
    const { blog } = getContent(locale)

    return pageHead(locale, {
      path: "/blog",
      title: blog.title,
      description: blog.description,
    })
  },
  component: Blog,
})

// The list has no sections to step through.
const sections: ReadonlyArray<never> = []

const labels = {}

function Blog() {
  const locale = resolveLocale(Route.useParams().locale)
  const { blog } = getContent(locale)

  return (
    <Page locale={locale} path="/blog" sections={sections} labels={labels}>
      <div
        id="top"
        className="flex scroll-mt-11 flex-col gap-2 px-5 py-10 md:px-8 md:py-14"
      >
        <h1 className="text-xl font-medium md:text-2xl">{blog.heading}</h1>
        <p className="max-w-[60ch] text-base text-muted-foreground">
          {blog.lead}
        </p>
      </div>

      {/* The date takes the column that holds the section label elsewhere.
          The bottom border closes the rule between the two columns. */}
      <ol className="border-b">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="grid border-t md:grid-cols-[13rem_minmax(0,1fr)]"
          >
            <div className="px-5 pt-8 md:border-r md:px-8 md:py-12">
              <time
                dateTime={post.date}
                className="text-xs tracking-widest text-muted-foreground tabular-nums"
              >
                {post.date}
              </time>
            </div>
            <div className="px-5 pt-5 pb-10 md:px-8 md:py-12">
              <Link
                to={`/{-$locale}/blog/${post.slug}`}
                params={{ locale: localeParam(locale) }}
                className="group flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-center sm:gap-8"
              >
                <PixelMark
                  rows={post.mark}
                  className="w-20"
                  cellClassName="group-hover:animate-wave motion-reduce:animate-none"
                />
                <div className="flex max-w-[60ch] flex-col gap-1.5">
                  <h2 className="text-xl font-medium underline decoration-foreground/30 underline-offset-4 transition-colors group-hover:text-primary group-hover:decoration-primary md:text-2xl">
                    {post.copy[locale].title}
                  </h2>
                  <p className="text-muted-foreground">
                    {post.copy[locale].summary}
                  </p>
                </div>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </Page>
  )
}
