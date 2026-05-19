/**
 * Stripe webhook handler for payment events.
 * Digital house plans have no inventory — payment success marks order paid and triggers Inngest.
 */
import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../config/prisma";
import { inngest } from "../inngest/index";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

/** POST /api/stripe — Stripe webhook (raw body) */
export const stripeWebhook = async (
  request: Request,
  response: Response
) => {
  let event: Stripe.Event;

  if (!endpointSecret) {
    return response.status(500).send("Webhook secret missing");
  }

  const signature = request.headers["stripe-signature"];

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature as string,
      endpointSecret
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.warn("Webhook signature verification failed.", message);
    return response.sendStatus(400);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const paymentIntentId = paymentIntent.id;

        const session = await stripe.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!session.data.length) {
          return response.status(404).send("Session not found");
        }

        const { orderId } = session.data[0].metadata as { orderId: string };

        await prisma.order.update({
          where: { id: orderId },
          data: { isPaid: true },
        });

        await inngest.send({
          name: "order/placed",
          data: { orderId },
        });

        break;
      }

      case "payment_intent.canceled":
      case "payment_intent.payment_failed": {
        const failedPaymentIntent =
          event.data.object as Stripe.PaymentIntent;

        const sessionFailure = await stripe.checkout.sessions.list({
          payment_intent: failedPaymentIntent.id,
        });

        if (!sessionFailure.data.length) {
          return response.status(404).send("Session not found");
        }

        const failureOrderId = sessionFailure.data[0].metadata?.orderId;

        if (failureOrderId) {
          await prisma.order.delete({
            where: { id: failureOrderId },
          });
        }

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return response.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook error";
    console.error("Webhook Error:", message);
    return response.status(500).json({
      success: false,
      message,
    });
  }
};
