import type { Content } from "./types"

export const en = {
  meta: {
    title: "Dylan Elens · Software Engineer",
    description:
      "Software engineer at MSML. TypeScript, React Native and Laravel, offline-first sync and agentic systems.",
  },
  nav: {
    about: "about",
    frontline: "frontline",
    agents: "agents",
    experience: "experience",
    projects: "projects",
    contact: "contact",
  },
  hero: {
    greeting: "Hi, I'm Dylan.",
    tagline:
      "I like building complex systems and the hard problems that come with them.",
    facts: [
      { key: "role", value: "software engineer @ MSML" },
      { key: "based", value: "Deventer, NL" },
      { key: "stack", value: "TypeScript, React Native, Laravel" },
      { key: "focus", value: "offline-first sync, agentic systems" },
      { key: "editor", value: "neovim (arch, btw)" },
    ],
  },
  about: {
    paragraphs: [
      "What I enjoy most is designing complex systems, and especially designing around failure. Networks drop, requests arrive twice, a device dies halfway through a write. I want those cases in the design and in the types, which is a big part of why I like Effect.",
    ],
    principles: [
      {
        key: "systems",
        body: "Start from the data and the ways it can fail. The UI follows.",
      },
      {
        key: "process",
        body: "Small steps, short feedback loops, automated checks.",
      },
      {
        key: "teams",
        body: "Write things down, review generously, share context early.",
      },
    ],
  },
  frontline: {
    kicker: "MSML · SaaS · field sales",
    paragraphs: [
      "MSML's field sales platform: planning, execution and analysis in one product. We built it from scratch as a team.",
      "My part was the offline-first sync engine between the tablet app and the backend. A rep checks in at a store and works offline from that moment. At check-out, the engine syncs everything.",
    ],
    siteLabel: "frontline-app.com",
    launchLabel: "launch post",
    diagram: {
      caption:
        "A toy model, not the production engine. Check in, write a few changes, check out.",
      tablet: "tablet app",
      localStore: "local store",
      outbox: "outbox",
      backend: "backend",
      database: "database",
      rows: (count) => `${count} ${count === 1 ? "row" : "rows"}`,
      phase: {
        idle: "idle",
        visit: "offline",
        syncing: "syncing",
      },
      checkIn: "check in",
      checkOut: "check out",
      write: "write change",
      inSync: "in sync",
      behind: (count) => `${count} behind`,
      logLabel: "Sync log",
      logEmpty: "idle. check in to start a visit.",
      log: {
        checkIn: "checked in. offline from here.",
        write: (op) => `change #${op} saved locally`,
        checkOut: (count) =>
          `checking out. syncing ${count} ${count === 1 ? "change" : "changes"}.`,
        checkOutEmpty: "checked out. nothing to sync.",
        ack: (op) => `#${op} synced`,
        done: "all synced. checked out.",
      },
    },
  },
  agents: {
    lead: "Agentic systems are the part of this field I can't leave alone.",
    items: [
      {
        key: "thesis",
        body: "My bachelor thesis at Radboud University was about agentic testing.",
      },
      {
        key: "at work",
        body: "At MSML I work on our agentic AI initiatives: working out where agents really help us build software, and putting them there.",
      },
      {
        key: "cloud agents",
        body: "Coding agents that work on a remote machine instead of my laptop, the way Amp does with orbs. The direction I'm most curious about right now.",
      },
    ],
  },
  experience: {
    jobs: {
      msml: {
        role: "Software Engineer",
        period: "feb 2025 – now",
        highlights: [
          "Built Frontline, our field sales platform, from scratch with the team.",
          "Built its offline-first sync engine: offline from check-in, synced at check-out.",
          "Work on agentic AI initiatives across the company.",
        ],
      },
      dearhealth: {
        role: "Frontend Developer",
        period: "jul 2023 – jan 2025",
        highlights: [
          "Built React features for a platform used by doctors treating chronic diseases.",
          "Worked against an event-driven backend on AWS.",
          "Kept strict control over which medical data reaches the frontend.",
        ],
      },
      pixelmonsters: {
        role: "Full Stack Software Engineer",
        period: "jun 2023 – jan 2025",
        highlights: [
          "Built Motorroutes, a greenfield React Native app, and shipped it to the App Store and Google Play.",
          "Set up its CI/CD with GitHub Actions.",
          "Maintained Laravel applications and built AWS Lambda functions for clients.",
        ],
      },
      productsup: {
        role: "Full Stack Software Engineer",
        period: "2021 – 2023",
        highlights: [
          "Vue and TypeScript frontend, Laravel REST API backend.",
          "Cut new data storage in S3 by 50% on average.",
          "100% increase in static analysis with PHPStan.",
        ],
      },
    },
    education: {
      period: "2020 – 2025",
      degree: "BSc Computing Science",
      school: "Radboud University",
      highlights: [
        "Thesis on agentic testing.",
        "Led a GiPHouse Scrum team building a dashboard for groundwater measurements.",
      ],
    },
  },
  projects: {
    descriptions: {
      interpreter: "An interpreter, written in Go.",
      gameOfLife: "Conway's Game of Life as a playable arcade box.",
      datamining:
        "Logistic regression versus decision trees for diabetes prediction.",
      dotfiles: "My Linux setup.",
      nvim: "My Neovim config.",
      seawings: "Website for Seawings NV, shipping and logistics in Curaçao.",
      smsCuracao:
        "Website for SMS Curaçao, a mailbox service for shipping to Curaçao.",
      madurosons:
        "Website for Maduro Shipping, a shipping agency in Aruba, Bonaire and Curaçao.",
    },
  },
  contact: {
    lead: "Say hi.",
    body: "Always up for talking about sync engines, agents or TypeScript.",
  },
  ui: {
    skipToContent: "Skip to content",
    switchLanguage: "Language",
    toggleTheme: "Toggle theme",
    dark: "dark",
    light: "light",
    hints: [
      { keys: ["j", "k"], label: "section" },
      { keys: ["gg", "G"], label: "top/bottom" },
      { keys: ["t"], label: "theme" },
      { keys: ["l"], label: "language" },
    ],
    top: "Top",
    bottom: "Bot",
    footer: "Built with TanStack Start and shadcn/ui.",
    notFoundTitle: "No such file or directory",
    notFoundBody: "The page you asked for does not exist.",
    notFoundLink: "cd ~",
  },
} satisfies Content
