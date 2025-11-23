import React, { useState } from "react";
import { ChevronDown, Plus, Edit2, Trash2, ChevronRight } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  pin: string;
  shiftStart: string;
  shiftEnd: string;
  avatar: string;
}

interface OrderItem {
  qty: number;
  name: string;
  serving: string;
  notes: string;
  amount: number;
}

interface Order {
  id: string;
  email: string;
  qty: number;
  amount: number;
  dateTime: string;
  status: "Served" | "Pending";
  items: OrderItem[];
}

interface DialogState {
  type: null | "edit" | "cancel" | "confirm";
  show: boolean;
}

type View = "orders" | "employees";

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("orders");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Jeon Wonwoo",
      role: "Cashier",
      pin: "28042",
      shiftStart: "08:00",
      shiftEnd: "16:00",
      avatar: "👤",
    },
    {
      id: "2",
      name: "Kim Mingyu",
      role: "Security",
      pin: "11234",
      shiftStart: "08:00",
      shiftEnd: "16:00",
      avatar: "👤",
    },
    {
      id: "3",
      name: "Austin",
      role: "Bartender",
      pin: "09876",
      shiftStart: "08:00",
      shiftEnd: "16:00",
      avatar: "👤",
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      email: "kelayeso@gmail.com",
      qty: 5,
      amount: 100000,
      dateTime: "2025-11-21 21:43",
      status: "Served",
      items: [
        {
          qty: 3,
          name: "Tav Special Pork Sisig",
          serving: "Solo",
          notes: "N/A",
          amount: 5000,
        },
        {
          qty: 1,
          name: "Tav Chicken Fingers Platter",
          serving: "To Share",
          notes: "Wag Chicken",
          amount: 15000,
        },
        {
          qty: 10,
          name: "Chili Ballpark Nachos",
          serving: "Regular",
          notes: "Extra Chili",
          amount: 90000,
        },
      ],
    },
    {
      id: "2",
      email: "kelayeso@gmail.com",
      qty: 5,
      amount: 100000,
      dateTime: "2025-11-21 23:21",
      status: "Pending",
      items: [],
    },
    {
      id: "3",
      email: "kelayeso@gmail.com",
      qty: 5,
      amount: 100000,
      dateTime: "2025-11-21 23:21",
      status: "Pending",
      items: [],
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Employee | null>(null);
  const [dialog, setDialog] = useState<DialogState>({
    type: null,
    show: false,
  });

  // Employee Management Functions
  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setEditData({ ...employee });
  };

  const handleCancel = () => {
    setDialog({ type: "cancel", show: true });
  };

  const handleConfirmCancel = () => {
    setEditingId(null);
    setEditData(null);
    setDialog({ type: null, show: false });
  };

  const handleSaveClick = () => {
    setDialog({ type: "confirm", show: true });
  };

  const handleConfirmSave = () => {
    if (editData) {
      setEmployees(employees.map((e) => (e.id === editData.id ? editData : e)));
      setEditingId(null);
      setEditData(null);
    }
    setDialog({ type: null, show: false });
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  const toggleOrderExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  // Employee Management Edit View
  if (editingId && editData) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gray-300 rounded-lg"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-6">
                  Edit Employee Details
                </h2>

                <div className="mb-4">
                  <input
                    type="text"
                    value={editData.id}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded text-sm text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="px-4 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <select className="w-full px-4 py-2 border border-gray-300 rounded text-sm appearance-none bg-white">
                      <option>08:00</option>
                      <option>09:00</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
                  </div>
                  <input
                    type="text"
                    placeholder="End Time"
                    value={editData.shiftEnd}
                    className="px-4 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <select className="w-full px-4 py-2 border border-gray-300 rounded text-sm appearance-none bg-white">
                      <option>Start Date</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select className="w-full px-4 py-2 border border-gray-300 rounded text-sm appearance-none bg-white">
                      <option>Thursday</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Employee Type
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-2 border border-gray-300 rounded text-sm appearance-none bg-white">
                      <option>Security</option>
                      <option>Cashier</option>
                      <option>Bartender</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Employee PIN
                  </label>
                  <input
                    type="text"
                    value={editData.pin}
                    onChange={(e) =>
                      setEditData({ ...editData, pin: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveClick}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
                  >
                    Save Change
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-4xl">
                  {editData.avatar}
                </div>
                <button className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center text-white text-2xl hover:bg-blue-500">
                  +
                </button>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {employees.map((emp) => (
                <div key={emp.id} className="flex justify-between items-center">
                  <div className="text-sm">
                    {emp.shiftStart} - {emp.shiftEnd}
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {dialog.show && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            {dialog.type === "cancel" && (
              <div className="bg-white rounded-lg p-6 max-w-sm">
                <h3 className="text-lg font-bold mb-4">
                  Are you sure you want to cancel? This will delete all changes
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDialog({ type: null, show: false })}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded"
                  >
                    Save Change
                  </button>
                </div>
              </div>
            )}

            {dialog.type === "confirm" && (
              <div className="bg-white rounded-lg p-6 max-w-sm">
                <h3 className="text-lg font-bold mb-4">
                  Are you sure you want to make changes with Employee Details?
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDialog({ type: null, show: false })}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSave}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
                  >
                    Save Change
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Order Tracking View
  if (currentView === "orders") {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Order Tracking</h1>
            <button
              onClick={() => setCurrentView("employees")}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
            >
              Employee Management
            </button>
          </div>

          <div className="flex gap-4 items-center mb-6">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 bg-white">
              📅 Daily
            </button>
            <span className="text-sm font-medium">November 21, 2025</span>
            <span className="text-sm font-medium">Total Result: 100</span>
            <div className="ml-auto">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <ChevronDown className="w-4 h-4" />
                Sort
              </button>
            </div>
          </div>

          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="space-y-0">
              {orders.map((order, idx) => (
                <div key={order.id}>
                  <div
                    onClick={() => toggleOrderExpand(order.id)}
                    className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                      idx !== orders.length - 1
                        ? "border-b border-gray-300"
                        : ""
                    }`}
                  >
                    <div className="w-12 text-sm font-semibold text-gray-600">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{order.email}</div>
                    </div>
                    <div className="w-16 text-sm text-right">{order.qty}</div>
                    <div className="w-24 text-sm text-right">
                      ₱ {order.amount.toLocaleString()}
                    </div>
                    <div className="w-40 text-sm text-right text-gray-600">
                      {order.dateTime}
                    </div>
                    <div className="w-28">
                      <span
                        className={`inline-block px-3 py-1 rounded text-white text-xs font-semibold ${
                          order.status === "Served"
                            ? "bg-green-500"
                            : "bg-orange-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  {expandedOrderId === order.id && order.items.length > 0 && (
                    <div className="bg-gray-50 border-t border-gray-300 px-6 py-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left py-2 font-semibold">
                              Qty
                            </th>
                            <th className="text-left py-2 font-semibold">
                              Order Name
                            </th>
                            <th className="text-left py-2 font-semibold">
                              Serving
                            </th>
                            <th className="text-left py-2 font-semibold">
                              Notes
                            </th>
                            <th className="text-right py-2 font-semibold">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, itemIdx) => (
                            <tr
                              key={itemIdx}
                              className="border-b border-gray-200"
                            >
                              <td className="py-2">{item.qty}</td>
                              <td className="py-2">{item.name}</td>
                              <td className="py-2">{item.serving}</td>
                              <td className="py-2">{item.notes}</td>
                              <td className="py-2 text-right">
                                ₱ {item.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Employee Management Main View
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView("orders")}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
            >
              Order Tracking
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            <ChevronDown className="w-4 h-4" />
            Sort
          </button>
          <input
            type="text"
            placeholder="November 21, 2025"
            className="px-4 py-2 border border-gray-300 rounded"
          />
          <div className="px-4 py-2 text-gray-700">Total Result: 100</div>
        </div>

        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="text-left px-6 py-4 font-semibold text-sm">
                  Full Name
                </th>
                <th className="text-left px-6 py-4 font-semibold text-sm">
                  Security PIN
                </th>
                <th className="text-left px-6 py-4 font-semibold text-sm">
                  Role
                </th>
                <th className="text-left px-6 py-4 font-semibold text-sm">
                  Shift Time
                </th>
                <th className="text-left px-6 py-4 font-semibold text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr
                  key={emp.id}
                  className={
                    idx !== employees.length - 1
                      ? "border-b border-gray-300"
                      : ""
                  }
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white">
                      {emp.avatar}
                    </div>
                    <span className="text-sm">{emp.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">{emp.pin}</td>
                  <td className="px-6 py-4 text-sm">{emp.role}</td>
                  <td className="px-6 py-4 text-sm">
                    {emp.shiftStart} - {emp.shiftEnd}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
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

export default Dashboard;
