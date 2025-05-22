import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Removed 'cursors' table definition

  puck_pages: defineTable({
    path: v.string(), // To store the route/path of the page
    data: v.any()     // To store the Puck editor's JSON output
  })
  .index("by_path", ["path"]), // To efficiently query pages by their path

  // Add other tables for your application here if needed
  // Example:
  // messages: defineTable({ body: v.string(), author: v.string() }),
});
