import { axiosInstance } from "./axios";

export const reportApi = {
  async generateReport(reportData: any) {
    try {
      const res = await axiosInstance.post("/report/generate", reportData, {
        responseType: "blob",
      });
      if (!res?.data) throw new Error("Can't generate report.");

      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to generate report.",
      );
    }
  },
};
