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
    const currentYear = new Date().getFullYear();

    const summary = data?.reduce((acc, curr) => {
      const status = curr.orderStatus;
      const year = new Date(curr.sessionExpiry).getFullYear().toString();

      const items =
        typeof curr.orderItems === "string"
          ? JSON.parse(curr.orderItems)
          : curr.orderItems || [];

      const sessionQuantity = Array.isArray(items)
        ? items.reduce(
            (sum: number, item: any) => sum + (item.quantity || 0),
            0,
          )
        : 0;

      acc[status] = (acc[status] || 0) + 1;

      if (status === "done" && year === currentYear.toString()) {
        acc.orderCount = (acc.orderCount || 0) + sessionQuantity;
        acc.totalEarnings = (acc.totalEarnings || 0) + (curr.total || 0);
      }

      return acc;
    }, {} as any);

    return summary;
  }

  async getEmail(orderId: string) {
    const myEmail = await orderRepository.getEmail(orderId);
    if (!myEmail) return;
    return myEmail[0]!.email;
  }

  async getTotalRevenue(period: string) {
    const data = (await this.getOrderList()) ?? [];

    if (period === "yearly") {
      // ─── YEARLY: group by year, sum all months ──────────────────────────
      const revenueMap: Record<string, number> = {};

      for (const curr of data) {
        const year = new Date(curr.sessionExpiry).getFullYear();
        const key = `year${year}`;
        revenueMap[key] = (revenueMap[key] ?? 0) + curr.total;
      }

      // Returns: [{ year: "2024", total: 120000 }, { year: "2025", total: 98000 }, ...]
      return Object.entries(revenueMap)
        .map(([key, total]) => ({
          year: key.replace("year", ""),
          total,
        }))
        .sort((a, b) => Number(a.year) - Number(b.year));
    }

    if (period === "monthly") {
      // ─── MONTHLY: original logic (group by month, split by year) ────────
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

      const revenueData = data.reduce((acc, curr) => {
        const date = new Date(curr.sessionExpiry);
        const month = monthOrder[date.getMonth()];
        const yearKey = `year${date.getFullYear()}`;

        let existing = acc.find((item: any) => item.month === month);
        if (!existing) {
          existing = { month };
          acc.push(existing);
        }

        existing[yearKey] = (existing[yearKey] ?? 0) + curr.total;
        return acc;
      }, [] as any[]);

      const latestYear = Math.max(
        ...data.map((d) => new Date(d.sessionExpiry).getFullYear()),
      );
      const latestMonthIndex = Math.max(
        ...data
          .filter((d) => new Date(d.sessionExpiry).getFullYear() === latestYear)
          .map((d) => new Date(d.sessionExpiry).getMonth()),
      );

      // Returns: [{ month: "JAN", year2025: 30000, year2026: 45000 }, ...]
      return revenueData
        .sort(
          (a: any, b: any) =>
            monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month),
        )
        .filter(
          (item: any) => monthOrder.indexOf(item.month) <= latestMonthIndex,
        );
    }

    return [];
  }
  async getOrderCountsByPeriod(period: string) {
    const data = (await this.getOrderList()) ?? [];
    const currentYear = new Date().getFullYear();

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

      const countData = data
        .filter(
          (curr) => new Date(curr.sessionExpiry).getFullYear() === currentYear,
        )
        .reduce((acc, curr) => {
          const date = new Date(curr.sessionExpiry);
          const month = monthOrder[date.getMonth()];

          let existing = acc.find((item: any) => item.month === month);
          if (!existing) {
            existing = { month, orders: 0 };
            acc.push(existing);
          }

          existing.orders += 1;
          return acc;
        }, [] as any[]);

      const latestMonthIndex = Math.max(
        ...data
          .filter(
            (d) => new Date(d.sessionExpiry).getFullYear() === currentYear,
          )
          .map((d) => new Date(d.sessionExpiry).getMonth()),
      );

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
            existing = { day, orders: 0 };
            acc.push(existing);
          }

          existing.orders += 1;
          return acc;
        }, [] as any[]);

      return countData.sort(
        (a: any, b: any) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day),
      );
    }

    return [];
  }
}

export const orderService = new OrderService();
