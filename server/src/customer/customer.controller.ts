import { Request, Response } from "express";
import { customerService } from "./customer.service";

class CustomerController {
  async getCustomerCountsByPeriod(req: Request, res: Response) {
    try {
      const period = req.params.period || "";
      const result = await customerService.getCustomerCountsByPeriod(period);

      if (!result)
        return res
          .status(400)
          .json({ message: "There is no returned customer counts." });

      return res
        .status(200)
        .json({ message: "Returned customer counts successfully.", result });
    } catch (error: any) {
      console.error("error from getCustomerCountsByPeriod(): ", error);
      return res
        .status(400)
        .json({ message: "can not return customer counts" });
    }
  }
}

export const customerController = new CustomerController();
