/**
 * KEPlans API entry point — Express server with auth, designs, orders, admin, uploads, Inngest, Stripe.
 */
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { serve } from "inngest/express";
import authRouter from "./routes/authRoutes";
import designRouter from "./routes/designRoutes";
import uploadRouter from "./routes/uploadRoutes";
import orderRouter from "./routes/orderRoutes";
import adminRouter from "./routes/adminRoutes";
import { inngest, functions } from "./inngest/index";
import { stripeWebhook } from "./controllers/webhooks";

const app = express();


// Stripe webhook must receive raw body (register before express.json())
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(cors({
  origin:"*"
}));
app.use(express.json());

/** Health check */
app.get("/", (_req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.use("/api/auth", authRouter);
app.use("/api/designs", designRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/inngest", serve({ client: inngest, functions }));

/** Global error handler */
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
);


export default app
