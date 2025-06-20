import express from "express";
import {
  signup,
  login,
  logout,
  protect,
  updateMe,
} from "../controllers/authController.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/updateMe").patch(protect, updateMe);

export { router };
