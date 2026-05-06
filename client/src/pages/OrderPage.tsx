import { SideBarOrder } from "@/assets/icons/icons";
import { formatReadableDate } from "@/utils/date";
import React, { useEffect, useMemo, useState } from "react";
import { orderApi } from "@/api/orders.api";
import { reservationsApi } from "@/api/reservations.api";
import { employeesApi } from "@/api/employees.api";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";

// ── TYPES ──────────────────────────────────────────────────────────────────────
interface OrderItem {
  orderName: string;
  quantity: number;
  total: number;
  price: number;
}

interface Order {
  orderId: string;
  createdAt: string;
  total: number;
  sessionExpiry: string;
  reservationId: string;
  orderStatus: string;
  orderItems: OrderItem[];
  qrCodeUrl: string;
  assignedCashierId: string;
  // Enriched fields
  name: string;
  email: string;
  type: string;
  date: string;
  status: string;
  alreadyCovered: number;
  vat: number;
  items: { name: string; qty: number; price: number }[];
  itemCount: number;
  cashierIncharge: string;
  securityIncharge: string;
}

const statusStyles: Record<string, { badge: string; border: string }> = {
  Pending: { badge: "bg-yellow-400 text-white", border: "border-yellow-400" },
  Declined: { badge: "bg-red-700 text-white", border: "border-red-700" },
  Served: { badge: "bg-green-500 text-white", border: "border-green-500" },
  Cancelled: { badge: "bg-gray-400 text-white", border: "border-gray-400" },
};

const tabs = ["All", "Pending", "Served", "Cancelled"];

const getVal = (obj: any, key: string) => obj?.attributes?.[key] ?? obj?.[key];

