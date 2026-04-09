import { Router } from "express";
import {
  reservationController,
  uploadMiddleware,
} from "./reservation.controller";
import { validateUpdateReservationStatus } from "./reservation.middleware";
import { reservationService } from "./reservation.service";

const reservationRoutes = Router();

// GET
reservationRoutes.get(
  "/get-reservation-list",
  reservationController.getReservationList,
);

reservationRoutes.get(
  "/get-reservation-summary",
  reservationController.getReservationSummary,
);

reservationRoutes.get(
  "/get-reservation-cancellations",
  reservationController.getReservationCancellations,
);

reservationRoutes.get("/get-email/:customerId", reservationController.getEmail);
reservationRoutes.get(
  "/get-reservation-by-id/:reservationId",
  reservationController.getReservationById,
);

// POST
reservationRoutes.post(
  "/update-reservation-status",
  validateUpdateReservationStatus,
  reservationController.updateReservationStatus,
);
reservationRoutes.post(
  "/upload-image",
  uploadMiddleware,
  reservationController.uploadImage,
);

export default reservationRoutes;
