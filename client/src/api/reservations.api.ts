import type {
  BookingData,
  CancellationStatus,
  DayStatus,
  ReservationStatus,
} from "../types/Reservation";
import { axiosInstance } from "./axios";

export const reservationsApi = {
  async getReservationTrends(year?: number) {
    try {
      const res = await axiosInstance.get("/reservation/get-reservation-trends", {
        params: { year },
      });
      if (!res) return console.log("Can't get reservation trends.");

      return res.data.result;
    } catch (error) {
      console.log("Error in reservationApi/getReservationTrends(): ", error);
    }
  },

  async getAvailableYears() {
    try {
      const res = await axiosInstance.get("/reservation/get-available-years");
      if (!res) return console.log("Can't get available years.");

      return res.data.result;
    } catch (error) {
      console.log("Error in reservationApi/getAvailableYears(): ", error);
    }
  },

  async getBookingDaysByMonth(
    year: number,
    month: number,
  ): Promise<BookingData> {
    try {
      const res = await axiosInstance.get("/booking-days", {
        params: { year, month: month + 1 },
      });
      if (!res) return {};

      return res.data.result;
    } catch (error) {
      console.log("Error in reservationApi/getBookingDaysByMonth(): ", error);
      return {};
    }
  },

  async getBookingDaysInRange(
    startDate: string,
    endDate: string,
  ): Promise<BookingData> {
    try {
      const res = await axiosInstance.get("/booking-days/range", {
        params: { startDate, endDate },
      });
      if (!res) return {};

      return res.data.result;
    } catch (error) {
      console.log("Error in reservationApi/getBookingDaysInRange(): ", error);
      return {};
    }
  },

  async getReservationCalendarSummary(
    year: number,
    month: number,
  ): Promise<{ date: string; count: number }[]> {
    try {
      const res = await axiosInstance.get("/reservation/calendar-summary", {
        params: { year, month: month + 1 },
      });
      if (!res) return [];

      return res.data.result;
    } catch (error) {
      console.log(
        "Error in reservationApi/getReservationCalendarSummary(): ",
        error,
      );
      return [];
    }
  },

  async updateBookingDays(dates: string[], status: DayStatus): Promise<void> {
    try {
      const res = await axiosInstance.patch("/booking-days", {
        dates,
        status,
      });
      if (!res) return console.log("Can't update booking days.");
    } catch (error) {
      console.log("Error in reservationApi/updateBookingDays(): ", error);
    }
  },

  async getReservationList() {
    try {
      const res = await axiosInstance.get("/reservation/get-reservation-list");
      if (!res) return console.log("Can't get reservation list.");

      return res.data.result;
    } catch (error) {
      console.log("Error in reservationApi/getReservationList(): ", error);
    }
  },

  async getReservationCancellations() {
    try {
      const res = await axiosInstance.get(
        "/reservation/get-reservation-cancellations",
      );
      if (!res) return console.log("Can't get reservation cancellations.");

      return res.data.result;
    } catch (error) {
      console.log(
        "Error in reservationApi/getReservationCancellations(): ",
        error,
      );
    }
  },

  async getReservationSummary() {
    try {
      const res = await axiosInstance.get(
        "/reservation/get-reservation-summary",
      );
      if (!res) return console.log("Can't get reservation summary.");

      return res.data.result;
    } catch (error) {
      console.log("Error in reservationApi/getReservationSummmary(): ", error);
    }
  },
  async getReservationById(reservationId: string) {
    try {
      const res = await axiosInstance.get(
        `/reservation/get-reservation-by-id/${reservationId}`,
      );
      if (!res) return console.log("Can't get reservation data.");

      return res.data.data[0];
    } catch (error) {
      console.log("Error in reservationApi/getReservationById(): ", error);
    }
  },

  async getEmail(customerId: string) {
    try {
      const res = await axiosInstance.get(
        `/reservation/get-email/${customerId}`,
      );
      if (!res) return console.log("Can't get reservation list.");

      return res.data.email;
    } catch (error) {
      console.log("Error in reservationApi/getReservationList(): ", error);
    }
  },

  async updateReservationStatus(
    reservationId: string,
    status: ReservationStatus,
  ) {
    try {
      const res = await axiosInstance.post(
        `/reservation/update-reservation-status`,
        {
          reservationId,
          status,
        },
      );
      if (!res) return console.log("Can't update reservation status.");

      return res.data.message;
    } catch (error) {
      console.log("Error in reservationApi/updateReservationStatus(): ", error);
    }
  },
  async updateCancellationStatus(
    reservationCancellationId: string,
    status: CancellationStatus,
  ) {
    try {
      const res = await axiosInstance.post(
        `/reservation/update-cancellation-status`,
        {
          reservationCancellationId,
          status,
        },
      );
      if (!res) return console.log("Can't update cancellation status.");

      return res.data.message;
    } catch (error) {
      console.log(
        "Error in reservationApi/updateCancellationStatus(): ",
        error,
      );
    }
  },

  async uploadImage(file: File, type: string, reservationId: string) {
    try {
      if (!file) {
        console.log("It must have a file");
        return;
      }

      const data = await this.getReservationById(reservationId);

      const formData = new FormData();

      const renamedFile = new File(
        [file],
        `${data.firstName}${data.lastName}-refundReceipt`,
        { type: file.type },
      );
      formData.append("file", renamedFile);
      formData.append("type", type);
      formData.append("reservationId", data.reservationId);

      const res = await axiosInstance.post(
        "/reservation/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (!res) {
        console.log("Can't upload image");
        return;
      }

      return res.data.imageUrl;
    } catch (error: any) {
      console.log("Error in uploadImage()", error.message);
    }
  },
};
