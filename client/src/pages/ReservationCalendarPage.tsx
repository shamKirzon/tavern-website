import { formatReadableDate } from "@/utils/date";
import {
  ApprovedReservation,
  AvailableReservation,
  DateVisible,
  ExclusiveReservation,
  PendingReservation,
  RegularReservation,
  SideBarDashboard,
  TotalEarnings,
  TotalReservation,
} from "@/assets/icons/icons";

import { Switch } from "@/components/ui/switch";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useEffect, useState, useCallback } from "react";
import React from "react";
import { BookingCalendar } from "@/components/ui/booking-calendar";
import { reservationsApi } from "@/api/reservations.api";
import type { BookingData, DayStatus, BookingInfo } from "@/types/Reservation";

// Converts the API summary into BookingData format the calendar understands
function buildBookingDataFromSummary(
  summary: { date: string; count: number }[],
): BookingData {
  const result: BookingData = {};
  summary.forEach(({ date, count }) => {
    result[date] = {
      booked: count,
      total: 100,
      status: "available",
    };
  });
  return result;
}

// Merges DB-configured statuses with real reservation counts
// DB status always wins, but booked count comes from real reservations
function mergeCalendarData(
  dbData: BookingData,
  reservationData: BookingData,
): BookingData {
  const merged: BookingData = { ...dbData };
  Object.entries(reservationData).forEach(([date, resInfo]) => {
    if (merged[date]) {
      merged[date] = { ...merged[date], booked: resInfo.booked };
    } else {
      merged[date] = resInfo;
    }
  });
  return merged;
}

