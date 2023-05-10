import express from "express";
import {
  addFriend,
  getAllUsers,
  getFriends,
  getUser,
  removeFriend,
} from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/user.middlewares";
const router = express.Router();

router.get("/getUser", authenticateToken, getUser);
router.get("/getFriends", authenticateToken, getFriends);
router.get("/getAllUsers", authenticateToken, getAllUsers);
router.patch("/addFriend", authenticateToken, addFriend);
router.patch("/removeFriend", authenticateToken, removeFriend);

export default router;
