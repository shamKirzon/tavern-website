import { axiosInstance } from "./axios";

export const employeesApi = {
  async getEmployeeList() {
    try {
      const res = await axiosInstance.get("employee/get-employee-list");

      if (!res?.data) throw new Error("Can't get employee list.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch employee list.",
      );
    }
  },

  async getEmployeeSummary() {
    try {
      const res = await axiosInstance.get("/employee/get-employee-summary");
      if (!res?.data) throw new Error("Can't get employee summary.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch employee summary.",
      );
    }
  },

  async addEmployee(employeeData: any) {
    try {
      const res = await axiosInstance.post(
        "employee/add-employee",
        employeeData,
      );
      if (!res?.data) throw new Error("Can't add employee.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to add employee.",
      );
    }
  },

  async updateEmployee(employeeId: string, employeeData: any) {
    try {
      const res = await axiosInstance.put(
        `employee/update-employee/${employeeId}`,
        employeeData,
      );
      if (!res?.data) throw new Error("Can't update employee.");

      return res.data.result;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update employee.",
      );
    }
  },

  async deleteEmployee(employeeId: string) {
    try {
      const res = await axiosInstance.delete(
        `employee/delete-employee/${employeeId}`,
      );
      if (!res?.data) throw new Error("Can't delete employee.");

      return true;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete employee.",
      );
    }
  },
};
