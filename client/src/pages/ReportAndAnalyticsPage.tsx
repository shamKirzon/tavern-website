import { SideBarReportsAndAnalytics } from "@/assets/icons/icons";
import { formatReadableDate } from "@/utils/date";
import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
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
import type { Reservation, Cancellation } from "@/types/Reservation";

// ─── Data ─────────────────────────────────────────────────────────────────────

const revenueData = [
  { day: "Mon", revenue: 22000, orders: 33 },
  { day: "Tue", revenue: 3000, orders: 12 },
  { day: "Wed", revenue: 12000, orders: 42 },
  { day: "Thu", revenue: 15000, orders: 61 },
  { day: "Fri", revenue: 25000, orders: 5 },
  { day: "Sat", revenue: 10000, orders: 27 },
  { day: "Sun", revenue: 23000, orders: 40 },
];

const employees = [
  { name: "Dannah Torres", type: "Full-time" },
  { name: "Shammy Suyat", type: "Part-time" },
  { name: "Keia Marie", type: "Full-time" },
  { name: "Paulyn Blanco", type: "Part-time" },
  { name: "Yuji Midorikawa", type: "Full-time" },
];

// ─── Chart Configs ────────────────────────────────────────────────────────────

const bookingTrendsChartConfig: ChartConfig = {
  approved: { label: "Approved", color: "#EAC54F" },
  cancelled: { label: "Cancelled", color: "#AA3131" },
};

const revenueChartConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "#EAC54F" },
};

const ordersChartConfig: ChartConfig = {
  orders: { label: "Orders", color: "#AA3131" },
};

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

