// services/pdfService.ts
import { PDFDocument, PDFPage, PDFFont, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

// ─── Constants ────────────────────────────────────────────────────────────────

const MARGIN = 50;
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

const COLORS = {
  primary: rgb(0.67, 0.19, 0.19),
  dark: rgb(0.15, 0.15, 0.15),
  muted: rgb(0.5, 0.5, 0.5),
  light: rgb(0.85, 0.85, 0.85),
  rowAlt: rgb(0.97, 0.97, 0.97),
  white: rgb(1, 1, 1),
  sectionBg: rgb(0.95, 0.92, 0.89),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sanitize = (text: any): string => String(text ?? "").replace(/₱/g, "P");

const drawDivider = (
  page: PDFPage,
  y: number,
  color = COLORS.light,
  thickness = 0.5,
) => {
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness,
    color,
  });
};

// ─── State ────────────────────────────────────────────────────────────────────

interface State {
  currentPage: PDFPage;
  y: number;
  font: PDFFont;
  boldFont: PDFFont;
  doc: PDFDocument;
  sectionIndex: number;
}

const addNewPage = (state: State): void => {
  state.currentPage = state.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  state.y = PAGE_HEIGHT - MARGIN;
};

const ensureSpace = (state: State, needed: number): void => {
  if (state.y - needed < MARGIN + 20) {
    addNewPage(state);
  }
};

// ─── Drawing Functions ────────────────────────────────────────────────────────

const drawPageHeader = (
  state: State,
  title: string,
  subtitle: string,
): void => {
  const { currentPage, boldFont, font } = state;

  currentPage.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 60,
    width: PAGE_WIDTH,
    height: 60,
    color: COLORS.primary,
  });

  currentPage.drawText(sanitize(title), {
    x: MARGIN,
    y: PAGE_HEIGHT - 38,
    size: 20,
    font: boldFont,
    color: COLORS.white,
  });

  currentPage.drawText(sanitize(subtitle), {
    x: MARGIN,
    y: PAGE_HEIGHT - 54,
    size: 8,
    font,
    color: rgb(0.9, 0.9, 0.9),
  });

  state.y = PAGE_HEIGHT - 80;
};

const drawSectionHeader = (state: State, title: string): void => {
  ensureSpace(state, 50);

  state.y -= 10;

  state.currentPage.drawRectangle({
    x: MARGIN,
    y: state.y - 6,
    width: PAGE_WIDTH - MARGIN * 2,
    height: 22,
    color: COLORS.sectionBg,
    borderColor: COLORS.primary,
    borderWidth: 0.5,
    borderOpacity: 0.4,
  });

  state.currentPage.drawRectangle({
    x: MARGIN,
    y: state.y - 6,
    width: 4,
    height: 22,
    color: COLORS.primary,
  });

  state.currentPage.drawText(`${state.sectionIndex}. ${sanitize(title)}`, {
    x: MARGIN + 12,
    y: state.y + 2,
    size: 10,
    font: state.boldFont,
    color: COLORS.primary,
  });

  state.y -= 28;
  state.sectionIndex += 1;
};

const drawTableHeader = (
  state: State,
  headers: string[],
  colXPositions: number[],
  colWidths: number[],
): void => {
  ensureSpace(state, 40);

  state.currentPage.drawRectangle({
    x: MARGIN,
    y: state.y - 4,
    width: PAGE_WIDTH - MARGIN * 2,
    height: 18,
    color: rgb(0.2, 0.2, 0.2),
  });

  headers.forEach((header, i) => {
    const xPos = (colXPositions[i] ?? MARGIN) + 4;
    state.currentPage.drawText(sanitize(header), {
      x: xPos,
      y: state.y,
      size: 8,
      font: state.boldFont,
      color: COLORS.white,
    });
  });

  state.y -= 22;
};

