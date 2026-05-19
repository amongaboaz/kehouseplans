/**
 * Order controllers: create, list, status updates, admin views.
 */
import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import sendEmail from "../config/nodemailer";

/** POST /api/orders — authenticated user places an order */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, paymentMethod, customerEmail } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const designIds = items.map((i: { product: string }) => i.product);

    const designs = await prisma.design.findMany({
      where: { id: { in: designIds } },
    });

    const designMap: Record<string, (typeof designs)[0]> = {};
    designs.forEach((p) => {
      designMap[p.id] = p;
    });

    const orderItems = items.map(
      (item: { product: string; quantity: number }) => {
        const dbDesign = designMap[item.product];

        if (!dbDesign) {
          throw new Error(`Design ${item.product} not found`);
        }

        return {
          product: dbDesign.id,
          title: dbDesign.title,
          price: dbDesign.price,
          documents: dbDesign.documents,
          quantity: item.quantity,
        };
      }
    );

    const subtotal = orderItems.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const total = subtotal;

    let finalEmail = customerEmail;

    if (!finalEmail) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });
      finalEmail = user?.email;
    }

    if (!finalEmail) {
      return res
        .status(400)
        .json({ message: "Customer email is required" });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        items: orderItems,
        customerEmail: finalEmail,
        paymentMethod: paymentMethod || "M-Pesa",
        subtotal,
        total,
        status: "Pending Confirmation",
        statusHistory: [
          {
            status: "Pending Confirmation",
            note: "Order placed, awaiting payment confirmation",
            timestamp: new Date(),
          },
        ],
      },
    });

    return res.status(201).json({ order });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Server error";
    return res.status(500).json({ message });
  }
};

/** GET /api/orders — current user's orders (optional ?status= filter) */
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { status } = req.query;

    const where: { userId: string; status?: string } = {
      userId: req.user.id,
    };

    if (status && status !== "all") {
      where.status = status as string;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.json({ orders });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/orders/:id — single order for authenticated user */
export const getOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id as string,
        userId: req.user.id,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ order });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** PUT /api/orders/:id/status — admin updates status; emails documents when Approved */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const rawHistory = order.statusHistory;
    let history: Array<{
      status: string;
      note: string;
      timestamp: string;
    }> = [];

    if (Array.isArray(rawHistory)) {
      history = rawHistory as typeof history;
    } else if (typeof rawHistory === "string") {
      try {
        const parsed = JSON.parse(rawHistory);
        history = Array.isArray(parsed) ? parsed : [];
      } catch {
        history = [];
      }
    }

    history.push({
      status,
      note: note || `Order ${String(status).toLowerCase()}`,
      timestamp: new Date().toISOString(),
    });

    const isPaid = status === "Approved" ? true : order.isPaid;

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id as string },
      data: {
        status,
        isPaid,
        statusHistory: history,
      },
    });

    if (status === "Approved" && order.customerEmail) {
      try {
        const orderItems = Array.isArray(order.items)
          ? (order.items as Array<{
              title: string;
              documents?: string[];
            }>)
          : [];

        let filesHtml = "";

        orderItems.forEach((item) => {
          filesHtml += `<h3 style="color:#1f2937;">${item.title}</h3>`;

          if (item.documents && item.documents.length > 0) {
            filesHtml += `<ul>`;
            item.documents.forEach((docUrl: string, idx: number) => {
              filesHtml += `<li><a href="${docUrl}" target="_blank">Download File ${
                idx + 1
              }</a></li>`;
            });
            filesHtml += `</ul>`;
          } else {
            filesHtml += `<p>No files available for this plan.</p>`;
          }
        });

        const emailBody = `
        <div style="font-family:Arial;max-width:600px;margin:auto;">
          <h2 style="color:#16a34a;">Your House Plans Are Ready!</h2>
          <p>Order ID: ${order.id}</p>
          <div>${filesHtml}</div>
        </div>
        `;

        await sendEmail({
          to: order.customerEmail,
          subject: "Your KEPlans Download Links",
          body: emailBody,
        });
      } catch (emailErr) {
        console.error("EMAIL FAILED:", emailErr);
      }
    }

    return res.json({ order: updatedOrder });
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/orders/all — admin list all orders with user info */
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ orders });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
