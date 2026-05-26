import { axiosInstance } from "./axios";

export const orderApi = {
  async getOrderList(year?: number) {
    try {
      const res = await axiosInstance.get("order/get-order-list", {
        params: { year },
      });

      if (!res?.data) throw new Error("Can't get order list.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch order list.",
      );
    }
  },

  async getOrderSummary() {
    try {
      const res = await axiosInstance.get("/order/get-order-summary");
      if (!res?.data) throw new Error("Can't get order summary.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch order summary.",
      );
    }
  },

  async getEmail(orderId: string) {
    try {
      const res = await axiosInstance.get(`/order/get-email/${orderId}`);
      if (!res?.data) throw new Error("Can't get email.");

      return res.data.email;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch email.");
    }
  },

  async getTotalRevenue(revenuePeriod: string) {
    try {
      const res = await axiosInstance.get(
        `/order/get-total-revenue/${revenuePeriod}`,
      );
      if (!res?.data) throw new Error("Can't get total revenue.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch total revenue.",
      );
    }
  },

  async getOrderCountsByPeriod(period: string) {
    try {
      const res = await axiosInstance.get(`/order/get-order-counts/${period}`);
      if (!res?.data) throw new Error("Can't get order counts.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch order counts.",
      );
    }
  },
};
