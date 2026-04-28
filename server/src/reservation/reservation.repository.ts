import { supabase } from "../lib/supabase-client";
import { CancellationStatus, ReservationStatus } from "../types/Reservation";

class ReservationRepository {
  async getReservationList(year?: number) {
    try {
      let query = supabase.from("reservations").select("*");
      
      if (year) {
        const start = `${year}-01-01`;
        const end = `${year}-12-31`;
        query = query.gte("date", start).lte("date", end);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error in repository/getReservationList():", error);
    }
  }

  async getReservationCancellations() {
    try {
      const { data, error } = await supabase
        .from("reservation_cancellations")
        .select("*");

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(
        "Error in repository/getReservationCancellations():",
        error,
      );
    }
  }

  async updateReservationStatus(
    reservationId: string,
    status: ReservationStatus,
  ) {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .update([{ reservation_status: status }])
        .eq("reservation_id", reservationId);

      if (error) throw error;

      return { message: "Reservation status updated successfully." };
    } catch (error) {
      console.error("Error in repository/updateReservationStatus():", error);
    }
  }

  async getEmail(customerId: string) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("email")
        .eq("customer_id", customerId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error in repository/getEmail():", error);
      return null;
    }
  }

  async getReservationById(reservationId: string) {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("reservation_id", reservationId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error in repository/getReservationById():", error);
      return null;
    }
  }

  async updateCancellationStatus(
    reservationCancellationId: string,
    status: CancellationStatus,
  ) {
    try {
      const { data, error } = await supabase
        .from("reservation_cancellations")
        .update({ status })
        .eq("reservation_cancellation_id", reservationCancellationId);

      if (error) throw error;

      return {
        message: "Reservation Cancellation status updated successfully.",
      };
    } catch (error) {
      console.error("Error in repository/updateCancellationStatus():", error);
    }
  }
  async getReservationCalendarSummary(year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("date")
        .neq("reservation_status", "cancelled")
        .gte("date", startDate)
        .lte("date", endDate);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(
        "Error in repository/getReservationCalendarSummary():",
        error,
      );
      return null;
    }
  }

  async uploadRefundReceipt(reservationId: string, imageUrl: string) {
    try {
      const { data, error } = await supabase
        .from("reservation_cancellations")
        .update({ refund_receipt_url: imageUrl })
        .eq("reservation_id", reservationId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error in repository/uploadRefundReceipt():", error);
      return null;
    }
  }
}

export const reservationRepository = new ReservationRepository();
