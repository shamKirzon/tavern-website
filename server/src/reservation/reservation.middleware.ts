import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ReservationStatus } from "../types/Reservation";

//Schemas:
const updateReservationStatusSchema = z.object({
  reservationId: z.string().uuid(), // enforce valid UUID
  status: z.enum([
    "none",
    "pending",
    "accepted",
    "rejected",
    "done",
    "cancelled",
  ]),
});

export const validateUpdateReservationStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parseResult = updateReservationStatusSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: parseResult.error, // array of readable strings
    });
  }
  next();
};
