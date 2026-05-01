import { axiosInstance } from "./axios";

export const authApi = {
  async login(authData: any) {
    console.log("authData in api: ", authData);
    try {
      const res = await axiosInstance.post("/auth/login", authData);
      if (!res) return console.log("Can't login.");

      return res.data;
    } catch (error) {
      console.log("Error in authApi/login(): ", error);
      throw error;
    }
  },
};
