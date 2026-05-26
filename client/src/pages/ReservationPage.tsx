import { formatDashDate, formatReadableDate } from "@/utils/date";
import { CancelRequest, SideBarReservation } from "@/assets/icons/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState, useMemo, useRef } from "react";
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
import type {
  CancellationStatus,
  ReservationStatus,
} from "@/types/Reservation";

const ReservationPage = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [reservationActions, setReservationActions] =
    useState<ReservationStatus>("none");
  const [cancellationAction, setCancellationAction] =
    useState<CancellationStatus>("none");

  const [reservationCancellations, setReservationCancellations] = useState<
    any[]
  >([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(
    null,
  );
  const [selectedCancellation, setSelectedCancellation] = useState<any | null>(
    null,
  );
  const [filterActive, setFilterActive] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [openModalImage, setOpenModalImage] = useState<boolean>(false);
  const [openConfirmCancellationModal, setOpenConfirmCancellationModal] =
    useState<boolean>(false);

  const [openReservationStatusModal, setOpenReservationStatusModal] =
    useState<boolean>(false);

  const [isUploadingReceipt, setIsUploadingReceipt] = useState<boolean>(false);
  const [uploadedRefundReceiptUrl, setUploadedRefundReceiptUrl] = useState<
    string | null
  >(null);
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReceiptFile, setRefundReceiptFile] = useState<File | null>(null);
  const [refundReceiptPreview, setRefundReceiptPreview] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      const data = await reservationsApi.getReservationList(2026);
      setReservations(data || []);
    };
    fetchReservations();
  }, []);

  // Fetch reservation cancellations
  useEffect(() => {
    const fetchCancellations = async () => {
      const [accepted, pending] = await Promise.all([
        reservationsApi.getReservationCancellations(2026),
        reservationsApi.getPendingReservationCancellation(2026),
      ]);
      setReservationCancellations([...(accepted || []), ...(pending || [])]);
    };
    fetchCancellations();
  }, []);

  const handleOpenImage = (url: string) => {
    setOpenModalImage(true);
    setImageUrl(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setRefundReceiptFile(file);
    setUploadedRefundReceiptUrl(null);
    if (file) {
      setRefundReceiptPreview(URL.createObjectURL(file));
    } else {
      setRefundReceiptPreview(null);
    }
  };

  const handleSaveReceipt = async () => {
    if (!refundReceiptFile) {
      console.log("No file selected");
      return;
    }

    setIsUploadingReceipt(true);
    try {
      const imageUrl = await reservationsApi.uploadImage(
        refundReceiptFile,
        "refundReceipt",
        selectedCancellation.reservationId,
      );

      if (imageUrl) {
        setUploadedRefundReceiptUrl(imageUrl);
        console.log("Refund receipt uploaded:", imageUrl);
        setOpenConfirmCancellationModal(false);
      }
    } catch (error) {
      console.log("Error uploading refund receipt:", error);
    } finally {
      updateCancellationStatus(
        selectedCancellation.reservationCancellationId,
        cancellationAction,
      );

      setIsUploadingReceipt(false);
    }
  };

  // ─── Filter type helpers ────────────────────────────────────────────────────
  // These filters show cancellation rows (from reservationCancellations)
  const CANCELLATION_FILTERS = ["Cancel Request", "Cancelled"];
  // "All" shows both reservation rows + cancellation rows
  const isCancelRequestView = filterActive === "Cancel Request";
  const isCancelledView = filterActive === "Cancelled";
  const isAllView = filterActive === "All";
  // True when the table should show cancellation rows
  const isCancellationView = isCancelRequestView || isCancelledView;

  // ─── Reservation Filters ────────────────────────────────────────────────────
  const reservationFilters = useMemo(() => {
    const activeReservations = reservations.filter(
      (r) => r.reservationStatus !== "cancelled",
    );

    // Reservation-side counts (pending / accepted / rejected / done)
    const countByStatus = (status: string) =>
      activeReservations.filter((r) => r.reservationStatus === status).length;

    // Cancellation-side counts
    const pendingCancellations = reservationCancellations.filter(
      (c) => c.status === "pending",
    ).length;
    // "Cancelled" = cancellations that the admin has confirmed (status === "accepted")
    const cancelledCount = reservationCancellations.filter(
      (c) => c.status === "accepted",
    ).length;

    // "All" = all non-cancelled reservations + all cancellations (pending/accepted)
    const allCount =
      activeReservations.length +
      reservationCancellations.filter(
        (c) => c.status === "pending" || c.status === "accepted",
      ).length;

    return [
      { count: allCount, name: "All" },
      { count: countByStatus("pending"), name: "Pending" },
      { count: pendingCancellations, name: "Cancel Request" },
      { count: countByStatus("accepted"), name: "Accepted" },
      { count: countByStatus("rejected"), name: "Declined" },
      { count: cancelledCount, name: "Cancelled" },
      { count: countByStatus("done"), name: "Done" },
    ];
  }, [reservations, reservationCancellations]);

  // ─── Enriched cancellations (Cancel Request = pending, Cancelled = accepted) ─
  const enrichedCancellations = useMemo(() => {
    return reservationCancellations
      .filter((c) => c.status === "pending" || c.status === "accepted")
      .map((c) => {
        const parentReservation = reservations.find(
          (r) => r.reservationId === c.reservationId,
        );
        return { ...c, reservation: parentReservation ?? null };
      });
  }, [reservationCancellations, reservations]);

  // ─── Filtered Reservations (Pending / Accepted / Rejected / Done) ───────────
  const filteredReservations = useMemo(() => {
    return reservations
      .filter((r) => r.reservationStatus !== "cancelled")
      .filter((r) => {
        const filterStatusMap: Record<string, string> = {
          Accepted: "accepted",
          Declined: "rejected",
        };
        const mappedStatus =
          filterStatusMap[filterActive] ?? filterActive.toLowerCase();

        // In "All" view, only show reservation-side statuses
        const matchesFilter =
          isAllView ||
          r.reservationStatus.toLowerCase() === mappedStatus.toLowerCase();

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
  }, [reservations, filterActive, searchQuery, isAllView]);

  // ─── Filtered Cancellations (Cancel Request = pending, Cancelled = accepted) ─
  const filteredCancellations = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return enrichedCancellations.filter((c) => {
      // In "Cancel Request" view: only pending; in "Cancelled" view: only accepted
      const matchesFilter =
        isAllView ||
        (isCancelRequestView && c.status === "pending") ||
        (isCancelledView && c.status === "accepted");

      const fullName = c.reservation
        ? `${c.reservation.firstName} ${c.reservation.lastName}`.toLowerCase()
        : "";
      const matchesSearch =
        q === "" ||
        fullName.includes(q) ||
        c.reason?.toLowerCase().includes(q) ||
        c.status?.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [
    enrichedCancellations,
    searchQuery,
    isAllView,
    isCancelRequestView,
    isCancelledView,
  ]);

  // ─── Row Click ───────────────────────────────────────────────────────────────
  const handleRowClick = (
    item: any,
    index: number,
    isCancellation: boolean,
  ) => {
    setSelectedRow(index);
    if (isCancellation) {
      setSelectedCancellation(item);
      setSelectedReservation(null);
    } else {
      setSelectedReservation(item);
      setSelectedCancellation(null);
    }
  };

  const updateReservationStatus = async (
    reservationId: string,
    status: ReservationStatus,
  ) => {
    await reservationsApi.updateReservationStatus(reservationId, status);

    setReservations((prev) =>
      prev.map((r) =>
        r.reservationId === reservationId
          ? { ...r, reservationStatus: status }
          : r,
      ),
    );

    setOpenReservationStatusModal(false);
  };

  const updateCancellationStatus = async (
    reservationCancellationId: string,
    status: CancellationStatus,
  ) => {
    await reservationsApi.updateCancellationStatus(
      reservationCancellationId,
      status,
    );

    setReservationCancellations((prev) =>
      prev.map((c) =>
        c.reservationCancellationId === reservationCancellationId
          ? { ...c, status: status }
          : c,
      ),
    );

    setOpenConfirmCancellationModal(false);
  };

  // ─── Styles Mapping ──────────────────────────────────────────────────────────
  const filterColors: Record<string, string> = {
    All: "bg-black/20 border-black",
    Pending: "bg-[#A6902A]/20 border-[#A6902A]",
    Accepted: "bg-[#009507]/20 border-[#009507]",
    Declined: "bg-[#B10000]/20 border-[#B10000]",
    Cancelled: "bg-[#ECD105]/20 border-[#ECD105]",
    CancelRequest: "bg-[#FF8400]/20 border-[#FF8400]",
    Done: "bg-[#2563EB]/20 border-[#2563EB]",
  };

  const badgeColors: Record<string, string> = {
    All: "bg-white",
    Pending: "bg-[#A6902A]",
    Accepted: "bg-[#009507]",
    Declined: "bg-[#B10000]",
    Cancelled: "bg-[#ECD105]",
    CancelRequest: "bg-[#FF8400]",
    Done: "bg-[#2563EB]/20",
  };

  const renderConfirmCancellationModal = () => (
    <Dialog
      open={openConfirmCancellationModal}
      onOpenChange={(open) => {
        setOpenConfirmCancellationModal(open);
        if (!open) {
          setRefundAmount("");
          setRefundReceiptFile(null);
          setRefundReceiptPreview(null);
          setUploadedRefundReceiptUrl(null);
        }
      }}
    >
      <DialogContent className="w-[420px] p-0 overflow-hidden font-poppins rounded-2xl border-none gap-0">
        <div className="bg-[#1a5c1a] px-6 py-5 flex items-center justify-between">
          <DialogTitle className="text-white text-xl font-medium">
            Refund Receipt
          </DialogTitle>
        </div>

        <div className="bg-white px-6 pt-5 pb-6 flex flex-col gap-5">
          <div className="flex items-center gap-2 border border-[#009507] rounded-full px-4 py-1.5 w-fit">
            <span className="text-[#009507] text-xs font-medium">
              Admin Only — Not visible to customer
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold tracking-widest text-gray-700 uppercase">
              Refund Amount
            </label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold tracking-widest text-gray-700 uppercase">
              Upload Receipt Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer hover:border-green-500 transition-colors"
            >
              {isUploadingReceipt && (
                <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {refundReceiptPreview ? (
                <img
                  src={refundReceiptPreview}
                  alt="Receipt preview"
                  className="max-h-32 object-contain rounded-lg"
                />
              ) : (
                <>
                  <svg
                    className="w-8 h-8 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"
                    />
                  </svg>
                  <span className="text-sm text-gray-400">
                    Upload an image here
                  </span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex gap-3 mt-1">
            <DialogClose asChild>
              <button className="flex-1 bg-[#1C1B1F] hover:bg-gray-900 text-white rounded-xl py-3 text-sm font-medium">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={handleSaveReceipt}
              disabled={isUploadingReceipt || !refundReceiptFile}
              className="flex-1 bg-[#1C1B1F] hover:bg-gray-900 text-white rounded-xl py-3 text-sm font-medium
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploadingReceipt ? "Uploading..." : "Save Receipt"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const displayCancellationDetails = () => {
    if (!selectedCancellation) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 py-10">
          <span className="text-sm font-poppins">
            Select a cancellation request to view details
          </span>
        </div>
      );
    }

    const r = selectedCancellation.reservation;

    const cancellationFields = [
      {
        label: "Cancellation Status",
        value: selectedCancellation.status,
        isStatus: true,
      },
      { label: "Name", value: r ? `${r.firstName} ${r.lastName}` : "N/A" },
      { label: "Contact Number", value: r?.mobileNumber ?? "N/A" },
      { label: "Reservation Date", value: formatDashDate(r?.date) ?? "N/A" },
      {
        label: "Reservation Type",
        value: r ? capitalizeWords(r.reservationType) : "N/A",
      },
      { label: "Pax", value: r?.pax ?? "N/A" },
      {
        label: "Reservation Fee",
        value: r ? `₱ ${Number(r.reservationAmount).toLocaleString()}` : "N/A",
      },
      { label: "Reservation ID", value: selectedCancellation.reservationId },
      { label: "Reason", value: selectedCancellation.reason ?? "N/A" },
      { label: "Notes", value: selectedCancellation.notes ?? "N/A" },
      {
        label: "Requested At",
        value: formatDashDate(selectedCancellation.createdAt),
      },
    ];

    // This is a confirmed cancellation (status === "accepted") — show refund receipt
    const isConfirmedCancellation = selectedCancellation.status === "accepted";

    return (
      <div className="p-2">
        <div className="mx-2 mb-2 flex flex-col p-2 gap-1 bg-[#AA3131]/20 border border-[#AA3131] rounded-2xl w-full">
          <div className="flex justify-between w-full">
            <div className="flex flex-row gap-1 items-center">
              <CancelRequest />
              <span className="text-[0.8rem] font-medium text-[#AA3131]">
                CANCEL REQUESTED
              </span>
            </div>
            <span className="text-[#717171] text-[0.7rem] pr-1">
              {formatReadableDate(selectedCancellation.createdAt)}
            </span>
          </div>
          {selectedCancellation.notes && (
            <span className="text-black text-[0.8rem]">
              "{selectedCancellation.notes}"
            </span>
          )}
        </div>

        <Table>
          <TableBody>
            {cancellationFields.map((field, index) => (
              <TableRow key={index} className="border-[#D9D9D9]">
                <TableCell className="py-2 text-[#717171]">
                  {field.label}
                </TableCell>
                {field.isStatus ? (
                  <TableCell className="py-2">
                    <span
                      className={`inline-flex items-center rounded-2xl h-8 px-8
                        ${field.value === "accepted" ? "bg-[#009507]/20 text-[#009507]" : ""}
                        ${field.value === "pending" ? "bg-[#EFD974]/20 text-[#A6902A]" : ""}
                        ${field.value === "rejected" ? "bg-[#B10000]/20 text-[#B10000]" : ""}
                      `}
                    >
                      {field.value === "rejected"
                        ? "Declined"
                        : field.value === "accepted"
                          ? "Cancelled"
                          : field.value === "pending"
                            ? "Cancel Request"
                            : capitalizeWords(field.value as string)}
                    </span>
                  </TableCell>
                ) : (
                  <TableCell className="py-2 font-sm wrap-break-word whitespace-normal w-[100px]">
                    {field.value}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 text-white pb-4 px-4 mt-2">
          {r && (
            <div className="flex gap-3 justify-center mt-2">
              <button
                onClick={() => handleOpenImage(r.validIdUrl)}
                className="bg-[#1C1B1F] rounded-xl w-40 py-2"
              >
                <span className="text-[0.8rem]">View Valid ID</span>
              </button>
              <button
                onClick={() => handleOpenImage(r.paymentUrl)}
                className="bg-[#1C1B1F] rounded-xl w-45 py-2"
              >
                <span className="text-[0.8rem]">View Proof of Payment</span>
              </button>
            </div>
          )}

          {/* View Refund Receipt — only shown for confirmed cancellations (Cancelled filter) */}
          {isConfirmedCancellation && selectedCancellation.refundReceiptUrl && (
            <button
              onClick={() =>
                handleOpenImage(selectedCancellation.refundReceiptUrl)
              }
              className="flex bg-[#1a5c1a] rounded-md w-full py-2 justify-center items-center"
            >
              <span className="text-[0.8rem]">View Refund Receipt</span>
            </button>
          )}

          {/* Confirm Cancellation — only shown for pending cancellations (Cancel Request filter) */}
          {selectedCancellation.status === "pending" && (
            <button
              onClick={() => {
                setCancellationAction("accepted");
                setOpenConfirmCancellationModal(true);
              }}
              className="flex bg-[#009507] rounded-md w-full py-2 justify-center items-center"
            >
              <span className="text-[0.8rem]">Confirm Cancellation</span>
            </button>
          )}
        </div>
      </div>
    );
  };

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
      { label: "Email", value: selectedReservation.email ?? "N/A" },
      {
        label: "Name",
        value: `${selectedReservation.firstName} ${selectedReservation.lastName}`,
      },
      { label: "Contact Number", value: selectedReservation.mobileNumber },
      { label: "Date", value: formatDashDate(selectedReservation.date) },
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

    const displayNonCancellationButton = () => (
      <div className="flex px-4 flex-col gap-3">
        <button
          onClick={() => {
            setReservationActions("accepted");
            setOpenReservationStatusModal(true);
          }}
          className="flex bg-[#009507] rounded-md w-full py-2 justify-center items-center"
        >
          <span className="text-[0.8rem]">Approve Reservation</span>
        </button>
        <button
          onClick={() => {
            setReservationActions("rejected");
            setOpenReservationStatusModal(true);
          }}
          className="flex bg-[#AA3131] rounded-md w-full py-2 justify-center items-center"
        >
          <span className="text-[0.8rem]">Decline Reservation</span>
        </button>

        {/* Confirmation Modal */}
        <Dialog
          open={openReservationStatusModal}
          onOpenChange={setOpenReservationStatusModal}
        >
          <DialogContent className="w-sm p-0 overflow-hidden font-poppins rounded-2xl border-none gap-0">
            <div className="bg-red-900 px-6 py-5">
              <DialogTitle className="text-white text-xl font-medium">
                Confirmation
              </DialogTitle>
            </div>

            <div className="bg-white px-6 pt-6 pb-6 flex flex-col gap-4 text-sm">
              <DialogDescription className="text-gray-600 text-md">
                Are you sure you want to apply this changes?
              </DialogDescription>

              <div className="flex gap-3">
                <DialogClose asChild>
                  <Button className="flex-1 bg-[#1C1B1F] hover:bg-gray-900 text-white rounded-xl py-5 text-md">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    updateReservationStatus(
                      selectedReservation.reservationId,
                      reservationActions,
                    );
                  }}
                  className="flex-1 bg-[#EFD974] hover:bg-yellow-300 text-black rounded-xl py-5 text-md"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                        ${field.value === "rejected" ? "bg-[#B10000]/20 text-[#B10000]" : ""}
                        ${field.value === "done" ? "bg-[#2563EB]/20 text-[#2563EB]" : ""}
                      `}
                    >
                      {field.value === "rejected"
                        ? "Declined"
                        : capitalizeWords(field.value as string)}
                    </span>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
        </div>
      </div>
    );
  };

  // ─── Determine what the details panel shows ──────────────────────────────────
  const showCancellationDetails = selectedCancellation !== null;

  // ─── Total count shown in header ─────────────────────────────────────────────
  const totalDisplayed = isCancellationView
    ? filteredCancellations.length
    : isAllView
      ? filteredReservations.length + filteredCancellations.length
      : filteredReservations.length;

  const totalSource = useMemo(() => {
    return reservationFilters.find((f) => f.name === "All")?.count ?? 0;
  }, [reservationFilters]);

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
          Showing {totalDisplayed} of {totalSource}{" "}
          {isCancelRequestView
            ? "Cancellation Requests"
            : isCancelledView
              ? "Cancelled Reservations"
              : "Reservations"}
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
              setSelectedCancellation(null);
            }}
          />

          <div className="flex flex-wrap gap-2">
            {reservationFilters.map((filter, index) => (
              <button
                onClick={() => {
                  setFilterActive(filter.name);
                  setSelectedRow(null);
                  setSelectedReservation(null);
                  setSelectedCancellation(null);
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
        {/* List */}
        <div className="w-200 h-115 bg-white p-3 font-poppins mt-4 rounded-2xl shadow-lg overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#D9D9D9]">
                <TableHead className="w-2.5"></TableHead>
                {isCancellationView ? (
                  <>
                    <TableHead className="w-50">Name</TableHead>
                    <TableHead className="w-50">Cancellation Status</TableHead>
                    <TableHead className="w-30">Reason</TableHead>
                    <TableHead>Reservation Date</TableHead>
                    <TableHead className="text-right">Requested At</TableHead>
                  </>
                ) : isAllView ? (
                  <>
                    <TableHead className="w-50">Name</TableHead>
                    <TableHead className="w-50">Status</TableHead>
                    <TableHead className="w-30">Type / Reason</TableHead>
                    <TableHead>Pax</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="w-50">Name</TableHead>
                    <TableHead className="w-50">Status</TableHead>
                    <TableHead className="w-30">Type</TableHead>
                    <TableHead>Pax</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Cancellation-only views */}
              {isCancellationView &&
                (filteredCancellations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-gray-400"
                    >
                      No{" "}
                      {isCancelRequestView
                        ? "cancellation requests"
                        : "cancelled reservations"}{" "}
                      found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCancellations.map((cancellation, index) => (
                    <TableRow
                      onClick={() => handleRowClick(cancellation, index, true)}
                      key={cancellation.reservationCancellationId}
                      className={`py-4 border-[#D9D9D9] cursor-pointer hover:bg-[#AA3131]/10
                        ${selectedRow === index && showCancellationDetails ? "bg-[#AA3131]/20" : ""}`}
                    >
                      <TableCell className="py-4">{index + 1}</TableCell>
                      <TableCell className="py-4 font-medium wrap-break-word whitespace-normal w-[100px]">
                        {cancellation.reservation
                          ? `${cancellation.reservation.firstName} ${cancellation.reservation.lastName}`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center rounded-lg py-0.5 h-8 px-8
                            ${cancellation.status === "accepted" ? "bg-[#009507]/20 text-[#009507]" : ""}
                            ${cancellation.status === "pending" ? "bg-[#EFD974]/20 text-[#A6902A]" : ""}
                            ${cancellation.status === "rejected" ? "bg-[#B10000]/20 text-[#B10000]" : ""}
                          `}
                        >
                          {cancellation.status === "rejected"
                            ? "Declined"
                            : cancellation.status === "accepted"
                              ? "Cancelled"
                              : cancellation.status === "pending"
                                ? "Cancel Request"
                                : capitalizeWords(cancellation.status)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 max-w-[120px]">
                        <span
                          className="block truncate"
                          title={cancellation.reason ?? "N/A"}
                        >
                          {cancellation.reason ?? "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        {formatDashDate(cancellation.reservation?.date) ??
                          "N/A"}
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        {formatDashDate(cancellation.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ))}

              {/* Reservation-only views (Pending / Accepted / Rejected / Done) */}
              {!isCancellationView &&
                !isAllView &&
                (filteredReservations.length === 0 ? (
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
                      onClick={() => handleRowClick(reservation, index, false)}
                      key={reservation.reservationId}
                      className={`py-4 border-[#D9D9D9] cursor-pointer hover:bg-[#AA3131]/10
                        ${selectedRow === index && !showCancellationDetails ? "bg-[#AA3131]/20" : ""}`}
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
                            ${reservation.reservationStatus === "rejected" ? "bg-[#B10000]/20 text-[#B10000]" : ""}
                            ${reservation.reservationStatus === "done" ? "bg-[#2563EB]/20 text-[#2563EB]" : ""}
                          `}
                        >
                          {reservation.reservationStatus === "rejected"
                            ? "Declined"
                            : capitalizeWords(reservation.reservationStatus)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        {capitalizeWords(reservation.reservationType)}
                      </TableCell>
                      <TableCell className="py-4">{reservation.pax}</TableCell>
                      <TableCell className="py-4 text-right">
                        {formatDashDate(reservation.date)}
                      </TableCell>
                    </TableRow>
                  ))
                ))}

              {/* All view — reservations first, then cancellations */}
              {isAllView &&
                (filteredReservations.length === 0 &&
                filteredCancellations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-gray-400"
                    >
                      No records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredReservations.map((reservation, index) => (
                      <TableRow
                        onClick={() =>
                          handleRowClick(reservation, index, false)
                        }
                        key={reservation.reservationId}
                        className={`py-4 border-[#D9D9D9] cursor-pointer hover:bg-[#AA3131]/10
                          ${selectedRow === index && !showCancellationDetails ? "bg-[#AA3131]/20" : ""}`}
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
                              ${reservation.reservationStatus === "rejected" ? "bg-[#B10000]/20 text-[#B10000]" : ""}
                              ${reservation.reservationStatus === "done" ? "bg-[#2563EB]/20 text-[#2563EB]" : ""}
                            `}
                          >
                            {reservation.reservationStatus === "rejected"
                              ? "Declined"
                              : capitalizeWords(reservation.reservationStatus)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          {capitalizeWords(reservation.reservationType)}
                        </TableCell>
                        <TableCell className="py-4">
                          {reservation.pax}
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          {formatDashDate(reservation.date)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredCancellations.map((cancellation, index) => {
                      const globalIndex = filteredReservations.length + index;
                      return (
                        <TableRow
                          onClick={() =>
                            handleRowClick(cancellation, globalIndex, true)
                          }
                          key={cancellation.reservationCancellationId}
                          className={`py-4 border-[#D9D9D9] cursor-pointer hover:bg-[#FF8400]/10
                            ${selectedRow === globalIndex && showCancellationDetails ? "bg-[#FF8400]/20" : ""}`}
                        >
                          <TableCell className="py-4">
                            {globalIndex + 1}
                          </TableCell>
                          <TableCell className="py-4 font-medium wrap-break-word whitespace-normal w-[100px]">
                            {cancellation.reservation
                              ? `${cancellation.reservation.firstName} ${cancellation.reservation.lastName}`
                              : "N/A"}
                          </TableCell>
                          <TableCell className="py-4">
                            <span className={`inline-flex items-center rounded-lg py-0.5 h-8 px-8 
                              ${cancellation.status === "pending" ? "bg-[#EFD974]/20 text-[#A6902A]" : "bg-[#009507]/20 text-[#009507]"}
                            `}>
                              {cancellation.status === "pending"
                                ? "Cancel Request"
                                : "Cancelled"}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 max-w-[120px]">
                            <span
                              className="block truncate"
                              title={cancellation.reason ?? "N/A"}
                            >
                              {cancellation.reason ?? "N/A"}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            {formatDashDate(cancellation.reservation?.date) ??
                              "N/A"}
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            {formatDashDate(cancellation.createdAt)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Details Panel */}
        <div className="flex flex-col w-100 h-115 bg-white mt-4 rounded-2xl shadow-lg font-poppins">
          <div className="flex h-15 rounded-t-2xl text-xl text-white pl-4 items-center bg-linear-to-r from-[#AA3131] via-[#AA3131] to-[#770B0B]">
            {showCancellationDetails
              ? "Cancellation Details"
              : "Reservation Details"}
          </div>
          <div className="flex-1 overflow-y-auto">
            {showCancellationDetails
              ? displayCancellationDetails()
              : displayReservationDetails()}
          </div>
        </div>

        {/* Modal — view image */}
        <Dialog open={openModalImage} onOpenChange={setOpenModalImage}>
          <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <DialogContent
            className="
              fixed top-1/2 left-1/2
              w-[500px] h-[500px]
              -translate-x-1/2 -translate-y-1/2
              bg-white border-2 border-red-500
              rounded-xl shadow-xl
              flex items-center justify-center p-4
            "
          >
            <img
              src={imageUrl?.replace("/upload/", "/upload/f_auto,w_600/")}
              alt="Document"
              className="w-full h-full object-contain"
            />
          </DialogContent>
        </Dialog>

        {renderConfirmCancellationModal()}
      </div>
    </div>
  );
};

export default ReservationPage;
