import { axiosInstance } from "./axios";

export const reportApi = {
  async generateReport(reportData: any) {
    try {
      const res = await axiosInstance.post("/report/generate", reportData, {
        responseType: "blob",
      });
      if (!res) return console.log("Can't generate report.");

      return res.data;
    } catch (error) {
      console.log("Error in reportApi/generateReport(): ", error);
    }
  },
};
