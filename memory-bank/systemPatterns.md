# System Patterns: ISKM Temple Website

## Architecture Overview

-   **Frontend:** React application built with Vite.
-   **Routing:** TanStack Router for client-side routing.
-   **State Management/Data Fetching:** TanStack Query for managing server state, caching, and background updates.
-   **Styling:** (Assumed based on `components.json` and common practices, likely Tailwind CSS via Shadcn UI, but needs confirmation).
-   **Backend (Planned):** Self-hosted Supabase instance.
    -   **Database:** PostgreSQL.
    -   **API:** Supabase auto-generated REST and GraphQL APIs, Supabase JS client library.
    -   **Realtime:** Supabase Realtime for live data synchronization.
    -   **Auth (Potential):** Supabase Auth for user management if needed (e.g., for CMS access, blog comments, user accounts).

## Key Technical Decisions (Existing & Planned)

-   **TanStack Ecosystem:** Leverage TanStack Query for data fetching from Supabase and TanStack Router for navigation. This promotes consistency.
-   **Supabase as Backend:** Centralize data persistence, realtime updates, and potentially authentication using Supabase.
-   **Self-Hosted Supabase:** Utilize the provided self-hosted instance. Configuration and connection details are critical.
-   **Component Structure:** (Assumed based on `src/components/` structure) Likely follows standard React component patterns. UI components potentially sourced from Shadcn UI.

## Data Flow (Planned)

1.  **Component Mount/Query Trigger:** TanStack Query hook initiates data fetch.
2.  **Supabase Client:** Query hook uses the configured Supabase client to interact with the database (fetch data).
3.  **Supabase Backend:** Processes the request, retrieves data from PostgreSQL.
4.  **Response:** Supabase returns data to the client.
5.  **TanStack Query Cache:** Data is cached and managed by TanStack Query.
6.  **Component Render:** Component renders with the fetched data.
7.  **Realtime Updates:** Supabase Realtime pushes changes to subscribed clients. TanStack Query potentially updates cache based on realtime events.

## CMS Patterns (Planned)

-   **Schema:** Define Supabase tables for content types (pages, blog posts, events, products, etc.).
-   **Draft/Published:** Implement a `status` field or similar mechanism in tables to manage content visibility. Queries will filter based on status and user roles/permissions (if applicable).
-   **Visual Editing:** Requires further investigation. Could involve:
    -   Fetching content structure and rendering editable fields directly in the frontend preview.
    -   Integrating with a headless CMS service that supports visual editing and uses Supabase as the data store.
    -   Using realtime features (like cursors) for collaborative editing interfaces.

## Important Considerations

-   **Security:** Securely manage Supabase credentials (URL, Anon Key, Service Role Key). Implement Row Level Security (RLS) in Supabase to control data access.
-   **Scalability:** Consider database indexing and efficient querying as the content grows.
-   **Error Handling:** Implement robust error handling for Supabase client interactions within TanStack Query.
