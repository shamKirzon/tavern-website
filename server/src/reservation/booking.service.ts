import { bookingRepository } from "./booking.repository";
import { BookingData, DayStatus } from "../types/Reservation";

class BookingService {
  async getBookingDaysByMonth(year: number, month: number): Promise<BookingData> {
    const dbResult = await bookingRepository.getBookingDaysByMonth(year, month);
    return this.mapToBookingData(dbResult);
  }

  async getBookingDaysInRange(startDate: string, endDate: string): Promise<BookingData> {
    const dbResult = await bookingRepository.getBookingDaysInRange(startDate, endDate);
    return this.mapToBookingData(dbResult);
  }

  private mapToBookingData(dbResult: any[] | null): BookingData {
    if (!dbResult) return {};

    const bookingData: BookingData = {};
    dbResult.forEach((row: any) => {
      bookingData[row.date] = {
        booked: row.booked_slots,
        total: row.total_slots,
        status: row.status as DayStatus,
      };
    });

    return bookingData;
  }

  async updateBookingDays(dates: string[], status: DayStatus) {
    return await bookingRepository.updateBookingDays(dates, status);
  }
}

export const bookingService = new BookingService();
