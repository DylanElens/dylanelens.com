// The sections of the post, in order. Both languages fill in the same ones,
// so an anchor like #memo works in either.
export const sectionIds = [
  "model",
  "rule",
  "commit",
  "state",
  "memo",
  "context",
  "refs",
  "recap",
] as const

export type SectionId = (typeof sectionIds)[number]
