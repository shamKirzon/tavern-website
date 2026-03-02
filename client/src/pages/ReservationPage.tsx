import { formatReadableDate } from "../utils/date";
import {
  CancelRequest,
  DateCategory,
  SideBarReservation,
} from "../assets/icons/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { useEffect, useState } from "react";
import type { Reservation } from "../types/Reservation";
import { capitalizeWords } from "../utils/capitalizeWords";

import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../components/ui/dialog";

const ReservationPage = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [reservationDetails, setReservationDetails] = useState<Reservation>({
    reservationStatus: "done",
    assignedSecurityId: null,
    firstName: "Dana Joysi",
    lastName: "The Dog",
    email: null,
    mobileNumber: "09876543210",
    date: "2026-03-01",
    reservationType: "exclusive",
    pax: 3,
    reservationAmount: 19000,
    paymentAmount: 2333,
    reservationId: "DNF93NDNF3",
    paymentReferenceNumber: "Eabdfo203993e",
    paymentUrl: "sample.com",
    customerId: "exampleIId9anocand",
    validIdUrl: "valididurlaodcnadcad",
    createdAt: null,
  });

  const [filterActive, setFilterActive] = useState<string>("");
  const [openCancellationDialog, setOpenCancellationDialog] =
    useState<boolean>(false);

  useEffect(() => {
    // fetch reservationList(accepted, rejected, pending, cancelled, done..)
  }, []);

  const reservationFilters = [
    { count: 3, name: "All" },
    { count: 23, name: "Pending" },
    { count: 90, name: "Cancel Request" },
    { count: 44, name: "Approved" },
    { count: 31, name: "Declined" },
    { count: 3, name: "Cancelled" },
    { count: 92, name: "Done" },
    { name: "Date", icon: DateCategory },
  ];

  const reservations = [
    {
      name: "Dana Joysi The Dog",
      status: "Done",
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

  const reservationFields = [
    { label: "Status", value: reservationDetails?.reservationStatus },
    {
      label: "Name",
      value: `${reservationDetails?.firstName} ${reservationDetails?.lastName}`,
    },
    { label: "Email", value: "hakdog@gmail.com" },
    { label: "Contact Number", value: reservationDetails?.mobileNumber },
    { label: "Date", value: reservationDetails?.date },
    { label: "Reservation Type", value: reservationDetails?.reservationType },
    { label: "Pax", value: reservationDetails?.pax },
    { label: "Reservation Fee", value: reservationDetails?.reservationAmount },
    { label: "Reservation Id", value: reservationDetails?.reservationId },
    {
      label: "Reference Number",
      value: reservationDetails?.paymentReferenceNumber,
    },
  ];

  const filterColors: Record<string, string> = {
    All: "bg-black/20 border-black",
    Pending: "bg-[#A6902A]/20 border-[#A6902A]",
    Approved: "bg-[#009507]/20 border-[#009507]",
    Declined: "bg-[#B10000]/20 border-[#B10000]",
    Cancelled: "bg-[#ECD105]/20 border-[#ECD105]",
    CancelRequest: "bg-[#FF8400]/20 border-[#FF8400]",
    Done: "bg-[#2563EB]/20 border-[#2563EB]",
    Date: "bg-black/20 border-black",
  };

  const badgeColors: Record<string, string> = {
    All: "bg-white",
    Pending: "bg-[#A6902A] ",
    Approved: "bg-[#009507]",
    Declined: "bg-[#B10000]",
    Cancelled: "bg-[#ECD105]",
    CancelRequest: "bg-[#FF8400]",
    Done: "bg-[#2563EB]/20",
    Date: "bg-white",
  };

  // Functions:
  const displayReservationDetails = () => {
    const displayNonCancellationButton = () => (
      // if status === "pending"
      <div className="flex px-4 flex-col gap-3">
        <button className="flex bg-[#009507] rounded-md w-full py-2 justify-center items-center">
          <span className="text-[0.8rem] ">Approve Reservation </span>
        </button>

        <button className="flex bg-[#AA3131] rounded-md w-full py-2 justify-center items-center">
          <span className="text-[0.8rem]">Decline Reservation</span>
        </button>
      </div>

      // if status === "done" && "approved"
      // return none:
    );

    const displayCancellationRequestButton = () => (
      <div className="flex px-4 flex-col gap-3">
        {/* cancellation status = pending */}
        <div className="flex flex-col p-2 gap-1 bg-[#AA3131]/20 border border-[#AA3131] rounded-2xl w-full ">
          <div className="flex justify-between w-full">
            <div className="flex flex-row gap-1">
              <CancelRequest />
              <span className="text-[0.8rem] font-medium text-[#AA3131]">
                CANCEL REQUESTED
              </span>
            </div>
            <span className="text-[#717171] text-[0.7rem]">3/1/2025</span>
          </div>

          <div>
            <span className="text-black text-[0.8rem]">
              "Change of plans - our event got rescheduled to next month.
            </span>
          </div>
        </div>

        {/* cancellation status = pending */}
        {true && (
          <button
            onClick={() => setOpenCancellationDialog(true)}
            className="flex bg-[#AA3131] rounded-md w-full py-2 justify-center items-center"
          >
            <span className="text-[0.8rem]">Cancel Reservation</span>
          </button>
        )}

        {/* Cancellation Dialog */}
        <Dialog
          open={openCancellationDialog}
          onOpenChange={setOpenCancellationDialog}
        >
          <DialogContent className="w-sm p-0 overflow-hidden font-poppins rounded-2xl border-none gap-0">
            {/* Red header */}
            <div className=" bg-red-900 px-6 py-5">
              <DialogTitle className="text-white text-xl font-medium ">
                Cancel Reservation
              </DialogTitle>
            </div>

            {/* Body */}
            <div className="bg-white px-6 pt-6 pb-6 flex flex-col gap-4 text-sm">
              <DialogDescription className="text-gray-600 text-md">
                Are you sure you want to{" "}
                <span className="font-bold text-red-700">
                  cancel this reservation
                </span>
                ? This cannot be{" "}
                <span className="font-bold text-gray-800">undone</span>.
              </DialogDescription>

              {/* Upload Refund Receipt button */}
              <Button className="w-full bg-[#770B0B] hover:bg-red-900 text-white rounded-xl py-4 text-md">
                Upload Refund Receipt
              </Button>

              {/* Cancel / Yes, Cancel row */}
              <div className="flex gap-3">
                <DialogClose asChild>
                  <Button className="flex-1 bg-[#1C1B1F] hover:bg-gray-900 text-white rounded-xl py-5 text-md">
                    Cancel
                  </Button>
                </DialogClose>
                <Button className="flex-1 bg-[#EFD974] hover:bg-yellow-300 text-black rounded-xl py-5 text-md">
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* cancellation status = approved */}
        {false && (
          <div className="flex flex-col gap-2">
            <button className="flex bg-black rounded-md w-full py-2 justify-center items-center">
              <span className="text-[0.8rem] text-white">
                View Refund Receipt
              </span>
            </button>

            <button className="flex bg-[#717171] rounded-md w-full py-2 justify-center items-center">
              <span className="text-[0.8rem] text-white">
                Reservation Cancelled
              </span>
            </button>
          </div>
        )}
      </div>
    );

    return (
      <>
        <div className="p-2">
          <Table>
            <TableBody>
              {reservationFields.map((field, index) => (
                <TableRow key={index} className="border-[#D9D9D9] ">
                  <TableCell className="py-2 text-[#717171]">
                    {field.label}
                  </TableCell>
                  {field.label !== "Status" && (
                    <TableCell className="py-2 font-medium wrap-break-word whitespace-normal w-[100px]">
                      {field.value}
                    </TableCell>
                  )}
                  {field.label === "Status" && (
                    <TableCell className="py-2">
                      <span
                        className={`inline-flex items-center rounded-2xl   h-8 px-8
              ${field.value === "accepted" ? "bg-[#009507]/20 text-[#009507]" : ""}
              ${field.value === "pending" ? "bg-[#EFD974]/20 text-[#A6902A]" : ""}
              ${field.value === "rejected" ? "bg-[#B10000] text-[#B10000]" : ""}
              ${field.value === "cancelled" ? "bg-[#ECD105]/20 text-[#ECD105]" : ""}
              ${field.value === "done" ? "bg-[#2563EB]/20 text-[#2563EB]" : ""}
            `}
                      >
                        {capitalizeWords(field.value as string)}
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* check if the reservationId is existing sa cancel request na table:
        if yes - display yung "Cancel Requested at Cancel Reservation Button"
      */}

          {/* Button Container */}
          <div className="flex flex-col gap-3 text-white pb-4">
            {/* Valid id & Proof of Payment Button  */}
            <div className="flex  gap-3 justify-center mt-3">
              <button className="bg-[#1C1B1F] rounded-xl w-40">
                <span className="text-[0.8rem]">View Valid ID</span>
              </button>
              <button className="bg-[#1C1B1F] rounded-xl w-45">
                <span className="text-[0.8rem]">View Proof of Payment</span>
              </button>
            </div>

            {/* {displayNonCancellationButton()} */}
            {displayCancellationRequestButton()}
          </div>

          {/* For Cancellation Request */}
        </div>
      </>
    );
  };

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
              <button
                onClick={() => setFilterActive(filter.name)}
                key={index}
                className={`flex items-center gap-2 px-[0.70rem] py-1 rounded-lg shadow-md border
                   ${filterActive === filter.name ? filterColors[filter.name.replace(" ", "")] : "bg-[#D9D9D9]/31 border-transparent"}
                  `}
              >
                {/* Badge if count exists */}
                {filter.count !== undefined && (
                  <div
                    className={`h-5 w-5 font-medium text-black rounded-full flex items-center justify-center text-xs
                        ${filterActive === filter.name ? badgeColors[filter.name.replace(" ", "")] : "bg-black/20"}
                      `}
                  >
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
              </button>
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
              ${reservation.status === "Done" ? "bg-[#2563EB]/20 text-[#2563EB]" : ""}

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
        <div className="w-100 h-115 bg-white mt-4 rounded-2xl  overflow-y-auto  shadow-lg font-poppins ">
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
