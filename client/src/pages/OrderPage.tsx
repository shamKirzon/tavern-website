import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { orderApi } from "../api/orders.api";
import type {
  AdditionalOrdersFormat,
  NormalizedOrder,
  OrderFormatResponse,
} from "../types/Order";

const OrderPage: React.FC = () => {
  const [orderTotal, setOrderTotal] = useState<Record<string, number>>({});
  const [currentView, setCurrentView] = useState<string>("orders");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [customerEmails, setCustomerEmails] = useState<Record<string, string>>(
    {}
  );
  const [orderData, setOrderData] = useState<NormalizedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Type guard
  const isAdditionalOrdersFormat = (
    data: OrderFormatResponse
  ): data is AdditionalOrdersFormat => {
    return (
      "orderItems" in data &&
      typeof data.orderItems === "object" &&
      "newOrders" in data.orderItems &&
      "originalOrders" in data.orderItems
    );
  };

  // Normalize single order
  const normalizeOrder = (data: OrderFormatResponse): NormalizedOrder => {
    const baseOrder = {
      assignedCashierId: data.assignedCashierId,
      createdAt: data.createdAt,
      orderId: data.orderId,
      orderStatus: data.orderStatus,
      qrCodeUrl: data.qrCodeUrl,
      reservationId: data.reservationId,
      sessionExpiry: data.sessionExpiry,
      total: data.total,
    };

    if (isAdditionalOrdersFormat(data)) {
      return {
        ...baseOrder,
        orderItems: [
          ...data.orderItems.newOrders.items,
          ...data.orderItems.originalOrders.items,
        ],
        sourceFormat: "additional",
      };
    }

    return {
      ...baseOrder,
      orderItems: data.orderItems,
      sourceFormat: "default",
    };
  };

  // Fetch and normalize all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orders = await orderApi.getOrderList();

        if (!orders) {
          console.error("No orders returned from API");
          return;
        }

        // Handle if API returns array of orders
        const ordersArray = Array.isArray(orders) ? orders : [orders];

        // Normalize all orders
        const normalizedOrders = ordersArray.map((order) =>
          normalizeOrder(order)
        );

        console.log("NORMALIZED ORDERS; ", normalizedOrders);

        setOrderData(normalizedOrders);
        normalizedOrders.forEach((order) => {
          console.log(
            `Order ${order.orderId}: ${order.orderItems.length} items`
          );
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // fetch order total and emails
  useEffect(() => {
    const fetchEmail = async () => {
      if (!orderData) return;

      const emails: Record<string, string> = {};

      for (const res of orderData) {
        try {
          const email = await orderApi.getEmail(res.orderId);
          emails[res.orderId] = email;
        } catch (error) {
          console.error("Failed to fetch email:", error);
        }
      }

      setCustomerEmails(emails);
    };

    const fetchTotals = async () => {
      if (!orderData) return;

      const orderTotals: Record<string, number> = {};

      for (const res of orderData) {
        const total = res.orderItems.reduce(
          (sum, order) => sum + order.total,
          0
        );
        orderTotals[res.orderId] = total;
      }

      setOrderTotal(orderTotals);
    };

    fetchTotals();

    fetchEmail();
  }, [orderData]);

  const toggleOrderExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (currentView === "orders") {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Order Tracking</h1>
          </div>

          <div className="flex gap-4 items-center mb-6">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 bg-white">
              Daily
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 bg-white">
              November 21, 2025
            </button>
            <span className="text-sm font-medium">
              Number of Orders: {orderData.length}
            </span>
            <div className="ml-auto">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <ChevronDown className="w-4 h-4" />
                Sort
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>Loading orders...</p>
            </div>
          ) : orderData.length === 0 ? (
            <div className="text-center py-8">
              <p>No orders found</p>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg overflow-hidden w-full">
              <div className="space-y-0">
                {orderData.map((order, index) => (
                  <div key={order.orderId}>
                    <div
                      onClick={() => toggleOrderExpand(order.orderId)}
                      className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                        index !== orderData.length - 1
                          ? "border-b border-gray-300"
                          : ""
                      }`}
                    >
                      <div className="w-12 text-sm font-semibold text-gray-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {customerEmails[order.orderId]}
                        </div>
                      </div>
                      <div className="w-16 text-sm text-right">
                        {order.orderItems.length}
                      </div>
                      <div className="w-24 text-sm text-righ t">
                        ₱ {orderTotal[order.orderId]}
                      </div>
                      <div className="w-40 text-sm text-right text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                      <div className="w-28">
                        <span
                          className={`inline-block px-3 py-1 rounded text-white text-xs font-semibold ${
                            order.orderStatus === "done"
                              ? "bg-green-500"
                              : order.orderStatus === "pending"
                              ? "bg-orange-400"
                              : "bg-red-500"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>

                    {expandedOrderId === order.orderId &&
                      order.orderItems.length > 0 && (
                        <div className="bg-gray-50 border-t border-gray-300 px-6 py-4">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-300">
                                <th className="text-left py-2 font-semibold">
                                  Qty
                                </th>
                                <th className="text-left py-2 font-semibold">
                                  Order Name
                                </th>
                                <th className="text-left py-2 font-semibold">
                                  Serving
                                </th>
                                <th className="text-left py-2 font-semibold">
                                  Notes
                                </th>
                                <th className="text-right py-2 font-semibold">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.orderItems.map((item, itemIndex) => (
                                <tr
                                  key={itemIndex}
                                  className="border-b border-gray-200"
                                >
                                  <td className="py-2">{item.quantity}</td>
                                  <td className="py-2">{item.orderName}</td>
                                  <td className="py-2">
                                    {item.serving
                                      ? `${item.serving.servingSize
                                          .charAt(0)
                                          .toUpperCase()}${item.serving.servingSize.slice(
                                          1
                                        )}`
                                      : "N/A"}
                                  </td>
                                  <td className="py-2">{item.note || "-"}</td>
                                  <td className="py-2 text-right">
                                    ₱ {item.total.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default OrderPage;
