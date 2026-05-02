// services/pdfService.ts
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export const generateReportFromTemplate = async (
  reportData: any,
): Promise<Buffer> => {
  let pdfDoc: PDFDocument;
  const templatePath = path.join(__dirname, "../templates/report-template.pdf");

  if (fs.existsSync(templatePath)) {
    const templateBytes = fs.readFileSync(templatePath);
    pdfDoc = await PDFDocument.load(templateBytes);
  } else {
    // Fallback: Create a new PDF if template is missing
    pdfDoc = await PDFDocument.create();
    pdfDoc.addPage();
  }

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  const page = pages[0];

  if (!page) {
    throw new Error("PDF must have at least one page.");
  }

  const { width, height } = page.getSize();

  // Title
  page.drawText(reportData.title || "Sales Report", {
    x: 50,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(0.67, 0.19, 0.19), // #AA3131
  });

  page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
    x: 50,
    y: height - 80,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Table Header
  let yPosition = height - 130;
  const tableHeaders = reportData.headers || ["Name", "Orders", "Revenue"];

  page.drawText(tableHeaders[0], { x: 50, y: yPosition, size: 12, font: boldFont });
  page.drawText(tableHeaders[1], { x: 250, y: yPosition, size: 12, font: boldFont });
  page.drawText(tableHeaders[2], { x: 450, y: yPosition, size: 12, font: boldFont });

  yPosition -= 20;
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: 550, y: yPosition },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  yPosition -= 25;

  // Draw table rows
  reportData.rows.forEach((row: any) => {
    if (yPosition < 50) {
      // Very basic pagination: if we run out of space, stop (or we could add a page)
      return;
    }
    page.drawText(row.name.toString(), { x: 50, y: yPosition, size: 11, font });
    page.drawText(row.orders.toString(), {
      x: 250,
      y: yPosition,
      size: 11,
      font,
    });
    page.drawText(row.revenue.toString(), { x: 450, y: yPosition, size: 11, font });
    yPosition -= 25;
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};

