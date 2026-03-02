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

<<<<<<< HEAD
// helloworld
=======
// testing lang ito
>>>>>>> f4218c6a2e1b9ca691a228f55d6ebacee1313b10

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

export type CancellationStatus = "pending" | "accepted" | "rejected";
