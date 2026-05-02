import { axiosInstance } from "./axios";

export const authApi = {
  async login(authData: any) {
    try {
      const res = await axiosInstance.post("/auth/login", authData);
      if (!res) return console.log("Can't login.");

      return res.data;
    } catch (error) {
      console.log("Error in authApi/login(): ", error);
      throw error;
    }
  },

  async generateOtp() {
    try {
      const res = await axiosInstance.post("/auth/generate-otp");
      if (!res) return console.log("Can't generate OTP.");

      return res.data;
    } catch (error) {
      console.log("Error in authApi/generateOtp(): ", error);
      throw error;
    }
  },

  async sendOtp() {
    try {
      const res = await axiosInstance.post("/auth/send-otp");
      if (!res) return console.log("Can't send OTP.");

      return res.data;
    } catch (error) {
      console.log("Error in authApi/sendOtp(): ", error);
      throw error;
    }
  },

  async updatePassword(password: string) {
    try {
      const res = await axiosInstance.post("/auth/update-password", {
        password,
      });
      if (!res) return console.log("Can't update password.");

      return res.data;
    } catch (error) {
      console.log("Error in authApi/updatePassword(): ", error);
      throw error;
    }
  },
};
