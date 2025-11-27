import { Router } from "express";
import { orderController } from "./order.controlller";

const orderRoutes = Router();

orderRoutes.get("/get-order-list", orderController.getOrderList);

export default orderRoutes;
