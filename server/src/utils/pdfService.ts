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
    pdfDoc = await PDFDocument.create();
    pdfDoc.addPage();
  }

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  let currentPage = pages[0] || pdfDoc.addPage();
  const { width, height } = currentPage.getSize();

  // Title
  currentPage.drawText("Comprehensive Tavern Report", {
    x: 50,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(0.67, 0.19, 0.19),
  });

  currentPage.drawText(`Generated on: ${new Date().toLocaleString()}`, {
    x: 50,
    y: height - 80,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  let yPosition = height - 120;

  const sanitizeText = (text: string) => {
    return text.toString().replace(/₱/g, "P");
  };

  const drawSection = (section: any) => {
    // Check if we need a new page
    if (yPosition < 150) {
      currentPage = pdfDoc.addPage();
      yPosition = currentPage.getSize().height - 50;
    }

    // Section Title
    currentPage.drawText(sanitizeText(section.title), {
      x: 50,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    yPosition -= 25;

    // Table Header
    const headers = section.headers || ["Name", "Orders", "Revenue"];
    const numCols = headers.length;
    const margin = 50;
    const availableWidth = width - margin * 2;
    const colWidth = availableWidth / numCols;

    headers.forEach((header: string, index: number) => {
      currentPage.drawText(sanitizeText(header), {
        x: margin + index * colWidth,
        y: yPosition,
        size: 10,
        font: boldFont,
      });
    });

    yPosition -= 10;
    currentPage.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    yPosition -= 20;

    // Rows
    section.rows.forEach((row: any) => {
      if (yPosition < 50) {
        currentPage = pdfDoc.addPage();
        yPosition = currentPage.getSize().height - margin;
      }

      // Handle both old object format and new array format for backward compatibility
      const values = Array.isArray(row)
        ? row
        : [row.name || "", row.orders || "", row.revenue || ""];

      values.forEach((value: any, index: number) => {
        if (index < numCols) {
          currentPage.drawText(sanitizeText(value), {
            x: margin + index * colWidth,
            y: yPosition,
            size: 9,
            font,
          });
        }
      });
      yPosition -= 20;
    });

    yPosition -= 30; // Gap between sections
  };

  if (reportData.sections && Array.isArray(reportData.sections)) {
    reportData.sections.forEach((section: any) => {
      drawSection(section);
    });
  } else {
    drawSection(reportData);
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};
