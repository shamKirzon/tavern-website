import { Request, Response } from "express";
import { generateReportFromTemplate } from "../utils/pdfService";

export const generateReport = async (req: Request, res: Response) => {
  try {
    const reportData = req.body;
    const pdfBuffer = await generateReportFromTemplate(reportData);

    const now = new Date();
    const formattedDate = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate(),
    ).padStart(2, "0")}-${now.getFullYear()}`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report_${formattedDate}.pdf`,
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
};
