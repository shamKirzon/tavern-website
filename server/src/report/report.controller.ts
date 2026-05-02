import { Request, Response } from "express";
import { generateReportFromTemplate } from "../utils/pdfService";

export const generateReport = async (req: Request, res: Response) => {
  try {
    const reportData = req.body;
    const pdfBuffer = await generateReportFromTemplate(reportData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
};
