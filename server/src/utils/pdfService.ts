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
    currentPage.drawText(sanitizeText(headers[0]), {
      x: 50,
      y: yPosition,
      size: 11,
      font: boldFont,
    });
    currentPage.drawText(sanitizeText(headers[1]), {
      x: 250,
      y: yPosition,
      size: 11,
      font: boldFont,
    });
    currentPage.drawText(sanitizeText(headers[2]), {
      x: 450,
      y: yPosition,
      size: 11,
      font: boldFont,
    });

    yPosition -= 10;
    currentPage.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: 550, y: yPosition },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    yPosition -= 20;

    // Rows
    section.rows.forEach((row: any) => {
      if (yPosition < 50) {
        currentPage = pdfDoc.addPage();
        yPosition = currentPage.getSize().height - 50;
      }
      currentPage.drawText(sanitizeText(row.name), {
        x: 50,
        y: yPosition,
        size: 10,
        font,
      });
      currentPage.drawText(sanitizeText(row.orders), {
        x: 250,
        y: yPosition,
        size: 10,
        font,
      });
      currentPage.drawText(sanitizeText(row.revenue), {
        x: 450,
        y: yPosition,
        size: 10,
        font,
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
