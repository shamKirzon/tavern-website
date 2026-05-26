import { Router } from "express";
import { authController } from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/login", authController.login);
authRoutes.post("/generate-otp", authController.generateOtp);
authRoutes.post("/send-otp", authController.sendOtp);
authRoutes.post("/update-password", authController.updatePassword);

export default authRoutes;
