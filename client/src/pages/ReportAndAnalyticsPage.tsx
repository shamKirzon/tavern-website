import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const trendData = [
  { day: "Mon", approved: 9, cancelled: 4 },
  { day: "Tue", approved: 1, cancelled: 8 },
  { day: "Wed", approved: 5, cancelled: 4 },
  { day: "Thu", approved: 4, cancelled: 3 },
  { day: "Fri", approved: 10, cancelled: 7 },
  { day: "Sat", approved: 3, cancelled: 10 },
  { day: "Sun", approved: 9, cancelled: 6 },
];

const statusData = [
  { name: "Approved", value: 143, color: "#4CAF50" },
  { name: "Pending", value: 40, color: "#EAC54F" },
  { name: "Rejected", value: 20, color: "#C0392B" },
  { name: "Cancelled", value: 88, color: "#4A78E3" },
];

const revenueData = [
  { day: "Mon", revenue: 22000, orders: 33 },
  { day: "Tue", revenue: 3000, orders: 12 },
  { day: "Wed", revenue: 12000, orders: 42 },
  { day: "Thu", revenue: 15000, orders: 61 },
  { day: "Fri", revenue: 25000, orders: 5 },
  { day: "Sat", revenue: 10000, orders: 27 },
  { day: "Sun", revenue: 23000, orders: 40 },
];

const employees = [
  { name: "Dannah Torres", type: "Full-time" },
  { name: "Shammy Suyat", type: "Part-time" },
  { name: "Keia Marie", type: "Full-time" },
  { name: "Paulyn Blanco", type: "Part-time" },
  { name: "Yuji Midorikawa", type: "Full-time" },
];

const ReportsAnalyticsPage: React.FC = () => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-500 to-red-800 text-white rounded-xl p-6 shadow-lg mb-8">
        <h1 className="text-3xl font-bold">Reports and Analytics</h1>
        <p className="text-sm opacity-90">{today}</p>
      </div>

      {/* ================= RESERVATIONS ================= */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Reservations</h2>
          <div className="flex-1 h-px bg-gray-300"></div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">
            Generate
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative bg-white rounded-xl shadow p-6">
            <div className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-green-200"></div>
            <p className="text-gray-500 text-sm">Total Reservation</p>
            <h3 className="text-3xl font-bold mt-2">143</h3>
          </div>

          <div className="relative bg-white rounded-xl shadow p-6">
            <div className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-purple-200"></div>
            <p className="text-gray-500 text-sm">Approved Reservations</p>
            <h3 className="text-3xl font-bold mt-2">143</h3>
          </div>

          <div className="relative bg-white rounded-xl shadow p-6">
            <div className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-yellow-200"></div>
            <p className="text-gray-500 text-sm">Cancelled Reservations</p>
            <h3 className="text-3xl font-bold mt-2">88</h3>
          </div>
        </div>

        {/* Booking Trends + Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Booking Trends</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fill: "#6B7280" }} />
                  <YAxis tick={{ fill: "#6B7280" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="approved"
                    stroke="#EAC54F"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cancelled"
                    stroke="#B33939"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Booking Status</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="square"
                    wrapperStyle={{ paddingTop: 20 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ORDERS & REVENUE ================= */}
      <div className="mt-16 mb-20">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Orders and Revenue</h2>
          <div className="flex-1 h-px bg-gray-300"></div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">
            Generate
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative bg-white rounded-xl shadow p-6">
            <div className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-green-200"></div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h3 className="text-3xl font-bold mt-2">₱123.7K</h3>
          </div>

          <div className="relative bg-white rounded-xl shadow p-6">
            <div className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-purple-200"></div>
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h3 className="text-3xl font-bold mt-2">143</h3>
          </div>

          <div className="relative bg-white rounded-xl shadow p-6">
            <div className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-yellow-200"></div>
            <p className="text-gray-500 text-sm">Orders per Day</p>
            <h3 className="text-3xl font-bold mt-2">88</h3>
          </div>
        </div>

        {/* Revenue Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Revenue Overtime</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#EAC54F" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Order Volume</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#B33939" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EMPLOYEES ================= */}
      <div className="mt-16 mb-20">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Employees</h2>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Employee Directory</h3>
            <p className="text-sm text-gray-500">19 staff members</p>
          </div>

          <table className="w-full text-sm">
            <thead className="text-gray-500 uppercase text-xs">
              <tr className="border-b">
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">Shift Time</th>
                <th className="text-left py-3">Days</th>
                <th className="text-left py-3">PIN</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees.map((emp, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4">{emp.name}</td>
                  <td>
                    <span className="px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-medium">
                      {emp.type}
                    </span>
                  </td>
                  <td>8:00PM - 6:00AM</td>
                  <td>Mon,Tue,Wed,Sat</td>
                  <td>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ReportsAnalyticsPage;