import { meta as reactRerenders } from "./react-rerenders/meta"

// Newest first. Every post here also needs a route file in
// src/routes/{-$locale}/blog/, named after its slug.
export const posts = [reactRerenders] as const

export type PostSlug = (typeof posts)[number]["slug"]