const OrderDetailsModal: React.FC<{ order: Order; onClose: () => void }> = ({
  order,
  onClose,
}) => {
  const total = order.items.reduce((sum, i) => sum + i.price, 0);
  const totalDue = total - order.alreadyCovered;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="text-white px-6 py-5 flex items-center justify-between"
          style={{ background: "linear-gradient(to right, #AA3131, #770B0B)" }}
        >
          <h2 className="text-xl font-bold">Order Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* ── CUSTOMER INFORMATION ── */}
          <div>
            <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wide mb-3">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Customer Information
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">Full Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    {order.name}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-800 break-all">
                    {order.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">Reservation Type</p>
                  <p className="text-sm font-medium text-gray-800">
                    {order.type}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">Date</p>
                  <p className="text-sm font-medium text-gray-800">
                    {order.date}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── STAFF INCHARGE ── */}
          <div>
            <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wide mb-3">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              Staff Incharge
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">Cashier Incharge</p>
                  <p className="text-sm font-medium text-gray-800">
                    {order.cashierIncharge}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">
                    Security Incharge
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {order.securityIncharge}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── ORDER ITEMS ── */}
          <div>
            <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wide mb-3">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Order Items
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 bg-yellow-400 px-4 py-2.5 text-xs font-bold text-gray-800 uppercase tracking-wide">
                <span>Item</span>
                <span className="text-center">QTY</span>
                <span className="text-right">Amount</span>
              </div>
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 px-4 py-3 text-sm ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                >
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-center text-gray-500">x{item.qty}</span>
                  <span className="text-right font-medium text-gray-800">
                    ₱{item.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── PAYABLE SUMMARY ── */}
          <div>
            <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wide mb-3">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Payable Summary
            </div>
            <div className="border border-gray-200 rounded-xl p-4 space-y-2.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total</span>
                <span>₱{Math.abs(total).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Already Covered</span>
                <span>₱{Math.abs(order.alreadyCovered).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 pb-3 border-b border-dashed border-gray-200">
                <span>VAT (12%)</span>
                <span>₱{Math.abs(order.vat).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-gray-900 text-base">
                  {(() => {
                    switch (order.status.toLowerCase()) {
                      case "pending":
                        return "Total Due";
                      case "served":
                        return "Total Paid";
                      case "cancelled":
                        return "Voided Amount";
                      default:
                        return "Total Due";
                    }
                  })()}
                </span>
                <span className="font-bold text-red-700 text-xl">
                  ₱{Math.abs(totalDue).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ORDER CARD ────────────────────────────────────────────────────────────────
const OrderCard: React.FC<{ order: Order; onClick: () => void }> = ({
  order,
  onClick,
}) => {
  const styles = statusStyles[order.status] || statusStyles.Pending;
  const previewItems = order.items.slice(0, 3);
  const extraCount = order.items.length - 3;

  const moreColor =
    order.status === "Pending" || order.status === "Served"
      ? "text-yellow-500"
      : order.status === "Declined"
        ? "text-red-600"
        : "text-gray-400";

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-t-4 ${styles.border} p-5 cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-0.5">
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-tight">
            {order.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{order.email}</p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${styles.badge}`}
        >
          {order.status}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-2 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          {order.type}
        </span>
        <span className="flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          {order.itemCount} items
        </span>
      </div>

      <div className="space-y-2 mb-1">
        {previewItems.map((item, i) => (
          <div key={i} className="flex justify-between text-sm text-gray-700">
            <span>{item.name}</span>
            <span>
              <span className="text-gray-400 mr-2">x{item.qty}</span>
              <span className="font-medium">
                ₱{item.price.toLocaleString()}
              </span>
            </span>
          </div>
        ))}
      </div>

      {extraCount > 0 && (
        <p className={`text-xs font-medium mt-2 mb-3 ${moreColor}`}>
          +{extraCount} more item...
        </p>
      )}

      <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
        <span className="text-xs text-gray-400">{order.orderId}</span>
        <div className="text-right">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-red-700 font-bold text-base">
            ₱{order.total.toLocaleString()}.00
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [orderList, resList, empList] = await Promise.all([
        orderApi.getOrderList(2026),
        reservationsApi.getReservationList(),
        employeesApi.getEmployeeList(),
      ]);
      if (orderList) setOrders(orderList);
      if (resList) setReservations(resList);
      if (empList) setEmployees(empList);
    };
    fetchData();
  }, []);

  const enrichedOrders = useMemo(() => {
    return orders.map((o) => {
      const orderId = getVal(o, "orderId");
      const createdAt = getVal(o, "createdAt");
      const total = getVal(o, "total") || 0;
      const sessionExpiry = getVal(o, "sessionExpiry");
      const reservationId = getVal(o, "reservationId");
      const orderStatus = getVal(o, "orderStatus");
      const rawOrderItems = getVal(o, "orderItems") || [];
      const qrCodeUrl = getVal(o, "qrCodeUrl");
      const assignedCashierId = getVal(o, "assignedCashierId");

      let normalizedItems: any[] = [];
      if (Array.isArray(rawOrderItems)) {
        normalizedItems = rawOrderItems;
      } else if (rawOrderItems && typeof rawOrderItems === "object") {
        const newItems = rawOrderItems.newOrders?.items || [];
        const originalItems = rawOrderItems.originalOrders?.items || [];
        normalizedItems = [...originalItems, ...newItems];
      }

      const res = reservations.find((r) => r.reservationId === reservationId);
      const cashier = employees.find((e) => e.employeeId === assignedCashierId);
      const security = employees.find(
        (e) => e.employeeId === res?.assignedSecurityId,
      );

      const statusMap: Record<string, string> = {
        pending: "Pending",
        served: "Served",
        done: "Served",
        cancelled: "Cancelled",
        declined: "Declined",
      };

      return {
        orderId,
        createdAt,
        total,
        sessionExpiry,
        reservationId,
        orderStatus,
        qrCodeUrl,
        assignedCashierId,
        orderItems: normalizedItems,
        // Enriched
        name: res ? `${res.firstName} ${res.lastName}` : "Unknown Customer",
        email: res?.email || "N/A",
        type: res ? capitalizeWords(res.reservationType) : "N/A",
        date: formatReadableDate(new Date(sessionExpiry)),
        status:
          statusMap[orderStatus.toLowerCase()] || capitalizeWords(orderStatus),
        itemCount: normalizedItems.length,
        items: normalizedItems.map((item: any) => ({
          name: item.orderName,
          qty: item.quantity,
          price: item.total || 0,
        })),
        alreadyCovered: res?.reservationAmount / 2 || 0,
        vat: total * 0.12,
        cashierIncharge: cashier?.fullName || "Not Assigned",
        securityIncharge: security?.fullName || "Not Assigned",
      };
    });
  }, [orders, reservations, employees]);

  const filtered = useMemo(() => {
    const data = enrichedOrders.filter((o) => {
      const matchesTab = activeTab === "All" || o.status === activeTab;
      const matchesSearch =
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase());

      const orderDate = new Date(o.sessionExpiry);
      const matchesDate =
        !selectedDate ||
        (orderDate.getFullYear() === selectedDate.getFullYear() &&
          orderDate.getMonth() === selectedDate.getMonth() &&
          orderDate.getDate() === selectedDate.getDate());

      return matchesTab && matchesSearch && matchesDate;
    });

    return data.sort((a, b) => {
      const dateA = new Date(a.sessionExpiry).getTime();
      const dateB = new Date(b.sessionExpiry).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [enrichedOrders, activeTab, search, sortOrder, selectedDate]);

  return (
    <div className="font-poppins">
      {/* Header */}
      <div
        className="flex flex-row pl-7 items-center w-full h-[100px] rounded-2xl mb-6"
        style={{
          background: "linear-gradient(to right, #AA3131, #770B0B)",
          boxShadow: "0 8px 32px rgba(150,30,30,0.45)",
        }}
      >
        <div className="w-[60px] h-[60px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <SideBarOrder className="text-white w-8 h-8" />
        </div>
        <div className="ml-5 text-white">
          <h1 className="font-poppins text-[38px] font-bold leading-tight">
            Orders
          </h1>
          <p className="font-poppins text-[13px] mt-0.5 opacity-85">
            {formatReadableDate(new Date())}
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex bg-white rounded-lg shadow overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-red-700 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="relative">
          <button
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="flex items-center bg-white rounded-lg shadow px-3 py-2 gap-2 text-sm text-gray-600 hover:bg-gray-50 transition font-medium"
          >
            <span>
              {selectedDate
                ? format(selectedDate, "eee, MMM. d, yyyy")
                : "Select Date"}
            </span>
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dateDropdownOpen && (
            <div className="absolute z-20 mt-1 bg-white shadow-xl rounded-xl p-1.5 ring-1 ring-black/5 border border-gray-100">
              <DayPicker
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => {
                  setSelectedDate(date || null);
                  setDateDropdownOpen(false);
                }}
                className="m-0 p-0 text-sm"
                style={
                  {
                    "--rdp-day-width": "24px",
                    "--rdp-day-height": "24px",
                    "--rdp-accent-color": "#AA3131",
                    "--rdp-accent-background-color": "#FFF5F5",
                  } as React.CSSProperties
                }
              />

              <div className="mt-1 pt-1 border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs text-gray-400 font-medium italic">
                  Select date
                </p>
                <button
                  className="text-sm font-bold text-red-700 hover:text-red-800 uppercase tracking-wider px-2 py-0.5 rounded hover:bg-red-50 transition"
                  onClick={() => {
                    setSelectedDate(null);
                    setDateDropdownOpen(false);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="flex items-center bg-white rounded-lg shadow px-3 py-2 gap-2 text-sm text-gray-600 hover:bg-gray-50 transition font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h18M6 12h12M9 17h6"
              />
            </svg>
            {sortOrder === "newest" ? "Newest" : "Oldest"}
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {sortDropdownOpen && (
            <div className="absolute z-10 mt-1 w-40 bg-white shadow-lg rounded-md py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <button
                onClick={() => {
                  setSortOrder("newest");
                  setSortDropdownOpen(false);
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-100"
              >
                Newest
              </button>
              <button
                onClick={() => {
                  setSortOrder("oldest");
                  setSortDropdownOpen(false);
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-100"
              >
                Oldest
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white rounded-lg shadow pl-9 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((order, i) => (
          <OrderCard
            key={i}
            order={order}
            onClick={() => setSelectedOrder(order)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 py-24 text-sm">
          No orders found.
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage;
