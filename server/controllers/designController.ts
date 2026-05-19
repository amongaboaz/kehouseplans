/**
 * Design (house plan) CRUD and listing controllers.
 */
import { Request, Response } from "express";
import { prisma } from "../config/prisma";

/** GET /api/designs/featured — up to 8 featured designs */
export const getFeaturedDesigns = async (req: Request, res: Response) => {
  try {
    const designs = await prisma.design.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return res.json({ designs });
  } catch (error) {
    console.error("GET FEATURED DESIGNS ERROR:", error);
    return res.status(500).json({ message: "Failed to load featured designs" });
  }
};

/** GET /api/designs — list with optional filters (category, search, price, sort) */
export const getDesigns = async (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    const where: Record<string, unknown> = {};

    if (category && category !== "all") {
      where.category = category as string;
    }

    if (search) {
      where.title = {
        contains: search as string,
        mode: "insensitive",
      };
    }

    if (minPrice || maxPrice) {
      const price: { gte?: number; lte?: number } = {};
      if (minPrice) price.gte = Number(minPrice);
      if (maxPrice) price.lte = Number(maxPrice);
      where.price = price;
    }

    const orderBy: Record<string, "asc" | "desc"> = {};
    if (sort === "price-low") {
      orderBy.price = "asc";
    } else if (sort === "price-high") {
      orderBy.price = "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const designs = await prisma.design.findMany({ where, orderBy });

    return res.json({ designs });
  } catch (error) {
    console.error("GET DESIGNS ERROR:", error);
    return res.status(500).json({ message: "Failed to load designs" });
  }
};

/** GET /api/designs/:id — single design by id */
export const getDesign = async (req: Request, res: Response) => {
  try {
    const design = await prisma.design.findUnique({
      where: { id: req.params.id as string },
    });

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    return res.json({ design });
  } catch (error) {
    console.error("GET DESIGN ERROR:", error);
    return res.status(500).json({ message: "Failed to load design" });
  }
};

/** POST /api/designs — admin create design */
export const createDesign = async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      price: Number(req.body.price),
      bedrooms: Number(req.body.bedrooms || 0),
      bathrooms: Number(req.body.bathrooms || 0),
      squareMeters: Number(req.body.squareMeters || 0),
      featured:
        req.body.featured === true || req.body.featured === "true",
    };

    const design = await prisma.design.create({ data });
    return res.status(201).json({ design });
  } catch (error) {
    console.error("CREATE DESIGN ERROR:", error);
    return res.status(500).json({ message: "Failed to create design" });
  }
};

/** PUT /api/designs/:id — admin update design */
export const updateDesign = async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      price: Number(req.body.price),
      bedrooms: Number(req.body.bedrooms || 0),
      bathrooms: Number(req.body.bathrooms || 0),
      squareMeters: Number(req.body.squareMeters || 0),
      featured:
        req.body.featured === true || req.body.featured === "true",
    };

    const design = await prisma.design.update({
      where: { id: req.params.id as string },
      data,
    });

    return res.json({ design });
  } catch (error) {
    console.error("UPDATE DESIGN ERROR:", error);
    return res.status(500).json({ message: "Failed to update design" });
  }
};

/** DELETE /api/designs/:id — admin delete design */
export const deleteDesign = async (req: Request, res: Response) => {
  try {
    await prisma.design.delete({
      where: { id: req.params.id as string },
    });

    return res.json({ message: "Design deleted" });
  } catch (error) {
    console.error("DELETE DESIGN ERROR:", error);
    return res.status(500).json({ message: "Failed to delete design" });
  }
};
