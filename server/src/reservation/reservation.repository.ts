import { supabase } from "../lib/supabase-client";
import { ReservationStatus } from "../types/Reservation";

class ReservationRepository {
  async getReservationList() {
    try {
      const { data, error } = await supabase.from("reservations").select("*");

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error in repository/getReservationList():", error);
    }
  }

  async updateReservationStatus(
    reservationId: string,
    status: ReservationStatus
  ) {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .update([{ reservation_status: status }])
        .eq("reservation_id", reservationId);

      if (error) throw error;

      return { message: "Reservation status updated successfully. " };
    } catch (error) {
      console.error("Error in repository/getReservationList():", error);
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
      console.error("Error in repository/getReservationList():", error);
    }
  }
}

export const reservationRepository = new ReservationRepository();
