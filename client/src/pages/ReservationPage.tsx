import { formatReadableDate } from "@/utils/date";
import {
  CancelRequest,
  DateCategory,
  SideBarReservation,
} from "@/assets/icons/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState, useMemo } from "react";
import { capitalizeWords } from "@/utils/capitalizeWords";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { reservationsApi } from "@/api/reservations.api";

// ─── Component ────────────────────────────────────────────────────────────────

const ReservationPage = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(
    null,
  );
  const [filterActive, setFilterActive] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openCancellationDialog, setOpenCancellationDialog] =
    useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [openModalImage, setOpenModalImage] = useState<boolean>(false);

  //fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      const data = await reservationsApi.getReservationList();
      setReservations(data);
      console.log("RESERVATION DATA: ", reservations);
    };

    fetchReservations();
  }, []);

  const handleOpenImage = (imageUrl: string) => {
    setOpenModalImage(true);
    setImageUrl(imageUrl);
  };

  const reservationFilters = [
    { count: 3, name: "All" },
    { count: 23, name: "Pending" },
    { count: 90, name: "Cancel Request" },
    { count: 44, name: "Approved" },
    { count: 31, name: "Declined" },
    { count: 3, name: "Cancelled" },
    { count: 92, name: "Done" },
  ];

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchesFilter =
        filterActive === "All" ||
        filterActive === "Date" ||
        r.reservationStatus.toLowerCase() === filterActive.toLowerCase() ||
        (filterActive === "Cancel Request" &&
          r.reservationStatus === "cancel_request");

      const q = searchQuery.toLowerCase();
      const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
      const matchesSearch =
        q === "" ||
        fullName.includes(q) ||
        r.reservationStatus.toLowerCase().includes(q) ||
        r.reservationType.toLowerCase().includes(q) ||
        r.date.includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [reservations, filterActive, searchQuery]);

  // Row click handler
  const handleRowClick = (reservation: any, index: number) => {
    setSelectedRow(index);
    setSelectedReservation(reservation);
  };

  // Style maps
  const filterColors: Record<string, string> = {
    All: "bg-black/20 border-black",
    Pending: "bg-[#A6902A]/20 border-[#A6902A]",
    Approved: "bg-[#009507]/20 border-[#009507]",
    Declined: "bg-[#B10000]/20 border-[#B10000]",
    Cancelled: "bg-[#ECD105]/20 border-[#ECD105]",
    CancelRequest: "bg-[#FF8400]/20 border-[#FF8400]",
    Done: "bg-[#2563EB]/20 border-[#2563EB]",
  };

  const badgeColors: Record<string, string> = {
    All: "bg-white",
    Pending: "bg-[#A6902A]",
    Approved: "bg-[#009507]",
    Declined: "bg-[#B10000]",
    Cancelled: "bg-[#ECD105]",
    CancelRequest: "bg-[#FF8400]",
    Done: "bg-[#2563EB]/20",
  };

  // Reservation Details Panel

  const displayReservationDetails = () => {
    if (!selectedReservation) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 py-10">
          <span className="text-sm font-poppins">
            Select a reservation to view details
          </span>
        </div>
      );
    }

    const reservationFields = [
      { label: "Status", value: selectedReservation.reservationStatus },
      {
        label: "Name",
        value: `${selectedReservation.firstName} ${selectedReservation.lastName}`,
      },
      { label: "Contact Number", value: selectedReservation.mobileNumber },
      { label: "Date", value: selectedReservation.date },
      {
        label: "Reservation Type",
        value: capitalizeWords(selectedReservation.reservationType),
      },
      { label: "Pax", value: selectedReservation.pax },
      {
        label: "Reservation Fee",
        value: `₱ ${Number(selectedReservation.reservationAmount).toLocaleString()}`,
      },
      { label: "Reservation ID", value: selectedReservation.reservationId },
      {
        label: "Reference Number",
        value: selectedReservation.paymentReferenceNumber ?? "N/A",
      },
      {
        label: "Payment Amount",
        value:
          selectedReservation.paymentAmount != null
            ? `₱ ${Number(selectedReservation.paymentAmount).toLocaleString()}`
            : "N/A",
      },
    ];

    const displayCancellationRequestButton = () => (
      <div className="flex px-4 flex-col gap-3 mt-2">
        <div className="flex flex-col p-2 gap-1 bg-[#AA3131]/20 border border-[#AA3131] rounded-2xl w-full">
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

        <button
          onClick={() => setOpenCancellationDialog(true)}
          className="flex bg-[#AA3131] rounded-md w-full py-2 justify-center items-center"
        >
          <span className="text-[0.8rem]">Cancel Reservation</span>
        </button>

        <Dialog
          open={openCancellationDialog}
          onOpenChange={setOpenCancellationDialog}
        >
          <DialogContent className="w-sm p-0 overflow-hidden font-poppins rounded-2xl border-none gap-0">
            <div className="bg-red-900 px-6 py-5">
              <DialogTitle className="text-white text-xl font-medium">
                Cancel Reservation
              </DialogTitle>
            </div>
            <div className="bg-white px-6 pt-6 pb-6 flex flex-col gap-4 text-sm">
              <DialogDescription className="text-gray-600 text-md">
                Are you sure you want to{" "}
                <span className="font-bold text-red-700">
                  cancel this reservation
                </span>
                ? This cannot be{" "}
                <span className="font-bold text-gray-800">undone</span>.
              </DialogDescription>
              <Button className="w-full bg-[#770B0B] hover:bg-red-900 text-white rounded-xl py-4 text-md">
                Upload Refund Receipt
              </Button>
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
      </div>
    );

    const displayNonCancellationButton = () => (
      <div className="flex px-4 flex-col gap-3">
        <button className="flex bg-[#009507] rounded-md w-full py-2 justify-center items-center">
          <span className="text-[0.8rem]">Approve Reservation</span>
        </button>
        <button className="flex bg-[#AA3131] rounded-md w-full py-2 justify-center items-center">
          <span className="text-[0.8rem]">Decline Reservation</span>
        </button>
      </div>
    );

    return (
      <div className="p-2">
        <Table>
          <TableBody>
            {reservationFields.map((field, index) => (
              <TableRow key={index} className="border-[#D9D9D9]">
                <TableCell className="py-2 text-[#717171]">
                  {field.label}
                </TableCell>
                {field.label !== "Status" && (
                  <TableCell className="py-2 font-sm wrap-break-word whitespace-normal w-[100px]">
                    {field.value}
                  </TableCell>
                )}
                {field.label === "Status" && (
                  <TableCell className="py-2">
                    <span
                      className={`inline-flex items-center rounded-2xl h-8 px-8
                        ${field.value === "accepted" ? "bg-[#009507]/20 text-[#009507]" : ""}
                        ${field.value === "pending" ? "bg-[#EFD974]/20 text-[#A6902A]" : ""}
                        ${field.value === "declined" ? "bg-[#B10000]/20 text-[#B10000]" : ""}
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

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 text-white pb-4">
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => handleOpenImage(selectedReservation.validIdUrl)}
              className="bg-[#1C1B1F] rounded-xl w-40 py-2"
            >
              <span className="text-[0.8rem]">View Valid ID</span>
            </button>
            <button
              onClick={() => handleOpenImage(selectedReservation.paymentUrl)}
              className="bg-[#1C1B1F] rounded-xl w-45 py-2"
            >
              <span className="text-[0.8rem]">View Proof of Payment</span>
            </button>
          </div>

          {selectedReservation.reservationStatus === "pending" &&
            displayNonCancellationButton()}
          {selectedReservation.reservationStatus === "cancel_request" &&
            displayCancellationRequestButton()}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div
        className="flex flex-row pl-7 items-center w-full h-[100px] rounded-2xl"
        style={{
          background: "linear-gradient(to right, #AA3131, #770B0B)",
          boxShadow: "0 8px 32px rgba(150,30,30,0.45)",
        }}
      >
        <div className="w-[60px] h-[60px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <SideBarReservation className="text-white w-8 h-8" />
        </div>
        <div className="ml-5 text-white">
          <h1 className="font-poppins text-[38px] font-bold leading-tight">
            Reservations
          </h1>
          <p className="font-poppins text-[13px] mt-0.5 opacity-85">
            {formatReadableDate(new Date())}
          </p>
        </div>
      </div>

      {/* Search and Statuses Container */}
      <div className="flex flex-col w-full p-4 gap-2 bg-white mt-4 rounded-2xl shadow-lg font-poppins">
        <span className="text-sm text-[#717171]">
          Showing {filteredReservations.length} of {reservations.length}{" "}
          Reservations
        </span>

        <div className="flex flex-row gap-2">
          <input
            className="bg-[#D9D9D9]/31 p-2 w-80 rounded-lg shadow-md focus:outline-0 text-sm placeholder:text-sm"
            type="text"
            placeholder="Search by name, status, type..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedRow(null);
              setSelectedReservation(null);
            }}
          />

          <div className="flex flex-wrap gap-2">
            {reservationFilters.map((filter, index) => (
              <button
                onClick={() => {
                  setFilterActive(filter.name);
                  setSelectedRow(null);
                  setSelectedReservation(null);
                }}
                key={index}
                className={`flex items-center gap-2 px-[0.70rem] py-1 rounded-lg shadow-md border
                  ${
                    filterActive === filter.name
                      ? filterColors[filter.name.replace(" ", "")]
                      : "bg-[#D9D9D9]/31 border-transparent"
                  }`}
              >
                {filter.count !== undefined && (
                  <div
                    className={`h-5 w-5 font-medium text-black rounded-full flex items-center justify-center text-xs
                      ${
                        filterActive === filter.name
                          ? badgeColors[filter.name.replace(" ", "")]
                          : "bg-black/20"
                      }`}
                  >
                    {filter.count}
                  </div>
                )}
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
        {/* Reservation List */}
        <div className="w-200 h-115 bg-white p-3 font-poppins mt-4 rounded-2xl shadow-lg overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#D9D9D9]">
                <TableHead className="w-2.5"></TableHead>
                <TableHead className="w-50">Name</TableHead>
                <TableHead className="w-50">Status</TableHead>
                <TableHead className="w-30">Type</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-gray-400"
                  >
                    No reservations found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservations.map((reservation, index) => (
                  <TableRow
                    onClick={() => handleRowClick(reservation, index)}
                    key={reservation.reservationId}
                    className={`py-4 border-[#D9D9D9] cursor-pointer hover:bg-[#AA3131]/10
                      ${selectedRow === index ? "bg-[#AA3131]/20" : ""}`}
                  >
                    <TableCell className="py-4">{index + 1}</TableCell>
                    <TableCell className="py-4 font-medium wrap-break-word whitespace-normal w-[100px]">
                      {reservation.firstName} {reservation.lastName}
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className={`inline-flex items-center rounded-lg py-0.5 h-8 px-8
                          ${reservation.reservationStatus === "accepted" ? "bg-[#009507]/20 text-[#009507]" : ""}
                          ${reservation.reservationStatus === "pending" ? "bg-[#EFD974]/20 text-[#A6902A]" : ""}
                          ${reservation.reservationStatus === "declined" ? "bg-[#B10000]/20 text-[#B10000]" : ""}
                          ${reservation.reservationStatus === "cancelled" ? "bg-[#ECD105]/20 text-[#ECD105]" : ""}
                          ${reservation.reservationStatus === "done" ? "bg-[#2563EB]/20 text-[#2563EB]" : ""}
                          ${reservation.reservationStatus === "cancel_request" ? "bg-[#FF8400]/20 text-[#FF8400]" : ""}
                        `}
                      >
                        {capitalizeWords(reservation.reservationStatus)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      {capitalizeWords(reservation.reservationType)}
                    </TableCell>
                    <TableCell className="py-4">{reservation.pax}</TableCell>
                    <TableCell className="py-4 text-right">
                      {reservation.date}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Reservation Details */}
        <div className="flex flex-col w-100 h-115 bg-white mt-4 rounded-2xl shadow-lg font-poppins">
          <div className="flex h-15 rounded-t-2xl text-xl text-white pl-4 items-center bg-linear-to-r from-[#AA3131] via-[#AA3131] to-[#770B0B]">
            Reservation Details
          </div>
          <div className="flex-1 overflow-y-auto">
            {displayReservationDetails()}
          </div>
        </div>

        {/* modal - view image */}
        <Dialog open={openModalImage} onOpenChange={setOpenModalImage}>
          <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

          <DialogContent
            className="
      fixed top-1/2 left-1/2
      w-[500px] h-[500px]
      -translate-x-1/2 -translate-y-1/2
      bg-white
      border-2 border-red-500
      rounded-xl
      shadow-xl
      flex items-center justify-center
      p-4
    "
          >
            <img
              src={imageUrl?.replace("/upload/", "/upload/f_auto,w_600/")}
              alt="Valid ID"
              className="
        w-full h-full
        object-contain
      "
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ReservationPage;
