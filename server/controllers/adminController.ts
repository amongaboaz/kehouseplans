/**
 * Admin dashboard statistics.
 */
import { Request, Response } from "express";
import { prisma } from "../config/prisma";

/** GET /api/admin/stats — order/user/design counts and recent orders */
export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const [totalOrders, totalUsers, totalDesigns, recentOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.user.count(),
        prisma.design.count(),
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        }),
      ]);

    return res.json({
      totalOrders,
      totalUsers,
      totalDesigns,
      recentOrders,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    return res.status(500).json({
      message: "Failed to load admin stats",
    });
  }
};
