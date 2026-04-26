import { ClosedAll, OpenAll } from "@/assets/icons/icons";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import type { BookingData, BookingInfo, DayStatus } from "@/types/Reservation";

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

interface StatusStyle {
  cell: string;
  text: string;
}

interface BookingCalendarProps {
  // Called when a day click occurs; receives the date key or null if selection is cleared/blank
  onDayClick?: (dateKey: string | null, info?: BookingInfo) => void;
  // Parent can supply its own booking data to override or seed the calendar
  externalBookingData?: BookingData;
  onApply?: (dates: string[]) => void;
  onOpenAll?: (dates: string[]) => void;
  onCloseAll?: (dates: string[]) => void;
  onMonthChange?: (year: number, month: number) => void;
  isLoading?: boolean;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
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

export function BookingCalendar({
  onDayClick,
  externalBookingData,
  onApply,
  onOpenAll,
  onCloseAll,
  onMonthChange,
  isLoading,
}: BookingCalendarProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());

  const [openConfirmationDialog, setOpenConfirmationDialog] =
    useState<boolean>(false);
  const [confirmationAction, setConfirmationAction] = useState<
    "apply" | "closedAll" | "openAll" | undefined
  >();

  // Use only external data
  const bookingData: BookingData = externalBookingData ?? {};

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
    setSelectedDays(new Set());
    let newYear = currentYear;
    let newMonth = currentMonth;
    if (currentMonth === 0) {
      newMonth = 11;
      newYear = currentYear - 1;
    } else {
      newMonth = currentMonth - 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    onMonthChange?.(newYear, newMonth);
  }

