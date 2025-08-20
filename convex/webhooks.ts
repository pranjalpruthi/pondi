"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import crypto from "crypto";

// Verify webhook signature
export const verifyWebhookSignature = action({
  args: {
    body: v.string(),
    signature: v.string(),
  },
  handler: async (ctx, args) => {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET!)
      .update(args.body)
      .digest("hex");

    return expectedSignature === args.signature;
  },
});