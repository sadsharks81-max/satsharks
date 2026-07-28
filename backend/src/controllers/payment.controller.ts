import { Request, Response } from "express";
import Stripe from "stripe";
import { env } from "../config/env";
import User from "../models/User";
import SubscriptionPlan from "../models/SubscriptionPlan";
import { phaseOneSubscriptionPlans } from "../data/phaseOne";

const stripe = new Stripe(env.stripeSecretKey || "sk_test_dummy", {
  apiVersion: "2024-12-18.acacia" as any, // using as any since we don't know the exact string, but typically you just omit it or use any
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { planId, region } = req.body;

    let user: any = null;
    if (userId) {
      user = await User.findById(userId);
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

    // Format price: $199 -> 19900 (Stripe takes cents)
    // If plan.price is "$199", parse the number. If it's "$0" or "Free", throw error.
    const numericPrice = parseInt(plan.price.replace(/[^0-9]/g, ""));
    if (isNaN(numericPrice) || numericPrice === 0) {
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
            unit_amount: numericPrice * 100, // in cents
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
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Server Error" });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // IMPORTANT: requires raw body parser
      sig,
      env.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
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
        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          // Create new user for the guest
          user = await User.create({
            email: email.toLowerCase(),
            password: Math.random().toString(36).slice(-10) + "A1!", // Dummy password
            name: session.customer_details?.name || "Guest Student",
            role: "STUDENT",
            region: "INTERNATIONAL",
            subscription: "PAID",
            subscriptionPlan: plan?.name || "Premium",
            subscriptionExpiry: expiry,
          });
          console.log(`Created new user from guest checkout: ${email}`);
        } else {
          // Update existing user
          user.subscription = "PAID";
          user.subscriptionPlan = plan?.name || "Premium";
          user.subscriptionExpiry = expiry;
          await user.save();
          console.log(`Updated existing user from guest checkout: ${email}`);
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
