import { supabase } from "../lib/supabase-client";
import { ReservationStatus } from "../types/Reservation";

class OrderRepository {
  async getOrderList() {
    try {
      const { data, error } = await supabase.from("orders").select("*");

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error in repository/getOrderList():", error);
    }
  }
}

export const orderRepository = new OrderRepository();
