import { orderRepository } from "../order/order.repository";
import { orderService } from "../order/order.service";
import { ReservationStatus } from "../types/Reservation";
import camelcaseKeys from "camelcase-keys";

class CustomerService {
  async getCustomerCountsByPeriod(period: string) {
    const data = (await orderService.getOrderList()) ?? [];

    if (period === "monthly") {
      const monthOrder = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];

      const currentYear = new Date().getFullYear();

      const countData = data
        .filter(
          (curr) => new Date(curr.sessionExpiry).getFullYear() === currentYear,
        )
        .reduce((acc, curr) => {
          const date = new Date(curr.sessionExpiry);
          const month = monthOrder[date.getMonth()];

          let existing = acc.find((item: any) => item.month === month);
          if (!existing) {
            existing = { month, customers: 0 };
            acc.push(existing);
          }

          existing.customers += 1;
          return acc;
        }, [] as any[]);

      const latestMonthIndex = Math.max(
        ...data
          .filter(
            (d) => new Date(d.sessionExpiry).getFullYear() === currentYear,
          )
          .map((d) => new Date(d.sessionExpiry).getMonth()),
      );

      // Returns: [{ month: "JAN", customers: 12 }, ...]
      return countData
        .sort(
          (a: any, b: any) =>
            monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month),
        )
        .filter(
          (item: any) => monthOrder.indexOf(item.month) <= latestMonthIndex,
        );
    }

    if (period === "weekly") {
      const dayOrder = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

      const currentYear = new Date().getFullYear();

      const getDayLabel = (date: Date) => {
        const jsDay = date.getDay();
        const monFirstIndex = (jsDay + 6) % 7;
        return dayOrder[monFirstIndex];
      };

      const countData = data
        .filter(
          (curr) => new Date(curr.sessionExpiry).getFullYear() === currentYear,
        )
        .reduce((acc, curr) => {
          const date = new Date(curr.sessionExpiry);
          const day = getDayLabel(date);

          let existing = acc.find((item: any) => item.day === day);
          if (!existing) {
            existing = { day, customers: 0 };
            acc.push(existing);
          }

          existing.customers += 1;
          return acc;
        }, [] as any[]);

      return countData.sort(
        (a: any, b: any) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day),
      );
    }

    return [];
  }
}

export const customerService = new CustomerService();
