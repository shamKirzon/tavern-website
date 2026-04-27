import * as React from "react";
import { useState, useRef, useEffect } from "react";
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
import { reservationsApi } from "@/api/reservations.api";
import { orderApi } from "@/api/orders.api";
import { employeesApi } from "@/api/employees.api";
import { customerApi } from "@/api/customers.api";

const reservationSummary = await reservationsApi.getReservationSummary();
const orderSummary = await orderApi.getOrderSummary();
const employeeSummary = await employeesApi.getEmployeeSummary();

const statCards = [
  {
    label: "Total Reservations",
    value: reservationSummary.reservationCount,
    iconBg: "rgba(0,149,7,0.15)",
    iconColor: "#009507",
    Icon: IconCalendarToday,
  },
  {
    label: "Approved Reservations",
    value: reservationSummary.accepted,
    iconBg: "rgba(0,17,255,0.12)",
    iconColor: "#2D37C2",
    Icon: IconCalendarCheck,
  },
  {
    label: "Pending Reservations",
    value: reservationSummary.pending,
    iconBg: "rgba(239,217,116,0.45)",
    iconColor: "#A6902A",
    Icon: IconCalendarClock,
  },
  {
    label: "Total Earnings",
    value: "₱ " + parseInt(orderSummary.totalEarnings).toLocaleString(),
    iconBg: "rgba(149,50,0,0.12)",
    iconColor: "#AD7434",
    Icon: IconCreditCardGear,
  },
  {
    label: "Total Orders ",
    value: orderSummary.orderCount,
    iconBg: "rgba(149,0,82,0.12)",
    iconColor: "#950052",
    Icon: IconFastFood,
  },
  {
    label: "Available Staff",
    value: employeeSummary.employeeCount,
    iconBg: "rgba(0,157,255,0.15)",
    iconColor: "#087DC7",
    Icon: IconFace,
  },
];

// ─── Dynamic chart config based on period ────────────────────────────────────

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

const customerMapChartConfig: ChartConfig = {
  customers: { label: "Customers", color: "#AA3131" },
};

const cardShadow = "0 8px 30px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)";

// ─── Dropdown Component ───────────────────────────────────────────────────────

type DropdownOption = { label: string; value: string };

const FilterDropdown = ({
  options,
  selected,
  onChange,
}: {
  options: DropdownOption[];
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

// ─── Filter options ───────────────────────────────────────────────────────────

const revenueFilterOptions: DropdownOption[] = [
  { label: "Yearly", value: "yearly" },
  { label: "Monthly", value: "monthly" },
];

const customerMapFilterOptions: DropdownOption[] = [
  { label: "Monthly", value: "monthly" },
  { label: "Weekly", value: "weekly" },
];

// ─── Dashboard Page ───────────────────────────────────────────────────────────

const DashboardPage = () => {
  const [revenuePeriod, setRevenuePeriod] = useState<string>("monthly");
  const [customerMapPeriod, setCustomerMapPeriod] = useState<string>("weekly");
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any[]>([]);

  useEffect(() => {
    orderApi.getTotalRevenue(revenuePeriod).then(setRevenueData);
  }, [revenuePeriod]);

  useEffect(() => {
    customerApi
      .getCustomerCountsByPeriod(customerMapPeriod)
      .then(setCustomerData);
  }, [customerMapPeriod]);

  // Revenue chart: "year" key for yearly, "month" for monthly
  const revenueXKey = revenuePeriod === "yearly" ? "year" : "month";
  const revenueChartConfig = getRevenueChartConfig(revenuePeriod);

  // Customer chart: "day" key for weekly, "month" for monthly  ← THE FIX
  const customerXKey = customerMapPeriod === "weekly" ? "day" : "month";

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

      {/* Stat Cards — Row 1 */}
      <div className="grid grid-cols-3 gap-5">
        {statCards.slice(0, 3).map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Stat Cards — Row 2 */}
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
            <FilterDropdown
              options={revenueFilterOptions}
              selected={revenuePeriod}
              onChange={setRevenuePeriod}
            />
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

        {/* Customer Map — Bar Chart */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-5"
          style={{ boxShadow: cardShadow }}
        >
          <div className="flex items-start justify-between mb-3">
            <p className="font-poppins font-bold text-gray-900 text-[15px]">
              Customer Map
            </p>
            <FilterDropdown
              options={customerMapFilterOptions}
              selected={customerMapPeriod}
              onChange={setCustomerMapPeriod}
            />
          </div>
          <ChartContainer
            config={customerMapChartConfig}
            className="h-[260px] w-full"
          >
            <BarChart
              data={customerData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey={customerXKey}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: "Poppins" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
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
