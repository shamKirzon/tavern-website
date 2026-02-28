import { formatReadableDate } from "../utils/date";
import { date, remove, SideBarReservation } from "../assets/icons/icons";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useState } from "react";

const ReservationPage = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [reservationDetails, setReservationDetails] = useState();

  // Constant:
  const reservationFilters = [
    { count: 3, name: "Testing" },
    { count: 23, name: "Pending" },
    { count: 90, name: "Cancel Request" },
    { count: 44, name: "Approved" },
    { count: 0, name: "Declined" },
    { count: 0, name: "Cancelled" },
    { name: "Date", icon: date },
    { icon: remove },
  ];

  const reservations = [
    {
      name: "Dana Joysi The Dog",
      status: "Pending",
      type: "Inclusive",
      pax: 2,
      date: "2026-03-01",
      time: "10:00",
    },
    {
      name: "PaupauSiopau",
      status: "Approved",
      type: "Exclusive",
      pax: 1,
      date: "2026-03-01",
      time: "12:00",
    },
    {
      name: "Boss Alex",
      status: "Cancelled",
      type: "Inclusive",
      pax: 3,
      date: "2026-03-02",
      time: "02:00",
    },
    {
      name: "Boss Lester",
      status: "Pending",
      type: "Exclusive",
      pax: 1,
      date: "2026-03-02",
      time: "03:30",
    },
    {
      name: "Boss Dorin",
      status: "Approved",
      type: "Inclusive",
      pax: 4,
      date: "2026-03-03",
      time: "11:00",
    },
    {
      name: "Boss Ethel",
      status: "Pending",
      type: "Exclusive",
      pax: 2,
      date: "2026-03-01",
      time: "10:00",
    },
    {
      name: "Boss Janice",
      status: "Approved",
      type: "Inclusive",
      pax: 1,
      date: "2026-03-01",
      time: "12:00",
    },
    {
      name: "Mark Johnson",
      status: "Cancelled",
      type: "Exclusive",
      pax: 3,
      date: "2026-03-02",
      time: "02:00",
    },
    {
      name: "Emily Clark",
      status: "Pending",
      type: "Inclusive",
      pax: 1,
      date: "2026-03-02",
      time: "03:30",
    },
    {
      name: "David Lee",
      status: "Approved",
      type: "Exclusive",
      pax: 4,
      date: "2026-03-03",
      time: "11:00",
    },
    {
      name: "John Doe",
      status: "Pending",
      type: "Inclusive",
      pax: 2,
      date: "2026-03-01",
      time: "10:00",
    },
    {
      name: "Jane Smith",
      status: "Approved",
      type: "Exclusive",
      pax: 1,
      date: "2026-03-01",
      time: "12:00",
    },
    {
      name: "Mark Johnson",
      status: "Cancelled",
      type: "Inclusive",
      pax: 3,
      date: "2026-03-02",
      time: "02:00",
    },
    {
      name: "Emily Clark",
      status: "Pending",
      type: "Exclusive",
      pax: 1,
      date: "2026-03-02",
      time: "03:30",
    },
    {
      name: "David Lee",
      status: "Approved",
      type: "Inclusive",
      pax: 4,
      date: "2026-03-03",
      time: "11:00",
    },
    {
      name: "John Doe",
      status: "Pending",
      type: "Exclusive",
      pax: 2,
      date: "2026-03-01",
      time: "10:00",
    },
    {
      name: "Jane Smith",
      status: "Approved",
      type: "Inclusive",
      pax: 1,
      date: "2026-03-01",
      time: "12:00",
    },
    {
      name: "Mark Johnson",
      status: "Cancelled",
      type: "Exclusive",
      pax: 3,
      date: "2026-03-02",
      time: "02:00",
    },
    {
      name: "Emily Clark",
      status: "Pending",
      type: "Inclusive",
      pax: 1,
      date: "2026-03-02",
      time: "03:30",
    },
    {
      name: "David Lee",
      status: "Approved",
      type: "Exclusive",
      pax: 4,
      date: "2026-03-03",
      time: "11:00",
    },
  ];

  // Functions:

  const displayReservationDetails = () => (
    <div className="p-2">
      <Table>
        <TableBody>
          {/* Status */}
          <TableRow className="border-[#D9D9D9] ">
            <TableCell className="py-2 text-[#717171]">Status</TableCell>
            <TableCell className="py-2 font-medium wrap-break-word whitespace-normal w-[100px]">
              Pending
            </TableCell>
          </TableRow>

          {/* Name */}
          <TableRow className="border-[#D9D9D9] ">
            <TableCell className="py-2 text-[#717171]">Name</TableCell>
            <TableCell className="py-2 font-medium wrap-break-word whitespace-normal w-[100px]">
              Dana Joysi the Dog
            </TableCell>
          </TableRow>

          {/* Email*/}
          <TableRow className="border-[#D9D9D9] ">
            <TableCell className="py-2 text-[#717171]">Email</TableCell>
            <TableCell className="py-2 font-medium wrap-break-word whitespace-normal w-[100px]">
              arfarf@gmail.com
            </TableCell>
          </TableRow>

          {/* Contact Number */}
          <TableRow className="border-[#D9D9D9] ">
            <TableCell className="py-2 text-[#717171]">
              Contact Number
            </TableCell>
            <TableCell className="py-2 font-medium wrap-break-word whitespace-normal w-[100px]">
              09876543210
            </TableCell>
          </TableRow>

          {/* Date */}
          <TableRow className="border-[#D9D9D9] ">
            <TableCell className="py-2 text-[#717171]">Date</TableCell>
            <TableCell className="py-2 font-medium wrap-break-word whitespace-normal w-[100px]">
              March 1, 2026
            </TableCell>
          </TableRow>

          {/* Type */}
          <TableRow className="border-[#D9D9D9] ">
            <TableCell className="py-2 text-[#717171]">
              Reservation Type
            </TableCell>
            <TableCell className="py-2 font-medium wrap-break-word whitespace-normal w-[100px]">
              Exclusive
            </TableCell>
          </TableRow>

          {/* Pax */}
          <TableRow className="border-[#D9D9D9] ">
            <TableCell className="py-2 text-[#717171]">Pax</TableCell>
            <TableCell className="py-2 font-medium wrap-break-word whitespace-normal w-[100px]">
              3
            </TableCell>
          </TableRow>

          {/* Reservation Fee */}
          <TableRow className="border-[#D9D9D9] ">
            <TableCell className="py-2 text-[#717171]">
              Reservation Fee
            </TableCell>
            <TableCell className="py-2 font-medium wrap-break-word whitespace-normal w-[100px]">
              19000
            </TableCell>
          </TableRow>

          {/* Reservation Id */}
          <TableRow className="border-[#D9D9D9] ">
            <TableCell className="py-2 text-[#717171]">
              Reservation Id
            </TableCell>
            <TableCell className="py-2 font-medium wrap-break-word whitespace-normal w-[100px]">
              DNF93NDNF3
            </TableCell>
          </TableRow>

          {/* Reference No.  */}
          <TableRow className="border-[#D9D9D9] ">
            <TableCell className="py-2 text-[#717171]">
              Reference Number
            </TableCell>
            <TableCell className="py-2 font-medium wrap-break-word whitespace-normal w-[100px]">
              Eabdfo203993e
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
  const getCurrentDate = () => {
    const formattedDate = formatReadableDate(new Date());
    return formattedDate;
  };

  const fetchReservationDetails = (reservationId: string) => {
    //get data from backend
  };

  return (
    // Main container
    <div>
      {/* Header Container*/}
      <div
        className="flex flex-row pl-6 items-center w-full h-27 rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)]
                bg-linear-to-r from-[#AA3131] via-[#AA3131] to-[#770B0B]"
      >
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center ">
          <SideBarReservation className="text-white w-10 h-10" />
        </div>

        <div className="ml-6 text-white flex flex-col ">
          <text className="text-4xl font-bold font-poppins ">Reservations</text>
          <text className="text-lg font-poppins">
            {getCurrentDate()} {/* current date */}
          </text>
        </div>
      </div>

      {/* Search and Statuses Container*/}
      <div className=" flex flex-col w-full p-4 gap-2 bg-white mt-4 rounded-2xl shadow-lg font-poppins">
        <text className=" text-sm  text-[#717171]">
          Showing 25 of 99 Reservations
        </text>
        {/* Search, Status */}
        <div className="flex flex-row gap-2">
          <input
            className="bg-[#D9D9D9]/31 p-2 w-63 rounded-lg shadow-md focus:outline-0"
            type="text"
            placeholder="Search"
          />

          <div className="flex flex-wrap gap-2">
            {reservationFilters.map((filter, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-[#D9D9D9]/31 rounded-lg shadow-md"
              >
                {/* Badge if count exists */}
                {filter.count !== undefined && (
                  <div className="h-5 w-5 bg-[#D9D9D9] font-medium text-black rounded-full flex items-center justify-center text-xs">
                    {filter.count}
                  </div>
                )}

                {/* Icon if exists */}
                {filter.icon && (
                  <div className="h-5 w-5 flex items-center justify-center">
                    <filter.icon />
                  </div>
                )}

                {/* Name if exists */}
                {filter.name && (
                  <span className="font-poppins text-sm">{filter.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reservation List and Details Container */}
      <div className="flex flex-row gap-5">
        {/* Reservation ListS */}
        <div className="w-200 h-115 bg-white p-3  font-poppins mt-4 rounded-2xl shadow-lg overflow-y-auto hide-scrollbar ">
          <Table>
            <TableHeader>
              <TableRow className="border-[#D9D9D9]">
                <TableHead className="w-2.5"></TableHead>
                <TableHead className="w-40">Name</TableHead>
                <TableHead className="w-45">Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead className="text-right">Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation, index) => (
                <TableRow
                  onClick={() => setSelectedRow(index)}
                  key={index}
                  className={`py-4 border-[#D9D9D9] ${selectedRow === index ? "bg-[#AA3131]/20" : ""}`}
                >
                  <TableCell className="py-4">{index + 1}</TableCell>
                  <TableCell className="py-4 font-medium wrap-break-word whitespace-normal w-[100px]">
                    {reservation.name}
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`inline-flex items-center rounded-lg  py-0.5 h-8 px-8
              ${reservation.status === "Approved" ? "bg-[#009507]/20 text-[#009507]" : ""}
              ${reservation.status === "Pending" ? "bg-[#EFD974]/20 text-[#A6902A]" : ""}
              ${reservation.status === "Declined" ? "bg-[#B10000] text-[#B10000]" : ""}
              ${reservation.status === "Cancelled" ? "bg-[#ECD105]/20 text-[#ECD105]" : ""}
            `}
                    >
                      {reservation.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">{reservation.type}</TableCell>
                  <TableCell className="py-4">{reservation.pax}</TableCell>
                  <TableCell className="py-4 text-right">
                    {reservation.date} {reservation.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Reservation Details Container */}
        <div className="w-100 h-115 bg-white mt-4 rounded-2xl  overflow-y-auto hide-scrollbar shadow-lg font-poppins ">
          {/* Banner */}
          <div
            className=" flex h-15 rounded-t-2xl text-xl text-white pl-4 items-center
                bg-linear-to-r from-[#AA3131] via-[#AA3131] to-[#770B0B]"
          >
            Reservation Details
          </div>

          {/* Details */}
          {displayReservationDetails()}
          {/* Buttons*/}
          <div>{/* Approved, Rejected, Pending */}</div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
