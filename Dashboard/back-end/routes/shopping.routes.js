import express from "express";

import verifyJWT from "../middleware/verifyJWT.js";

import {
  getShoppings,
  createShopping,
  updateShopping,
  deleteShopping,
} from "../controllers/shopping.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", getShoppings);
router.post("/", createShopping);
router.put("/", updateShopping);
router.delete("/", deleteShopping);

export default router;
