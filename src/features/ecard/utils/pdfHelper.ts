import jsPDF from 'jspdf';
import { PageLayoutResult } from './layoutCalculator';

export interface PdfJsDocument {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfJsPage>;
}

export interface PdfJsPage {
  getViewport: (options: { scale: number }) => { width: number; height: number };
  render: (options: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => { promise: Promise<void> };
}

export interface PdfJsLibInstance {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (options: { data: ArrayBuffer; password?: string }) => { promise: Promise<PdfJsDocument> };
}

declare global {
  interface Window {
    pdfjsLib?: PdfJsLibInstance;
  }
}

const PDFJS_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfJsLoadPromise: Promise<PdfJsLibInstance> | null = null;

export function loadPdfJs(): Promise<PdfJsLibInstance> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('PDF.js can only be loaded in a browser environment'));
  }

  if (window.pdfjsLib) {
    return Promise.resolve(window.pdfjsLib);
  }

  if (pdfJsLoadPromise) {
    return pdfJsLoadPromise;
  }

  pdfJsLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${PDFJS_CDN_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
          resolve(window.pdfjsLib);
        } else {
          reject(new Error('PDF.js failed to initialize'));
        }
      });
      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load PDF.js from CDN'));
      });
      return;
    }

    const script = document.createElement('script');
    script.src = PDFJS_CDN_URL;
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        resolve(window.pdfjsLib);
      } else {
        reject(new Error('PDF.js failed to initialize'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load PDF renderer script'));
    };
    document.head.appendChild(script);
  });

  return pdfJsLoadPromise;
}

export class PasswordRequiredError extends Error {
  code: number;
  constructor(message = 'Password required to unlock this PDF', code = 1) {
    super(message);
    this.name = 'PasswordRequiredError';
    this.code = code;
  }
}

export interface PdfDocumentInfo {
  numPages: number;
  renderPage: (pageNumber: number, scale?: number) => Promise<{ dataUrl: string; width: number; height: number }>;
}

export async function parsePdfFile(file: File, password?: string): Promise<PdfDocumentInfo> {
  const pdfjs = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjs.getDocument({
    data: arrayBuffer,
    password: password || undefined,
  });

  try {
    const pdfDoc = await loadingTask.promise;

    return {
      numPages: pdfDoc.numPages,
      renderPage: async (pageNumber: number, scale = 3.5) => {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const renderContext = {
          canvasContext: ctx,
          viewport,
        };

        await page.render(renderContext).promise;
        // PNG is 100% lossless - zero compression degradation
        const dataUrl = canvas.toDataURL('image/png');

        return {
          dataUrl,
          width: viewport.width,
          height: viewport.height,
        };
      },
    };
  } catch (err: unknown) {
    const errObj = err as { name?: string; code?: number; message?: string };
    if (
      errObj?.name === 'PasswordException' ||
      errObj?.code === 1 ||
      errObj?.code === 2 ||
      errObj?.message?.toLowerCase().includes('password')
    ) {
      throw new PasswordRequiredError(
        errObj?.code === 2 ? 'Incorrect password. Please verify and try again.' : 'Password required to open this PDF document.',
        errObj?.code || 1
      );
    }
    throw err;
  }
}

/**
 * Client-side fallback PDF generator using jsPDF
 * Used as a fallback if the backend API is temporarily unreachable
 */
export async function generateClientPdf(
  croppedImageDataUrl: string,
  layout: PageLayoutResult,
  showCutMarks = true,
  showRuler = true
): Promise<Blob> {
  const isLandscape = layout.orientation === 'landscape';
  const doc = new jsPDF({
    orientation: isLandscape ? 'l' : 'p',
    unit: 'mm',
    format: [layout.effectivePaperWidthMm, layout.effectivePaperHeightMm],
    compress: true,
  });

  for (let pageIdx = 0; pageIdx < layout.totalPages; pageIdx++) {
    if (pageIdx > 0) {
      doc.addPage([layout.effectivePaperWidthMm, layout.effectivePaperHeightMm], isLandscape ? 'l' : 'p');
    }

    const pageSlots = layout.slots.filter((s) => s.pageIndex === pageIdx);

    for (const slot of pageSlots) {
      // Draw card image at exact mm coordinates
      doc.addImage(
        croppedImageDataUrl,
        'JPEG',
        slot.xMm,
        slot.yMm,
        slot.widthMm,
        slot.heightMm,
        undefined,
        'FAST'
      );

      // Subtle border / cut marks
      if (showCutMarks) {
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.15);
        doc.rect(slot.xMm, slot.yMm, slot.widthMm, slot.heightMm);

        // L-shaped corner cut marks slightly outside the card
        const markLen = 2.5; // mm
        const offset = 1.0;  // mm
        doc.setDrawColor(120, 120, 120);
        doc.setLineWidth(0.2);

        // Top-Left
        doc.line(slot.xMm - offset - markLen, slot.yMm, slot.xMm - offset, slot.yMm);
        doc.line(slot.xMm, slot.yMm - offset - markLen, slot.xMm, slot.yMm - offset);

        // Top-Right
        const rightX = slot.xMm + slot.widthMm;
        doc.line(rightX + offset, slot.yMm, rightX + offset + markLen, slot.yMm);
        doc.line(rightX, slot.yMm - offset - markLen, rightX, slot.yMm - offset);

        // Bottom-Left
        const bottomY = slot.yMm + slot.heightMm;
        doc.line(slot.xMm - offset - markLen, bottomY, slot.xMm - offset, bottomY);
        doc.line(slot.xMm, bottomY + offset, slot.xMm, bottomY + offset + markLen);

        // Bottom-Right
        doc.line(rightX + offset, bottomY, rightX + offset + markLen, bottomY);
        doc.line(rightX, bottomY + offset, rightX, bottomY + offset + markLen);
      }
    }

    // Add calibration check scale on the first page
    if (showRuler && pageIdx === 0) {
      const rulerY = layout.effectivePaperHeightMm - 7;
      const rulerX = layout.marginMm;
      const rulerLenMm = 50; // Exact 50 mm ruler

      doc.setDrawColor(60, 60, 60);
      doc.setLineWidth(0.4);
      doc.line(rulerX, rulerY, rulerX + rulerLenMm, rulerY);

      // Ruler tick marks (every 10mm)
      for (let t = 0; t <= rulerLenMm; t += 10) {
        const tickH = t % 10 === 0 ? 2 : 1;
        doc.line(rulerX + t, rulerY, rulerX + t, rulerY - tickH);
      }

      doc.setFontSize(6.5);
      doc.setTextColor(80, 80, 80);
      doc.text('50 mm (5 cm) Calibration Check Scale', rulerX, rulerY - 2.8);
      doc.setFontSize(5.5);
      doc.setTextColor(130, 130, 130);
      doc.text(
        'IMPORTANT: Print at "Actual Size / 100% scale". Do NOT use "Fit to page".',
        rulerX + rulerLenMm + 4,
        rulerY - 1
      );
    }
  }

  return doc.output('blob');
}
