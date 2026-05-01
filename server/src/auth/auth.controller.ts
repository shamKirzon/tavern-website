import { Request, Response } from "express";
import { authService } from "./auth.service";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);

      if (!result) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      return res.status(200).json({
        message: "Login successful",
        result,
      });
    } catch (error) {
      console.error("error from login(): ", error);
      return res.status(500).json({ message: "An error occurred during login" });
    }
  }
}

export const authController = new AuthController();
