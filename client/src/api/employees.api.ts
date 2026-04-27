import { axiosInstance } from "./axios";

export const employeesApi = {
  async getEmployeeList() {
    try {
      const res = await axiosInstance.get("employee/get-employee-list");

      if (!res) return console.log("Can't get employee list. ");

      return res.data.result;
    } catch (error) {
      console.log("Error in orderApi/getEmployeeList(): ", error);
    }
  },

  async getEmployeeSummary() {
    try {
      const res = await axiosInstance.get("/employee/get-employee-summary");
      if (!res) return console.log("Can't get employee summary.");

      return res.data.result;
    } catch (error) {
      console.log("Error in employees/getEmployeeSummary(): ", error);
    }
  },

  async addEmployee(employeeData: any) {
    try {
      const res = await axiosInstance.post(
        "employee/add-employee",
        employeeData,
      );
      if (!res) return console.log("Can't add employee.");

      return res.data.result;
    } catch (error) {
      console.log("Error in employees/addEmployee(): ", error);
    }
  },

  async updateEmployee(employeeId: string, employeeData: any) {
    try {
      const res = await axiosInstance.put(
        `employee/update-employee/${employeeId}`,
        employeeData,
      );
      if (!res) return console.log("Can't update employee.");

      return res.data.result;
    } catch (error) {
      console.log("Error in employees/updateEmployee(): ", error);
    }
  },

  async deleteEmployee(employeeId: string) {
    try {
      const res = await axiosInstance.delete(
        `employee/delete-employee/${employeeId}`,
      );
      if (!res) return console.log("Can't delete employee.");

      return true;
    } catch (error) {
      console.log("Error in employees/deleteEmployee(): ", error);
    }
  },
};
