import { en } from "./en"
import { nl } from "./nl"
import { defaultLocale, locales } from "./types"
import type { Content, Locale } from "./types"

const dictionaries: Record<Locale, Content> = { en, nl }

export function getContent(locale: Locale): Content {
  return dictionaries[locale]
}

export function isLocale(value: string | undefined): value is Locale {
  return locales.some((locale) => locale === value)
}

export function resolveLocale(param: string | undefined): Locale {
  return isLocale(param) ? param : defaultLocale
}

// The default locale lives at "/", every other one under its own prefix.
export function localeParam(locale: Locale): Locale | undefined {
  return locale === defaultLocale ? undefined : locale
}

// `path` is the page without its locale prefix: "" for home, "/blog" for the blog.
export function localePath(locale: Locale, path = ""): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`

  return `${prefix}${path}` || "/"
}

export * from "./types"

export * from "./site"
