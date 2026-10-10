<img src="assets/icon.svg" width="64" height="64" alt="">

# portfolio

TanStack Start, shadcn/ui (lyra preset on Base UI), Tailwind CSS 4, deployed to Vercel through Nitro. Every page is prerendered at build time.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm typecheck && pnpm lint
```

## Where things live

- `src/content/` holds all copy. `en.ts` and `nl.ts` must both satisfy the `Content` type in `types.ts`, so a string missing in one language is a type error. `site.ts` has the links and names that are the same in every language.
- `src/routes/{-$locale}/` is the page. English is served at `/`, Dutch at `/nl`.
- `src/components/site/` has the site's own components, including the sync diagram.
- `src/components/ui/` is shadcn. Add components with the CLI: `pnpm dlx shadcn@latest add <name>`.
- `src/styles.css` has the theme tokens for both the dark (default) and light theme.
