# Active Context: ISKM Temple Website (Supabase Integration)

## Current Focus

-   **Initiate Supabase Integration:** Setting up the necessary configurations, dependencies, and initial documentation (Memory Bank) to integrate the self-hosted Supabase instance.

## Recent Changes (as of 2025-05-04 19:48 IST)

-   Created initial Memory Bank files:
    -   `projectbrief.md`
    -   `productContext.md`
    -   `systemPatterns.md`
    -   `techContext.md`
-   Established the plan for Supabase integration.

## Next Steps

1.  Create `memory-bank/progress.md`.
2.  Create `memory-bank/library.md`.
3.  Install `@supabase/supabase-js` dependency using `pnpm` (Done).
4.  Configure Supabase client using `shadcn` generated setup (`src/lib/supabase/client.ts`) (Done).
5.  Store Supabase credentials securely in `.env.local` (Done).
6.  Confirm `.gitignore` includes `.env.local` (Done).
7.  Use Context7 MCP to resolve and fetch documentation for `@supabase/supabase-js` (Done).
8.  Integrate `RealtimeCursors` component into `src/routes/index.tsx` for testing (Done).
9.  Verify `RealtimeCursors` functionality by running the dev server and checking the browser.

## Active Decisions & Considerations

-   Using the self-hosted Supabase instance provided by the user.
-   Using the `shadcn`-generated Supabase client setup (`src/lib/supabase/client.ts`). Removed redundant `src/lib/supabaseClient.ts`.
-   Credentials (URL, Anon Key) stored in `.env.local`.
-   Need to confirm Tailwind/Shadcn UI usage for accurate documentation (High likelihood confirmed by `shadcn` command usage).
-   Visual Editing requirements need further clarification later in the process.

## Important Patterns & Preferences

-   **Memory Bank:** Maintain documentation rigorously.
-   **pnpm:** Use for all package operations.
-   **TanStack:** Leverage Query and Router for data and navigation.
-   **TypeScript:** Maintain type safety.

## Learnings & Insights

-   Memory Bank was not previously initialized for this project. Starting fresh documentation.
-   Project uses TanStack Query/Router and Vite.
-   Self-hosted Supabase details provided.
-   `shadcn` command used to add `RealtimeCursors` component and related files (`src/components/cursor.tsx`, `src/hooks/use-realtime-cursors.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`).
