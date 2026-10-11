import { site } from "./site"
import type { Content } from "./types"

export const nl = {
  meta: {
    title: "Dylan Elens · Software Engineer",
    description:
      "Software engineer bij MSML. TypeScript, React Native en Laravel, offline-first sync en agentic systemen.",
  },
  nav: {
    about: "over mij",
    frontline: "frontline",
    agents: "agents",
    experience: "ervaring",
    projects: "projecten",
    contact: "contact",
  },
  hero: {
    greeting: "Hoi, ik ben Dylan.",
    tagline:
      "Ik bouw graag complexe systemen, met alle lastige problemen die daarbij horen.",
    facts: [
      { key: "rol", value: "software engineer @ MSML" },
      { key: "locatie", value: "Deventer, NL" },
      { key: "stack", value: "TypeScript, React Native, Laravel" },
      { key: "focus", value: "offline-first sync, agentic systemen" },
      { key: "editor", value: "neovim (arch, btw)" },
    ],
  },
  about: {
    paragraphs: [
      "Het liefst ontwerp ik complexe systemen, en dan vooral rondom alles wat mis kan gaan. Netwerken vallen weg, requests komen dubbel binnen, een apparaat valt halverwege een schrijfactie uit. Die gevallen wil ik terugzien in het ontwerp en in de types. Dat is een groot deel van waarom ik graag met Effect werk.",
    ],
    principles: [
      {
        key: "systemen",
        body: "Begin bij de data en de manieren waarop het mis kan gaan. De UI volgt.",
      },
      {
        key: "proces",
        body: "Kleine stappen, korte feedbackloops, geautomatiseerde checks.",
      },
      {
        key: "teams",
        body: "Schrijf dingen op, review ruimhartig en deel context vroeg.",
      },
    ],
  },
  frontline: {
    kicker: "MSML · SaaS · field sales",
    paragraphs: [
      "Het field sales platform van MSML: planning, uitvoering en analyse in één product. We hebben het als team vanaf nul gebouwd.",
      "Mijn deel was de offline-first sync engine tussen de tablet-app en de backend. Een vertegenwoordiger checkt in bij een winkel en werkt vanaf dat moment offline. Bij het uitchecken synchroniseert de engine alles.",
    ],
    siteLabel: "frontline-app.com",
    launchLabel: "lanceringspost",
    diagram: {
      caption:
        "Een speelgoedmodel, niet de engine uit productie. Check in, schrijf een paar wijzigingen en check uit.",
      tablet: "tablet-app",
      localStore: "lokale opslag",
      outbox: "outbox",
      backend: "backend",
      database: "database",
      rows: (count) => `${count} ${count === 1 ? "rij" : "rijen"}`,
      phase: {
        idle: "idle",
        visit: "offline",
        syncing: "sync",
      },
      checkIn: "check in",
      checkOut: "check uit",
      write: "schrijf wijziging",
      inSync: "in sync",
      behind: (count) => `${count} achter`,
      logLabel: "Synclog",
      logEmpty: "idle. check in om een bezoek te starten.",
      log: {
        checkIn: "ingecheckt. vanaf nu offline.",
        write: (op) => `wijziging #${op} lokaal opgeslagen`,
        checkOut: (count) =>
          `uitchecken. ${count} ${count === 1 ? "wijziging" : "wijzigingen"} synchroniseren.`,
        checkOutEmpty: "uitgecheckt. niets te synchroniseren.",
        ack: (op) => `#${op} gesynchroniseerd`,
        done: "alles gesynchroniseerd. uitgecheckt.",
      },
    },
  },
  agents: {
    lead: "Agentic systemen zijn het deel van dit vak dat ik niet met rust kan laten.",
    items: [
      {
        key: "scriptie",
        body: "Mijn bachelorscriptie aan de Radboud Universiteit ging over agentic testing.",
        link: { label: "lees de scriptie", href: site.thesis },
      },
      {
        key: "op het werk",
        body: "Bij MSML werk ik aan onze agentic AI-initiatieven: uitzoeken waar agents ons echt helpen software te bouwen, en ze daar inzetten.",
      },
      {
        key: "cloud agents",
        body: "Coding agents die op een machine in de cloud werken in plaats van op mijn laptop, zoals Amp dat doet met orbs. De richting waar ik nu het nieuwsgierigst naar ben.",
      },
    ],
  },
  experience: {
    jobs: {
      msml: {
        role: "Software Engineer",
        period: "feb 2025 – nu",
        highlights: [
          "Frontline, ons field sales platform, met het team vanaf nul gebouwd.",
          "De offline-first sync engine gebouwd: offline vanaf het inchecken, gesynchroniseerd bij het uitchecken.",
          "Werk aan agentic AI-initiatieven binnen het hele bedrijf.",
        ],
      },
      verbelco: {
        role: "Full Stack Software Engineer",
        period: "mei 2024 – dec 2024",
        highlights: [
          "Een bijbaan die voortkwam uit het GiPHouse-project op de universiteit.",
          "Hun legacy PHP-applicatie gemigreerd naar Laravel, React en TypeScript.",
        ],
      },
      dearhealth: {
        role: "Frontend Developer",
        period: "jul 2023 – jan 2025",
        highlights: [
          "React-features gebouwd voor een platform voor artsen die chronische ziektes behandelen.",
          "Gewerkt met een event-driven backend in AWS.",
          "Strikte controle op welke medische gegevens de frontend bereiken.",
        ],
      },
      pixelmonsters: {
        role: "Full Stack Software Engineer",
        period: "jun 2023 – jan 2025",
        highlights: [
          "Motorroutes gebouwd, een greenfield React Native-app, en gepubliceerd in de App Store en Google Play.",
          "CI/CD opgezet met GitHub Actions.",
          "Laravel-applicaties onderhouden en AWS Lambda-functies gebouwd voor klanten.",
        ],
      },
      productsup: {
        role: "Full Stack Software Engineer",
        period: "2021 – 2023",
        highlights: [
          "Frontend in Vue en TypeScript, backend in Laravel als REST API.",
          "Gemiddeld 50% minder nieuwe dataopslag in S3.",
          "100% toename van statische analyse met PHPStan.",
        ],
      },
    },
    education: {
      period: "2020 – 2025",
      degree: "BSc Computing Science",
      school: "Radboud Universiteit",
      highlights: [
        "Scriptie over agentic testing.",
        "Teamleider van een GiPHouse Scrum-team dat een dashboard voor grondwatermetingen bouwde.",
      ],
    },
  },
  projects: {
    descriptions: {
      interpreter: "Een interpreter, geschreven in Go.",
      gameOfLife: "Conway's Game of Life als speelbare arcadekast.",
      datamining:
        "Logistische regressie versus beslisbomen voor het voorspellen van diabetes.",
      dotfiles: "Mijn Linux-setup.",
      nvim: "Mijn Neovim-configuratie.",
      seawings:
        "Website voor Seawings NV, scheepvaart en logistiek op Curaçao.",
      smsCuracao:
        "Website voor SMS Curaçao, een mailboxservice voor verzending naar Curaçao.",
      madurosons:
        "Website voor Maduro Shipping, een scheepsagent op Aruba, Bonaire en Curaçao.",
    },
  },
  contact: {
    lead: "Zeg hallo.",
    body: "Ik praat altijd graag over sync engines, agents of TypeScript.",
  },
  ui: {
    skipToContent: "Ga naar de inhoud",
    switchLanguage: "Taal",
    toggleTheme: "Wissel thema",
    dark: "donker",
    light: "licht",
    hints: [
      { keys: ["j", "k"], label: "sectie" },
      { keys: ["gg", "G"], label: "begin/einde" },
      { keys: ["t"], label: "thema" },
      { keys: ["l"], label: "taal" },
    ],
    top: "Top",
    bottom: "Bot",
    footer: "Gebouwd met TanStack Start en shadcn/ui.",
    notFoundTitle: "Bestand of map bestaat niet",
    notFoundBody: "De pagina die je zocht bestaat niet.",
    notFoundLink: "cd ~",
  },
} satisfies Content
