import { axiosInstance } from "./axios";

export const authApi = {
  async login(authData: any) {
    try {
      const res = await axiosInstance.post("/auth/login", authData);
      if (!res?.data) throw new Error("Invalid response from server");

      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  },

  async generateOtp() {
    try {
      const res = await axiosInstance.post("/auth/generate-otp");
      if (!res?.data) throw new Error("Can't generate OTP.");

      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to generate OTP.",
      );
    }
  },

  async sendOtp() {
    try {
      const res = await axiosInstance.post("/auth/send-otp");
      if (!res?.data) throw new Error("Can't send OTP.");

      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to send OTP.");
    }
  },

  async updatePassword(password: string) {
    try {
      const res = await axiosInstance.post("/auth/update-password", {
        password,
      });
      if (!res?.data) throw new Error("Can't update password.");

      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update password.",
      );
    }
  },
};
