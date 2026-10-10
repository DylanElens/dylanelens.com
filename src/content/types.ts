export const locales = ["en", "nl"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const sectionIds = [
  "about",
  "frontline",
  "agents",
  "experience",
  "projects",
  "contact",
] as const

export type SectionId = (typeof sectionIds)[number]

export const jobIds = [
  "msml",
  "dearhealth",
  "pixelmonsters",
  "productsup",
] as const

export type JobId = (typeof jobIds)[number]

export const projectIds = [
  "interpreter",
  "gameOfLife",
  "datamining",
  "dotfiles",
  "nvim",
  "seawings",
  "smsCuracao",
  "madurosons",
] as const

export type ProjectId = (typeof projectIds)[number]

export interface JobCopy {
  role: string
  period: string
  highlights: ReadonlyArray<string>
}

export interface Content {
  meta: {
    title: string
    description: string
  }
  nav: Record<SectionId, string>
  hero: {
    greeting: string
    tagline: string
    facts: ReadonlyArray<{ key: string; value: string }>
  }
  about: {
    paragraphs: ReadonlyArray<string>
    principles: ReadonlyArray<{ key: string; body: string }>
  }
  frontline: {
    kicker: string
    paragraphs: ReadonlyArray<string>
    siteLabel: string
    launchLabel: string
    diagram: {
      caption: string
      tablet: string
      localStore: string
      outbox: string
      backend: string
      database: string
      rows: (count: number) => string
      phase: Record<"idle" | "visit" | "syncing", string>
      checkIn: string
      checkOut: string
      write: string
      inSync: string
      behind: (count: number) => string
      logLabel: string
      logEmpty: string
      log: {
        checkIn: string
        write: (op: number) => string
        checkOut: (count: number) => string
        checkOutEmpty: string
        ack: (op: number) => string
        done: string
      }
    }
  }
  agents: {
    lead: string
    items: ReadonlyArray<{ key: string; body: string }>
  }
  experience: {
    jobs: Record<JobId, JobCopy>
    education: {
      period: string
      degree: string
      school: string
      highlights: ReadonlyArray<string>
    }
  }
  projects: {
    descriptions: Record<ProjectId, string>
  }
  contact: {
    lead: string
    body: string
  }
  ui: {
    skipToContent: string
    switchLanguage: string
    toggleTheme: string
    dark: string
    light: string
    hints: ReadonlyArray<{ keys: ReadonlyArray<string>; label: string }>
    top: string
    bottom: string
    footer: string
    notFoundTitle: string
    notFoundBody: string
    notFoundLink: string
  }
}