const drawTableRows = (
  state: State,
  rows: any[],
  colXPositions: number[],
  numCols: number,
  headers: string[],
  colWidths: number[],
): void => {
  rows.forEach((row, rowIndex) => {
    ensureSpace(state, 22);

    const isFirstOnPage = state.y >= PAGE_HEIGHT - MARGIN - 5;
    if (isFirstOnPage) {
      drawTableHeader(state, headers, colXPositions, colWidths);
    }

    const values: any[] = Array.isArray(row)
      ? row
      : [row.name ?? "", row.orders ?? "", row.revenue ?? ""];

    if (rowIndex % 2 === 0) {
      state.currentPage.drawRectangle({
        x: MARGIN,
        y: state.y - 4,
        width: PAGE_WIDTH - MARGIN * 2,
        height: 16,
        color: COLORS.rowAlt,
      });
    }

    values.forEach((value: any, colIndex: number) => {
      if (colIndex < numCols) {
        const xPos = (colXPositions[colIndex] ?? MARGIN) + 4;
        state.currentPage.drawText(sanitize(value), {
          x: xPos,
          y: state.y,
          size: 8,
          font: state.font,
          color: COLORS.dark,
        });
      }
    });

    state.y -= 18;
  });
};

const drawSummaryBlock = (state: State, summaryLines: string[]): void => {
  ensureSpace(state, summaryLines.length * 18 + 20);

  state.y -= 8;

  state.currentPage.drawRectangle({
    x: MARGIN,
    y: state.y - summaryLines.length * 18 - 4,
    width: PAGE_WIDTH - MARGIN * 2,
    height: summaryLines.length * 18 + 10,
    color: rgb(0.98, 0.96, 0.94),
    borderColor: COLORS.primary,
    borderWidth: 0.5,
    borderOpacity: 0.3,
  });

  summaryLines.forEach((line) => {
    state.currentPage.drawText(sanitize(line), {
      x: MARGIN + 10,
      y: state.y,
      size: 9,
      font: state.boldFont,
      color: COLORS.dark,
    });
    state.y -= 18;
  });

  state.y -= 10;
};

const drawSection = (state: State, section: any): void => {
  drawSectionHeader(state, section.title);

  const headers: string[] = section.headers ?? ["Name", "Value", "Total"];
  const numCols = headers.length;
  const availableWidth = PAGE_WIDTH - MARGIN * 2;

  const colWidths: number[] = headers.map(
    (h: string) => state.boldFont.widthOfTextAtSize(sanitize(h), 9) + 20,
  );

  section.rows.forEach((row: any) => {
    const values: any[] = Array.isArray(row)
      ? row
      : [row.name ?? "", row.orders ?? "", row.revenue ?? ""];

    values.forEach((val: any, i: number) => {
      if (i < numCols) {
        const w = state.font.widthOfTextAtSize(sanitize(val), 8) + 20;
        if (w > (colWidths[i] ?? 0)) colWidths[i] = w;
      }
    });
  });

  const totalWidth = colWidths.reduce((a: number, b: number) => a + b, 0);
  const scale = totalWidth > availableWidth ? availableWidth / totalWidth : 1;
  const finalWidths: number[] = colWidths.map((w: number) => w * scale);

  const colXPositions: number[] = [MARGIN];
  for (let i = 0; i < numCols - 1; i++) {
    const prev = colXPositions[i] ?? MARGIN;
    const colWidth = finalWidths[i] ?? 0;
    colXPositions.push(prev + colWidth);
  }

  drawTableHeader(state, headers, colXPositions, finalWidths);
  drawTableRows(
    state,
    section.rows,
    colXPositions,
    numCols,
    headers,
    finalWidths,
  );

  if (section.summary && Array.isArray(section.summary)) {
    drawSummaryBlock(state, section.summary);
  }

  drawDivider(state.currentPage, state.y, COLORS.light);
  state.y -= 20;
};

// ─── Main Export ──────────────────────────────────────────────────────────────

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
    pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  }

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0] ?? pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const state: State = {
    doc: pdfDoc,
    currentPage: firstPage,
    y: PAGE_HEIGHT - MARGIN,
    font,
    boldFont,
    sectionIndex: 1,
  };

  const reportTitle: string = reportData.title ?? "Comprehensive Tavern Report";
  const subtitle = `Generated on: ${new Date().toLocaleString()}`;

  drawPageHeader(state, reportTitle, subtitle);

  const sections: any[] = Array.isArray(reportData.sections)
    ? reportData.sections
    : [reportData];

  sections.forEach((section: any) => drawSection(state, section));

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};
