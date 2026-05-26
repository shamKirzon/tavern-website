import { authRepository } from "./auth.repository";
import { AuthData } from "../types/Auth";
import { sendAdminPasswordResetOTP } from "../utils/sendMail";

class AuthService {
  async login(authData: AuthData) {
    const accounts = await authRepository.getAdminAccounts();
    const user = accounts.find(
      (acc: any) =>
        acc.username === authData.username && acc.password === authData.password,
    );

    if (!user) return null;

    return { username: user.username };
  }

  async generateOtp() {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    return otp;
  }

  async sendOtp() {
    const otp = await this.generateOtp();
    await sendAdminPasswordResetOTP(otp);
    return otp;
  }

  async updatePassword(newPassword: string) {
    return await authRepository.updatePassword(newPassword);
  }
}

export const authService = new AuthService();
