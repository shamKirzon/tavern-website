import { Router } from "express";
import { orderController } from "./order.controlller";

const orderRoutes = Router();

orderRoutes.get("/get-order-list", orderController.getOrderList);
orderRoutes.get("/get-order-summary", orderController.getOrderSummary);

orderRoutes.get("/get-email/:orderId", orderController.getEmail);

export default orderRoutes;
