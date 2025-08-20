import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Table for storing subscription information
  subscriptions: defineTable({
    // Razorpay subscription details
    razorpaySubscriptionId: v.string(),
    razorpayPlanId: v.string(),
    razorpayCustomerId: v.optional(v.string()),

    // Customer information
    customerEmail: v.optional(v.string()),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),

    // Subscription details
    planName: v.string(), // e.g., "Pushpa Seva", "Archana Seva"
    amount: v.number(), // Amount in paisa (smallest currency unit)
    currency: v.string(), // e.g., "INR"
    status: v.union(
      v.literal("created"),
      v.literal("active"),
      v.literal("pending"),
      v.literal("halted"),
      v.literal("cancelled"),
      v.literal("completed"),
      v.literal("expired")
    ),

    // Billing cycle information
    currentStart: v.optional(v.number()), // Unix timestamp
    currentEnd: v.optional(v.number()), // Unix timestamp
    totalCount: v.optional(v.number()), // Total billing cycles
    paidCount: v.optional(v.number()), // Number of paid cycles
    remainingCount: v.optional(v.number()), // Remaining cycles

    // Payment tracking
    payments: v.array(
      v.object({
        paymentId: v.string(),
        amount: v.number(),
        currency: v.string(),
        status: v.string(),
        createdAt: v.number(),
        captured: v.boolean(),
      })
    ),

    // Metadata
    notes: v.optional(v.record(v.string(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),

    // User association (if you have user authentication)
    userId: v.optional(v.string()),

    // Additional tracking
    source: v.optional(v.string()), // e.g., "api", "dashboard"
    shortUrl: v.optional(v.string()), // Razorpay short URL for subscription
  }).index("by_razorpay_subscription_id", ["razorpaySubscriptionId"])
   .index("by_user_id", ["userId"])
   .index("by_status", ["status"]),

  // Table for storing payment records
  payments: defineTable({
    // Razorpay payment details
    razorpayPaymentId: v.string(),
    razorpayOrderId: v.optional(v.string()),
    razorpaySubscriptionId: v.optional(v.string()),

    // Payment details
    amount: v.number(), // Amount in paisa
    currency: v.string(),
    status: v.union(
      v.literal("created"),
      v.literal("authorized"),
      v.literal("captured"),
      v.literal("refunded"),
      v.literal("failed")
    ),

    // Customer information
    customerEmail: v.optional(v.string()),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    customerContact: v.optional(v.string()),

    // Card/UPI details (masked for security)
    method: v.optional(v.string()), // e.g., "card", "upi", "netbanking"
    cardId: v.optional(v.string()), // Razorpay card ID
    bank: v.optional(v.string()),
    wallet: v.optional(v.string()),
    vpa: v.optional(v.string()), // UPI VPA

    // Subscription association
    subscriptionId: v.optional(v.id("subscriptions")), // Reference to subscriptions table

    // Error information
    errorCode: v.optional(v.string()),
    errorDescription: v.optional(v.string()),

    // Metadata
    description: v.optional(v.string()),
    notes: v.optional(v.record(v.string(), v.string())),
    createdAt: v.number(),
    capturedAt: v.optional(v.number()),
    failedAt: v.optional(v.number()),

    // User association
    userId: v.optional(v.string()),
  }).index("by_razorpay_payment_id", ["razorpayPaymentId"])
   .index("by_subscription_id", ["subscriptionId"])
   .index("by_user_id", ["userId"])
   .index("by_status", ["status"]),

  // Table for storing webhook events
  webhookEvents: defineTable({
    // Webhook details
    eventType: v.string(), // e.g., "subscription.activated", "payment.captured"
    razorpayEventId: v.string(), // Razorpay webhook event ID
    entityType: v.string(), // e.g., "subscription", "payment"
    entityId: v.string(), // Razorpay entity ID

    // Event payload
    payload: v.any(), // Full webhook payload

    // Processing status
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("processed"),
      v.literal("failed")
    ),
    processedAt: v.optional(v.number()),
    errorMessage: v.optional(v.string()),

    // Metadata
    createdAt: v.number(),
    signature: v.optional(v.string()), // Webhook signature for verification
  }).index("by_event_type", ["eventType"])
   .index("by_entity_id", ["entityId"])
   .index("by_status", ["status"]),

  // Table for storing customer information
  customers: defineTable({
    // Customer details
    razorpayCustomerId: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    contact: v.optional(v.string()), // Contact number with country code

    // Address information
    billingAddress: v.optional(
      v.object({
        line1: v.optional(v.string()),
        line2: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        country: v.optional(v.string()),
        postalCode: v.optional(v.string()),
      })
    ),

    // User association
    userId: v.optional(v.string()),

    // Metadata
    notes: v.optional(v.record(v.string(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_razorpay_customer_id", ["razorpayCustomerId"])
   .index("by_email", ["email"])
   .index("by_user_id", ["userId"]),
});