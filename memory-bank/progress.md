# Progress: ISKM Temple Website (Supabase Integration)

## Current Status (as of 2025-05-04 19:48 IST)

-   **Phase:** Initialization & Setup
-   **Overall Progress:** Just started. Memory Bank documentation initiated.

## What Works

-   Existing TanStack Query/Router application structure (assumed functional based on file structure).
-   Vite build process (assumed).

## What's Left to Build / Integrate

1.  **Supabase Setup:**
    -   Install client library.
    -   Configure client connection.
    -   Secure credential storage.
    -   Update `.gitignore`.
2.  **Documentation:**
    -   Fetch Supabase docs via Context7.
    -   Create `library.md`.
3.  **Database Schema:**
    -   Design and implement tables in Supabase for CMS (pages, components, settings), Blog (posts, authors, categories), Events, Donations, Shop Products, etc.
4.  **Data Integration:**
    -   Replace or augment existing data fetching logic with TanStack Query hooks using the Supabase client.
5.  **Realtime Features:**
    -   Implement Supabase Realtime subscriptions for live lecture status, donation progress, etc. (Pending)
    -   Integrate `RealtimeCursors` component using **Convex** (Schema defined, functions deployed, component updated & functional, minor lag observed).
6.  **Blog Section:**
    -   Create routes using TanStack Router.
    -   Develop components for blog index and post pages.
    -   Implement data fetching from Supabase.
7.  **CMS Features:**
    -   Implement Draft/Published logic in data fetching and potentially UI.
    -   Investigate and implement Visual Editing approach.
8.  **Testing & Refinement:**
    -   Test all integrations thoroughly.
    -   Refine UI/UX based on new data sources.

## Known Issues / Blockers

-   Minor lagginess observed in Convex realtime cursors (Potential optimization needed later).
-   Lingering TypeScript errors in `useRealtimeCursors.ts` due to Convex type generation issues with self-hosted setup (Workaround using `api` object seems functional).
-   Complexity of mapping existing data structures (if any) to Supabase schema.
-   Implementing robust Draft Mode and Visual Editing.

## Evolution of Decisions

-   **Decision (Initial):** Use Supabase as the backend CMS and for realtime features. (Revised - Using Convex for Realtime Cursors).
-   **Decision (Initial):** Start by establishing the Memory Bank documentation. (Done).
-   **Decision (Mid-Task):** Switched Realtime Cursors implementation from Supabase to Convex due to self-hosted Supabase configuration issues.
-   **Decision (Mid-Task):** Manually created Convex `cursors` table using `npx convex import` as `deploy` didn't create it automatically in self-hosted setup.
-   **Decision (Mid-Task):** Resolved Convex type generation issues by ensuring `schema.ts` and `cursors.ts` existed before running `npx convex deploy`.
