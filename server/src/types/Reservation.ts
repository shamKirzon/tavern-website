export type ReservationData = {
  email?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  validIdUrl?: string;
  paymentUrl?: string;
  reservationType?: string;
  date?: string;
  pax?: number;
  reservationAmount: number;
  paymentReferenceNumber?: string;
  paymentAmount?: number;
};

export type ReservationImageType = "payment" | "validId";

export type ReservationStatus =
  | "none"
  | "pending"
  | "accepted"
  | "rejected"
  | "done";

export type CancellationStatus = "pending" | "accepted" | "rejected";
