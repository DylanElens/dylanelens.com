import type { PostMeta } from "../types"

export const meta = {
  slug: "react-rerenders",
  date: "2026-10-10",
  // A state update at the top, and the tree below it.
  mark: [
    "....@@@....",
    "....@@@....",
    ".....#.....",
    ".#########.",
    ".#...#...#.",
    "###.###.###",
    "###.###.###",
  ],
  copy: {
    en: {
      title: "Why did this render again?",
      summary:
        "What a state update does to a React component tree, and where to put state so it does less.",
    },
    nl: {
      title: "Waarom rendert dit opnieuw?",
      summary:
        "Wat een state update doet met een React component tree, en waar je state neerzet zodat dat minder wordt.",
    },
  },
} as const satisfies PostMeta
