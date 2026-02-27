import { Router } from "express";
import { reservationController } from "./reservation.controller";
import { validateUpdateReservationStatus } from "./reservation.middleware";

const reservationRoutes = Router();

// hello po kuya shammy hhehehheheh 
reservationRoutes.get(
  "/get-reservation-list",
  reservationController.getReservationList,
);

reservationRoutes.post(
  "/update-reservation-status",
  validateUpdateReservationStatus,
  reservationController.updateReservationStatus,
);

reservationRoutes.get("/get-email/:customerId", reservationController.getEmail);

export default reservationRoutes;
