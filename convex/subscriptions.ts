import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new subscription record
export const createSubscription = mutation({
  args: {
    razorpaySubscriptionId: v.string(),
    razorpayPlanId: v.string(),
    razorpayCustomerId: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    planName: v.string(),
    amount: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("created"),
      v.literal("active"),
      v.literal("pending"),
      v.literal("halted"),
      v.literal("cancelled"),
      v.literal("completed"),
      v.literal("expired")
    ),
    currentStart: v.optional(v.number()),
    currentEnd: v.optional(v.number()),
    totalCount: v.optional(v.number()),
    paidCount: v.optional(v.number()),
    remainingCount: v.optional(v.number()),
    shortUrl: v.optional(v.string()),
    notes: v.optional(v.record(v.string(), v.string())),
    source: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const subscriptionId = await ctx.db.insert("subscriptions", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      payments: [],
    });
    return subscriptionId;
  },
});

// Update subscription status
export const updateSubscriptionStatus = mutation({
  args: {
    razorpaySubscriptionId: v.string(),
    status: v.union(
      v.literal("created"),
      v.literal("active"),
      v.literal("pending"),
      v.literal("halted"),
      v.literal("cancelled"),
      v.literal("completed"),
      v.literal("expired")
    ),
    currentStart: v.optional(v.number()),
    currentEnd: v.optional(v.number()),
    paidCount: v.optional(v.number()),
    remainingCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { razorpaySubscriptionId, ...updateFields } = args;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_razorpay_subscription_id", (q) => q.eq("razorpaySubscriptionId", razorpaySubscriptionId))
      .first();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    await ctx.db.patch(subscription._id, {
      ...updateFields,
      updatedAt: Date.now(),
    });

    return subscription._id;
  },
});

// Add payment to subscription
export const addPaymentToSubscription = mutation({
  args: {
    razorpaySubscriptionId: v.string(),
    payment: v.object({
      paymentId: v.string(),
      amount: v.number(),
      currency: v.string(),
      status: v.string(),
      createdAt: v.number(),
      captured: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const { razorpaySubscriptionId, payment } = args;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_razorpay_subscription_id", (q) => q.eq("razorpaySubscriptionId", razorpaySubscriptionId))
      .first();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const existingPayments = subscription.payments || [];
    await ctx.db.patch(subscription._id, {
      payments: [...existingPayments, payment],
      updatedAt: Date.now(),
    });

    return subscription._id;
  },
});

// Get subscription by Razorpay ID
export const getSubscriptionByRazorpayId = query({
  args: {
    razorpaySubscriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_razorpay_subscription_id", (q) => q.eq("razorpaySubscriptionId", args.razorpaySubscriptionId))
      .first();
  },
});

// Get all subscriptions for a user
export const getSubscriptionsByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Get all active subscriptions
export const getActiveSubscriptions = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});