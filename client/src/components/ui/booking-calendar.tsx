import { ClosedAll, OpenAll } from "@/assets/icons/icons";
import { useState } from "react";

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

type DayStatus = "available" | "fullyBooked" | "closed";

interface BookingInfo {
  booked: number;
  total: number;
  status: DayStatus;
}

type BookingData = Record<string, BookingInfo>;

interface StatusStyle {
  cell: string;
  text: string;
}

interface LegendItemProps {
  color: string;
  label: string;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function generateMockData(year: number, month: number): BookingData {
  const data: BookingData = {};
  const daysInMonth = getDaysInMonth(year, month);
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const rand = Math.random();
    if (rand < 0.3) {
      // no data
    } else if (rand < 0.6) {
      const booked = Math.floor(Math.random() * 90) + 5;
      data[key] = { booked, total: 100, status: "available" };
    } else if (rand < 0.8) {
      data[key] = { booked: 100, total: 100, status: "fullyBooked" };
    } else {
      data[key] = { booked: 100, total: 100, status: "closed" };
    }
  }
  return data;
}

const STATUS_STYLES: Record<DayStatus, StatusStyle> = {
  available: {
    cell: "bg-green-100 border-green-300",
    text: "text-green-800",
  },
  fullyBooked: {
    cell: "bg-[#f5f0d0] border-[#d4c55a]",
    text: "text-yellow-800",
  },
  closed: {
    cell: "bg-red-100 border-red-300",
    text: "text-red-700",
  },
};

export function BookingCalendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [closedEvery, setClosedEvery] = useState<string>("Day");

  const [bookingData] = useState<BookingData>(() =>
    generateMockData(currentYear, currentMonth),
  );

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString(
    "default",
    {
      month: "long",
      year: "numeric",
    },
  );

  const totalBooked = Object.values(bookingData).reduce(
    (sum, d) => sum + (d?.booked ?? 0),
    0,
  );
  const totalCapacity =
    Object.values(bookingData).reduce((sum, d) => sum + (d?.total ?? 0), 0) ||
    1000;

  function prevMonth(): void {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth(): void {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  function getDayKey(d: number): string {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function isToday(d: number): boolean {
    return (
      d === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  }

  return (
    <div className=" flex flex-col font-poppins bg-white rounded-2xl overflow-hidden">
      {/* Legend */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 text-sm text-gray-600 border-b border-[#D9D9D9]">
        <span className="text-[#717171]">
          Total Month Reservation:{" "}
          <span>
            {totalBooked} out of {totalCapacity}
          </span>
        </span>

        {/* Legends  */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <LegendItem
            color="bg-green-200 border border-green-400"
            label="Available"
          />
          <LegendItem
            color="bg-[#f0e96a] border border-[#c9b800]"
            label="Fully Booked"
          />
          <LegendItem color="bg-red-200 border border-red-400" label="Closed" />
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between px-5 py-3 ">
        <button
          onClick={prevMonth}
          className="w-9 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-600 text-4xl "
        >
          ‹
        </button>
        <h2 className="text-xl font-bold text-gray-800">{monthName}</h2>
        <button
          onClick={nextMonth}
          className="w-9 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-600 text-4xl "
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-3 gap-1 mb-1">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 px-3 overflow-auto">
        <div className="flex flex-col gap-1 h-full">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1 flex-1">
              {week.map((d, di) => {
                if (!d) return <div key={di} />;
                const key = getDayKey(d);
                const info: BookingInfo | undefined = bookingData[key];
                const status: DayStatus | undefined = info?.status;
                const styles: StatusStyle | null = status
                  ? STATUS_STYLES[status]
                  : null;
                const todayCell = isToday(d);
                const selected = selectedDay === key;

                return (
                  <button
                    key={di}
                    onClick={() => setSelectedDay(key)}
                    className={`
                      relative flex flex-col items-center justify-center rounded-xl border-2 transition-all
                      text-gray-800 cursor-pointer select-none
                      ${styles ? styles.cell : "bg-white border-gray-200 hover:border-gray-400"}
                      ${todayCell && !status ? "border-[#c9a800] border-2" : ""}
                      ${selected ? "ring-2 ring-blue-400 ring-offset-1" : ""}
                      py-1
                    `}
                  >
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide ${
                        styles ? styles.text : "text-gray-400"
                      }`}
                    >
                      {DAYS_OF_WEEK[di]}
                    </span>
                    <span
                      className={`text-lg font-extrabold leading-tight ${
                        styles ? styles.text : "text-gray-700"
                      }`}
                    >
                      {d}
                    </span>
                    {info && styles && (
                      <span
                        className={`text-[10px] font-semibold mt-0.5 ${styles.text}`}
                      >
                        {info.booked}/{info.total}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="flex items-center justify-between px-4 py-3  mt-2 gap-2 flex-wrap">
        <button className="flex items-center gap-2 px-4 py-2 font-medium bg-[#D9D9D9]/31 border border-[#D9D9D9] rounded-2xl text-sm  ">
          <OpenAll />
          <span>Open All 14 Days</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 font-medium bg-[#E44848]/8 border border-[#770B0B] rounded-2xl text-sm  ">
          <ClosedAll />
          <span>Closed All</span>
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
          <span>Closed every</span>
          <select
            value={closedEvery}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setClosedEvery(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-1 py-1 text-sm font-medium text-gray-700 bg-[#D9D9D9]/31 focus:outline-none"
          >
            <option>Day</option>
            <option>Week</option>
            <option>Month</option>
          </select>
        </div>
        <button className="ml-auto px-6 py-2 rounded-full bg-[#b5a020] text-white text-sm font-bold hover:bg-[#9e8c1a] transition shadow-sm whitespace-nowrap">
          Apply
        </button>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-4 h-4 rounded-sm ${color}`} />
      <span>{label}</span>
    </div>
  );
}
