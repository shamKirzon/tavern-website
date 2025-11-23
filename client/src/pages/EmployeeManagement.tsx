import React, { useState } from "react";
import { ChevronDown, Plus, Edit2, Trash2, X } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  pin: string;
  shiftStart: string;
  shiftEnd: string;
  avatar: string;
}

interface DialogState {
  type: null | "edit" | "cancel" | "confirm";
  show: boolean;
}

const EmployeeManagement: React.FC = () => {
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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Employee | null>(null);
  const [dialog, setDialog] = useState<DialogState>({
    type: null,
    show: false,
  });

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

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            <Plus className="w-5 h-5" />
            Add Employee
          </button>
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

export default EmployeeManagement;
