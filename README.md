# BulMaze

Language-learning word game built with Next.js, TypeScript and Tailwind CSS.

## Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Query
- next-auth (optional)
- i18next / next-i18next for localization

## Features
- Quick play mode
- Career mode with placement wizard and dashboard
- Profile with game history
- Settings with language and theme toggles
- Localization and optional authentication

## Pages
- `/` – Home / mode selection
- `/quick` – Quick game board
- `/career` – Career mode and dashboard
- `/profile` – User profile overview
- `/settings` – Language and theme settings

## Environment Setup
Create `.env.local` based on `.env.local.example` and fill in:

```bash
cp .env.local.example .env.local
```

Key variables:
- `OPENAI_API_KEY`
- `FEATURE_AUTH` (set `true` to require login)
- `NEXTAUTH_SECRET`
- Provider keys for Google/Apple when auth is enabled

## Scripts
```bash
pnpm dev    # start development server
pnpm build  # create production build
pnpm start  # run built app
pnpm lint   # lint with ESLint
pnpm test   # run tests
```

## Authentication Toggle
Set `FEATURE_AUTH=false` (default) to run without login; career progress is stored in localStorage.
To enable authentication, set `FEATURE_AUTH=true` and provide `NEXTAUTH_SECRET` along with Google and Apple OAuth keys.
When enabled, users must sign in and their career progress is saved via `/api/profile` using NextAuth.

## Deployment (Vercel)
- Use `pnpm install` and `pnpm build` for install/build commands
- Set environment variables from `.env.local`
- Optionally enable auth via `FEATURE_AUTH`
- After deployment, `pnpm start` launches the production server

## Testing
```bash
pnpm test
```
