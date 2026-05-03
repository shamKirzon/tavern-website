import { supabase } from "../lib/supabase-client";
import { ReservationStatus } from "../types/Reservation";

class OrderRepository {
  async getOrderList(year?: number) {
    try {
      let query = supabase.from("orders").select("*");

      if (year) {
        const start = `${year}-01-01`;
        const end = `${year}-12-31`;
        query = query.gte("session_expiry", start).lte("session_expiry", end);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error in repository/getOrderList():", error);
    }
  }

  async getEmail(orderId: string) {
    try {
      // getting reservation id:
      const { data: reservation, error: reservationError } = await supabase
        .from("orders")
        .select("reservation_id")
        .eq("order_id", orderId);

      if (!reservation) return;
      const reservationId = reservation[0]?.reservation_id;

      // getting email:
      const { data: customer, error: customerError } = await supabase
        .from("reservations")
        .select("customer_id")
        .eq("reservation_id", reservationId);

      if (!customer) return;
      const customerId = customer[0]?.customer_id;

      const { data, error } = await supabase
        .from("customers")
        .select("email")
        .eq("customer_id", customerId);

      if (!data) return;

      return data;
    } catch (error) {
      console.error("Error in repository/getReservationList():", error);
    }
  }
}

export const orderRepository = new OrderRepository();
