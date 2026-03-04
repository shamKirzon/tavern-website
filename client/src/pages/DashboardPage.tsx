import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { formatReadableDate } from "@/utils/date";
import {
  SideBarDashboard,
  IconCalendarToday,
  IconCalendarCheck,
  IconCalendarClock,
  IconCreditCardGear,
  IconFastFood,
  IconFace,
} from "@/assets/icons/icons";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Backend: update values below to connect to your API

// ─── Stat Cards ───────────────────────────────────────────────────────────────
// To connect to API: replace each `value` with your fetched data variable
// e.g. value: data.totalReservations

const statCards = [
  {
    label: "Total Reservation",
    value: 143, // ← replace with API value
    iconBg: "rgba(0,149,7,0.15)",
    iconColor: "#009507",
    Icon: IconCalendarToday,
  },
  {
    label: "Approved Reservations",
    value: 143, // ← replace with API value
    iconBg: "rgba(0,17,255,0.12)",
    iconColor: "#2D37C2",
    Icon: IconCalendarCheck,
  },
  {
    label: "Pending Reservations",
    value: 88, // ← replace with API value
    iconBg: "rgba(239,217,116,0.45)",
    iconColor: "#A6902A",
    Icon: IconCalendarClock,
  },
  {
    label: "Total Earnings",
    value: "₱122,000.00", // ← replace with API value
    iconBg: "rgba(149,50,0,0.12)",
    iconColor: "#AD7434",
    Icon: IconCreditCardGear,
  },
  {
    label: "Total Orders Today",
    value: 205, // ← replace with API value
    iconBg: "rgba(149,0,82,0.12)",
    iconColor: "#950052",
    Icon: IconFastFood,
  },
  {
    label: "Available Staff",
    value: 143, // ← replace with API value
    iconBg: "rgba(0,157,255,0.15)",
    iconColor: "#087DC7",
    Icon: IconFace,
  },
];

// ─── Revenue Chart ────────────────────────────────────────────────────────────
// To connect to API: replace revenueData with your fetched array
// Shape required: { month: string, year2025: number, year2026: number }

const revenueData = [
  { month: "JAN", year2025: 10000, year2026: 2000 }, // ← replace with API data
  { month: "FEB", year2025: 21000, year2026: 4000 },
  { month: "MAR", year2025: 15000, year2026: 7000 },
  { month: "APR", year2025: 13000, year2026: 10000 },
  { month: "MAY", year2025: 22000, year2026: 20000 },
  { month: "JUN", year2025: 14000, year2026: 22000 },
  { month: "JUL", year2025: 24000, year2026: 15000 },
];

const revenueChartConfig: ChartConfig = {
  year2025: { label: "2025", color: "#E8C96A" },
  year2026: { label: "2026", color: "#AA3131" },
};

// ─── Customer Map Chart ───────────────────────────────────────────────────────
// To connect to API: replace customerMapData with your fetched array
// Shape required: { day: string, customers: number }

const customerMapData = [
  { day: "MON", customers: 5 }, // ← replace with API data
  { day: "TUE", customers: 2 },
  { day: "WED", customers: 4 },
  { day: "THU", customers: 8 },
  { day: "FRI", customers: 5 },
  { day: "SAT", customers: 3 },
  { day: "SUN", customers: 1 },
];

const customerMapChartConfig: ChartConfig = {
  customers: { label: "Customers", color: "#AA3131" },
};

// END OF DATA — do not edit below unless changing UI layout

const cardShadow = "0 8px 30px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)";

// ─── Stat Card Component ──────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  iconBg,
  iconColor,
  Icon,
}: {
  label: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
  Icon: React.ComponentType<{ className?: string }>;
}) => (
  <div
    className="bg-white rounded-2xl border border-gray-100 px-5 py-5 flex items-center justify-between"
    style={{ boxShadow: cardShadow }}
  >
    <div>
      <p className="font-poppins text-gray-500 text-[13px] font-medium leading-snug">
        {label}
      </p>
      <p className="font-poppins text-[30px] font-bold text-gray-900 mt-1.5 leading-tight">
        {value}
      </p>
    </div>
    <div
      className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: iconBg, color: iconColor }}
    >
      <Icon className="w-8 h-8" />
    </div>
  </div>
);

// ─── Dashboard Page ───────────────────────────────────────────────────────────

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div
        className="flex flex-row pl-7 items-center w-full h-[100px] rounded-2xl"
        style={{
          background: "linear-gradient(to right, #AA3131, #770B0B)",
          boxShadow: "0 8px 32px rgba(150,30,30,0.45)",
        }}
      >
        <div className="w-[60px] h-[60px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <SideBarDashboard className="text-white w-8 h-8" />
        </div>
        <div className="ml-5 text-white">
          <h1 className="font-poppins text-[38px] font-bold leading-tight">
            Admin Dashboard
          </h1>
          <p className="font-poppins text-[13px] mt-0.5 opacity-85">
            {formatReadableDate(new Date())}
          </p>
        </div>
      </div>

      {/* Stat Cards — Row 1 (first 3) */}
      <div className="grid grid-cols-3 gap-5">
        {statCards.slice(0, 3).map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Stat Cards — Row 2 (last 3) */}
      <div className="grid grid-cols-3 gap-5">
        {statCards.slice(3, 6).map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-5">
        {/* Total Revenue — Area Chart */}
        <div
          className="col-span-2 bg-white rounded-2xl border border-gray-100 p-5"
          style={{ boxShadow: cardShadow }}
        >
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="font-poppins font-bold text-gray-900 text-[15px]">
                Total Revenue
              </p>
              <p className="font-poppins text-gray-400 text-[11px] mt-0.5">
                Total Revenue (₱) per period
              </p>
            </div>
            <button className="border border-gray-200 text-[11px] font-poppins px-3 py-1.5 rounded-lg text-gray-600 flex items-center gap-1 hover:bg-gray-50 shadow-sm">
              Yearly <span className="text-[9px]">▾</span>
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
                <linearGradient id="fillYear2025" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-year2025)"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-year2025)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient id="fillYear2026" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-year2026)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-year2026)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "Poppins" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "Poppins" }}
                tickFormatter={(v: number) => `P${(v / 1000).toFixed(0)}K`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
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
              <ChartLegend
                content={<ChartLegendContent payload={[]} />}
                wrapperStyle={{ paddingTop: "20px" }}
                verticalAlign="bottom"
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Customer Map — Bar Chart */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-5"
          style={{ boxShadow: cardShadow }}
        >
          <div className="flex items-start justify-between mb-3">
            <p className="font-poppins font-bold text-gray-900 text-[15px]">
              Customer Map
            </p>
            <button className="border border-gray-200 text-[11px] font-poppins px-3 py-1.5 rounded-lg text-gray-600 flex items-center gap-1 hover:bg-gray-50 shadow-sm">
              Weekly <span className="text-[9px]">▾</span>
            </button>
          </div>
          <ChartContainer
            config={customerMapChartConfig}
            className="h-[260px] w-full"
          >
            <BarChart
              data={customerMapData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: "Poppins" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "Poppins" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="customers"
                fill="var(--color-customers)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