  function nextMonth(): void {
    setSelectedDays(new Set());
    let newYear = currentYear;
    let newMonth = currentMonth;
    if (currentMonth === 11) {
      newMonth = 0;
      newYear = currentYear + 1;
    } else {
      newMonth = currentMonth + 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    onMonthChange?.(newYear, newMonth);
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

  function handleDayClick(d: number): void {
    const key = getDayKey(d);
    const info = bookingData[key];

    if (info?.status) {
      // Has status → single-select only: clear all others, select just this one
      // Clicking the same already-selected day deselects it
      setSelectedDays((prev) => {
        const isDeselecting = prev.size === 1 && prev.has(key);
        if (isDeselecting) {
          onDayClick?.(null);
          return new Set();
        }
        onDayClick?.(key, info);
        return new Set([key]);
      });
    } else {
      // No status → multi-select toggle, but clear any previously selected status-day first
      setSelectedDays((prev) => {
        const hadStatusDay = [...prev].some((k) => bookingData[k]?.status);
        const next = hadStatusDay ? new Set<string>() : new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        onDayClick?.(null);
        return next;
      });
    }
  }

  // for dialog result - confirm
  const handleConfirmDialog = () => {
    switch (confirmationAction) {
      case "apply":
        {
          const applyDates = [...selectedDays].filter(
            (key) => !bookingData[key]?.status,
          );
          if (applyDates.length > 0) {
            onApply?.(applyDates);
          }
        }
        setSelectedDays(new Set());
        break;
      case "closedAll":
        {
          const allDates: string[] = [];
          for (let d = 1; d <= daysInMonth; d++) {
            allDates.push(getDayKey(d));
          }
          onCloseAll?.(allDates);
        }
        setSelectedDays(new Set());
        break;
      case "openAll":
        {
          const allDates: string[] = [];
          for (let d = 1; d <= daysInMonth; d++) {
            allDates.push(getDayKey(d));
          }
          onOpenAll?.(allDates);
        }
        setSelectedDays(new Set());
        break;

      default:
        break;
    }
    setOpenConfirmationDialog(false);
  };

  return (
    <div className="flex flex-col font-poppins bg-white rounded-2xl overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#AA3131] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {/* Legend */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 text-sm text-gray-600 border-b border-[#D9D9D9] flex-shrink-0">
        <span className="text-[#717171]">
          Total Reservations This Month:{" "}
          <span>
            {totalBooked} Reservation{totalBooked !== 1 ? "s" : ""}
          </span>
        </span>
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
      <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
        <button
          onClick={prevMonth}
          className="w-9 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-600 text-4xl"
        >
          ‹
        </button>
        <h2 className="text-xl font-bold text-gray-800">{monthName}</h2>
        <button
          onClick={nextMonth}
          className="w-9 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-600 text-4xl"
        >
          ›
        </button>
      </div>
      {/* Day headers */}
      <div className="grid grid-cols-7 px-3 gap-1 mb-1 flex-shrink-0">
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
      <div className="flex-1 px-3 pb-2">
        <div className="flex flex-col gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((d, di) => {
                if (!d) return <div key={di} className="h-16" />;

                const key = getDayKey(d);
                const info: BookingInfo | undefined = bookingData[key];
                const status: DayStatus | undefined = info?.status;
                const styles: StatusStyle | null = status
                  ? STATUS_STYLES[status]
                  : null;
                const todayCell = isToday(d);
                const selected = selectedDays.has(key);

                return (
                  <button
                    key={di}
                    onClick={() => handleDayClick(d)}
                    className={`
                      relative flex flex-col items-center justify-center rounded-xl border-2 transition-all
                      text-gray-800 cursor-pointer select-none h-16
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

      {/* Confirmation Modal */}
      <Dialog
        open={openConfirmationDialog}
        onOpenChange={setOpenConfirmationDialog}
      >
        <DialogContent className="w-sm p-0 overflow-hidden font-poppins rounded-2xl border-none gap-0">
          {/* Red header */}
          <div className=" bg-red-900 px-6 py-5">
            <DialogTitle className="text-white text-xl font-medium ">
              Confirmation
            </DialogTitle>
          </div>

          {/* Body */}
          <div className="bg-white px-6 pt-6 pb-6 flex flex-col gap-4 text-sm">
            <DialogDescription className="text-gray-600 text-md">
              Are you sure you want to apply this schedule change?
            </DialogDescription>

            {/* Cancel / Yes, Cancel row */}
            <div className="flex gap-3">
              <DialogClose asChild>
                <Button className="flex-1 bg-[#1C1B1F] hover:bg-gray-900 text-white rounded-xl py-5 text-md">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={() => {
                  handleConfirmDialog();
                }}
                className="flex-1 bg-[#EFD974] hover:bg-yellow-300 text-black rounded-xl py-5 text-md"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex shrink-0  items-center justify-between px-4 py-3 border-t border-[#D9D9D9] gap-2 flex-wrap bg-whit">
        <button
          onClick={() => {
            setConfirmationAction("openAll");
            setOpenConfirmationDialog(true);
          }}
          className="flex items-center gap-2 px-4 py-2 font-medium bg-[#D9D9D9]/31 border border-[#D9D9D9] rounded-2xl text-sm"
        >
          <OpenAll />
          <span>Open All {daysInMonth} Days</span>
        </button>
        <button
          onClick={() => {
            setConfirmationAction("closedAll");
            setOpenConfirmationDialog(true);
          }}
          className="flex items-center gap-2 px-4 py-2 font-medium bg-[#E44848]/8 border border-[#770B0B] rounded-2xl text-sm"
        >
          <ClosedAll />
          <span>Closed All</span>
        </button>

        {/* Apply only counts days with no existing status */}
        {(() => {
          const applyCount = [...selectedDays].filter(
            (key) => !bookingData[key]?.status,
          ).length;
          return (
            <button
              onClick={() => {
                setOpenConfirmationDialog(true);
                setConfirmationAction("apply");
              }}
              className="ml-auto px-6 py-2 rounded-full bg-[#b5a020] text-white text-sm font-bold hover:bg-[#9e8c1a] transition shadow-sm whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={applyCount === 0}
            >
              Apply {applyCount > 0 ? `(${applyCount})` : ""}
            </button>
          );
        })()}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-4 h-4 rounded-sm ${color}`} />
      <span>{label}</span>
    </div>
  );
}
