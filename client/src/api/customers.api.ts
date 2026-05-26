import { axiosInstance } from "./axios";

export const customerApi = {
  async getCustomerCountsByPeriod(period: string) {
    try {
      const res = await axiosInstance.get(
        `/customer/get-customer-counts-by-period/${period}`,
      );
      if (!res?.data) throw new Error("Can't get the customer counts.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch customer counts.",
      );
    }
  },
};
