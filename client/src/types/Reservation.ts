export type Reservation = {
  email: string | null;
  assignedSecurityId: string | null;
  createdAt: string | null;
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
  | "cancelled"
  | "done";

export type ReservationType = "inclusive" | "exclusive";

export type Cancellation = {
  reservationCancellationId: string;
  reservationId: string;
  createdAt: string | null;
  status: CancellationStatus;
  reason: string;
  notes: string | null;
  refundReceiptUrl: string | null;
};

export type CancellationStatus = "pending" | "accepted" | "rejected" | "none";

export type DayStatus = "available" | "fullyBooked" | "closed";

export interface BookingInfo {
  booked: number;
  total: number;
  status: DayStatus;
}

export type BookingData = Record<string, BookingInfo>;
