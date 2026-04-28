import { CancellationStatus, ReservationStatus } from "../types/Reservation";
import { reservationRepository } from "./reservation.repository";
import { bookingRepository } from "./booking.repository";
import camelcaseKeys from "camelcase-keys";

class ReservationService {
  async getReservationTrends() {
    const reservations = await this.getReservationList();
    const cancellations = await this.getReservationCancellations();

    const trendMap: Record<string, { approved: number; cancelled: number }> = {};

    reservations?.forEach((r) => {
      const date = r.date;
      if (!trendMap[date]) {
        trendMap[date] = { approved: 0, cancelled: 0 };
      }
      if (r.reservationStatus === "accepted" || r.reservationStatus === "done") {
        trendMap[date].approved += 1;
      }
    });

    cancellations?.forEach((c) => {
      if (c.status === "accepted") {
        const res = reservations?.find(
          (r) => r.reservationId === c.reservationId,
        );
        if (res) {
          const date = res.date;
          if (!trendMap[date]) {
            trendMap[date] = { approved: 0, cancelled: 0 };
          }
          trendMap[date].cancelled += 1;
        }
      }
    });

    return Object.entries(trendMap).map(([date, counts]) => ({
      date,
      ...counts,
    }));
  }

  async getReservationList() {
    const dbResult = await reservationRepository.getReservationList();
    if (!dbResult) return;

    return camelcaseKeys(dbResult ?? [], { deep: true });
  }

  async getReservationCancellations() {
    const dbResult = await reservationRepository.getReservationCancellations();
    if (!dbResult) return;

    return camelcaseKeys(dbResult ?? [], { deep: true });
  }

  async updateReservationStatus(
    reservationId: string,
    status: ReservationStatus,
  ) {
    return await reservationRepository.updateReservationStatus(
      reservationId,
      status,
    );
  }

  async getEmail(customerId: string) {
    const myEmail = await reservationRepository.getEmail(customerId);
    if (!myEmail) return;
    return myEmail[0]!.email;
  }
  async getReservationById(reservationId: string) {
    const data = await reservationRepository.getReservationById(reservationId);
    if (!data) return;

    return camelcaseKeys(data ?? [], { deep: true });
  }

  async getReservationSummary() {
    const data = await this.getReservationList();
    const cancellations = await this.getReservationCancellations();

    const summary = data?.reduce((acc, curr) => {
      const status = curr.reservationStatus;

      acc.reservationCount = (acc.reservationCount || 0) + 1;
      acc[status] = (acc[status] || 0) + 1;

      return acc;
    }, {});

    const enrichedCancellationsCount = cancellations?.filter(
      (c) => c.status === "pending" || c.status === "accepted",
    ).length || 0;

    if (summary) {
      summary.reservationCount = (summary.reservationCount || 0) + enrichedCancellationsCount;
    }

    return summary;
  }

  async updateCancellationStatus(
    reservationCancellationId: string,
    status: CancellationStatus,
  ) {
    return await reservationRepository.updateCancellationStatus(
      reservationCancellationId,
      status,
    );
  }

  async getReservationCalendarSummary(year: number, month: number) {
    const data = await reservationRepository.getReservationCalendarSummary(
      year,
      month,
    );
    if (!data) return [];

    const summaryMap = data.reduce((acc: any, curr: any) => {
      const date = curr.date;
      if (!acc[date]) {
        acc[date] = { date, count: 0 };
      }
      acc[date].count += 1;
      return acc;
    }, {});

    const summary: any[] = Object.values(summaryMap);

    // Sync Logic: Ensure booking_days table has records for these dates
    const existingBookingDays = await bookingRepository.getBookingDaysByMonth(
      year,
      month,
    );
    const existingMap = (existingBookingDays || []).reduce(
      (acc: any, curr: any) => {
        acc[curr.date] = curr;
        return acc;
      },
      {},
    );

    const upsertRecords = summary.map((s: any) => {
      const existing = existingMap[s.date];
      return {
        date: s.date,
        status: existing ? existing.status : "available",
        total_slots: existing ? existing.total_slots : 100,
        booked_slots: s.count,
      };
    });

    if (upsertRecords.length > 0) {
      await bookingRepository.upsertBookingRecords(upsertRecords);
    }

    return summary;
  }
}

export const reservationService = new ReservationService();

/**
 NEXT STEP :
 1. testing update cancellation status
 2. apply it to reservation / cancel request
 3. apply also the auto update like in updateReservationStatus() (line 217)
 4. Edit the reservation status enum - remove the "cancelled"
 *  */
