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
};
