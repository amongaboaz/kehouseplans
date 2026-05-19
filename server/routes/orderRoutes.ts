/**
 * Order routes — user orders and admin management.
 */
import express from "express";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
import {
  createOrder,
  getAllOrders,
  getOrder,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderContoller";

const orderRouter = express.Router();

orderRouter.get("/all", auth, admin, getAllOrders);
orderRouter.put("/:id/status", auth, admin, updateOrderStatus);
orderRouter.post("/", auth, createOrder);
orderRouter.get("/", auth, getUserOrders);
orderRouter.get("/:id", auth, getOrder);

export default orderRouter;
