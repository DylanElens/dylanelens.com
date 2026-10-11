import type { JobId, ProjectId } from "./types"

// Everything that reads the same in every language.
export const site = {
  name: "Dylan Elens",
  url: "https://dylanelens.com",
  email: "dylanelens@hotmail.com",
  github: "https://github.com/dylanelens",
  // TODO: confirm the profile slug; the link in the CV is malformed.
  linkedin: "https://www.linkedin.com/in/dylanelens/",
  thesis:
    "https://www.cs.ru.nl/bachelors-theses/2025/Dylan_Elens___1051438___An_LLM-Based_End-to-End_Testing_Agent_for_Web_Applications.pdf",
  frontline: {
    site: "https://frontline-app.com/",
    launch:
      "https://nl.linkedin.com/posts/msml_frontline-fieldsales-msml-activity-7502719387125268480-iJX4",
    // TODO: confirm the stack.
    stack: ["TypeScript", "React Native", "Laravel"],
  },
} as const

export const jobs: Record<JobId, { company: string; href?: string }> = {
  msml: { company: "MSML", href: "https://www.msml.nl/" },
  verbelco: { company: "Verbelco", href: "https://www.verbelco.nl/" },
  dearhealth: { company: "DearHEALTH", href: "https://dearhealth.com/" },
  pixelmonsters: { company: "Pixel Monsters", href: "https://motorroutes.nl/" },
  productsup: { company: "Productsup", href: "https://www.productsup.com/" },
}

export const projects: Record<
  ProjectId,
  { name: string; href: string; tag: string }
> = {
  interpreter: {
    name: "interpreterInGo",
    href: "https://github.com/DylanElens/interpreterInGo",
    tag: "go",
  },
  gameOfLife: {
    name: "game-of-life-arcade-box",
    href: "https://github.com/DylanElens/game-of-life-arcade-box",
    tag: "c++",
  },
  datamining: {
    name: "datamining_project",
    href: "https://github.com/DylanElens/datamining_project",
    tag: "jupyter",
  },
  dotfiles: {
    name: "dotfiles",
    href: "https://github.com/DylanElens/dotfiles",
    tag: "shell",
  },
  nvim: {
    name: ".nvim",
    href: "https://github.com/DylanElens/.nvim",
    tag: "lua",
  },
  seawings: {
    name: "seawingsnv.com",
    href: "https://www.seawingsnv.com/",
    tag: "web",
  },
  smsCuracao: {
    name: "smscuracao.com",
    href: "https://smscuracao.com/",
    tag: "web",
  },
  madurosons: {
    name: "madurosons.com",
    href: "https://www.madurosons.com/",
    tag: "web",
  },
}
