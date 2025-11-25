import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface OrderItem {
  qty: number;
  name: string;
  serving: string;
  notes: string;
  amount: number;
}

interface Reservation {
  id: string;
  email: string;
  status: "Approved" | "Pending";
  pax: number;
  dateTime: string;
  date: string;
  name: string;
  contact: string;
  type: string;
  guests: number;
  customerId: string;
  reservationId: string;
  fee: number;
  referenceNumber: string;
  items: OrderItem[];
  availablePac: number;
}

const ReservationManagement: React.FC = () => {
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [reservations] = useState<Reservation[]>([
    {
      id: "1",
      email: "kelayeso@gmail.com",
      status: "Approved",
      pax: 20,
      dateTime: "2025-11-25 21:54",
      date: "2025-09-18",
      name: "Dannith Joxep Torres",
      contact: "09876543210",
      type: "Exclusive",
      guests: 50,
      customerId: "1bbadb5f-64e-4540-aaffe-0f0acc6f46dd",
      reservationId: "52bc6f-42ee-44cd-b023-8f8a6c4d8ef",
      fee: 30000,
      referenceNumber: "ITT2311042244008",
      items: [
        { qty: 1, name: "Tav Special Pork Sisig", serving: "Solo", notes: "N/A", amount: 3845 },
        { qty: 1, name: "Tav Chicken Fingers Platter", serving: "To Share", notes: "N/A", amount: 3845 },
        { qty: 1, name: "Chili Ballpark Nachos", serving: "Regular", notes: "N/A", amount: 3845 },
        { qty: 1, name: "Ihaw-ihaw Set", serving: "Solo", notes: "N/A", amount: 3845 },
        { qty: 1, name: "Charcuterie Set", serving: "Solo", notes: "N/A", amount: 3845 },
      ],
      availablePac: 55,
    },
    {
      id: "2",
      email: "kelayeso@gmail.com",
      status: "Pending",
      pax: 18,
      dateTime: "2025-11-25 23:21",
      date: "2025-09-18",
      name: "John Doe",
      contact: "09876543211",
      type: "Regular",
      guests: 40,
      customerId: "customer-2",
      reservationId: "reservation-2",
      fee: 25000,
      referenceNumber: "ITT2311042244009",
      items: [],
      availablePac: 45,
    },
  ]);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-full mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Reservations</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium">Total Result: 100</span>

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
                    <th className="text-left px-6 py-4 font-semibold text-sm">No.</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Email Address</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Status</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Pax</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Date & Time</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Details</th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.map((res, idx) => (
                    <tr key={res.id} className={idx !== reservations.length - 1 ? "border-b border-gray-300" : ""}>
                      <td className="px-6 py-4 text-sm font-semibold">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm">{res.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex justify-center items-center w-18 px-3 py-1 rounded text-white text-xs font-regular ${
                            res.status === "Approved" ? "bg-green-500" : "bg-orange-400"
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{res.pax}</td>
                      <td className="px-6 py-4 text-sm">{res.dateTime}</td>
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

          {/* RIGHT SIDE DETAILS */}
          <div className="col-span-1">
            {selectedReservation ? (
              <div className="bg-white border border-gray-300 rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold">Reservation Details</h2>
                  <button onClick={() => setSelectedReservation(null)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">Date:</div>
                    <div className="text-sm font-semibold">{selectedReservation.date}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">Name:</div>
                    <div className="text-sm font-semibold">{selectedReservation.name}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">Contact Number:</div>
                    <div className="text-sm font-semibold">{selectedReservation.contact}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">Type of Reservation:</div>
                    <div className="text-sm font-semibold">{selectedReservation.type}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">Guests:</div>
                    <div className="text-sm font-semibold">{selectedReservation.guests}</div>
                  </div>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-300">
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">Customer ID:</div>
                    <div className="text-xs text-gray-600 break-all">{selectedReservation.customerId}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">Reservation ID:</div>
                    <div className="text-xs text-gray-600 break-all">{selectedReservation.reservationId}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">Reservation Fee:</div>
                    <div className="text-sm font-semibold">{selectedReservation.fee.toLocaleString()} PHP</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">Reference Number:</div>
                    <div className="text-sm font-semibold">{selectedReservation.referenceNumber}</div>
                  </div>
                </div>

                <div className="flex flex-row gap-3 mb-6">
                  <button className="w-1/2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-semibold">
                    Valid ID
                  </button>
                  <button className="w-1/2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-semibold">
                    Proof of Payment
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-base">Available Pax</span>
                    <span className="font-bold text-base">{selectedReservation.availablePac}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded font-bold">
                    Approve Reservation
                  </button>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded font-bold">
                    Decline
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 h-full flex items-center justify-center">
                <p className="text-gray-500 text-sm text-center">Select a reservation to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationManagement;