
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/api/razorpay/create-subscription",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    console.log("🚀 HTTP Action Started: /api/razorpay/create-subscription");

    try {
      const body = await request.json();
      console.log("📝 Request body received:", body);

      const { plan_id, plan_name, amount, customer_email, customer_name, customer_phone } = body;
      console.log("📋 Extracted data:", { plan_id, plan_name, amount, customer_email, customer_name, customer_phone });

      if (!plan_id) {
        console.error("❌ Missing plan_id");
        return new Response(JSON.stringify({ error: "Missing plan_id" }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      console.log("🔄 Calling Razorpay action with:", { plan_id, plan_name, amount, customer_email, customer_name, customer_phone });
      const subscription = await ctx.runAction(api.razorpay.createSubscription, {
        plan_id,
        plan_name,
        amount,
        customer_email,
        customer_name,
        customer_phone
      });
      console.log("✅ Success! Subscription created:", subscription?.id);

      return new Response(JSON.stringify(subscription), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.constructor.name,
        code: error.code,
        statusCode: error.statusCode
      });

      return new Response(JSON.stringify({
        error: error.message,
        details: error.stack,
        code: error.code
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// This is needed to handle preflight requests for CORS
http.route({
  path: "/api/razorpay/create-subscription",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/api/razorpay/verify-subscription",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const { 
        razorpay_payment_id, 
        razorpay_subscription_id, 
        razorpay_signature 
      } = await request.json();
      
      const verification = await ctx.runAction(api.razorpay.verifySubscription, {
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature
      });
      
      return new Response(JSON.stringify(verification), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// This is needed to handle preflight requests for CORS
http.route({
  path: "/api/razorpay/verify-subscription",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

// Webhook handler for Razorpay events
http.route({
  path: "/api/razorpay/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.text();
      const signature = request.headers.get("x-razorpay-signature");

      if (!signature) {
        return new Response(JSON.stringify({ error: "Missing signature" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Verify webhook signature using action
      const isValidSignature = await ctx.runAction(api.webhooks.verifyWebhookSignature, {
        body,
        signature,
      });

      if (!isValidSignature) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const event = JSON.parse(body);

      // Process webhook using mutation
      await ctx.runMutation(api.webhookMutations.processWebhookEvent, {
        eventType: event.event,
        razorpayEventId: event.account_id,
        entityType: event.event.split('.')[0],
        entityId: event.payload.subscription?.entity?.id || event.payload.payment?.entity?.id,
        payload: event,
        signature: signature,
      });

      return new Response(JSON.stringify({ status: "success" }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Webhook processing error:", error);

      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// Webhook preflight request handler
http.route({
  path: "/api/razorpay/webhook",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, X-Razorpay-Signature",
      },
    });
  }),
});

// Pause subscription endpoint
http.route({
  path: "/api/razorpay/pause-subscription",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const { razorpaySubscriptionId, pauseAt } = await request.json();
      const result = await ctx.runAction(api.razorpay.pauseSubscription, {
        razorpaySubscriptionId,
        pauseAt,
      });

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// Resume subscription endpoint
http.route({
  path: "/api/razorpay/resume-subscription",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const { razorpaySubscriptionId, resumeAt } = await request.json();
      const result = await ctx.runAction(api.razorpay.resumeSubscription, {
        razorpaySubscriptionId,
        resumeAt,
      });

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// Cancel subscription endpoint
http.route({
  path: "/api/razorpay/cancel-subscription",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const { razorpaySubscriptionId, cancelAtCycleEnd } = await request.json();
      const result = await ctx.runAction(api.razorpay.cancelSubscription, {
        razorpaySubscriptionId,
        cancelAtCycleEnd,
      });

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// Get subscription details endpoint
http.route({
  path: "/api/razorpay/subscription-details",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const razorpaySubscriptionId = url.searchParams.get("subscription_id");

      if (!razorpaySubscriptionId) {
        return new Response(JSON.stringify({ error: "Missing subscription_id parameter" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      const result = await ctx.runAction(api.razorpay.getSubscriptionDetails, {
        razorpaySubscriptionId,
      });

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// Update subscription endpoint
http.route({
  path: "/api/razorpay/update-subscription",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const updateData = await request.json();
      const result = await ctx.runAction(api.razorpay.updateSubscription, updateData);

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// CORS preflight handlers for new endpoints
["/api/razorpay/pause-subscription", "/api/razorpay/resume-subscription",
 "/api/razorpay/cancel-subscription", "/api/razorpay/update-subscription"].forEach(path => {
  http.route({
    path,
    method: "OPTIONS",
    handler: httpAction(async () => {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }),
  });
});

export default http;
