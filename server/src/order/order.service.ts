import { ReservationStatus } from "../types/Reservation";
import { orderRepository } from "./order.repository";
import camelcaseKeys from "camelcase-keys";

class OrderService {
  async getOrderList() {
    const dbResult = await orderRepository.getOrderList();
    if (!dbResult) return;

    return camelcaseKeys(dbResult ?? [], { deep: true });
  }

  async getEmail(orderId: string) {
    const myEmail = await orderRepository.getEmail(orderId);
    if (!myEmail) return;
    return myEmail[0]!.email;
  }
}

export const orderService = new OrderService();
