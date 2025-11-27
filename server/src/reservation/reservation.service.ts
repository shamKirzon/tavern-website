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
    status: ReservationStatus
  ) {
    return await reservationRepository.updateReservationStatus(
      reservationId,
      status
    );
  }

  async getEmail(customerId: string) {
    const myEmail = await reservationRepository.getEmail(customerId);
    if (!myEmail) return;
    return myEmail[0]!.email;
  }
}

export const reservationService = new ReservationService();
