import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get page data by its path
export const getPage = query({
  args: { path: v.string() },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("puck_pages")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .unique();
    return page;
  },
});

// Mutation to save or update page data
export const savePage = mutation({
  args: { 
    path: v.string(), 
    data: v.any() // Puck data is JSON
  },
  handler: async (ctx, args) => {
    const existingPage = await ctx.db
      .query("puck_pages")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .unique();

    if (existingPage) {
      // Update existing page
      await ctx.db.patch(existingPage._id, { data: args.data });
      return existingPage._id;
    } else {
      // Create new page
      const pageId = await ctx.db.insert("puck_pages", { 
        path: args.path, 
        data: args.data 
      });
      return pageId;
    }
  },
});
