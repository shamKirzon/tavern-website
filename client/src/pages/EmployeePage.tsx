import React, { useState } from "react";
import { ChevronDown, Plus, Edit2, Trash2 } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  pin: string;
  shiftStart: string;
  shiftEnd: string;
  avatar: string;
  shiftDate: string;
}

interface DialogState {
  type: null | "editCancel" | "editConfirm" | "delete" | "addConfirm" | "addCancel";
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
      shiftDate: "Monday - Friday",
    },
    {
      id: "2",
      name: "Kim Mingyu",
      role: "Security",
      pin: "11234",
      shiftStart: "08:00",
      shiftEnd: "16:00",
      avatar: "👤",
      shiftDate: "Monday - Friday",
    },
    {
      id: "3",
      name: "Austin",
      role: "Bartender",
      pin: "09876",
      shiftStart: "08:00",
      shiftEnd: "16:00",
      avatar: "👤",
      shiftDate: "Monday - Friday",
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Employee | null>(null);

  const [dialog, setDialog] = useState<DialogState>({
    type: null,
    show: false,
  });

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // ----- ADD EMPLOYEE -----
  const [isAdding, setIsAdding] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: "",
    name: "",
    role: "",
    pin: "",
    shiftStart: "",
    shiftEnd: "",
    avatar: "👤",
    shiftDate: "",
  });

  const openAddConfirm = () => {
    setDialog({ type: "addConfirm", show: true });
  };

  const confirmAddEmployee = () => {
    setEmployees([...employees, { ...newEmployee, id: String(Date.now()) }]);
    setDialog({ type: null, show: false });
    setIsAdding(false);

    setNewEmployee({
      id: "",
      name: "",
      role: "",
      pin: "",
      shiftStart: "",
      shiftEnd: "",
      avatar: "👤",
      shiftDate: "",
    });
  };

  const openAddCancelConfirm = () => {
    setDialog({ type: "addCancel", show: true });
  };

  const confirmAddCancel = () => {
    setDialog({ type: null, show: false });
    setIsAdding(false);

    setNewEmployee({
      id: "",
      name: "",
      role: "",
      pin: "",
      shiftStart: "",
      shiftEnd: "",
      avatar: "👤",
      shiftDate: "",
    });
  };

  // ----- EDIT EMPLOYEE -----
  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setEditData({ ...employee });
  };

  const handleCancelEdit = () => {
    setDialog({ type: "editCancel", show: true });
  };

  const confirmEditCancel = () => {
    setEditingId(null);
    setEditData(null);
    setDialog({ type: null, show: false });
  };

  const handleSaveClick = () => {
    setDialog({ type: "editConfirm", show: true });
  };

  const confirmEditSave = () => {
    if (editData) {
      setEmployees(employees.map((e) => (e.id === editData.id ? editData : e)));
      setEditingId(null);
      setEditData(null);
    }
    setDialog({ type: null, show: false });
  };

  const confirmDeleteEmployee = () => {
    if (deleteTarget) {
      setEmployees(employees.filter((e) => e.id !== deleteTarget));
      setDeleteTarget(null);
    }
    setDialog({ type: null, show: false });
  };

  // ----------------------------------------------------------------------
  // ADD EMPLOYEE PANEL
  // ----------------------------------------------------------------------
  if (isAdding) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full relative">
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
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
                  <select
                    value={newEmployee.shiftStart}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        shiftStart: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm bg-white appearance-none"
                  >
                    <option value="">Start Time</option>
                    <option>08:00</option>
                    <option>09:00</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4" />
                </div>

                <input
                  type="text"
                  placeholder="End Time"
                  value={newEmployee.shiftEnd}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, shiftEnd: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded text-sm bg-white appearance-none">
                    <option>Start Date</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4" />
                </div>

                <div className="relative">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded text-sm bg-white appearance-none">
                    <option>Thursday</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4" />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">
                  Employee Type
                </label>

                <div className="relative">
                  <select
                    value={newEmployee.role}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm bg-white appearance-none"
                  >
                    <option value="">Select Type</option>
                    <option>Security</option>
                    <option>Cashier</option>
                    <option>Bartender</option>
                  </select>

                  <ChevronDown className="absolute right-2 top-3 w-4 h-4" />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  Employee PIN
                </label>

                <input
                  type="text"
                  value={newEmployee.pin}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, pin: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={openAddCancelConfirm}
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={openAddConfirm}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
                >
                  Add Employee
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-4xl">
                {newEmployee.avatar}
              </div>

              <button className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center text-white text-2xl">
                +
              </button>
            </div>
          </div>

          {/* ADD EMPLOYEE CONFIRM */}
          {dialog.show && dialog.type === "addConfirm" && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[999]">
              <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4">
                  Are you sure you want to add this employee?
                </h3>

                <div className="flex gap-4">
                  <button
                    onClick={() => setDialog({ type: null, show: false })}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmAddEmployee}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ADD EMPLOYEE CANCEL CONFIRM */}
          {dialog.show && dialog.type === "addCancel" && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[999]">
              <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4">
                  Are you sure you want to cancel? This will delete all changes.
                </h3>

                <div className="flex gap-4">
                  <button
                    onClick={() => setDialog({ type: null, show: false })}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
                  >
                    Discard
                  </button>

                  <button
                    onClick={confirmAddCancel}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // EDIT EMPLOYEE PANEL
  // ----------------------------------------------------------------------
  if (editingId && editData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full relative">
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-6">Edit Employee Details</h2>

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
                  placeholder="Full Name"
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
                  <select className="w-full px-4 py-2 border border-gray-300 rounded text-sm bg-white appearance-none">
                    <option>08:00</option>
                    <option>09:00</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
                </div>

                <input
                  type="text"
                  placeholder="End Time"
                  value={editData.shiftEnd}
                  onChange={(e) =>
                    setEditData({ ...editData, shiftEnd: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded text-sm bg-white appearance-none">
                    <option>Start Date</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
                </div>

                <div className="relative">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded text-sm bg-white appearance-none">
                    <option>Thursday</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">
                  Employee Type
                </label>

                <div className="relative">
                  <select
                    value={editData.role}
                    onChange={(e) =>
                      setEditData({ ...editData, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm bg-white appearance-none"
                  >
                    <option>Security</option>
                    <option>Cashier</option>
                    <option>Bartender</option>
                  </select>

                  <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
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
                  onClick={handleCancelEdit}
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveClick}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
                >
                  Save Changes
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

          {/* EDIT CANCEL CONFIRMATION */}
          {dialog.show && dialog.type === "editCancel" && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[999]">
              <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4">
                  Are you sure you want to cancel? This will delete all changes.
                </h3>

                <div className="flex gap-4">
                  <button
                    onClick={() => setDialog({ type: null, show: false })}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
                  >
                    Discard
                  </button>

                  <button
                    onClick={confirmEditCancel}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT SAVE CONFIRM */}
          {dialog.show && dialog.type === "editConfirm" && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[999]">
              <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4">
                  Are you sure you want to make changes with Employee Details?
                </h3>

                <div className="flex gap-4">
                  <button
                    onClick={() => setDialog({ type: null, show: false })}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmEditSave}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DELETE CONFIRM */}
          {dialog.show && dialog.type === "delete" && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[999]">
              <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
                <h3 className="text-lg font-bold mb-4">
                  Are you sure you want to delete this employee? This will delete
                  all information.
                </h3>

                <div className="flex gap-4">
                  <button
                    onClick={() => setDialog({ type: null, show: false })}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmDeleteEmployee}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // MAIN TABLE VIEW
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">Employee Management</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded">
            <ChevronDown className="w-4 h-4" /> Sort
          </button>

          <button className="px-4 py-2 border border-gray-300 rounded">
            November 21, 2025
          </button>

          <span className="text-gray-700">Total Result: {employees.length}</span>
        </div>

        <button
          onClick={() => {
            setIsAdding(true);
            setNewEmployee({
              id: String(Date.now()),
              name: "",
              role: "",
              pin: "",
              shiftStart: "",
              shiftEnd: "",
              avatar: "👤",
              shiftDate: "",
            });
          }}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded"
        >
          <Plus className="w-5 h-5" /> Add Employee
        </button>
      </div>

      {/* TABLE */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-300">
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Full Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Security PIN
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Shift Time
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Shift Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, idx) => (
              <tr
                key={emp.id}
                className={idx < employees.length - 1 ? "border-b border-gray-300" : ""}
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

                <td className="px-6 py-4 text-sm">{emp.shiftDate}</td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>

                    <button
                      onClick={() => {
                        setDeleteTarget(emp.id);
                        setDialog({ type: "delete", show: true });
                      }}
                      className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DELETE CONFIRM FOR TABLE */}
      {dialog.show && dialog.type === "delete" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to delete this employee? This will delete all
              information.
            </h3>

            <div className="flex gap-4">
              <button
                onClick={() => setDialog({ type: null, show: false })}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteEmployee}
                className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;