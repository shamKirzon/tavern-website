import { supabase } from "../lib/supabase-client";
import { CancellationStatus, ReservationStatus } from "../types/Reservation";
import { logger } from "../utils/logger";

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

      const reservationsWithEmail = await Promise.all(
        (data || []).map(async (res: any) => {
          const customer = await this.getCustomerById(res.customer_id);
          return {
            ...res,
            email: customer?.email,
          };
        }),
      );

      return reservationsWithEmail;
    } catch (error) {
      logger.error("Error in repository/getReservationList():", error);
    }
  }

  async getReservationCancellations(year?: number) {
    try {
      let query = supabase
        .from("reservation_cancellations")
        .select("*, reservations!inner(date)")
        .eq("status", "accepted");

      if (year) {
        const start = `${year}-01-01`;
        const end = `${year}-12-31`;
        query = query
          .gte("reservations.date", start)
          .lte("reservations.date", end);
      }

      const { data: cancellations, error } = await query;

      if (error) throw error;

      const result = (cancellations || []).map((c: any) => ({
        ...c,
        date: c.reservations?.date,
      }));

      return result;
    } catch (error) {
      logger.error("Error in repository/getReservationCancellations():", error);
    }
  }

  async getPendingReservationCancellation(year?: number) {
    try {
      let query = supabase
        .from("reservation_cancellations")
        .select("*, reservations!inner(date)")
        .eq("status", "pending");

      if (year) {
        const start = `${year}-01-01`;
        const end = `${year}-12-31`;
        query = query
          .gte("reservations.date", start)
          .lte("reservations.date", end);
      }

      const { data: cancellations, error } = await query;

      if (error) throw error;

      const result = (cancellations || []).map((c: any) => ({
        ...c,
        date: c.reservations?.date,
      }));

      return result;
    } catch (error) {
      logger.error(
        "Error in repository/getPendingReservationCancellation():",
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

      if (status === "accepted") {
        const resData = await this.getReservationById(reservationId);
        if (resData && resData.length > 0) {
          const res = resData[0];
          await this.adjustBookedSlots(res.date, res.pax);
        }
      }

      return { message: "Reservation status updated successfully." };
    } catch (error) {
      logger.error("Error in repository/updateReservationStatus():", error);
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
      logger.error("Error in repository/getEmail():", error);
      return null;
    }
  }

  async getCustomerById(customerId: string) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("customer_id", customerId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error("Error in repository/getCustomerById():", error);
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
      logger.error("Error in repository/getReservationById():", error);
      return null;
    }
  }

  async updateCancellationStatus(
    reservationCancellationId: string,
    status: CancellationStatus,
  ) {
    try {
      // 1. Fetch the cancellation record to get the reservation_id
      const { data: cancellationData, error: fetchError } = await supabase
        .from("reservation_cancellations")
        .select("reservation_id")
        .eq("reservation_cancellation_id", reservationCancellationId)
        .single();

      if (fetchError) throw fetchError;

      const reservationId = cancellationData.reservation_id;

      // 2. Update the cancellation status
      const { error: updateError } = await supabase
        .from("reservation_cancellations")
        .update({ status })
        .eq("reservation_cancellation_id", reservationCancellationId);

      if (updateError) throw updateError;

      // 3. If accepted, deduct the slots
      if (status === "accepted") {
        const resData = await this.getReservationById(reservationId);
        if (resData && resData.length > 0) {
          const res = resData[0];
          // Pass negative pax to deduct slots
          await this.adjustBookedSlots(res.date, -res.pax);
        }
      }

      return {
        message: "Reservation Cancellation status updated successfully.",
      };
    } catch (error) {
      logger.error("Error in repository/updateCancellationStatus():", error);
    }
  }
  async getReservationCalendarSummary(year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("date, pax")
        .in("reservation_status", ["accepted", "done"])
        .gte("date", startDate)
        .lte("date", endDate);

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error(
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
      logger.error("Error in repository/uploadRefundReceipt():", error);
      return null;
    }
  }

  async adjustBookedSlots(date: string | undefined, pax: number | undefined) {
    try {
      if (pax === 0) return;
      const formattedDate = date?.split("T")[0];

      const { data: currentData, error: fetchError } = await supabase
        .from("booking_days")
        .select("booked_slots")
        .eq("date", formattedDate)
        .single();

      if (fetchError) throw fetchError;

      const newSlots = Math.max(
        0,
        (currentData?.booked_slots || 0) + (pax || 0),
      );

      const { data, error } = await supabase
        .from("booking_days")
        .update({ booked_slots: newSlots })
        .eq("date", formattedDate)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error("Error in repository/adjustBookedSlots():", error);
    }
  }
}

export const reservationRepository = new ReservationRepository();
