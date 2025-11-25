import express from "express";
import { getMe, loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe); // API này được bảo vệ bởi 'protect'
// router.post("/logout", authController.logout);

export default router;
