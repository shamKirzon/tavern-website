import { axiosInstance } from "./axios";

export const customerApi = {
  async getCustomerCountsByPeriod(period: string) {
    try {
      const res = await axiosInstance.get(
        `/customer/get-customer-counts-by-period/${period}`,
      );
      if (!res) return console.log("Can't get the customer counts.");

      return res.data.result;
    } catch (error) {
      console.log("Error in customerApi/getCustomerCountsByPeriod(): ", error);
    }
  },
};
