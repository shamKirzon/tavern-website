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
      if (!res?.data) throw new Error("Can't get reservation trends.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch reservation trends.",
      );
    }
  },

  async getAvailableYears() {
    try {
      const res = await axiosInstance.get("/reservation/get-available-years");
      if (!res?.data) throw new Error("Can't get available years.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch available years.",
      );
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
      if (!res?.data) return {};

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking days.",
      );
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
      if (!res?.data) return {};

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking days in range.",
      );
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
      if (!res?.data) return [];

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch reservation calendar summary.",
      );
    }
  },

  async updateBookingDays(dates: string[], status: DayStatus): Promise<void> {
    try {
      const res = await axiosInstance.patch("/booking-days", {
        dates,
        status,
      });
      if (!res?.data) throw new Error("Can't update booking days.");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update booking days.",
      );
    }
  },

  async getReservationList(year?: number) {
    try {
      const res = await axiosInstance.get("/reservation/get-reservation-list", {
        params: { year },
      });
      if (!res?.data) throw new Error("Can't get reservation list.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch reservation list.",
      );
    }
  },

  async getReservationCancellations(year?: number) {
    try {
      const res = await axiosInstance.get(
        "/reservation/get-reservation-cancellations",
        { params: { year } },
      );
      if (!res?.data) throw new Error("Can't get reservation cancellations.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch reservation cancellations.",
      );
    }
  },

  async getPendingReservationCancellation(year?: number) {
    try {
      const res = await axiosInstance.get(
        "/reservation/get-pending-reservation-cancellations",
        { params: { year } },
      );
      if (!res?.data)
        throw new Error("Can't get pending reservation cancellations.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch pending reservation cancellations.",
      );
    }
  },

  async getReservationSummary() {
    try {
      const res = await axiosInstance.get(
        "/reservation/get-reservation-summary",
      );
      if (!res?.data) throw new Error("Can't get reservation summary.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch reservation summary.",
      );
    }
  },
  async getReservationById(reservationId: string) {
    try {
      const res = await axiosInstance.get(
        `/reservation/get-reservation-by-id/${reservationId}`,
      );
      if (!res?.data) throw new Error("Can't get reservation data.");

      return res.data.data[0];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch reservation by ID.",
      );
    }
  },

  async getEmail(customerId: string) {
    try {
      const res = await axiosInstance.get(
        `/reservation/get-email/${customerId}`,
      );
      if (!res?.data) throw new Error("Can't get email.");

      return res.data.email;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch email.");
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
      if (!res?.data) throw new Error("Can't update reservation status.");

      return res.data.message;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update reservation status.",
      );
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
      if (!res?.data) throw new Error("Can't update cancellation status.");

      return res.data.message;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to update cancellation status.",
      );
    }
  },

  async uploadImage(file: File, type: string, reservationId: string) {
    try {
      if (!file) {
        throw new Error("A file must be provided.");
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

      if (!res?.data) {
        throw new Error("Can't upload image.");
      }

      return res.data.imageUrl;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to upload image.");
    }
  },
};
