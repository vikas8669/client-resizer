'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Trash2,
  RotateCw,
  Printer,
  Download,
  Scissors,
  FileText,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Sliders,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Info,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ECardStudioHeader, StudioSettings } from './ECardStudioHeader';
import { PdfPasswordModal } from './PdfPasswordModal';
import { EcardSubscriptionModal, EcardLimitExhaustedBanner } from './EcardSubscriptionModal';
import { useEcardAccess } from '../hooks/useEcardAccess';
import { parsePdfFile, PdfDocumentInfo, PasswordRequiredError } from '../utils/pdfHelper';
import { autoCutDocumentCards, AutoCutResult } from '../utils/autoCardCutter';
import { generateClientPdf } from '../utils/pdfHelper';
import { calculateCardLayout } from '../utils/layoutCalculator';
import apiClient from '@/api/api';
import { ENDPOINTS } from '@/api/endpoints';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ECardStudioViewProps {
  initialSlug?: string;
}

export function ECardStudioView({ initialSlug = 'aadhaar' }: ECardStudioViewProps) {
  const router = useRouter();
  const {
    isLoggedIn,
    isAdmin,
    paymentEnabled,
    ecutterEnabled,
    hasActiveSubscription,
    freeMonthlyLimit,
    usedCount,
    remainingCount,
    isFreeLimitExhausted,
    canCut,
    plans,
    subscribeToPlan,
    isCheckingPayment,
    refetch: refetchAccess,
  } = useEcardAccess();

  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);

  // Studio Settings matching screenshot controls
  const [settings, setSettings] = useState<StudioSettings>({
    paperSize: 'A4',
    cardLayoutMode: 'dual-both',
    bgColor: 'default',
    bgLabel: 'Default BG',
    isEnhanced: true,
    isRounded: false,
    cardHeightCm: 5.4, // Standard ID-1 card height (54mm) for exact lamination pouch fit
    gapX: 8,            // Default Gap X: 8mm from user screenshot
    gapY: 10,           // Default Gap Y: 10mm from user screenshot
    borderWidth: 1,     // Default Border: 1px from user screenshot
    copies: 2,          // Default 2 pairs (4 cards total) as shown in screenshot
  });

  const [nudgeOffsetPct, setNudgeOffsetPct] = useState<number>(0);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [pdfInfo, setPdfInfo] = useState<PdfDocumentInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Auto-cut results (Front & Back cards)
  const [cutResult, setCutResult] = useState<AutoCutResult | null>(null);

  // Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [pendingPdfFile, setPendingPdfFile] = useState<File | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  // Execute Auto-cut whenever a new document image is loaded
  const performAutoCut = useCallback(
    async (
      src: string,
      docType = 'aadhaar',
      nudges?: { offsetYPct?: number; heightAdjustPct?: number }
    ) => {
      try {
        setIsLoading(true);
        const res = await autoCutDocumentCards(src, docType, undefined, nudges);
        setCutResult(res);
      } catch (err) {
        console.error('Auto-cut error:', err);
        toast.error('Could not auto-cut cards. Please verify document orientation.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleNudge = (direction: 'up' | 'down' | 'reset') => {
    if (!imageSrc) return;
    let newOffset = nudgeOffsetPct;
    if (direction === 'up') newOffset -= 0.006; // shift cut ~1.8mm higher
    else if (direction === 'down') newOffset += 0.006; // shift cut ~1.8mm lower
    else newOffset = 0;
    setNudgeOffsetPct(newOffset);
    performAutoCut(imageSrc, initialSlug, { offsetYPct: newOffset });
    if (direction === 'up') toast.info('Cut line shifted 1.8mm up');
    else if (direction === 'down') toast.info('Cut line shifted 1.8mm down');
    else toast.info('Cut line reset to automatic detection');
  };

  // Process uploaded file (Image or PDF)
  const processFile = useCallback(
    async (file: File) => {
      const isPdfFile =
        file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isImgFile =
        file.type.startsWith('image/') ||
        /\.(jpe?g|png|webp|bmp)$/i.test(file.name.toLowerCase());

      if (!isPdfFile && !isImgFile) {
        toast.error('Please upload a PDF document or JPG/PNG image.');
        return;
      }

      setUploadedFile(file);
      setCutResult(null);

      if (isPdfFile) {
        setIsPdf(true);
        setIsLoading(true);
        try {
          const info = await parsePdfFile(file);
          setPdfInfo(info);
          setTotalPages(info.numPages);
          setCurrentPage(1);

          // Render first page at high-res 3.5x scale (lossless)
          const pageData = await info.renderPage(1, 3.5);
          setImageSrc(pageData.dataUrl);
          await performAutoCut(pageData.dataUrl, initialSlug);
        } catch (err: unknown) {
          if (
            err instanceof PasswordRequiredError ||
            (err as { name?: string })?.name === 'PasswordRequiredError'
          ) {
            setPendingPdfFile(file);
            setIsPasswordModalOpen(true);
            toast.info('This PDF is password-protected. Enter password to unlock.');
          } else {
            console.error('PDF error:', err);
            toast.error('Failed to read PDF document.');
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsPdf(false);
        setPdfInfo(null);
        setTotalPages(1);
        setCurrentPage(1);
        const objUrl = URL.createObjectURL(file);
        setImageSrc(objUrl);
        await performAutoCut(objUrl, initialSlug);
      }
    },
    [initialSlug, performAutoCut]
  );

  // Handle unlocking password-protected PDF
  const handleUnlockPdf = async (password: string): Promise<boolean> => {
    if (!pendingPdfFile) return false;
    try {
      setIsLoading(true);
      const info = await parsePdfFile(pendingPdfFile, password);
      setPdfInfo(info);
      setTotalPages(info.numPages);
      setCurrentPage(1);

      const pageData = await info.renderPage(1, 3.5);
      setImageSrc(pageData.dataUrl);
      setIsPasswordModalOpen(false);
      setPendingPdfFile(null);
      await performAutoCut(pageData.dataUrl, initialSlug);
      toast.success('PDF unlocked & cards automatically cut!');
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Change PDF Page
  const handlePageChange = async (newPage: number) => {
    if (!pdfInfo || newPage < 1 || newPage > totalPages) return;
    try {
      setIsLoading(true);
      setCurrentPage(newPage);
      const pageData = await pdfInfo.renderPage(newPage, 3.5);
      setImageSrc(pageData.dataUrl);
      await performAutoCut(pageData.dataUrl, initialSlug);
    } catch (err) {
      console.error('Page render error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (imageSrc && imageSrc.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(null);
    setUploadedFile(null);
    setCutResult(null);
    setIsPdf(false);
    setPdfInfo(null);
    setPendingPdfFile(null);
  };

  const handleRotate = async () => {
    if (!imageSrc) return;
    try {
      setIsLoading(true);
      const img = new Image();
      img.src = imageSrc;
      await new Promise((res) => (img.onload = res));

      const canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((90 * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      }
      const rotatedUrl = canvas.toDataURL('image/png');
      setImageSrc(rotatedUrl);
      await performAutoCut(rotatedUrl, initialSlug);
      toast.success('Rotated 90° clockwise');
    } catch (err) {
      console.error('Rotate error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Direct Print via Browser
  const handlePrint = () => {
    if (isExporting || isLoading) return;
    if (!cutResult) {
      toast.error('Please upload a document first.');
      return;
    }
    if (!isLoggedIn) {
      toast.error('Please sign in to print your document.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (!ecutterEnabled && !isAdmin) {
      toast.error('E-Card Cutter is currently disabled by administrator.');
      return;
    }
    if (isFreeLimitExhausted) {
      setIsPlanModalOpen(true);
      toast.info(`You've used all ${freeMonthlyLimit} free cuts this month. Choose a plan to continue.`);
      return;
    }
    window.print();
  };

  // Export Print-Ready PDF directly in-memory
  const handleDownload = async () => {
    // Prevent duplicate download requests caused by repeated clicks
    if (isExporting || isLoading) return;

    if (!cutResult) {
      toast.error('No card document available to export.');
      return;
    }

    if (!isLoggedIn) {
      toast.error('Please sign in to export your print document.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!ecutterEnabled && !isAdmin) {
      toast.error('E-Card Cutter is currently disabled by administrator.');
      return;
    }

    if (isFreeLimitExhausted) {
      setIsPlanModalOpen(true);
      toast.info(`You've used all ${freeMonthlyLimit} free cuts this month. Choose a plan to continue.`);
      return;
    }

    try {
      setIsExporting(true);

      const docWidthMm = 85.6;
      // Convert height cm to mm
      const docHeightMm = settings.cardHeightCm * 10 || 53.98;

      try {
        // Direct PDF binary response stream (0 disk, 0 MongoDB, 0 Redis)
        const response = await apiClient.post(
          ENDPOINTS.ECARD_PDF,
          {
            frontImageBase64: cutResult.frontDataUrl,
            backImageBase64: cutResult.backDataUrl,
            layoutMode: settings.cardLayoutMode === 'dual-both' ? 'dual-cards' : 'single',
            docWidthMm,
            docHeightMm,
            paperSize: settings.paperSize,
            copies: settings.copies,
            gapXMm: settings.gapX,
            gapYMm: settings.gapY,
            borderWidth: settings.borderWidth,
            backgroundColor: settings.bgColor === 'default' ? undefined : settings.bgColor,
            isEnhanced: settings.isEnhanced,
            orientation: 'portrait',
          },
          {
            responseType: 'blob',
            timeout: 60000,
          }
        );

        // Convert binary stream to Blob and initiate immediate browser download
        const blob =
          response.data instanceof Blob
            ? response.data
            : new Blob([response.data], { type: 'application/pdf' });

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `PrintPix_${initialSlug}_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke temporary object URL promptly to free browser memory
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

        // Refresh access status to reflect newly used cut in UI
        refetchAccess();

        toast.success('Print-ready PDF downloaded successfully!');
        return;
      } catch (backendErr: any) {
        const status = backendErr?.response?.status;
        let errData: any = null;

        if (backendErr?.response?.data instanceof Blob) {
          try {
            const text = await backendErr.response.data.text();
            errData = JSON.parse(text);
          } catch {
            // Not a JSON error string
          }
        } else {
          errData = backendErr?.response?.data;
        }

        const errCode = errData?.code;
        const errMsg = errData?.message;

        if (status === 401) {
          toast.error('Session expired. Please sign in again.');
          router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          return;
        }

        if (status === 403) {
          if (errCode === 'LIMIT_EXCEEDED' || errCode === 'SUBSCRIPTION_REQUIRED') {
            setIsPlanModalOpen(true);
            refetchAccess();
            toast.error(errMsg || 'Free cut limit reached. Subscribe to continue.');
            return;
          }
          if (errCode === 'ECUTTER_DISABLED') {
            toast.error(errMsg || 'E-Card Cutter is currently disabled.');
            return;
          }
        }

        console.error('Backend PDF generation error:', backendErr);
        toast.error(errMsg || 'Failed to generate print-ready PDF. Please try again.');
        return;
      }
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  // Card Pairs array for preview rendering
  const pairsCount = Math.max(1, settings.copies);
  const pairsList = Array.from({ length: pairsCount }, (_, i) => i);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col">
      {/* Top Studio Controls Bar */}
      <ECardStudioHeader
        settings={settings}
        onUpdateSettings={(part) => setSettings((s) => ({ ...s, ...part }))}
        onClear={handleClear}
        onRotate={handleRotate}
        onPrint={handlePrint}
        onDownload={handleDownload}
        isProcessing={isExporting || isLoading}
        usageInfo={{
          isLoggedIn,
          isAdmin,
          paymentEnabled,
          hasActiveSubscription,
          usedCount,
          remainingCount,
          freeMonthlyLimit,
        }}
        onOpenPlans={() => setIsPlanModalOpen(true)}
      />

      {/* Free Limit Exhausted Alert Banner */}
      {isFreeLimitExhausted && (
        <div className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/10">
          <EcardLimitExhaustedBanner
            onOpenPlans={() => setIsPlanModalOpen(true)}
            freeMonthlyLimit={freeMonthlyLimit}
          />
        </div>
      )}

      {/* Password Modal Popup */}
      <PdfPasswordModal
        isOpen={isPasswordModalOpen}
        fileName={pendingPdfFile?.name || 'Document.pdf'}
        documentCategory={initialSlug}
        onUnlock={handleUnlockPdf}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingPdfFile(null);
        }}
      />

      {/* Main Studio Body: Left Original Preview vs Right Cutting Card Sheet */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Column: Original Uploaded Document Thumbnail Sidebar */}
        <div className="w-full md:w-64 lg:w-72 bg-zinc-50 dark:bg-zinc-900/80 border-r border-zinc-200 dark:border-white/10 p-4 flex flex-col shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Uploaded Document
            </span>
            {uploadedFile && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold">
                Auto-Cut Active
              </span>
            )}
          </div>

          {!imageSrc ? (
            /* Upload Dropzone */
            <div
              className={cn(
                'flex-1 min-h-[300px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 text-center transition-all cursor-pointer select-none',
                isDragging
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20'
                  : 'border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900 hover:border-blue-500'
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
              />
              <div className="p-3.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 mb-3 shadow-xs">
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Upload Document PDF / Image
              </p>
              <p className="text-[11px] text-zinc-500 mt-1 max-w-[180px]">
                Aadhaar, PAN, or DL letter. Auto-cuts front & back cards.
              </p>
              <Button size="sm" variant="outline" className="mt-4 text-xs h-7 rounded-lg">
                Select File
              </Button>
            </div>
          ) : (
            /* Uploaded Thumbnail with Delete Button */
            <div className="space-y-3">
              <div className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-white shadow-md">
                {/* Red Trash Delete Button on top left (matching screenshot) */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute top-2 left-2 z-20 p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-md transition-all cursor-pointer hover:scale-105"
                  title="Remove Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Original Document Preview with Cut Boxes Highlight */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Original Document"
                  className="w-full h-auto max-h-[360px] object-contain block select-none pointer-events-none"
                />

                {/* Dotted Cut Rectangle Overlay on bottom cards matching ID-1 physical card */}
                <div
                  className="absolute left-[8.0%] top-[72.8%] w-[84.0%] h-[18.4%] border-2 border-dashed border-emerald-500/90 bg-emerald-500/10 pointer-events-none rounded-xs flex items-center justify-center"
                >
                  <span className="text-[9px] font-black tracking-wider text-emerald-800 dark:text-emerald-200 bg-white/95 dark:bg-zinc-900/95 px-1.5 py-0.5 rounded shadow-xs">
                    ✂️ EXACT CARD CUT
                  </span>
                </div>
              </div>

              {/* Document metadata info */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 space-y-1 text-xs">
                <p className="font-bold text-zinc-900 dark:text-white truncate">
                  {uploadedFile?.name || 'Document.pdf'}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {isPdf ? `PDF Document (${totalPages} page${totalPages > 1 ? 's' : ''})` : 'Image Document'}
                </p>

                {isPdf && totalPages > 1 && (
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-white/5">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="w-6 h-6 cursor-pointer"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </Button>
                    <span className="text-[10px] font-semibold">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="w-6 h-6 cursor-pointer"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Lamination Fit Fine-Tune Controls */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
                    Lamination Precision Cut
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                    85.6 × 54 mm
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-tight">
                  Auto-cuts at dashed line (✂️). Use nudge buttons below if you need micro-adjustment:
                </p>
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] font-semibold cursor-pointer"
                    onClick={() => handleNudge('up')}
                    title="Nudge cut line 1.8mm up"
                  >
                    ▲ Shift Up
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] font-semibold cursor-pointer"
                    onClick={() => handleNudge('down')}
                    title="Nudge cut line 1.8mm down"
                  >
                    ▼ Shift Down
                  </Button>
                </div>
                {nudgeOffsetPct !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleNudge('reset')}
                    className="w-full text-center text-[10px] text-blue-600 hover:underline pt-0.5 cursor-pointer block font-medium"
                  >
                    Reset to auto-detected cut
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Cutting Card Format on Sheet (Matching screenshot) */}
        <div className="flex-1 bg-zinc-200/70 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 overflow-auto flex flex-col items-center justify-start print:p-0 print:bg-white">
          {!cutResult ? (
            /* Empty State */
            <div className="m-auto text-center p-8 max-w-md">
              <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-4 shadow-sm">
                <Scissors className="w-8 h-8" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2">
                Automatic E-Card Cutter Studio
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                Upload your e-Aadhaar, PAN, or DL letter. The cards will automatically be extracted
                from the bottom slip and arranged in the print-ready cutting format!
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md px-6 py-5 cursor-pointer"
              >
                Upload Document to Cut
              </Button>
            </div>
          ) : (
            /* Live Cutting Card Sheet Preview */
            <div className="w-full flex flex-col items-center">
              {/* Sheet Container: Realistic A4 Sheet with Shadow */}
              <div
                id="printable-sheet"
                className="bg-white shadow-2xl border border-zinc-300 relative select-none print:shadow-none print:border-none print:m-0 print:p-0 [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
                style={{
                  width: '100%',
                  maxWidth: '720px',
                  aspectRatio: '210 / 297', // A4 aspect ratio
                  padding: '28px',
                  boxSizing: 'border-box',
                }}
              >
                {/* Print Sheet Header Guide (hidden on print) */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-dashed border-zinc-200 text-[10px] text-zinc-400 print:hidden">
                  <div className="flex items-center gap-1 font-semibold text-zinc-500">
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Exact-Size Card Sheet ({settings.paperSize})</span>
                  </div>
                  <span>
                    Gap X: {settings.gapX}mm · Gap Y: {settings.gapY}mm · Border: {settings.borderWidth}px
                  </span>
                </div>

                {/* Cards Container Grid arranged in rows */}
                <div
                  className="flex flex-col items-center justify-start w-full"
                  style={{
                    rowGap: `${settings.gapY * 2.2}px`,
                  }}
                >
                  {pairsList.map((pairIdx) => (
                    <div
                      key={pairIdx}
                      className="flex items-center justify-center w-full"
                      style={{
                        columnGap: `${settings.gapX * 2.2}px`,
                      }}
                    >
                      {/* Front Card (Left) */}
                      {(settings.cardLayoutMode === 'dual-both' || settings.cardLayoutMode === 'front-only') && (
                        <div
                          className={cn(
                            'relative overflow-hidden transition-all shrink-0 isolate',
                            settings.isRounded && 'rounded-xl',
                            settings.isEnhanced && 'contrast-105 saturate-105'
                          )}
                          style={{
                            width: settings.cardLayoutMode === 'front-only' ? '70%' : '46%',
                            aspectRatio: '85.6 / 53.98',
                            border:
                              settings.borderWidth > 0
                                ? `${settings.borderWidth}px solid #27272a`
                                : 'none',
                            backgroundColor: '#ffffff',
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cutResult.frontDataUrl}
                            alt="Front Card"
                            className="w-full h-full object-fill block select-none pointer-events-none"
                          />

                          {/* Background tint overlay ON TOP of the image */}
                          {settings.bgColor !== 'default' && (
                            <div
                              className="absolute inset-0 pointer-events-none mix-blend-multiply z-10 transition-all duration-200"
                              style={{
                                background: settings.bgColor,
                                opacity: 0.96,
                              }}
                            />
                          )}
                        </div>
                      )}

                      {/* Back Card (Right) */}
                      {(settings.cardLayoutMode === 'dual-both' || settings.cardLayoutMode === 'back-only') && (
                        <div
                          className={cn(
                            'relative overflow-hidden transition-all shrink-0 isolate',
                            settings.isRounded && 'rounded-xl',
                            settings.isEnhanced && 'contrast-105 saturate-105'
                          )}
                          style={{
                            width: settings.cardLayoutMode === 'back-only' ? '70%' : '46%',
                            aspectRatio: '85.6 / 53.98',
                            border:
                              settings.borderWidth > 0
                                ? `${settings.borderWidth}px solid #27272a`
                                : 'none',
                            backgroundColor: '#ffffff',
                          }}
                        >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cutResult.backDataUrl}
                          alt="Back Card"
                          className="w-full h-full object-fill block select-none pointer-events-none"
                        />

                        {/* Background tint overlay ON TOP of the image */}
                        {settings.bgColor !== 'default' && (
                          <div
                            className="absolute inset-0 pointer-events-none mix-blend-multiply z-10 transition-all duration-200"
                            style={{
                              background: settings.bgColor,
                              opacity: 0.96,
                            }}
                          />
                        )}
                      </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Scissor / Calibration Guide */}
                <div className="absolute bottom-3 left-7 right-7 pt-2 border-t border-dashed border-zinc-300 flex items-center justify-between text-[8px] text-zinc-400 print:hidden">
                  <span>✂️ Cut along outer card edges</span>
                  <span>Print Scale: 100% / Actual Size</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Plans Modal */}
      <EcardSubscriptionModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        plans={plans}
        onSelectPlan={subscribeToPlan}
        isProcessing={isCheckingPayment}
        isLimitExhausted={isFreeLimitExhausted}
        freeMonthlyLimit={freeMonthlyLimit}
      />
    </div>
  );
}
