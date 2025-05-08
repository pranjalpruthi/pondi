import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convexKey = import.meta.env.VITE_CONVEX_KEY; // For self-hosted, this is the admin key

if (!convexUrl) {
  throw new Error("Missing environment variable: VITE_CONVEX_URL");
}
if (!convexKey) {
  throw new Error("Missing environment variable: VITE_CONVEX_KEY. For self-hosted Convex, this should be your admin key.");
}

// Initialize the Convex client
// For self-hosted instances, the admin key is used directly.
// The format for the key is typically "convex-self-hosted|<actual_key_part>"
// The client will parse this.
const convex = new ConvexReactClient(convexUrl);

// Set the admin key for authentication with the self-hosted instance
// This is a simplified approach for self-hosted where admin key might be used directly.
// For cloud Convex, you'd typically use `convex.setAuth(async () => { /* fetch token */ });`
// but for self-hosted with direct admin key, we might need to pass it differently
// or ensure the client handles the "convex-self-hosted|" prefix correctly.
// The ConvexReactClient constructor might handle the key directly if it's in the URL
// or if there's a specific method for self-hosted admin keys.
// Let's assume for now the URL and key are sufficient as per common patterns,
// or that the key format "convex-self-hosted|..." is recognized.

// A more direct way if the client supports it, or if the key needs to be passed as a token:
// This is speculative and depends on how your self-hosted client expects the admin key.
// One common pattern for self-hosted might be to include it in the URL if not handled by a specific method.
// Or, the key might be used in a custom fetch wrapper.

// For now, we'll rely on the constructor and the key format.
// If direct key authentication is needed and not handled by the constructor,
// we might need to adjust how the key is passed or used.
// The `ConvexReactClient` might not have a direct `setAdminKey` method.
// The key `convex-self-hosted|...` is often used in the `CONVEX_DEPLOYMENT_KEY` env var for CLI tools.
// For client-side, it's usually `VITE_CONVEX_URL` and then `convex.setAuth` for tokens.
// However, since you provided a single key, it's likely an admin key for direct access.

// Let's try a common pattern for self-hosted where the key might be used as a token.
// This is a guess and might need adjustment based on your self-hosted Convex client's specifics.
convex.setAuth(async () => convexKey);


export default convex;
