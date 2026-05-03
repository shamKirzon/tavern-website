import { SideBarReportsAndAnalytics } from "@/assets/icons/icons";
import { formatReadableDate } from "@/utils/date";
import { capitalizeWords } from "@/utils/capitalizeWords";
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { reservationsApi } from "@/api/reservations.api";
import { orderApi } from "@/api/orders.api";
import { employeesApi } from "@/api/employees.api";
import type { Reservation, Cancellation } from "@/types/Reservation";
import type { Employee } from "@/types/Employee";

import { reportApi } from "@/api/report.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ─── Data ─────────────────────────────────────────────────────────────────────

// ─── Chart Configs ────────────────────────────────────────────────────────────

const bookingTrendsChartConfig: ChartConfig = {
  approved: { label: "Approved", color: "#EAC54F" },
  cancelled: { label: "Cancelled", color: "#AA3131" },
};

const getRevenueChartConfig = (period: string): ChartConfig => {
  if (period === "yearly") {
    return {
      total: { label: "Revenue", color: "#AA3131" },
    };
  }
  return {
    year2025: { label: "2025", color: "#E8C96A" },
    year2026: { label: "2026", color: "#AA3131" },
  };
};

const revenueFilterOptions = [
  { label: "Yearly", value: "yearly" },
  { label: "Monthly", value: "monthly" },
];

const ordersChartConfig: ChartConfig = {
  orders: { label: "Orders", color: "#AA3131" },
};

const ROLE_BADGE_COLORS: Record<string, string> = {
  BARTENDER: "bg-[#087DC7]/15 text-[#087DC7]",
  WAITER: "bg-[#950052]/15 text-[#950052]",
  "KITCHEN STAFF": "bg-[#009507]/15 text-[#009507]",
  CASHIER: "bg-[#AD7434]/15 text-[#AD7434]",
  SECURITY: "bg-[#2D37C2]/15 text-[#2D37C2]",
};

const orderVolumeFilterOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Weekly", value: "weekly" },
];

// ─── Shared Styles ────────────────────────────────────────────────────────────

const cardShadow = "0 8px 30px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)";
const headerGradient = "linear-gradient(to right, #AA3131, #770B0B)";

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  accentBg,
}: {
  label: string;
  value: string | number;
  accentBg: string;
}) => (
  <div
    className="relative bg-white rounded-2xl border border-gray-100 px-5 py-5"
    style={{ boxShadow: cardShadow }}
  >
    <div
      className="absolute top-4 right-4 w-10 h-10 rounded-xl"
      style={{ backgroundColor: accentBg }}
    />
    <p className="font-poppins text-gray-500 text-[13px] font-medium leading-snug">
      {label}
    </p>
    <p className="font-poppins text-[30px] font-bold text-gray-900 mt-1.5 leading-tight">
      {value}
    </p>
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-4 mb-5">
    <h2 className="font-poppins text-[20px] font-bold text-gray-900 whitespace-nowrap">
      {title}
    </h2>
    <div className="flex-1 h-[.5px] bg-[#9B9B9B]" />
  </div>
);

