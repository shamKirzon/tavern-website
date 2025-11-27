import { axiosInstance } from "./axios";

export const reservationsApi = {
  async getReservationList() {
    try {
      const res = await axiosInstance.get("/reservation/get-reservation-list");
      if (!res) return console.log("Can't get reservation list.");

      return res.data.result;
    } catch (error) {
      console.log("Error in reservationApi/getReservationList(): ", error);
    }
  },

  async getEmail(customerId: string) {
    try {
      const res = await axiosInstance.get(
        `/reservation/get-email/${customerId}`
      );
      if (!res) return console.log("Can't get reservation list.");

      return res.data.email;
    } catch (error) {
      console.log("Error in reservationApi/getReservationList(): ", error);
    }
  },
};
