import { Router } from "express";
import { orderController } from "./order.controlller";

const orderRoutes = Router();

orderRoutes.get("/get-order-list", orderController.getOrderList);
orderRoutes.get("/get-order-summary", orderController.getOrderSummary);

orderRoutes.get("/get-total-revenue/:period", orderController.getTotalRevenue);
orderRoutes.get(
  "/get-order-counts/:period",
  orderController.getOrderCountsByPeriod,
);

export default orderRoutes;
