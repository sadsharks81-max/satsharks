import { Request, Response } from "express";
import Stripe from "stripe";
import { env } from "../config/env";
import User from "../models/User";
import SubscriptionPlan from "../models/SubscriptionPlan";
import { phaseOneSubscriptionPlans } from "../data/phaseOne";
import { generateRandomPassword, hashPassword } from "../utils/password";
import { sendError } from "../utils/http";

const stripe = new Stripe(env.stripeSecretKey || "sk_test_dummy", {
  apiVersion: "2024-12-18.acacia" as any, // using as any since we don't know the exact string, but typically you just omit it or use any
});

/**
 * Converts a display price ("$199", "$1,299", "$29.99") to Stripe's integer
 * cents. The previous `parseInt(price.replace(/[^0-9]/g,"")) * 100` stripped the
 * decimal point, so "$29.99" became 2999 dollars , a 100x overcharge , and a
 * non-string price threw inside the request handler.
 */
export const parsePriceToCents = (price: unknown): number | null => {
  if (typeof price === "number") {
    return Number.isFinite(price) && price > 0 ? Math.round(price * 100) : null;
  }
  if (typeof price !== "string") return null;

  const match = price.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  if (!match) return null;

  const amount = Number.parseFloat(match[0]);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100);
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { planId, region } = req.body;

    let user: { region?: string } | null = null;
    if (userId) {
      user = await User.findById(userId).select("region").lean<{ region: string } | null>();
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
    }

    let plan: any;
    if (env.isDatabaseConfigured) {
      plan = await SubscriptionPlan.findById(planId);
    } else {
      plan = phaseOneSubscriptionPlans.find((p: any) => p.id === planId || p._id === planId);
    }
    
    if (!plan) {
      if (planId === "rw") {
        plan = { id: "rw", name: "Reading & Writing Module", price: "$200" };
      } else if (planId === "math") {
        plan = { id: "math", name: "Math Module", price: "$200" };
      } else if (planId === "bundle") {
        plan = { id: "bundle", name: "Complete SAT Prep", price: "$350" };
      } else {
        return res.status(400).json({ success: false, error: "Invalid plan selected" });
      }
    }

    // Determine gateway
    // In future, if region is LOCAL, we will initiate PayPro here.
    // For now, Stripe is used for INTERNATIONAL.
    const checkoutRegion = user ? user.region : (region || "INTERNATIONAL");
    if (checkoutRegion === "LOCAL") {
      // Mock PayPro Implementation
      return res.status(200).json({
        success: true,
        gateway: "paypro",
        url: `${env.frontendUrl}/payment/success?session_id=mock_paypro_session_for_${planId}`
      });
    }

    // Format price: "$199" -> 19900 (Stripe takes cents)
    const unitAmount = parsePriceToCents(plan.price);
    if (unitAmount === null) {
      return res.status(400).json({ success: false, error: "Cannot process payment for free plan" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: plan.description || "Subscription plan",
            },
            unit_amount: unitAmount, // already in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment", // or 'subscription' if using Stripe Billing
      success_url: `${env.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.frontendUrl}/payment/cancel`,
      ...(userId ? { client_reference_id: userId } : {}),
      metadata: {
        planId: plan.id || plan._id.toString(),
      },
    });

    return res.status(200).json({ success: true, gateway: "stripe", url: session.url });
  } catch (error) {
    // Stripe error messages can echo account/config details, so they are logged
    // rather than returned to the caller.
    return sendError(res, error, "payment.createCheckoutSession");
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  // Without a configured secret, constructEvent cannot authenticate the caller.
  // Reject explicitly rather than relying on it to throw, so a misconfigured
  // deployment can never be coaxed into trusting forged subscription upgrades.
  if (!env.stripeWebhookSecret) {
    console.error("[error] payment.stripeWebhook: STRIPE_WEBHOOK_SECRET is not configured");
    return res.status(503).send("Webhook not configured");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // IMPORTANT: requires raw body parser
      sig,
      env.stripeWebhookSecret,
    );
  } catch (err) {
    // Logged in full, but the response body does not echo the verification
    // detail back to an unauthenticated caller.
    console.error("[error] payment.stripeWebhook signature verification failed:", err);
    return res.status(400).send("Invalid signature");
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    let userId = session.client_reference_id;
    const planId = session.metadata?.planId;
    const email = session.customer_details?.email;

    if (planId && (userId || email)) {
      let plan: any;
      if (env.isDatabaseConfigured) {
        plan = await SubscriptionPlan.findById(planId);
      } else {
        plan = phaseOneSubscriptionPlans.find((p: any) => p.id === planId || p._id === planId);
      }
      
      if (!plan) {
        if (planId === "rw") plan = { name: "Reading & Writing Module" };
        else if (planId === "math") plan = { name: "Math Module" };
        else if (planId === "bundle") plan = { name: "Complete SAT Prep" };
      }
      
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1); // Mock 1 year validity

      if (!userId && email) {
        // Guest checkout - check if user exists by email
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail }).select("_id").lean();
        if (!user) {
          // The placeholder password is bcrypt-hashed and generated from a CSPRNG.
          // Previously a Math.random() string was written straight into the
          // password field: a plaintext credential at rest, and because
          // bcrypt.compare() can never match a non-hash, the account it created
          // was permanently impossible to log into. The holder recovers access
          // through the password reset flow.
          await User.create({
            email: normalizedEmail,
            password: await hashPassword(generateRandomPassword()),
            name: session.customer_details?.name || "Guest Student",
            role: "STUDENT",
            region: "INTERNATIONAL",
            subscription: "PAID",
            subscriptionPlan: plan?.name || "Premium",
            subscriptionExpiry: expiry,
          });
          console.log(`Created new user from guest checkout: ${normalizedEmail}`);
        } else {
          await User.updateOne(
            { _id: user._id },
            {
              $set: {
                subscription: "PAID",
                subscriptionPlan: plan?.name || "Premium",
                subscriptionExpiry: expiry,
              },
            },
          );
          console.log(`Updated existing user from guest checkout: ${normalizedEmail}`);
        }
      } else if (userId) {
        await User.findByIdAndUpdate(userId, {
          subscription: "PAID",
          subscriptionPlan: plan?.name || "Premium",
          subscriptionExpiry: expiry,
        });
        console.log(`Payment successful for user ${userId}, plan ${planId}`);
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};
