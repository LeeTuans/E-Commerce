import express from "express";

import verifyJWT from "../middleware/verifyJWT.js";

import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order/order.controller.js";

const router = express.Router();

router.use(verifyJWT);

// ***
router.get("/", getOrders);
router.post("/", createOrder);
router.put("/", updateOrder);
router.delete("/", deleteOrder);

// *** Order Payment
router.get("/payment", getOrders);
router.post("/payment", createOrder);
router.put("/payment", updateOrder);
router.delete("/payment", deleteOrder);

export default router;
