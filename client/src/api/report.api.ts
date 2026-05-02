import axios from "axios";

export const reportApi = {
  generateReport: async (reportData: any) => {
    const response = await axios.post("/report/generate", reportData, {
      responseType: "blob",
    });
    return response.data;
  },
};
