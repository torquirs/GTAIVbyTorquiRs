# GTA VI Release Countdown

An independent, fan-made release countdown built with Next.js App Router,
TypeScript, and Tailwind CSS v4. It is not affiliated with Rockstar Games.

## Development

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin before deploying.
The value must be an absolute HTTP(S) origin (for example,
`https://countdown.example.com`). Copy `.env.example` to `.env.local` and replace
the example URL for local production-metadata testing. The production fallback
is `https://example.com`; do not deploy without setting the real site origin.

## Architecture

```text
src/
├── app/                  # App Router routes, metadata, sitemap, robots, styles
├── components/
│   ├── common/           # Site-wide header and footer
│   ├── features/
│   │   ├── countdown/    # Release countdown feature
│   │   ├── gallery/      # Gallery feature
│   │   └── landing/      # Landing-page composition
│   └── ui/               # Reusable button and card primitives
├── config/               # Site metadata and gallery asset manifest
├── hooks/                # Gallery autoplay hook
├── lib/                  # Shared class-name utilities
└── types/                # Shared TypeScript domain types
public/
└── images/               # Local gallery and social-card imagery
```

Tailwind CSS v4 uses the CSS-first `@theme` configuration in
`src/app/globals.css`; a legacy `tailwind.config.ts` is intentionally omitted.

## Validation

```bash
npm run lint
npm run build
```
