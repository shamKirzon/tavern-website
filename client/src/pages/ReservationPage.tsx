import { useEffect } from "react";
import { formatReadableDate } from "../utils/date";
import { SideBarReservation } from "../assets/icons/icons";

const ReservationPage = () => {
  // Functions:
  const currentDate = () => {
    const formattedDate = formatReadableDate(new Date());
    return formattedDate;
  };
  return (
    // Main container
    <div>
      {/* Header */}
      <div className="flex flex-row pl-6 items-center w-full h-27 bg-[#AA3131] rounded-2xl ">
        <div className="w-20 h-20 bg-[#6b7280] rounded-full flex items-center justify-center shadow-md">
          <SideBarReservation className="text-white w-10 h-10" />
        </div>

        <div className="ml-6 text-white flex flex-col gap-1">
          <div className="text-4xl font-bold">Reservations</div>
          <div className="text-lg ">
            {currentDate()} {/* current date */}
          </div>
        </div>
      </div>

      {/* Search and Statuses */}
      <div className="w-full h-27 bg-white mt-4 rounded-2xl shadow-lg "></div>

      {/* Reservation List and Details Container */}
      <div className="flex flex-row gap-5">
        {/* Reservation ListS */}
        <div className="w-200 h-109 bg-blue-50 mt-4 rounded-2xl shadow-lg ">
          {/* Content  */}
        </div>

        {/* Reservation Details */}
        <div className="w-100 h-109 bg-pink-50 mt-4 rounded-2xl shadow-lg ">
          {/* Content  */}
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
