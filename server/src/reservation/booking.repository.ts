import { supabase } from "../lib/supabase-client";
import { DayStatus } from "../types/Reservation";

class BookingRepository {
  async getBookingDaysByMonth(year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

    return await this.getBookingDaysInRange(startDate, endDate);
  }

  async getBookingDaysInRange(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from("booking_days")
        .select("*")
        .gte("date", startDate)
        .lte("date", endDate);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in BookingRepository/getBookingDaysInRange:", error);
      return null;
    }
  }

  async updateBookingDays(dates: string[], status: DayStatus) {
    try {
      // 1. Fetch current reservation pax counts for these dates to avoid resetting them to 0
      const { data: reservations, error: countError } = await supabase
        .from("reservations")
        .select("date, pax")
        .in("date", dates)
        .in("reservation_status", ["accepted", "done"]);

      if (countError) throw countError;

      const paxMap = (reservations || []).reduce((acc: any, curr: any) => {
        const pax = Number(curr.pax) || 0;
        acc[curr.date] = (acc[curr.date] || 0) + pax;
        return acc;
      }, {});

      // 2. Prepare records
      const records = dates.map((date) => ({
        date,
        status,
        total_slots: 100, // Default as per schema
        booked_slots: paxMap[date] || 0,
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