const FilterDropdown = ({
  options,
  selected,
  onChange,
}: {
  options: { label: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === selected)?.label ?? selected;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="border border-gray-200 text-[11px] font-poppins px-3 py-1.5 rounded-lg text-gray-600 flex items-center gap-1.5 hover:bg-gray-50 shadow-sm select-none"
      >
        {selectedLabel}
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1.5 w-32 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-[12px] font-poppins transition-colors
                ${
                  selected === opt.value
                    ? "bg-red-50 text-[#AA3131] font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ReportsAnalyticsPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cancellations, setCancellations] = useState<Cancellation[]>([]);
  const [summaryReservations, setSummaryReservations] = useState<Reservation[]>(
    [],
  );
  const [summaryCancellations, setSummaryCancellations] = useState<
    Cancellation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString(),
  );
  const [selectedStatusYear, setSelectedStatusYear] = useState<string>(
    currentYear.toString(),
  );

  const [reservationTrends, setReservationTrends] = useState<
    { date: string; approved: number; cancelled: number }[]
  >([]);

  const [employeeList, setEmployeeList] = useState<Employee[]>([]);

  const [orderMetrics, setOrderMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    ordersPerDay: 0,
  });

  const [revenuePeriod, setRevenuePeriod] = useState<string>("monthly");
  const [revenueData, setRevenueData] = useState<any[]>([]);

  // PDF Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    const comprehensiveData = {
      title: "Comprehensive Tavern Report",
      sections: [
        {
          title: "Reservations Summary",
          headers: ["Date", "Status", "Amount"],
          rows: [
            { name: "2026-05-01", orders: "Accepted", revenue: "₱ 1,500" },
            { name: "2026-05-02", orders: "Done", revenue: "₱ 2,200" },
            { name: "2026-05-03", orders: "Pending", revenue: "₱ 1,800" },
            { name: "2026-05-04", orders: "Accepted", revenue: "₱ 2,500" },
            { name: "2026-05-05", orders: "Accepted", revenue: "₱ 3,100" },
          ],
        },
        {
          title: "Orders & Revenue Summary",
          headers: ["Order ID", "Items", "Total"],
          rows: [
            { name: "#ORD-001", orders: "5 items", revenue: "₱ 3,450" },
            { name: "#ORD-002", orders: "2 items", revenue: "₱ 1,200" },
            { name: "#ORD-003", orders: "8 items", revenue: "₱ 5,600" },
            { name: "#ORD-004", orders: "1 item", revenue: "₱ 450" },
            { name: "#ORD-005", orders: "3 items", revenue: "₱ 2,100" },
          ],
        },
        {
          title: "Employee Directory Summary",
          headers: ["Name", "Role", "Shift"],
          rows: [
            { name: "John Doe", orders: "Bartender", revenue: "10:00-18:00" },
            { name: "Jane Smith", orders: "Waiter", revenue: "14:00-22:00" },
            { name: "Mike Ross", orders: "Cashier", revenue: "08:00-16:00" },
            {
              name: "Sarah Connor",
              orders: "Security",
              revenue: "22:00-06:00",
            },
            { name: "Peter Parker", orders: "Waiter", revenue: "12:00-20:00" },
          ],
        },
      ],
    };

    try {
      const blob = await reportApi.generateReport(comprehensiveData);
      if (!blob) {
        toast.error("Failed to generate report blob");
        return;
      }
      const url = URL.createObjectURL(blob);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl); // Clean up previous URL
      setPdfUrl(url);
      setIsViewerOpen(true);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  useEffect(() => {
    orderApi.getTotalRevenue(revenuePeriod).then(setRevenueData);
  }, [revenuePeriod]);

  const revenueXKey = revenuePeriod === "yearly" ? "year" : "month";
  const currentRevenueChartConfig = getRevenueChartConfig(revenuePeriod);

  const [orderVolumePeriod, setOrderVolumePeriod] = useState<string>("weekly");
  const [orderVolumeData, setOrderVolumeData] = useState<any[]>([]);

  useEffect(() => {
    orderApi.getOrderCountsByPeriod(orderVolumePeriod).then(setOrderVolumeData);
  }, [orderVolumePeriod]);

  const orderVolumeXKey = orderVolumePeriod === "weekly" ? "day" : "month";

  useEffect(() => {
    employeesApi.getEmployeeList().then((data) => {
      if (data) setEmployeeList(data);
    });
  }, []);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const [list, summary, allRes] = await Promise.all([
          orderApi.getOrderList(),
          orderApi.getOrderSummary(),
          reservationsApi.getReservationList(),
        ]);

        if (summary && list && allRes) {
          const resMap = new Map(allRes.map((r: any) => [r.reservationId, r]));

          const currentYearOrders = list.filter((order: any) => {
            const res: any = resMap.get(order.reservationId);

            return new Date(res.date).getFullYear() === currentYear;
          });

          const currentYearOrderCount = currentYearOrders.length;
          const totalOrders = summary.orderCount || 0;

          // orders per day = total orders / current year order count
          const ordersPerDay =
            currentYearOrderCount > 0
              ? Math.round(totalOrders / currentYearOrderCount)
              : 0;

          setOrderMetrics({
            totalRevenue: Number(summary.totalEarnings) || 0,
            totalOrders,
            ordersPerDay,
          });
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchOrderData();
  }, [currentYear]);

  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [yearsData, allRes, allCancels] = await Promise.all([
          reservationsApi.getAvailableYears(),
          reservationsApi.getReservationList(2026),
          reservationsApi.getReservationCancellations(2026),
        ]);
        if (yearsData) setYears(yearsData);
        if (allRes) setSummaryReservations(allRes);
        if (allCancels) setSummaryCancellations(allCancels);
      } catch (error) {
        console.error("Error fetching base data:", error);
      }
    };
    fetchBaseData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const year =
          selectedStatusYear === "all" ? undefined : Number(selectedStatusYear);
        const [resData, cancelData] = await Promise.all([
          reservationsApi.getReservationList(year),
          reservationsApi.getReservationCancellations(year),
        ]);
        if (resData) setReservations(resData);
        if (cancelData) setCancellations(cancelData);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedStatusYear]);

  useEffect(() => {
    const fetchTrends = async () => {
      const year = selectedYear === "all" ? undefined : Number(selectedYear);
      const trendsData = await reservationsApi.getReservationTrends(year);
      if (trendsData) setReservationTrends(trendsData);
    };
    fetchTrends();
  }, [selectedYear]);

  const reservationMetrics = useMemo(() => {
    const done = reservations.filter((r) => r.reservationStatus === "done");
    const accepted = reservations.filter(
      (r) => r.reservationStatus === "accepted",
    );
    const pending = reservations.filter(
      (r) => r.reservationStatus === "pending",
    );
    const rejected = reservations.filter(
      (r) => r.reservationStatus === "rejected",
    );

    const cancelledCount = cancellations.filter(
      (c) => c.status === "accepted",
    ).length;

    const totalRevenue = done.reduce((sum, r) => {
      return sum + (Number(r.reservationAmount) || 0);
    }, 0);

    return {
      totalRevenue,
      approvedCount: accepted.length,
      cancelledCount: cancelledCount,
      pendingCount: pending.length,
      rejectedCount: rejected.length,
      doneCount: done.length,
    };
  }, [reservations, cancellations]);

  const summaryMetrics = useMemo(() => {
    const done = summaryReservations.filter(
      (r) => r.reservationStatus === "done",
    );
    const accepted = summaryReservations.filter(
      (r) => r.reservationStatus === "accepted",
    );
    const cancelledCount = summaryCancellations.filter(
      (c) => c.status === "accepted",
    ).length;

    const totalRevenue = done.reduce((sum, r) => {
      return sum + (Number(r.reservationAmount) || 0);
    }, 0);

    return {
      totalRevenue,
      approvedCount: accepted.length,
      cancelledCount: cancelledCount,
    };
  }, [summaryReservations, summaryCancellations]);

  const trendData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayMap = days.reduce(
      (acc, day) => {
        acc[day] = { day, approved: 0, cancelled: 0 };
        return acc;
      },
      {} as Record<
        string,
        { day: string; approved: number; cancelled: number }
      >,
    );

    reservationTrends.forEach((t) => {
      const [year, month, day] = t.date.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = dayNames[date.getDay()];
      if (dayMap[dayName]) {
        dayMap[dayName].approved += Math.floor(t.approved);
        dayMap[dayName].cancelled += Math.floor(t.cancelled);
      }
    });

    return days.map((day) => dayMap[day]);
  }, [reservationTrends]);

  const statusData = useMemo(
    () => [
      {
        name: "Approved",
        value: reservationMetrics.approvedCount,
        color: "#16a34a",
      },
      {
        name: "Cancelled",
        value: reservationMetrics.cancelledCount,
        color: "#4A78E3",
      },
      {
        name: "Pending",
        value: reservationMetrics.pendingCount,
        color: "#fde047",
      },
      {
        name: "Done",
        value: reservationMetrics.doneCount,
        color: "#ea580c",
      },
      {
        name: "Rejected",
        value: reservationMetrics.rejectedCount,
        color: "#C0392B",
      },
    ],
    [reservationMetrics],
  );

  const formatRevenue = (value: number) => {
    return `₱ ${Math.floor(value).toLocaleString()}`;
  };

  return (
    <div className="flex flex-col gap-10  font-poppins">
      {/* Header */}
      <div
        className="flex flex-row px-7 items-center w-full h-[100px] rounded-2xl"
        style={{
          background: headerGradient,
          boxShadow: "0 8px 32px rgba(150,30,30,0.45)",
        }}
      >
        <div className="flex flex-row items-center flex-1">
          <div className="w-[60px] h-[60px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <SideBarReportsAndAnalytics className="text-white w-8 h-8" />
          </div>
          <div className="ml-5 text-white">
            <h1 className="text-[38px] font-bold leading-tight">
              Reports and Analytics
            </h1>
            <p className="text-[13px] mt-0.5 opacity-85">
              {formatReadableDate(new Date())}
            </p>
          </div>
        </div>
        <button
          onClick={handleGenerateReport}
          className="text-black text-[14px] font-poppins font-bold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity bg-[#EFD974] shadow-md"
        >
          Generate
        </button>
      </div>

      {/* ═══════════════════ RESERVATIONS ═══════════════════ */}
      <div>
        <SectionHeader title="Reservations" />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <StatCard
            label="Total Reservation Revenue"
            value={formatRevenue(summaryMetrics.totalRevenue)}
            accentBg="rgba(0,149,7,0.15)"
          />
          <StatCard
            label="Approved Reservations"
            value={summaryMetrics.approvedCount}
            accentBg="rgba(0,17,255,0.12)"
          />
          <StatCard
            label="Cancelled Reservations"
            value={summaryMetrics.cancelledCount}
            accentBg="rgba(239,217,116,0.45)"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Booking Trends — Line Chart */}
          <div
            className="bg-white rounded-2xl border border-gray-100 p-5"
            style={{ boxShadow: cardShadow }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-gray-900 text-[15px] mb-1">
                  Booking Trends
                </p>
                <p className="text-gray-400 text-[11px]">
                  Approved vs Cancelled per day
                </p>
              </div>
              <FilterDropdown
                options={[
                  { label: "All Years", value: "all" },
                  ...years.map((y) => ({
                    label: y.toString(),
                    value: y.toString(),
                  })),
                ]}
                selected={selectedYear}
                onChange={setSelectedYear}
              />
            </div>
            <ChartContainer
              config={bookingTrendsChartConfig}
              className="h-[260px] w-full"
            >
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-approved)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-approved)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient
                    id="fillCancelled"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-cancelled)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-cancelled)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{
                    fontSize: 11,
                    fill: "#9ca3af",
                    fontFamily: "Poppins",
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#9ca3af",
                    fontFamily: "Poppins",
                  }}
                  allowDecimals={false}
                  interval="preserveStartEnd"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="approved"
                  type="natural"
                  fill="url(#fillApproved)"
                  stroke="var(--color-approved)"
                  strokeWidth={2.5}
                />
                <Area
                  dataKey="cancelled"
                  type="natural"
                  fill="url(#fillCancelled)"
                  stroke="var(--color-cancelled)"
                  strokeWidth={2.5}
                />
                <ChartLegend
                  content={<ChartLegendContent payload={[]} />}
                  wrapperStyle={{ paddingTop: "16px" }}
                  verticalAlign="bottom"
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Booking Status — Pie Chart */}
          <div
            className="bg-white rounded-2xl border border-gray-100 p-5"
            style={{ boxShadow: cardShadow }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-gray-900 text-[15px] mb-1">
                  Booking Status
                </p>
                <p className="text-gray-400 text-[11px]">
                  Distribution of reservation statuses
                </p>
              </div>
              <FilterDropdown
                options={[
                  { label: "All Years", value: "all" },
                  ...years.map((y) => ({
                    label: y.toString(),
                    value: y.toString(),
                  })),
                ]}
                selected={selectedStatusYear}
                onChange={setSelectedStatusYear}
              />
            </div>
            <div className="h-[200px] w-full flex items-center justify-center mt-8 ">
              <PieChart width={500} height={200}>
                <Pie
                  data={statusData}
                  dataKey="value"
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={0}
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="square"
                  wrapperStyle={{
                    fontFamily: "Poppins",
                    fontSize: 11,
                    paddingLeft: "10px",
                  }}
                />
              </PieChart>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ ORDERS & REVENUE ═══════════════════ */}
      <div>
        <SectionHeader title="Orders and Revenue" />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <StatCard
            label="Total Order Revenue"
            value={formatRevenue(orderMetrics.totalRevenue)}
            accentBg="rgba(0,149,7,0.15)"
          />
          <StatCard
            label="Total Orders"
            value={orderMetrics.totalOrders}
            accentBg="rgba(0,17,255,0.12)"
          />
          <StatCard
            label="Average Orders per Day"
            value={orderMetrics.ordersPerDay}
            accentBg="rgba(239,217,116,0.45)"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Revenue Overtime — Area Chart */}
          <div
            className="bg-white rounded-2xl border border-gray-100 p-5"
            style={{ boxShadow: cardShadow }}
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="font-bold text-gray-900 text-[15px]">
                  Revenue Overtime
                </p>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  Total Revenue (₱) per {revenuePeriod}
                </p>
              </div>
              <FilterDropdown
                options={revenueFilterOptions}
                selected={revenuePeriod}
                onChange={setRevenuePeriod}
              />
            </div>
            <ChartContainer
              config={currentRevenueChartConfig}
              className="h-[260px] w-full"
            >
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#AA3131" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#AA3131" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="fillYear2025" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8C96A" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#E8C96A" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="fillYear2026" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#AA3131" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#AA3131" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey={revenueXKey}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{
                    fontSize: 11,
                    fill: "#9ca3af",
                    fontFamily: "Poppins",
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#9ca3af",
                    fontFamily: "Poppins",
                  }}
                  tickFormatter={(v: number) => `P${(v / 1000).toFixed(0)}K`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />

                {revenuePeriod === "yearly" ? (
                  <Area
                    dataKey="total"
                    type="natural"
                    fill="url(#fillTotal)"
                    stroke="#AA3131"
                    strokeWidth={2.5}
                  />
                ) : (
                  <>
                    <Area
                      dataKey="year2025"
                      type="natural"
                      fill="url(#fillYear2025)"
                      stroke="var(--color-year2025)"
                      strokeWidth={2.5}
                    />
                    <Area
                      dataKey="year2026"
                      type="natural"
                      fill="url(#fillYear2026)"
                      stroke="var(--color-year2026)"
                      strokeWidth={2.5}
                    />
                  </>
                )}

                <ChartLegend
                  content={<ChartLegendContent payload={[]} />}
                  wrapperStyle={{ paddingTop: "20px" }}
                  verticalAlign="bottom"
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Order Volume — Bar Chart */}
          <div
            className="bg-white rounded-2xl border border-gray-100 p-5"
            style={{ boxShadow: cardShadow }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-gray-900 text-[15px]">
                  Order Volume
                </p>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  Number of orders per {orderVolumePeriod}
                </p>
              </div>
              <FilterDropdown
                options={orderVolumeFilterOptions}
                selected={orderVolumePeriod}
                onChange={setOrderVolumePeriod}
              />
            </div>
            <ChartContainer
              config={ordersChartConfig}
              className="h-[260px] w-full"
            >
              <BarChart
                data={orderVolumeData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey={orderVolumeXKey}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{
                    fontSize: 10,
                    fill: "#9ca3af",
                    fontFamily: "Poppins",
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#9ca3af",
                    fontFamily: "Poppins",
                  }}
                  allowDecimals={false}
                  interval="preserveStartEnd"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="orders"
                  fill="var(--color-orders)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* ═══════════════════ EMPLOYEES ═══════════════════ */}
      <div>
        <SectionHeader title="Employees" />

        <div
          className="bg-white rounded-2xl border border-gray-100 p-5"
          style={{ boxShadow: cardShadow }}
        >
          <div className="mb-5">
            <p className="font-bold text-gray-900 text-[15px]">
              Employee Directory
            </p>
            <p className="text-[12px] text-gray-400 mt-0.5">
              {employeeList.length} staff members
            </p>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  Name
                </th>
                <th className="text-left py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  Type
                </th>
                <th className="text-left py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  Shift Time
                </th>
                <th className="text-left py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  Days
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employeeList.map((emp, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-[13px] font-medium text-gray-800">
                    {emp.fullName}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-md text-[11px] font-medium ${ROLE_BADGE_COLORS[emp.employeeRole.toUpperCase()] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {capitalizeWords(emp.employeeRole)}
                    </span>
                  </td>
                  <td className="py-4 text-[13px] text-gray-500">
                    {emp.shiftStart} - {emp.shiftEnd}
                  </td>
                  <td className="py-4 text-[13px] text-gray-500">
                    {emp.shiftDay
                      .map((day) => day.substring(0, 3).toUpperCase())
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full bg-gray-100 rounded-lg overflow-hidden border">
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="PDF Viewer"
              />
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsViewerOpen(false)}>
              Close
            </Button>
            {pdfUrl && (
              <a
                href={pdfUrl}
                download={`tavern_report_${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}-${new Date().getFullYear()}.pdf`}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#AA3131] text-white shadow hover:bg-[#770B0B] h-9 px-4 py-2"
              >
                Download PDF
              </a>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsAnalyticsPage;