const ReservationCalendarPage = () => {
  // Calendar Data:
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [refreshKey, setRefreshKey] = useState(0);

  // selection state:
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const fetchBookingData = useCallback(async (year: number, month: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const [dbDays, summary, allReservations] = await Promise.all([
        reservationsApi.getBookingDaysByMonth(year, month),
        reservationsApi.getReservationCalendarSummary(year, month),
        reservationsApi.getReservationList(),
      ]);

      const reservationData = buildBookingDataFromSummary(summary);
      const merged = mergeCalendarData(dbDays, reservationData);
      setBookingData(merged);
      setReservations(allReservations || []);
    } catch (err) {
      setError("Failed to fetch booking data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookingData(currentYear, currentMonth);
  }, [currentYear, currentMonth, refreshKey, fetchBookingData]);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  const handleUpdateBookingDays = async (
    dates: string[],
    status: DayStatus,
  ) => {
    setIsLoading(true);
    try {
      await reservationsApi.updateBookingDays(dates, status);
      triggerRefresh();
    } catch (err) {
      setError("Failed to update booking days.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedDateKey(null); // Clear selection when month changes
  };

  const reservationSummaryItems = React.useMemo(() => {
    const filtered = reservations.filter((r) => {
      const rDate = new Date(r.date);
      return (
        rDate.getFullYear() === currentYear && rDate.getMonth() === currentMonth
      );
    });

    const pending = filtered.filter((r) => r.reservationStatus === "pending")
      .length;
    const approved = filtered.filter((r) => r.reservationStatus === "accepted")
      .length;
    const total = filtered.length;
    const exclusive = filtered.filter((r) => r.reservationType === "exclusive")
      .length;
    const regular = filtered.filter((r) => r.reservationType === "inclusive")
      .length;
    const earnings = filtered
      .filter((r) => r.reservationStatus === "done")
      .reduce((sum, r) => sum + (Number(r.reservationAmount) || 0), 0);

    // Available formula: (days open * 100) - total reservations in month
    // "Open" days are those with status 'available' or 'fullyBooked'
    const openDaysCount = Object.values(bookingData).filter(
      (d) => d.status === "available" || d.status === "fullyBooked",
    ).length;
    const available = Math.max(0, openDaysCount * 100 - total);

    return [
      {
        label: "Pending Reservation",
        count: pending,
      },
      {
        label: "Total Reservation",
        count: total,
      },
      {
        label: "Approved Reservation",
        count: approved,
      },
      {
        label: "Available Reservation",
        count: available,
      },
      {
        label: "Exclusive Reservation",
        count: exclusive,
      },
      {
        label: "Regular Reservation",
        count: regular,
      },
      {
        label: "Total Earnings",
        count: "₱ " + earnings.toLocaleString(),
      },
    ];
  }, [reservations, bookingData, currentYear, currentMonth]);

  // Derived state for the switch
  const selectedInfo = selectedDateKey ? bookingData[selectedDateKey] : null;

  // Functions:
  const reservationSummaryBadge = (label: string) => {
    switch (label) {
      case "Pending Reservation":
        return (
          <div className=" flex justify-center items-center p-1.5 bg-[#EFD974]/40 rounded-lg ">
            <PendingReservation className="w-5 h-5" />
          </div>
        );
      case "Total Reservation":
        return (
          <div className=" flex justify-center items-center p-1.5 bg-[#009507]/20 rounded-lg ">
            <TotalReservation className="w-5 h-5" />
          </div>
        );
      case "Approved Reservation":
        return (
          <div className=" flex justify-center items-center p-1.5 bg-[#0011FF]/20 rounded-lg ">
            <ApprovedReservation className="w-5 h-5" />
          </div>
        );
      case "Available Reservation":
        return (
          <div className=" flex justify-center items-center p-1.5 bg-[#10B981]/20 rounded-lg ">
            <AvailableReservation className="w-5 h-5 text-[#059669]" />
          </div>
        );
      case "Exclusive Reservation":
        return (
          <div className=" flex justify-center items-center p-1.5 bg-black/20 rounded-lg ">
            <ExclusiveReservation className="w-5 h-5" />
          </div>
        );
      case "Regular Reservation":
        return (
          <div className=" flex justify-center items-center p-1.5 bg-black/20 rounded-lg ">
            <RegularReservation className="w-5 h-5" />
          </div>
        );
      case "Total Earnings":
        return (
          <div className=" flex justify-center items-center p-1.5 bg-[#953200]/20 rounded-lg ">
            <TotalEarnings className="w-5 h-5" />
          </div>
        );

      default:
        break;
    }
  };

  return (
    // Main container
    <div className="font-poppins">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">
            ×
          </button>
        </div>
      )}

      {/* Header Container */}
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
          <h1 className=" text-[38px] font-bold leading-tight">Calendar</h1>
          <p className=" text-[13px] mt-0.5 opacity-85">
            {formatReadableDate(new Date())}
          </p>
        </div>
      </div>

      {/* Calendar & Reservation Summary Container*/}
      <div className="flex flex-row gap-5">
        {/* Calendar*/}
        <div className="w-200  bg-white p-3 mt-4 rounded-2xl shadow-lg h-fit">
          <BookingCalendar
            externalBookingData={bookingData}
            isLoading={isLoading}
            onMonthChange={handleMonthChange}
            onDayClick={(key) => setSelectedDateKey(key)}
            onApply={(dates) => handleUpdateBookingDays(dates, "available")}
            onOpenAll={(dates) => handleUpdateBookingDays(dates, "available")}
            onCloseAll={(dates) => handleUpdateBookingDays(dates, "closed")}
          />
        </div>

        {/*Reservation Summary*/}
        <div className="w-100 h-115 bg-white mt-4 rounded-2xl  overflow-y-auto hide-scrollbar shadow-lg  ">
          {/* Date */}
          <div className="flex flex-col pl-10 pt-5">
            <span className="text-lg font-medium">
              Month of {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })}
            </span>
          </div>
          <div className="px-6 pt-2.5">
            <Table>
              <TableBody>
                <TableRow className="border-[#D9D9D9] text-black text-sm">
                  <TableCell className="py-2">
                    <div
                      className={`flex items-center gap-2 ${!selectedDateKey ? "text-gray-400" : "text-black"}`}
                    >
                      <Switch
                        disabled={!selectedDateKey}
                        checked={
                          selectedInfo?.status === "available" ||
                          selectedInfo?.status === "fullyBooked"
                        }
                        onCheckedChange={async (checked) => {
                          const status = checked ? "available" : "closed";
                          if (selectedDateKey) {
                            await handleUpdateBookingDays(
                              [selectedDateKey],
                              status,
                            );
                          }
                        }}
                        className="data-[state=checked]:bg-[#009507] data-[state=unchecked]:bg-gray-300 disabled:opacity-30 cursor-default"
                      />
                      <span
                        className={!selectedDateKey ? "text-gray-400" : ""}
                      >
                        Open for reservations
                      </span>
                    </div>
                  </TableCell>
                </TableRow>

                {reservationSummaryItems.map((item, index) => (
                  <TableRow
                    key={index}
                    className="border-[#D9D9D9] text-black text-sm"
                  >
                    <TableCell className="py-2 flex items-center gap-2">
                      {reservationSummaryBadge(item.label)}
                      <span className="text-[0.8rem] ">{item.label}</span>
                    </TableCell>

                    <TableCell className="py-2 text-right whitespace-nowrap">
                      {item.count}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendarPage;
