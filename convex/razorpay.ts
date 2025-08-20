"use node";

import { action, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import Razorpay from "razorpay";
import { v } from "convex/values";
import crypto from "crypto";

export const createSubscription = action({
  args: {
    plan_id: v.string(),
    plan_name: v.optional(v.string()),
    amount: v.optional(v.number()),
    customer_email: v.optional(v.string()),
    customer_name: v.optional(v.string()),
    customer_phone: v.optional(v.string()),
  },
  handler: async (ctx, {
    plan_id,
    plan_name = "Seva Subscription",
    amount = 0,
    customer_email,
    customer_name,
    customer_phone
  }) => {
    console.log("🔑 Checking environment variables...");
    console.log("RAZORPAY_KEY_ID exists:", !!process.env.RAZORPAY_KEY_ID);
    console.log("RAZORPAY_KEY_SECRET exists:", !!process.env.RAZORPAY_KEY_SECRET);

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Missing Razorpay credentials in environment variables");
    }

    console.log("🔐 Razorpay credentials found, initializing...");
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    try {
      console.log("📊 Building subscription data...");
      const subscriptionData: any = {
        plan_id: plan_id,
        customer_notify: 1,
        quantity: 1,
        total_count: 12,
        addons: [],
        notes: {
          plan_id: plan_id,
          plan_name: plan_name,
        },
      };

      // Add customer information if provided
      if (customer_email) {
        subscriptionData.customer = {
          email: customer_email,
        };

        if (customer_name) {
          subscriptionData.customer.name = customer_name;
        }

        if (customer_phone) {
          subscriptionData.customer.contact = customer_phone;
        }
      }

      console.log("📤 Calling Razorpay API with data:", subscriptionData);
      const subscription = await razorpay.subscriptions.create(subscriptionData);
      console.log("💳 Razorpay subscription created successfully:", subscription.id);

      // Store subscription in database
      await ctx.runMutation("subscriptions:createSubscription", {
        razorpaySubscriptionId: subscription.id,
        razorpayPlanId: plan_id,
        planName: plan_name,
        amount: amount,
        currency: "INR",
        status: subscription.status,
        customerEmail: customer_email,
        customerName: customer_name,
        customerPhone: customer_phone,
        currentStart: subscription.current_start,
        currentEnd: subscription.current_end,
        totalCount: subscription.total_count,
        paidCount: subscription.paid_count,
        remainingCount: subscription.remaining_count,
        shortUrl: subscription.short_url,
        notes: subscription.notes,
        source: subscription.source,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        payments: [],
      });

      return subscription;
    } catch (error) {
      console.error("Error creating Razorpay subscription:", error);
      if (error.error && error.error.description) {
        throw new Error(error.error.description);
      }
      throw new Error(JSON.stringify(error));
    }
  },
});

export const verifySubscription = action({
  args: {
    razorpay_payment_id: v.string(),
    razorpay_subscription_id: v.string(),
    razorpay_signature: v.string(),
  },
  handler: async (ctx, args) => {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(args.razorpay_payment_id + "|" + args.razorpay_subscription_id)
      .digest('hex');

    if (expectedSignature === args.razorpay_signature) {
      // Payment is authentic - update subscription status and store payment details
      try {
        // Update subscription status to active
        await ctx.runMutation(api.subscriptions.updateSubscriptionStatus, {
          razorpaySubscriptionId: args.razorpay_subscription_id,
          status: "active",
        });

        // Store payment details
        await ctx.runMutation(api.payments.createPayment, {
          razorpayPaymentId: args.razorpay_payment_id,
          razorpaySubscriptionId: args.razorpay_subscription_id,
          amount: 0, // Will be updated when we get payment details from Razorpay
          currency: "INR",
          status: "captured",
        });

        // Add payment to subscription
        await ctx.runMutation(api.subscriptions.addPaymentToSubscription, {
          razorpaySubscriptionId: args.razorpay_subscription_id,
          payment: {
            paymentId: args.razorpay_payment_id,
            amount: 0, // Will be updated with actual amount
            currency: "INR",
            status: "captured",
            createdAt: Date.now(),
            captured: true,
          },
        });

        return { status: 'success', verified: true };
      } catch (dbError) {
        console.error("Error updating database:", dbError);
        // Payment is still verified, but database update failed
        return { status: 'success', verified: true, dbError: dbError.message };
      }
    } else {
      throw new Error('Invalid signature');
    }
  },
});

