import { createFileRoute } from "@tanstack/react-router"
import { resolveLocale } from "@/content"
import { postHead } from "@/lib/head"
import { ReactRerenders } from "@/posts/react-rerenders"
import { meta } from "@/posts/react-rerenders/meta"

export const Route = createFileRoute("/{-$locale}/blog/react-rerenders")({
  head: ({ params }) => postHead(resolveLocale(params.locale), meta),
  component: ReactRerenders,
})
