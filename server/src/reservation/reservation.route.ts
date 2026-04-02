import { Router } from "express";
import { reservationController } from "./reservation.controller";
import { validateUpdateReservationStatus } from "./reservation.middleware";
import { reservationService } from "./reservation.service";

const reservationRoutes = Router();

reservationRoutes.get(
  "/get-reservation-list",
  reservationController.getReservationList,
);

reservationRoutes.get(
  "/get-reservation-summary",
  reservationController.getReservationSummary,
);

reservationRoutes.post(
  "/update-reservation-status",
  validateUpdateReservationStatus,
  reservationController.updateReservationStatus,
);

reservationRoutes.get("/get-email/:customerId", reservationController.getEmail);

export default reservationRoutes;