// Pause a subscription
export const pauseSubscription = action({
  args: {
    razorpaySubscriptionId: v.string(),
    pauseAt: v.optional(v.string()), // 'now' or future timestamp
  },
  handler: async (ctx, { razorpaySubscriptionId, pauseAt = 'now' }) => {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    try {
      const result = await razorpay.subscriptions.pause(razorpaySubscriptionId, {
        pause_at: pauseAt,
      });

      // Update subscription status in database
      await ctx.runMutation(api.subscriptions.updateSubscriptionStatus, {
        razorpaySubscriptionId,
        status: "halted",
      });

      return result;
    } catch (error) {
      console.error("Error pausing subscription:", error);
      if (error.error && error.error.description) {
        throw new Error(error.error.description);
      }
      throw new Error(JSON.stringify(error));
    }
  },
});

// Resume a subscription
export const resumeSubscription = action({
  args: {
    razorpaySubscriptionId: v.string(),
    resumeAt: v.optional(v.string()), // 'now' or future timestamp
  },
  handler: async (ctx, { razorpaySubscriptionId, resumeAt = 'now' }) => {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    try {
      const result = await razorpay.subscriptions.resume(razorpaySubscriptionId, {
        resume_at: resumeAt,
      });

      // Update subscription status in database
      await ctx.runMutation(api.subscriptions.updateSubscriptionStatus, {
        razorpaySubscriptionId,
        status: "active",
      });

      return result;
    } catch (error) {
      console.error("Error resuming subscription:", error);
      if (error.error && error.error.description) {
        throw new Error(error.error.description);
      }
      throw new Error(JSON.stringify(error));
    }
  },
});

// Cancel a subscription
export const cancelSubscription = action({
  args: {
    razorpaySubscriptionId: v.string(),
    cancelAtCycleEnd: v.optional(v.boolean()), // true to cancel at end of cycle, false for immediate
  },
  handler: async (ctx, { razorpaySubscriptionId, cancelAtCycleEnd = false }) => {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    try {
      const result = await razorpay.subscriptions.cancel(razorpaySubscriptionId, {
        cancel_at_cycle_end: cancelAtCycleEnd,
      });

      // Update subscription status in database
      await ctx.runMutation(api.subscriptions.updateSubscriptionStatus, {
        razorpaySubscriptionId,
        status: cancelAtCycleEnd ? "active" : "cancelled", // Will be cancelled at end of cycle
      });

      return result;
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      if (error.error && error.error.description) {
        throw new Error(error.error.description);
      }
      throw new Error(JSON.stringify(error));
    }
  },
});

// Get subscription details
export const getSubscriptionDetails = action({
  args: {
    razorpaySubscriptionId: v.string(),
  },
  handler: async (ctx, { razorpaySubscriptionId }) => {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    try {
      const subscription = await razorpay.subscriptions.fetch(razorpaySubscriptionId);
      return subscription;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      if (error.error && error.error.description) {
        throw new Error(error.error.description);
      }
      throw new Error(JSON.stringify(error));
    }
  },
});

// Update subscription (change plan, quantity, etc.)
export const updateSubscription = action({
  args: {
    razorpaySubscriptionId: v.string(),
    planId: v.optional(v.string()),
    quantity: v.optional(v.number()),
    remainingCount: v.optional(v.number()),
    customerNotify: v.optional(v.boolean()),
    offerId: v.optional(v.string()),
  },
  handler: async (ctx, { razorpaySubscriptionId, ...updateFields }) => {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    try {
      const options: any = {};
      if (updateFields.planId) options.plan_id = updateFields.planId;
      if (updateFields.quantity) options.quantity = updateFields.quantity;
      if (updateFields.remainingCount) options.remaining_count = updateFields.remainingCount;
      if (updateFields.customerNotify !== undefined) options.customer_notify = updateFields.customerNotify;
      if (updateFields.offerId) options.offer_id = updateFields.offerId;

      options.schedule_change_at = 'now';

      const result = await razorpay.subscriptions.update(razorpaySubscriptionId, options);

      // Update subscription in database
      if (updateFields.planId) {
        await ctx.runMutation(api.subscriptions.updateSubscriptionStatus, {
          razorpaySubscriptionId,
          status: "active", // Keep current status, could be updated based on response
        });
      }

      return result;
    } catch (error) {
      console.error("Error updating subscription:", error);
      if (error.error && error.error.description) {
        throw new Error(error.error.description);
      }
      throw new Error(JSON.stringify(error));
    }
  },
});
