import express from "express";
import { getJwt, logout, signIn, signUp } from "../controllers/auth.controller";
const router = express.Router();

router.post("/register", signUp);
router.post("/login", signIn);
router.get("/logout", logout);
router.get("/jwtid", getJwt);
export default router;
