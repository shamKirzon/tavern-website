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
}

export const orderController = new OrderController();
