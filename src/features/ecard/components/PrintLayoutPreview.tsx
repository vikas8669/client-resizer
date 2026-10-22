'use client';

import React, { useState, useMemo } from 'react';
import {
  Printer,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  PAPER_SIZES,
  DocumentPreset,
} from '../config/documentPresets';
import { calculateCardLayout, PageLayoutResult } from '../utils/layoutCalculator';
import { generateClientPdf } from '../utils/pdfHelper';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PrintLayoutPreviewProps {
  croppedImageDataUrl: string;
  preset: DocumentPreset;
  docWidthMm: number;
  docHeightMm: number;
}

export function PrintLayoutPreview({
  croppedImageDataUrl,
  preset,
  docWidthMm,
  docHeightMm,
}: PrintLayoutPreviewProps) {
  const [selectedPaper, setSelectedPaper] = useState<'A4' | '4x6' | 'Letter'>('A4');
  const [copies, setCopies] = useState<number>(4);
  const [marginPreset, setMarginPreset] = useState<'minimal' | 'standard'>('minimal');
  const [gapMm, setGapMm] = useState<number>(3);
  const [showCutMarks, setShowCutMarks] = useState<boolean>(true);
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [previewPageIdx, setPreviewPageIdx] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const marginMm = marginPreset === 'minimal' ? 6 : 12;

  // Calculate dynamic layout
  const layout: PageLayoutResult = useMemo(() => {
    return calculateCardLayout({
      paperKey: selectedPaper,
      cardWidthMm: docWidthMm,
      cardHeightMm: docHeightMm,
      marginMm,
      gapMm,
      copies,
      orientation: 'auto',
    });
  }, [selectedPaper, docWidthMm, docHeightMm, marginMm, gapMm, copies]);

  // Adjust preview page index if out of range
  const safePreviewPageIdx = Math.min(previewPageIdx, Math.max(0, layout.totalPages - 1));

  // Get slots for the currently viewed preview page
  const currentPageSlots = useMemo(() => {
    return layout.slots.filter((s) => s.pageIndex === safePreviewPageIdx);
  }, [layout.slots, safePreviewPageIdx]);

  // Download PDF handler
  const handleDownloadPdf = async () => {
    if (!croppedImageDataUrl) {
      toast.error('No cropped document found. Please crop your document first.');
      return;
    }

    try {
      setIsDownloading(true);

      // Attempt high-quality backend PDF generation with in-memory streaming
      try {
        const response = await apiClient.post(
          ENDPOINTS.ECARD_PDF,
          {
            imageBase64: croppedImageDataUrl,
            docWidthMm,
            docHeightMm,
            paperSize: selectedPaper,
            copies,
            marginMm,
            gapMm,
            showCutMarks,
            showRuler,
            orientation: layout.orientation,
            returnDownloadUrl: false,
          },
          {
            responseType: 'blob',
            timeout: 25000,
          }
        );

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `PrintPix_${preset.id}_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 10000);

        toast.success('Print-ready PDF downloaded successfully!');
        return;
      } catch (backendErr) {
        console.warn('Backend PDF endpoint error, falling back to client-side generation:', backendErr);
      }

      // Client-side fallback using jsPDF
      const fallbackBlob = await generateClientPdf(
        croppedImageDataUrl,
        layout,
        showCutMarks,
        showRuler
      );
      const downloadUrl = URL.createObjectURL(fallbackBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `PrintPix_${preset.id}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 10000);

      toast.success('Print-ready PDF generated and downloaded!');
    } catch (err) {
      console.error('PDF download error:', err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-xs">
        {/* Copies selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
            <span>Number of Copies</span>
            <span className="text-blue-600 font-bold">{copies} card{copies > 1 ? 's' : ''}</span>
          </Label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 4, 8, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCopies(num)}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  copies === num
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                )}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="pt-1">
            <Input
              type="number"
              min="1"
              max="50"
              value={copies}
              onChange={(e) => setCopies(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              className="h-8 text-xs font-semibold"
              placeholder="Custom copies"
            />
          </div>
        </div>

        {/* Paper Size Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Paper Format
          </Label>
          <div className="space-y-1">
            {(Object.keys(PAPER_SIZES) as Array<'A4' | '4x6' | 'Letter'>).map((paperKey) => {
              const p = PAPER_SIZES[paperKey];
              const isSelected = selectedPaper === paperKey;
              return (
                <button
                  key={paperKey}
                  type="button"
                  onClick={() => setSelectedPaper(paperKey)}
                  className={cn(
                    'w-full p-1.5 px-2.5 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-all cursor-pointer border',
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-700 dark:text-blue-300'
                      : 'border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300'
                  )}
                >
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-[10px] text-zinc-400">
                    {p.widthMm} × {p.heightMm} mm
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacing & Margins */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Layout & Margins
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setMarginPreset('minimal')}
              className={cn(
                'p-2 rounded-lg text-xs font-semibold text-center border transition-all cursor-pointer',
                marginPreset === 'minimal'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                  : 'border-zinc-200 dark:border-white/10 hover:bg-zinc-50 text-zinc-700 dark:text-zinc-300'
              )}
            >
              Minimal (6mm)
              <span className="block text-[9px] font-normal text-zinc-400">Save Paper</span>
            </button>
            <button
              type="button"
              onClick={() => setMarginPreset('standard')}
              className={cn(
                'p-2 rounded-lg text-xs font-semibold text-center border transition-all cursor-pointer',
                marginPreset === 'standard'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                  : 'border-zinc-200 dark:border-white/10 hover:bg-zinc-50 text-zinc-700 dark:text-zinc-300'
              )}
            >
              Standard (12mm)
              <span className="block text-[9px] font-normal text-zinc-400">Wide Edge</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-zinc-500">Card Gap:</span>
            <div className="flex gap-1">
              {[2, 3, 5].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGapMm(g)}
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-bold',
                    gapMm === g
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  )}
                >
                  {g}mm
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toggles & Options */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Cut Marks & Guides
          </Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showCutMarks}
                onChange={(e) => setShowCutMarks(e.target.checked)}
                className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              <span>Scissor / Cut Corner Marks</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showRuler}
                onChange={(e) => setShowRuler(e.target.checked)}
                className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              <span>50mm Calibration Scale</span>
            </label>
          </div>

          <div className="pt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            Orientation: <span className="font-bold uppercase text-zinc-700 dark:text-zinc-300">{layout.orientation}</span>
          </div>
        </div>
      </div>

      {/* Sheet Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5">
          <p className="text-[11px] text-zinc-400 font-semibold uppercase">Document Size</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">
            {docWidthMm.toFixed(2)} × {docHeightMm.toFixed(2)} mm
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5">
          <p className="text-[11px] text-zinc-400 font-semibold uppercase">Capacity / Page</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">
            {layout.cardsPerPage} cards ({layout.cols} × {layout.rows} grid)
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5">
          <p className="text-[11px] text-zinc-400 font-semibold uppercase">Pages Required</p>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
            {layout.totalPages} {layout.totalPages === 1 ? 'Page' : 'Pages'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5">
          <p className="text-[11px] text-zinc-400 font-semibold uppercase">Paper Efficiency</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {layout.printableAreaEfficiencyPct}% area used
          </p>
        </div>
      </div>

      {/* Critical Printing Instructions Alert */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-amber-900 dark:text-amber-200">
            CRITICAL FOR EXACT CARD SIZE PRINTING:
          </p>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
            When opening the downloaded PDF in your printer dialog, ensure you select{' '}
            <strong className="underline font-black">Actual Size / 100% scale</strong>.
            Do NOT select <em>&ldquo;Fit to page&rdquo;</em> or <em>&ldquo;Shrink oversized pages&rdquo;</em>,
            as that will distort the physical dimensions of official cards.
          </p>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
            A 50 mm calibration ruler is printed at the bottom edge so you can measure with a physical ruler before cutting.
          </p>
        </div>
      </div>

      {/* Visual Live Sheet Layout Preview */}
      <div className="p-5 rounded-3xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-white">
              Visual Print Sheet Preview
            </span>
            <span className="text-[11px] text-zinc-400">
              ({layout.effectivePaperWidthMm} × {layout.effectivePaperHeightMm} mm {layout.paper.name})
            </span>
          </div>

          {layout.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewPageIdx((p) => Math.max(0, p - 1))}
                disabled={safePreviewPageIdx <= 0}
                className="h-7 text-xs px-2"
              >
                Previous
              </Button>
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Page {safePreviewPageIdx + 1} of {layout.totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewPageIdx((p) => Math.min(layout.totalPages - 1, p + 1))}
                disabled={safePreviewPageIdx >= layout.totalPages - 1}
                className="h-7 text-xs px-2"
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Paper Sheet Rendering */}
        <div
          className="relative bg-white shadow-2xl rounded-sm border border-zinc-300 overflow-hidden select-none transition-all"
          style={{
            width: '100%',
            maxWidth: layout.orientation === 'landscape' ? '560px' : '420px',
            aspectRatio: `${layout.effectivePaperWidthMm} / ${layout.effectivePaperHeightMm}`,
          }}
        >
          {/* Subtle printable margin border */}
          <div
            className="absolute border border-dashed border-zinc-300 pointer-events-none"
            style={{
              top: `${(marginMm / layout.effectivePaperHeightMm) * 100}%`,
              left: `${(marginMm / layout.effectivePaperWidthMm) * 100}%`,
              right: `${(marginMm / layout.effectivePaperWidthMm) * 100}%`,
              bottom: `${(marginMm / layout.effectivePaperHeightMm) * 100}%`,
            }}
          />

          {/* Cards on this page */}
          {currentPageSlots.map((slot) => {
            const leftPct = (slot.xMm / layout.effectivePaperWidthMm) * 100;
            const topPct = (slot.yMm / layout.effectivePaperHeightMm) * 100;
            const widthPct = (slot.widthMm / layout.effectivePaperWidthMm) * 100;
            const heightPct = (slot.heightMm / layout.effectivePaperHeightMm) * 100;

            return (
              <div
                key={slot.copyIndex}
                className="absolute overflow-hidden shadow-xs border border-zinc-400/80 bg-zinc-100 flex flex-col items-center justify-center"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                }}
              >
                {/* Image */}
                {croppedImageDataUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={croppedImageDataUrl}
                    alt={`Card Copy ${slot.copyIndex + 1}`}
                    className="w-full h-full object-fill pointer-events-none"
                  />
                )}

                {/* Subtle Cut Marks Corner Guides */}
                {showCutMarks && (
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-zinc-400/50" />
                )}
              </div>
            );
          })}

          {/* Calibration ruler visual at bottom of page 1 */}
          {showRuler && safePreviewPageIdx === 0 && (
            <div
              className="absolute left-0 bottom-2 pointer-events-none px-4 flex items-center gap-2"
              style={{
                left: `${(marginMm / layout.effectivePaperWidthMm) * 100}%`,
              }}
            >
              <div className="flex flex-col">
                <div
                  className="h-1.5 border-b-2 border-l-2 border-r-2 border-zinc-700 relative"
                  style={{
                    width: `${(50 / layout.effectivePaperWidthMm) * 100}%`,
                    minWidth: '70px',
                  }}
                />
                <span className="text-[8px] font-mono font-bold text-zinc-600 mt-0.5">
                  50mm Ruler Scale
                </span>
              </div>
              <span className="text-[7px] text-zinc-400 hidden sm:inline">
                Scale Check: Must measure exactly 5 cm
              </span>
            </div>
          )}
        </div>

        {/* Action Button: Download Print-Ready PDF */}
        <div className="w-full max-w-md mt-6">
          <Button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            size="lg"
            className="w-full py-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating High-Quality PDF...</span>
              </>
            ) : (
              <>
                <Printer className="w-5 h-5" />
                <span>Download Print-Ready PDF ({copies} {copies === 1 ? 'Copy' : 'Copies'})</span>
              </>
            )}
          </Button>
          <p className="text-center text-[11px] text-zinc-400 mt-2">
            Generates exact-dimension vector PDF with calibration checks. Zero document retention.
          </p>
        </div>
      </div>
    </div>
  );
}
