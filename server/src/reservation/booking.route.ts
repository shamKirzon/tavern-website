import { Router } from "express";
import { bookingController } from "./booking.controller";

const bookingRoutes = Router();

bookingRoutes.get("/", bookingController.getBookingDaysByMonth);
bookingRoutes.get("/range", bookingController.getBookingDaysInRange);
bookingRoutes.patch("/", bookingController.updateBookingDays);

export default bookingRoutes;
