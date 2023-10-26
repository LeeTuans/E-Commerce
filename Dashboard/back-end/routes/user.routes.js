import express from "express";

import verifyJWT from "../middleware/verifyJWT.js";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user/user.controller.js";

const router = express.Router();

router.use(verifyJWT);

// ***
router.get("/", getUsers);
router.post("/", createUser);
router.put("/", updateUser);
router.delete("/", deleteUser);

// *** User Address
router.get("/address", getUsers);
router.post("/address", createUser);
router.put("/address", updateUser);
router.delete("/address", deleteUser);

// *** User Payment
router.get("/payments", getUsers);
router.post("/payments", createUser);
router.put("/payments", updateUser);
router.delete("/payments", deleteUser);

export default router;
