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
      // 1. Fetch current reservation counts for these dates to avoid resetting them to 0
      const { data: counts, error: countError } = await supabase
        .from("reservations")
        .select("date")
        .in("date", dates)
        .neq("reservation_status", "cancelled");

      if (countError) throw countError;

      const countMap = (counts || []).reduce((acc: any, curr: any) => {
        acc[curr.date] = (acc[curr.date] || 0) + 1;
        return acc;
      }, {});

      // 2. Prepare records
      const records = dates.map((date) => ({
        date,
        status,
        total_slots: 100, // Default as per schema
        booked_slots: countMap[date] || 0,
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

  async upsertBookingRecords(records: any[]) {
    try {
      const { data, error } = await supabase
        .from("booking_days")
        .upsert(records, { onConflict: "date" });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in BookingRepository/upsertBookingRecords:", error);
      return null;
    }
  }
}

export const bookingRepository = new BookingRepository();
