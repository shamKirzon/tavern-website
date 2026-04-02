import { Request, Response } from "express";
import { reservationService } from "./reservation.service";

class ReservationController {
  async getReservationList(req: Request, res: Response) {
    try {
      const result = await reservationService.getReservationList();

      if (!result)
        return res
          .status(400)
          .json({ message: "There is no returned reservation list. " });

      return res
        .status(200)
        .json({ message: "Fetched reservation list successfully. ", result });
    } catch (error: any) {
      console.error("error from createReservation(): ", error);
      return res.status(400).json({ message: "can't create reservation" });
    }
  }

  async getReservationSummary(req: Request, res: Response) {
    try {
      const result = await reservationService.getReservationSummary();

      if (!result)
        return res
          .status(400)
          .json({ message: "There is no returned reservation summary. " });

      return res.status(200).json({
        message: "Fetched reservation summary successfully. ",
        result,
      });
    } catch (error: any) {
      console.error("error from getReservationSummary(): ", error);
      return res
        .status(400)
        .json({ message: "can't fetch reservation summary" });
    }
  }

  async updateReservationStatus(req: Request, res: Response) {
    try {
      const { reservationId, status } = req.body;

      if (!reservationId || !status)
        return res
          .status(400)
          .json({ message: "It must have a reservation id or status" });

      const result = await reservationService.updateReservationStatus(
        reservationId,
        status,
      );

      if (!result)
        return res
          .status(200)
          .json({ message: "Can't update the reservation status." });

      return res.status(200).json({ message: result.message });
    } catch (error: any) {
      console.error("error from createReservation(): ", error);
      return res.status(400).json({ message: "can't create reservation" });
    }
  }

  async getEmail(req: Request, res: Response) {
    try {
      const { customerId } = req.params;

      if (!customerId)
        return res.status(400).json({ message: "It must have a customer id." });

      const email = await reservationService.getEmail(customerId);

      if (!email) return res.status(200).json({ message: "Can't get email." });

      return res.status(200).json({ message: "get email successfully", email });
    } catch (error: any) {
      console.error("error from createReservation(): ", error);
      return res.status(400).json({ message: "can't create reservation" });
    }
  }
}

export const reservationController = new ReservationController();

// LAST TOUCH: TESTING MO USING CONNECTING TO FRONTEND : )
