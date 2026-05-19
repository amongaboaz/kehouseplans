/**
 * Admin-only routes.
 */
import express from "express";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
import { getAdminStats } from "../controllers/adminController";

const adminRouter = express.Router();

adminRouter.get("/stats", auth, admin, getAdminStats);

export default adminRouter;
