import { ReservationStatus } from "../types/Reservation";
import { orderRepository } from "./order.repository";
import camelcaseKeys from "camelcase-keys";

class OrderService {
  async getOrderList() {
    const dbResult = await orderRepository.getOrderList();
    if (!dbResult) return;

    return camelcaseKeys(dbResult ?? [], { deep: true });
  }

  async getOrderSummary() {
    const data = await this.getOrderList();

    const summary = data?.reduce((acc, curr) => {
      const status = curr.orderStatus;

      acc.orderCount = (acc.orderCount || 0) + 1;
      acc[status] = (acc[status] || 0) + 1;

      if (status === "done") {
        acc.totalEarnings = (curr.total || 0) + (acc.total || 0);
      }

      return acc;
    }, {});

    return summary;
  }

  async getEmail(orderId: string) {
    const myEmail = await orderRepository.getEmail(orderId);
    if (!myEmail) return;
    return myEmail[0]!.email;
  }
}

export const orderService = new OrderService();
