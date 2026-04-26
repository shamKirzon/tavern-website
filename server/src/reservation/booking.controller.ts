import { Request, Response } from "express";
import { bookingService } from "./booking.service";

class BookingController {
  async getBookingDaysByMonth(req: Request, res: Response) {
    try {
      const { year, month } = req.query;
      if (!year || !month) {
        return res.status(400).json({ message: "Year and Month are required." });
      }

      const result = await bookingService.getBookingDaysByMonth(
        Number(year),
        Number(month)
      );

      return res.status(200).json({
        message: "Fetched booking days successfully.",
        result,
      });
    } catch (error) {
      console.error("Error in BookingController/getBookingDaysByMonth:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  async updateBookingDays(req: Request, res: Response) {
    try {
      const { dates, status } = req.body;
      if (!dates || !status) {
        return res.status(400).json({ message: "Dates and status are required." });
      }

      await bookingService.updateBookingDays(dates, status);

      return res.status(200).json({
        message: "Updated booking days successfully.",
      });
    } catch (error) {
      console.error("Error in BookingController/updateBookingDays:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
}

export const bookingController = new BookingController();
