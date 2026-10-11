import type { Locale } from "@/content"

export interface PostMeta {
  // Also the last part of the URL: /blog/<slug>.
  slug: string
  // ISO date, shown as written.
  date: string
  // Drawn by PixelMark: "#" is foreground, "@" is the accent.
  mark: ReadonlyArray<string>
  copy: Record<Locale, { title: string; summary: string }>
}
