import { supabase } from "../lib/supabase-client";
import { DayStatus } from "../types/Reservation";

class BookingRepository {
  async getBookingDaysByMonth(year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

    try {
      const { data, error } = await supabase
        .from("booking_days")
        .select("*")
        .gte("date", startDate)
        .lte("date", endDate);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in BookingRepository/getBookingDaysByMonth:", error);
      return null;
    }
  }

  async updateBookingDays(dates: string[], status: DayStatus) {
    try {
      // Upsert: for each date, if it exists, update status. If not, insert with default slots.
      // Supabase .upsert() with 'date' as the conflict column.
      const records = dates.map((date) => ({
        date,
        status,
        total_slots: 100, // Default as per schema
        booked_slots: 0,
      }));

      const { data, error } = await supabase
        .from("booking_days")
        .upsert(records, { onConflict: "date" });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in BookingRepository/updateBookingDays:", error);
      return null;
    }
  }
}

export const bookingRepository = new BookingRepository();
