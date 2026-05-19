/**
 * Admin authorization middleware.
 * Must run after auth. Checks user email against ADMIN_EMAILS env list.
 */
import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

const admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
      : [];

    const isAdmin = adminEmails.includes(user.email.toLowerCase());

    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    req.user = { ...req.user, id: userId, isAdmin: true };
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      message: "Admin verification failed",
    });
  }
};

export default admin;
