# Tech Context: ISKM Temple Website

## Core Technologies

-   **Language:** TypeScript
-   **Framework/Library:** React
-   **Build Tool:** Vite
-   **Package Manager:** pnpm
-   **Routing:** TanStack Router (`@tanstack/react-router`)
-   **Data Fetching/State Management:** TanStack Query (`@tanstack/react-query`)
-   **Styling:** Tailwind CSS (Confirmed by `shadcn` usage).
-   **UI Components:** Shadcn UI (Confirmed by `shadcn` usage).

## Backend & Database (Planned)

-   **Platform:** Supabase (Self-Hosted)
    -   URL: `https://pranjalwork-supabase-2eec96-89-144-35-116.traefik.me` (Set in `.env.local`)
    -   Database: PostgreSQL
-   **Client Library:** `@supabase/supabase-js` (Installed)
-   **Client Setup:** Uses `createBrowserClient` from `@supabase/ssr` via `src/lib/supabase/client.ts` (generated by `shadcn`). Also includes `src/lib/supabase/server.ts`.

## Development Environment

-   **Node.js:** Required (version compatibility check might be needed)
-   **pnpm:** Required for package management.
-   **Code Editor:** VS Code (implied by environment details)
-   **Environment Variables:** Supabase URL and Anon Key need to be stored, likely in `.env.local`.

## Key Dependencies (Existing & Added - Partial List)

-   `react`
-   `react-dom`
-   `@tanstack/react-router`
-   `@tanstack/react-query`
-   `typescript`
-   `vite`
-   `tailwindcss` (Likely)
-   `@radix-ui/*` (Likely, via Shadcn UI)
-   `clsx`, `tailwind-merge` (Confirmed, via Shadcn UI `utils.ts`)
-   `@supabase/supabase-js` (Added)
-   `@supabase/ssr` (Added via `shadcn` command for `RealtimeCursors`)
-   Other dependencies added by `shadcn add ...` (check `package.json` if needed)

## Key Files Added by `shadcn` for `RealtimeCursors`

-   `src/components/cursor.tsx`
-   `src/components/realtime-cursors.tsx`
-   `src/hooks/use-realtime-cursors.ts`
-   `src/lib/supabase/client.ts` (Used for client-side Supabase instance)
-   `src/lib/supabase/server.ts` (Likely for server-side/SSR Supabase usage, if needed later)

## Technical Constraints & Considerations

-   **Self-Hosted Supabase:** Requires correct configuration and network accessibility from the development/deployment environment. Ensure the provided URL (`pranjalwork-supabase-2eec96-89-144-35-116.traefik.me`) is reachable.
-   **pnpm:** All package management commands must use `pnpm`.
-   **TypeScript:** Code should adhere to TypeScript best practices.
-   **Environment Variables:** Supabase URL and Anon Key stored in `.env.local` with `VITE_` prefix for client-side access. `.env.local` is in `.gitignore`.
-   **Realtime Performance:** Monitor the performance impact of Supabase Realtime subscriptions, especially with many concurrent users or frequent updates.
-   **Client Setup:** Standardize on using `src/lib/supabase/client.ts` for browser client initialization.

## Tool Usage Patterns

-   **Context7 MCP:** Used for fetching library documentation (e.g., for `@supabase/supabase-js`).
-   **Memory Bank:** Core documentation strategy for maintaining project context.
