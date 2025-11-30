import React, { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import type { Reservation } from "../types/Reservation";
import { reservationsApi } from "../api/reservations.api";
import { formatDashDate, formatReadableDate } from "../utils/date";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "../components/ui/dialog";

const ReservationPage: React.FC = () => {
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [customerNames, setCustomerNames] = useState<Record<string, string>>(
    {}
  );

  const [reservationCount, setReservationCount] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [reservationData, setReservationData] = useState<Reservation[]>([]);

  // Modals:
  const [openModalImage, setOpenModalImage] = useState<boolean>(false);
  const [openModalConfirmation, setOpenModalConfirmation] =
    useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<
    "accepted" | "cancelled" | "rejected" | null
  >(null);
  const [selectedReservationId, setSelectedReservationId] =
    useState<string>("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservations = await reservationsApi.getReservationList();

        if (!reservations) return;

        const mappedReservations: Reservation[] = reservations.map(
          (res: any) => ({
            assignedSecurityId: res.assignedSecurityId,
            createdAt: res.createdAt,
            customerId: res.customerId,
            date: res.date,
            firstName: res.firstName,
            lastName: res.lastName,
            mobileNumber: res.mobileNumber,
            pax: res.pax,
            paymentAmount: res.paymentAmount,
            paymentReferenceNumber: res.paymentReferenceNumber,
            paymentUrl: res.paymentUrl,
            reservationAmount: res.reservationAmount,
            reservationId: res.reservationId,
            reservationStatus: res.reservationStatus,
            reservationType: res.reservationType,
            validIdUrl: res.validIdUrl,
          })
        );

        setReservationData(mappedReservations);
        setReservationCount(mappedReservations.length);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    };

    fetchReservations();
  }, [openModalConfirmation]);

  // customer name:
  useEffect(() => {
    const fetchCustomersName = async () => {
      if (!reservationData) return;

      const names: Record<string, string> = {};

      for (const res of reservationData) {
        try {
          const email = await reservationsApi.getEmail(res.customerId);
          names[res.customerId] = email;
        } catch (error) {
          console.error("Failed to fetch customer:", error);
        }
      }

      setCustomerNames(names);
    };

    fetchCustomersName();
  }, [reservationData]);

  // functions:

  const handleReservationStatus = async () => {
    try {
      if (selectedStatus === "accepted") {
        await reservationsApi.updateReservationStatus(
          selectedReservationId,
          "accepted"
        );
      } else if (selectedStatus === "rejected") {
        await reservationsApi.updateReservationStatus(
          selectedReservationId,
          "rejected"
        );
      } else if (selectedStatus === "cancelled") {
        await reservationsApi.updateReservationStatus(
          selectedReservationId,
          "cancelled"
        );
      } else throw new Error("The status is invalid");
    } catch (error) {
      console.error("Error in handleReservationStatus():", error);
    } finally {
      setSelectedReservationId("");
      setSelectedStatus(null);
      setOpenModalConfirmation(false);
      setSelectedReservation(null);
    }
  };

  const handleOpenConfirmation = (
    reservationId: string,
    status: "accepted" | "cancelled" | "rejected" | null
  ) => {
    setSelectedStatus(status);
    setSelectedReservationId(reservationId);
    setOpenModalConfirmation(true);
  };

  const handleOpenImage = (imageUrl: string) => {
    setOpenModalImage(true);
    setImageUrl(imageUrl);
  };

  const getStatusBg = (status: string) => {
    if (status === "accepted") return "bg-green-500";
    if (status === "done") return "bg-yellow-500";
    if (status === "cancelled") return "bg-orange-500";
    if (status === "rejected") return "bg-red-500";
    return "bg-orange-400";
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-full mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Reservations</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium">
            Number of Reservations: {reservationCount}
          </span>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            <ChevronDown className="w-4 h-4" />
            Sort
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left side - Table */}
          <div className="col-span-2">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <th className="text-left px-6 py-4 font-semibold text-sm">
                      No.
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">
                      Email Address
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">
                      Pax
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reservationData.map((res, index) => (
                    <tr
                      key={res.reservationId}
                      className={
                        index !== reservationData!.length - 1
                          ? "border-b border-gray-300"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 text-sm font-semibold">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {customerNames[res.customerId]}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex justify-center items-center w-18 px-3 py-1 rounded text-white text-xs font-regular ${getStatusBg(
                            res.reservationStatus
                          )}`}
                        >
                          {res.reservationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{res.pax}</td>
                      <td className="px-6 py-4 text-sm">
                        {formatDashDate(res.date)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedReservation(res)}
                          className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-xs font-semibold"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* modal - view image */}
          <Dialog open={openModalImage} onOpenChange={setOpenModalImage}>
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white  rounded-lg shadow-lg">
              <div className="my-4 flex justify-center">
                <img
                  src={imageUrl?.replace("/upload/", "/upload/f_auto,w_600/")}
                  alt="Valid ID"
                  className="max-w-full max-h-full rounded-lg object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* modal - confirmation */}
          <Dialog
            open={openModalConfirmation}
            onOpenChange={setOpenModalConfirmation}
          >
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-sm-translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 space-y-4">
              {/* Accessible Title */}
              <DialogTitle className="text-xl font-semibold text-center">
                {selectedStatus === "accepted" && "Approve Reservation"}
                {selectedStatus === "rejected" && "Reject Reservation"}
                {selectedStatus === "cancelled" && "Cancel Reservation"}
              </DialogTitle>

              {/* Accessible Description */}
              <DialogDescription className="text-center text-gray-600 text-sm">
                {selectedStatus === "accepted" &&
                  "Do you want to accept this reservation?"}
                {selectedStatus === "rejected" &&
                  "Do you want to reject this reservation?"}
                {selectedStatus === "cancelled" &&
                  "Do you want to cancel this reservation?"}
              </DialogDescription>

              {/* Confirmation Buttons */}
              <div className="grid grid-cols-1 gap-3 mt-4">
                <button
                  onClick={() => handleReservationStatus()}
                  className={`w-full px-4 py-3 rounded font-bold text-white transition ${
                    selectedStatus === "accepted"
                      ? "bg-green-600 hover:bg-green-700"
                      : selectedStatus === "rejected"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  {selectedStatus === "accepted" && "Approve Reservation"}
                  {selectedStatus === "rejected" && "Decline"}
                  {selectedStatus === "cancelled" && "Mark as Cancelled"}
                </button>

                <button
                  onClick={() => setOpenModalConfirmation(false)}
                  className="w-full px-4 py-3 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* RIGHT SIDE DETAILS */}
          <div className="col-span-1">
            {selectedReservation ? (
              <div className="bg-white border border-gray-300 rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold">Reservation Details</h2>
                  <button
                    onClick={() => setSelectedReservation(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      Date:
                    </div>
                    <div className="text-sm font-semibold">
                      {formatReadableDate(selectedReservation.date)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      Name:
                    </div>
                    <div className="text-sm font-semibold">
                      {selectedReservation.firstName}{" "}
                      {selectedReservation.lastName}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      Contact Number:
                    </div>
                    <div className="text-sm font-semibold">
                      {selectedReservation.mobileNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      Type of Reservation:
                    </div>
                    <div className="text-sm font-semibold">
                      {selectedReservation.reservationType
                        .charAt(0)
                        .toUpperCase()}
                      {selectedReservation.reservationType.slice(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      Guests:
                    </div>
                    <div className="text-sm font-semibold">
                      {selectedReservation.pax}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-300">
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      Customer ID:
                    </div>
                    <div className="text-xs text-gray-600 break-all">
                      {selectedReservation.customerId}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      Reservation ID:
                    </div>
                    <div className="text-xs text-gray-600 break-all">
                      {selectedReservation.reservationId}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      Reservation Fee:
                    </div>
                    <div className="text-sm font-semibold">
                      {selectedReservation.reservationAmount.toLocaleString()}{" "}
                      PHP
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      Reference Number:
                    </div>
                    <div className="text-sm font-semibold">
                      {selectedReservation.paymentReferenceNumber}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-3 mb-6">
                  <button
                    onClick={() =>
                      handleOpenImage(selectedReservation.validIdUrl)
                    }
                    className="w-1/2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-semibold"
                  >
                    Valid ID
                  </button>
                  <button
                    onClick={() =>
                      handleOpenImage(selectedReservation.paymentUrl)
                    }
                    className="w-1/2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-semibold"
                  >
                    Proof of Payment
                  </button>
                </div>

                <div className="mb-9"></div>

                <div className="flex flex-col gap-3">
                  {/* status - pending */}
                  {selectedReservation.reservationStatus === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleOpenConfirmation(
                            selectedReservation.reservationId,
                            "accepted"
                          )
                        }
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded font-bold"
                      >
                        Approve Reservation
                      </button>
                      <button
                        onClick={() =>
                          handleOpenConfirmation(
                            selectedReservation.reservationId,
                            "rejected"
                          )
                        }
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded font-bold"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {selectedReservation.reservationStatus === "accepted" && (
                    <>
                      <button
                        onClick={() =>
                          handleOpenConfirmation(
                            selectedReservation.reservationId,
                            "cancelled"
                          )
                        }
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded font-bold"
                      >
                        Mark as Cancelled
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 h-full flex items-center justify-center">
                <p className="text-gray-500 text-sm text-center">
                  Select a reservation to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
