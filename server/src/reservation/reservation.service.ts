import { ReservationStatus } from "../types/Reservation";
import { reservationRepository } from "./reservation.repository";
import camelcaseKeys from "camelcase-keys";

class ReservationService {
  async getReservationList() {
    const dbResult = await reservationRepository.getReservationList();
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

  async getReservationSummary() {
    const data = await this.getReservationList();

    const summary = data?.reduce((acc, curr) => {
      const status = curr.reservationStatus;

      acc.reservationCount = (acc.total || 0) + 1;
      acc[status] = (acc[status] || 0) + 1;

      return acc;
    }, {});

    return summary;
  }
}

export const reservationService = new ReservationService();
