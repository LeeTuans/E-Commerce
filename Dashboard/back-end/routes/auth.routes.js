import express from "express";
import {
  login,
  getMe,
  logout,
  refreshToken,
} from "../controllers/auth.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.post("/login", login);
router.get("/user-infor", verifyJWT, getMe);
router.get("/refresh", refreshToken);
router.get("/logout", logout);

export default router;
