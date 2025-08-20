import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Process webhook event
export const processWebhookEvent = mutation({
  args: {
    eventType: v.string(),
    razorpayEventId: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    payload: v.any(),
    signature: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { eventType, entityId, payload } = args;

    try {
      // Handle different event types
      switch (eventType) {
        case "subscription.activated":
          await ctx.db
            .query("subscriptions")
            .withIndex("by_razorpay_subscription_id", (q) => q.eq("razorpaySubscriptionId", entityId))
            .first()
            .then((subscription) => {
              if (subscription) {
                const subData = payload.subscription?.entity;
                ctx.db.patch(subscription._id, {
                  status: "active",
                  currentStart: subData?.current_start,
                  currentEnd: subData?.current_end,
                  paidCount: subData?.paid_count,
                  remainingCount: subData?.remaining_count,
                  updatedAt: Date.now(),
                });
              }
            });
          break;

        case "subscription.charged":
          const paymentData = payload.payment?.entity;
          if (paymentData) {
            await ctx.db.insert("payments", {
              razorpayPaymentId: paymentData.id,
              razorpaySubscriptionId: entityId,
              amount: paymentData.amount,
              currency: paymentData.currency,
              status: "captured",
              customerEmail: paymentData.email,
              customerName: paymentData.contact,
              method: paymentData.method,
              createdAt: Date.now(),
              capturedAt: Date.now(),
            });
          }
          break;

        case "subscription.cancelled":
          await ctx.db
            .query("subscriptions")
            .withIndex("by_razorpay_subscription_id", (q) => q.eq("razorpaySubscriptionId", entityId))
            .first()
            .then((subscription) => {
              if (subscription) {
                ctx.db.patch(subscription._id, {
                  status: "cancelled",
                  updatedAt: Date.now(),
                });
              }
            });
          break;

        case "subscription.expired":
          await ctx.db
            .query("subscriptions")
            .withIndex("by_razorpay_subscription_id", (q) => q.eq("razorpaySubscriptionId", entityId))
            .first()
            .then((subscription) => {
              if (subscription) {
                ctx.db.patch(subscription._id, {
                  status: "expired",
                  updatedAt: Date.now(),
                });
              }
            });
          break;
      }

      // Store webhook event for audit trail
      await ctx.db.insert("webhookEvents", {
        eventType,
        razorpayEventId: args.razorpayEventId,
        entityType: args.entityType,
        entityId,
        payload,
        status: "processed",
        processedAt: Date.now(),
        signature: args.signature,
        createdAt: Date.now(),
      });

      return { status: "success" };
    } catch (error) {
      console.error("Webhook processing error:", error);

      // Store failed webhook for debugging
      await ctx.db.insert("webhookEvents", {
        eventType,
        razorpayEventId: args.razorpayEventId,
        entityType: args.entityType,
        entityId,
        payload,
        status: "failed",
        errorMessage: error.message,
        signature: args.signature,
        createdAt: Date.now(),
      });

      throw error;
    }
  },
});