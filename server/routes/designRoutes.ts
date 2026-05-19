/**
 * Design routes — public read, admin write.
 */
import express from "express";
import {
  createDesign,
  deleteDesign,
  getFeaturedDesigns,
  getDesign,
  getDesigns,
  updateDesign,
} from "../controllers/designController";
import auth from "../middleware/auth";
import admin from "../middleware/admin";

const designRouter = express.Router();

designRouter.get("/featured", getFeaturedDesigns);
designRouter.get("/", getDesigns);
designRouter.get("/:id", getDesign);
designRouter.post("/", auth, admin, createDesign);
designRouter.put("/:id", auth, admin, updateDesign);
designRouter.delete("/:id", auth, admin, deleteDesign);

export default designRouter;
