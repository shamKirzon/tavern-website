import { formatReadableDate } from "../utils/date";
import {
  CancelRequest,
  DateCategory,
  SideBarDashboard,
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

const ReservationCalendarPage = () => {
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
          <h1 className="font-poppins text-[38px] font-bold leading-tight">
            Calendar
          </h1>
          <p className="font-poppins text-[13px] mt-0.5 opacity-85">
            {getCurrentDate()}
          </p>
        </div>
      </div>

      {/* Calendar & Reservation Summary*/}
      <div className="flex flex-row gap-5">
        {/* Calendar*/}
        <div className="w-200 h-115 bg-white p-3  font-poppins mt-4 rounded-2xl shadow-lg overflow-y-auto hide-scrollbar "></div>

        {/*Reservation Summary*/}
        <div className="w-100 h-115 bg-white mt-4 rounded-2xl  overflow-y-auto hide-scrollbar shadow-lg font-poppins "></div>
      </div>
    </div>
  );
};

export default ReservationCalendarPage;
