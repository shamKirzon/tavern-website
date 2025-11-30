import { axiosInstance } from "./axios";

export const orderApi = {
  async getOrderList() {
    try {
      const res = await axiosInstance.get("order/get-order-list");

      if (!res) return console.log("Can't get order list. ");

      return res.data.result;
    } catch (error) {
      console.log("Error in orderApi/getOrderList(): ", error);
    }
  },

  async getEmail(orderId: string) {
    try {
      const res = await axiosInstance.get(`/order/get-email/${orderId}`);
      if (!res) return console.log("Can't get email.");

      return res.data.email;
    } catch (error) {
      console.log("Error in reservationApi/getReservationList(): ", error);
    }
  },
};
