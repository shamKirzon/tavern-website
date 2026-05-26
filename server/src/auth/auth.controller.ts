import { Request, Response } from "express";
import { authService } from "./auth.service";
import { logger } from "../utils/logger";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);

      if (!result) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      return res.status(200).json({
        message: "Login successful",
        result,
      });
    } catch (error) {
      logger.error("error from login(): ", error);
      return res
        .status(500)
        .json({ message: "An error occurred during login" });
    }
  }

  async generateOtp(req: Request, res: Response) {
    try {
      const otp = await authService.generateOtp();
      // OTP logging removed for security

      return res.status(200).json({ otp });
    } catch (error) {
      logger.error("error from generateOtp(): ", error);
      return res
        .status(500)
        .json({ message: "An error occurred while generating OTP" });
    }
  }

  async sendOtp(req: Request, res: Response) {
    try {
      const otp = await authService.sendOtp();
      // OTP logging removed for security
      return res.status(200).json({ message: "OTP sent successfully", otp });
    } catch (error) {
      logger.error("error from sendOtp(): ", error);
      return res
        .status(500)
        .json({ message: "An error occurred while sending OTP" });
    }
  }

  async updatePassword(req: Request, res: Response) {
    const { password } = req.body;
    try {
      const result = await authService.updatePassword(password);
      if (result.status === "success") {
        return res.status(200).json({ status: "success" });
      }
      return res
        .status(400)
        .json({ status: "error", message: "Failed to update password" });
    } catch (error) {
      logger.error("error from updatePassword(): ", error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred during password update",
      });
    }
  }
}

export const authController = new AuthController();
