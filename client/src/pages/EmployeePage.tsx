import React, { useEffect, useState } from "react";
import { ChevronDown, Plus, Edit2, Trash2 } from "lucide-react";
import { employeesApi } from "../api/employees.api";
import type { Employee } from "../types/Employee";
import { formatReadableDate } from "../utils/date";

const EmployeeManagement: React.FC = () => {
  const currentDate = new Date();
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);

  // fetch employee list:
  useEffect(() => {
    const fetchEmployees = async () => {
      const lists = await employeesApi.getEmployeeList();

      setEmployeeList(lists);
    };

    fetchEmployees();
  }, []);

  // function:

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">Employee Management</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded">
            <ChevronDown className="w-4 h-4" /> Sort
          </button>

          <button className="px-4 py-2 border border-gray-300 rounded">
            {formatReadableDate(currentDate)}
          </button>

          <span className="text-gray-700">
            Employee Count: {employeeList.length}
          </span>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded">
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
                Shift Day
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {employeeList.map((employee, index) => (
              <tr
                key={employee.employeeId}
                className={
                  index < employeeList.length - 1
                    ? "border-b border-gray-300"
                    : ""
                }
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white">
                    D
                  </div>
                  <span className="text-sm">{employee.fullName}</span>
                </td>

                <td className="px-6 py-4 text-sm font-semibold">
                  {employee.pin}
                </td>
                <td className="px-6 py-4 text-sm">
                  {employee.employeeRole.charAt(0).toUpperCase()}
                  {employee.employeeRole.slice(1).toLowerCase()}
                </td>

                <td className="px-6 py-4 text-sm">
                  {employee.shiftStart} - {employee.shiftEnd}
                </td>

                <td className="px-6 py-4 text-sm">
                  {employee.shiftDay.join(", ")}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>

                    <button
                      onClick={() => {}}
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
    </div>
  );
};

export default EmployeeManagement;
