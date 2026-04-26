import { Request, Response } from "express";
import { reservationService } from "./reservation.service";
import { uploadImageWithUrl } from "../utils/uploadImageWithUrl";

import multer from "multer";
import { reservationRepository } from "./reservation.repository";

const upload = multer({ dest: "uploads/" });
export const uploadMiddleware = upload.single("file");

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

  async getReservationCancellations(req: Request, res: Response) {
    try {
      const result = await reservationService.getReservationCancellations();

      if (!result)
        return res.status(400).json({
          message: "There is no returned reservation cancellation list. ",
        });

      return res.status(200).json({
        message: "Fetched reservation cancellation list successfully. ",
        result,
      });
    } catch (error: any) {
      console.error("error from getReservationCancellations(): ", error);
      return res
        .status(400)
        .json({ message: "can't get reservation cancellations" });
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

  async getReservationCalendarSummary(req: Request, res: Response) {
    try {
      const { year, month } = req.query;

      if (!year || !month) {
        return res
          .status(400)
          .json({ message: "Year and month are required." });
      }

      const result = await reservationService.getReservationCalendarSummary(
        Number(year),
        Number(month),
      );

      return res.status(200).json({
        message: "Fetched reservation calendar summary successfully.",
        result,
      });
    } catch (error: any) {
      console.error("error from getReservationCalendarSummary(): ", error);
      return res
        .status(400)
        .json({ message: "can't fetch reservation calendar summary" });
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
  async updateCancellationStatus(req: Request, res: Response) {
    try {
      const { reservationCancellationId, status } = req.body;

      if (!reservationCancellationId || !status)
        return res
          .status(400)
          .json({ message: "It must have a reservation id or status" });

      const result = await reservationService.updateCancellationStatus(
        reservationCancellationId,
        status,
      );

      if (!result)
        return res
          .status(200)
          .json({ message: "Can't update the cancellation status." });

      return res.status(200).json({ message: result.message });
    } catch (error: any) {
      console.error("error from updateCancellationtatus(): ", error);
      return res
        .status(400)
        .json({ message: "can't update cancellation status" });
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
  async getReservationById(req: Request, res: Response) {
    try {
      const { reservationId } = req.params;

      if (!reservationId)
        return res
          .status(400)
          .json({ message: "It must have a reservation id." });

      const data = await reservationService.getReservationById(reservationId);

      if (!data) return res.status(200).json({ message: "Can't get email." });

      return res
        .status(200)
        .json({ message: "get information successfully", data });
    } catch (error: any) {
      console.error("error from getReservationById(): ", error);
      return res.status(400).json({ message: "can't get reservation" });
    }
  }

  async uploadImage(req: Request, res: Response) {
    try {
      if (!(req as any).file)
        return res.status(400).json({ message: "no file uploaded" });

      const localFile = (req as any).file;
      const type = req.body.type;
      const reservationId = req.body.reservationId;

      const imageUrl = await uploadImageWithUrl({ localFile, type });

      if (!imageUrl) return;

      await reservationRepository.uploadRefundReceipt(reservationId, imageUrl);

      return res
        .status(200)
        .json({ message: "image uploaded successfully", imageUrl });
    } catch (error: any) {
      console.log("Error in uploadImage(): ", error);
      return res.status(400).json({ message: "can't upload image" });
    }
  }
}

export const reservationController = new ReservationController();
