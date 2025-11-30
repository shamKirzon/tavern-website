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
};
