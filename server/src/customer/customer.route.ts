import { Router } from "express";
import { customerController } from "./customer.controller";

const customerRoutes = Router();

customerRoutes.get(
  "/get-customer-counts-by-period/:period",
  customerController.getCustomerCountsByPeriod,
);

export default customerRoutes;
