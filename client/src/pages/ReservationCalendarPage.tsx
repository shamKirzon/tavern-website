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

import { useEffect, useState, useCallback } from "react";
import React from "react";
import { BookingCalendar } from "@/components/ui/booking-calendar";
import { reservationsApi } from "@/api/reservations.api";
import type { BookingData, DayStatus } from "@/types/Reservation";

const ReservationCalendarPage = () => {
  // Calendar Data:
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // others:
  const [isOpenForReservations, setIsOpenForReservation] =
    useState<boolean>(false);

  const fetchBookingData = useCallback(async (year: number, month: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reservationsApi.getBookingDaysByMonth(year, month);
      setBookingData(data);
    } catch (err) {
      setError("Failed to fetch booking data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookingData(currentYear, currentMonth);
  }, [currentYear, currentMonth, fetchBookingData]);

  const handleUpdateBookingDays = async (
    dates: string[],
    status: DayStatus,
  ) => {
    setIsLoading(true);
    try {
      await reservationsApi.updateBookingDays(dates, status);
      await fetchBookingData(currentYear, currentMonth);
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
  };

  useEffect(() => {
    if (isOpenForReservations) {
      console.log("BINUKSAN KO ANG BUTTON HEHE");
    }
  }, [isOpenForReservations]);

  const reservationSummaryItems = [
    {
      label: "Pending Reservation",
      count: 67,
    },
    {
      label: "Total Reservation",
      count: 81,
    },
    {
      label: "Approved Reservation",
      count: 14,
    },
    {
      label: "Available Reservation",
      count: 19,
    },
    {
      label: "Exclusive Reservation",
      count: 50,
    },
    {
      label: "Regular Reservation",
      count: 31,
    },
    {
      label: "Total Earnings",
      count: 52301,
    },
  ];

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
          <div className=" flex justify-center items-center p-1.5 bg-[#B10000]/20 rounded-lg ">
            <AvailableReservation className="w-5 h-5" />
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
  const getCurrentDate = () => {
    const formattedDate = formatReadableDate(new Date());
    return formattedDate;
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
          <p className=" text-[13px] mt-0.5 opacity-85">{getCurrentDate()}</p>
        </div>
      </div>

      {/* Calendar & Reservation Summary Container*/}
      <div className="flex flex-row gap-5">
        {/* Calendar*/}
        <div className="w-200  bg-white p-3 mt-4 rounded-2xl shadow-lg h-[650px]">
          <BookingCalendar
            externalBookingData={bookingData}
            isLoading={isLoading}
            onMonthChange={handleMonthChange}
            onApply={(dates) => handleUpdateBookingDays(dates, "available")}
            onOpenAll={(dates) => handleUpdateBookingDays(dates, "available")}
            onCloseAll={(dates) => handleUpdateBookingDays(dates, "closed")}
          />
        </div>

        {/*Reservation Summary*/}
        <div className="w-100 h-115 bg-white mt-4 rounded-2xl  overflow-y-auto hide-scrollbar shadow-lg  ">
          {/* Date & Date Visible */}
          <div className="flex flex-col pl-10 pt-5">
            <span className="text-lg font-medium">{getCurrentDate()}</span>
            {/* Date Visible */}
            <div className="flex flex-row gap-1">
              <DateVisible />
              <span className="text-[0.8rem] text-[#717171]">Date visible</span>
            </div>
          </div>
          <div className="px-6 pt-2.5">
            <Table>
              <TableBody>
                <TableRow className="border-[#D9D9D9] text-black text-sm">
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={isOpenForReservations}
                        onCheckedChange={setIsOpenForReservation}
                        className="data-[state=checked]:bg-[#009507] data-[state=unchecked]:bg-gray-300"
                      />
                      <span>Open for reservations</span>
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
