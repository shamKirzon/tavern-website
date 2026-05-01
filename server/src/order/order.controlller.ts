import { Request, Response } from "express";
import { orderService } from "./order.service";

class OrderController {
  async getOrderList(req: Request, res: Response) {
    try {
      const result = await orderService.getOrderList();

      if (!result)
        return res
          .status(400)
          .json({ message: "There is no returned order list. " });

      return res
        .status(200)
        .json({ message: "Fetched order list successfully. ", result });
    } catch (error: any) {
      console.error("error from getOrderList(): ", error);
      return res.status(400).json({ message: "Can't get the list of orders." });
    }
  }

  async getOrderSummary(req: Request, res: Response) {
    try {
      const result = await orderService.getOrderSummary();

      if (!result)
        return res
          .status(400)
          .json({ message: "There is no returned order summary. " });

      return res.status(200).json({
        message: "Fetched order summary successfully. ",
        result,
      });
    } catch (error: any) {
      console.error("error from getOrderSummary(): ", error);
      return res.status(400).json({ message: "can't fetch order summary" });
    }
  }

  async getEmail(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      if (!orderId)
        return res.status(400).json({ message: "It must have an order id." });

      const email = await orderService.getEmail(orderId);

      if (!email) return res.status(200).json({ message: "Can't get email." });

      return res.status(200).json({ message: "get email successfully", email });
    } catch (error: any) {
      console.error("error from (): ", error);
      return res.status(400).json({ message: "can't create reservation" });
    }
  }

  async getTotalRevenue(req: Request, res: Response) {
    try {
      const period = req.params.period || "";
      const result = await orderService.getTotalRevenue(period);

      if (!result)
        return res
          .status(400)
          .json({ message: "There is no returned total revenue. " });

      return res.status(200).json({
        message: "Returned total revenue successfully. ",
        result,
      });
    } catch (error: any) {
      console.error("error from getTotalRevenue(): ", error);
      return res.status(400).json({ message: "can't return  total revenue" });
    }
  }

  async getOrderCountsByPeriod(req: Request, res: Response) {
    try {
      const { period } = req.params;
      const result = await orderService.getOrderCountsByPeriod(period || "");

      if (!result)
        return res
          .status(400)
          .json({ message: "There is no returned order counts. " });

      return res.status(200).json({
        message: "Fetched order counts successfully. ",
        result,
      });
    } catch (error: any) {
      console.error("error from getOrderCountsByPeriod(): ", error);
      return res.status(400).json({ message: "Can't fetch order counts." });
    }
  }
}

export const orderController = new OrderController();
