import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new payment record
export const createPayment = mutation({
  args: {
    razorpayPaymentId: v.string(),
    razorpayOrderId: v.optional(v.string()),
    razorpaySubscriptionId: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("created"),
      v.literal("authorized"),
      v.literal("captured"),
      v.literal("refunded"),
      v.literal("failed")
    ),
    customerEmail: v.optional(v.string()),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    customerContact: v.optional(v.string()),
    method: v.optional(v.string()),
    cardId: v.optional(v.string()),
    bank: v.optional(v.string()),
    wallet: v.optional(v.string()),
    vpa: v.optional(v.string()),
    description: v.optional(v.string()),
    notes: v.optional(v.record(v.string(), v.string())),
    errorCode: v.optional(v.string()),
    errorDescription: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const paymentId = await ctx.db.insert("payments", {
      ...args,
      createdAt: Date.now(),
    });
    return paymentId;
  },
});

// Update payment status
export const updatePaymentStatus = mutation({
  args: {
    razorpayPaymentId: v.string(),
    status: v.union(
      v.literal("created"),
      v.literal("authorized"),
      v.literal("captured"),
      v.literal("refunded"),
      v.literal("failed")
    ),
    capturedAt: v.optional(v.number()),
    failedAt: v.optional(v.number()),
    errorCode: v.optional(v.string()),
    errorDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { razorpayPaymentId, ...updateFields } = args;

    const payment = await ctx.db
      .query("payments")
      .withIndex("by_razorpay_payment_id", (q) => q.eq("razorpayPaymentId", razorpayPaymentId))
      .first();

    if (!payment) {
      throw new Error("Payment not found");
    }

    await ctx.db.patch(payment._id, updateFields);

    return payment._id;
  },
});

// Get payment by Razorpay ID
export const getPaymentByRazorpayId = query({
  args: {
    razorpayPaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_razorpay_payment_id", (q) => q.eq("razorpayPaymentId", args.razorpayPaymentId))
      .first();
  },
});

// Get all payments for a subscription
export const getPaymentsBySubscription = query({
  args: {
    subscriptionId: v.id("subscriptions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_subscription_id", (q) => q.eq("subscriptionId", args.subscriptionId))
      .collect();
  },
});

// Get all payments for a user
export const getPaymentsByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Get all captured payments
export const getCapturedPayments = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_status", (q) => q.eq("status", "captured"))
      .collect();
  },
});