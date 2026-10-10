import { defineConfig } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { nitro } from "nitro/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    // Every page is static, so render them all at build time. Crawling picks
    // up the other locales from the language switch.
    tanstackStart({ prerender: { enabled: true, crawlLinks: true } }),
    nitro(),
    viteReact(),
  ],
})

export default config
