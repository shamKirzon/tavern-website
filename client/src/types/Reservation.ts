export type Reservation = {
  assignedSecurityId: string | null;
  createdAt: string;
  customerId: string;
  date: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  pax: number;
  paymentAmount: number;
  paymentReferenceNumber: string;
  paymentUrl: string;
  reservationAmount: number;
  reservationId: string;
  reservationStatus: ReservationStatus;
  reservationType: ReservationType;
  validIdUrl: string;
};

export type ReservationStatus =
  | "none"
  | "pending"
  | "accepted"
  | "rejected"
  | "done";

export type ReservationType = "inclusive" | "exclusive";