const SectionHeader = ({
  title,
  showGenerate = false,
}: {
  title: string;
  showGenerate?: boolean;
}) => (
  <div className="flex items-center gap-4 mb-5">
    <h2 className="font-poppins text-[20px] font-bold text-gray-900 whitespace-nowrap">
      {title}
    </h2>
    <div className="flex-1 h-px bg-gray-200" />
    {showGenerate && (
      <button
        className="text-white text-[13px] font-poppins font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        style={{ background: headerGradient }}
      >
        Generate
      </button>
    )}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const ReportsAnalyticsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cancellations, setCancellations] = useState<Cancellation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [reservationTrends, setReservationTrends] = useState<
    { date: string; approved: number; cancelled: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resData, cancelData, trendsData] = await Promise.all([
          reservationsApi.getReservationList(),
          reservationsApi.getReservationCancellations(),
          reservationsApi.getReservationTrends(),
        ]);
        if (resData) setReservations(resData);
        if (cancelData) setCancellations(cancelData);
        if (trendsData) setReservationTrends(trendsData);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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

    const totalRevenue = done.reduce(
      (sum, r) => sum + (Number(r.reservationAmount) || 0),
      0,
    );

    return {
      totalRevenue,
      approvedCount: accepted.length,
      cancelledCount: cancelledCount,
      pendingCount: pending.length,
      rejectedCount: rejected.length,
      doneCount: done.length,
    };
  }, [reservations, cancellations]);

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
      const date = new Date(t.date);
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
        value: reservationMetrics.approvedCount + reservationMetrics.doneCount,
        color: "#4CAF50",
      },
      {
        name: "Pending",
        value: reservationMetrics.pendingCount,
        color: "#EAC54F",
      },
      {
        name: "Rejected",
        value: reservationMetrics.rejectedCount,
        color: "#C0392B",
      },
      {
        name: "Cancelled",
        value: reservationMetrics.cancelledCount,
        color: "#4A78E3",
      },
    ],
    [reservationMetrics],
  );

  const formatRevenue = (value: number) => {
    if (value >= 1000) {
      const truncated = Math.floor((value / 1000) * 10) / 10;
      return `₱${truncated.toFixed(1)}K`;
    }
    return `₱${value.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col gap-5 font-poppins">
      {/* Header */}
      <div
        className="flex flex-row pl-7 items-center w-full h-[100px] rounded-2xl"
        style={{
          background: headerGradient,
          boxShadow: "0 8px 32px rgba(150,30,30,0.45)",
        }}
      >
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

      {/* ═══════════════════ RESERVATIONS ═══════════════════ */}
      <div>
        <SectionHeader title="Reservations" showGenerate />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <StatCard
            label="Total Reservation Revenue"
            value={formatRevenue(reservationMetrics.totalRevenue)}
            accentBg="rgba(0,149,7,0.15)"
          />
          <StatCard
            label="Approved Reservations"
            value={reservationMetrics.approvedCount}
            accentBg="rgba(0,17,255,0.12)"
          />
          <StatCard
            label="Cancelled Reservations"
            value={reservationMetrics.cancelledCount}
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
            <p className="font-bold text-gray-900 text-[15px] mb-1">
              Booking Trends
            </p>
            <p className="text-gray-400 text-[11px] mb-4">
              Approved vs Cancelled per day
            </p>
            <ChartContainer
              config={bookingTrendsChartConfig}
              className="h-[260px] w-full"
            >
              <LineChart
                data={trendData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
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
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  stroke="var(--color-approved)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke="var(--color-cancelled)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <ChartLegend
                  content={<ChartLegendContent payload={[]} />}
                  wrapperStyle={{ paddingTop: "16px" }}
                  verticalAlign="bottom"
                />
              </LineChart>
            </ChartContainer>
          </div>

          {/* Booking Status — Pie Chart */}
          <div
            className="bg-white rounded-2xl border border-gray-100 p-5"
            style={{ boxShadow: cardShadow }}
          >
            <p className="font-bold text-gray-900 text-[15px] mb-1">
              Booking Status
            </p>
            <p className="text-gray-400 text-[11px] mb-4">
              Distribution of reservation statuses
            </p>
            <div className="h-[260px] w-full flex items-center justify-center">
              <PieChart width={340} height={260}>
                <Pie
                  data={statusData}
                  dataKey="value"
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="square"
                  wrapperStyle={{
                    paddingTop: 20,
                    fontFamily: "Poppins",
                    fontSize: 11,
                  }}
                />
              </PieChart>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ ORDERS & REVENUE ═══════════════════ */}
      <div>
        <SectionHeader title="Orders and Revenue" showGenerate />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <StatCard
            label="Total Revenue"
            value="₱123.7K"
            accentBg="rgba(0,149,7,0.15)"
          />
          <StatCard
            label="Total Orders"
            value={143}
            accentBg="rgba(0,17,255,0.12)"
          />
          <StatCard
            label="Orders per Day"
            value={88}
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
                  Total Revenue (₱) per day
                </p>
              </div>
              <button className="border border-gray-200 text-[11px] font-poppins px-3 py-1.5 rounded-lg text-gray-600 flex items-center gap-1 hover:bg-gray-50 shadow-sm">
                Weekly <span className="text-[9px]">▾</span>
              </button>
            </div>
            <ChartContainer
              config={revenueChartConfig}
              className="h-[260px] w-full"
            >
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
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
                  tickFormatter={(v: number) => `P${(v / 1000).toFixed(0)}K`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="url(#fillRevenue)"
                  stroke="var(--color-revenue)"
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
                  Number of orders per day
                </p>
              </div>
              <button className="border border-gray-200 text-[11px] font-poppins px-3 py-1.5 rounded-lg text-gray-600 flex items-center gap-1 hover:bg-gray-50 shadow-sm">
                Weekly <span className="text-[9px]">▾</span>
              </button>
            </div>
            <ChartContainer
              config={ordersChartConfig}
              className="h-[260px] w-full"
            >
              <BarChart
                data={revenueData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
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
            <p className="text-[12px] text-gray-400 mt-0.5">19 staff members</p>
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
                <th className="text-left py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  PIN
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employees.map((emp, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-[13px] font-medium text-gray-800">
                    {emp.name}
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-[11px] font-medium">
                      {emp.type}
                    </span>
                  </td>
                  <td className="py-4 text-[13px] text-gray-500">
                    8:00PM - 6:00AM
                  </td>
                  <td className="py-4 text-[13px] text-gray-500">
                    Mon, Tue, Wed, Sat
                  </td>
                  <td className="py-4">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-gray-300 rounded-full"
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalyticsPage;
