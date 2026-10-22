'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  DOCUMENT_CATEGORIES,
  DocumentCategoryConfig,
  DocumentPreset,
  getCategoryBySlug,
} from '../config/documentPresets';
import { DocumentSelector } from './DocumentSelector';
import { CropEditor } from './CropEditor';
import { PdfPageSelector } from './PdfPageSelector';
import { PrintLayoutPreview } from './PrintLayoutPreview';
import { PdfPasswordModal } from './PdfPasswordModal';
import { parsePdfFile, PdfDocumentInfo, PasswordRequiredError } from '../utils/pdfHelper';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Scissors,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ECardCutterViewProps {
  initialSlug?: string;
}

export function ECardCutterView({ initialSlug = 'aadhaar' }: ECardCutterViewProps) {
  const initialCategory = getCategoryBySlug(initialSlug);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategoryConfig>(initialCategory);
  const [selectedPreset, setSelectedPreset] = useState<DocumentPreset>(
    initialCategory.presets[0] || DOCUMENT_CATEGORIES[0].presets[0]
  );
  const [prevSlug, setPrevSlug] = useState(initialSlug);

  // Sync category when initialSlug changes (route change) without effect cascade
  if (initialSlug !== prevSlug) {
    setPrevSlug(initialSlug);
    const cat = getCategoryBySlug(initialSlug);
    setSelectedCategory(cat);
    setSelectedPreset(cat.presets[0]);
  }

  const [customWidthMm, setCustomWidthMm] = useState<number>(
    initialCategory.presets[0]?.widthMm || 85.6
  );
  const [customHeightMm, setCustomHeightMm] = useState<number>(
    initialCategory.presets[0]?.heightMm || 53.98
  );

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [pdfInfo, setPdfInfo] = useState<PdfDocumentInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [pendingPdfFile, setPendingPdfFile] = useState<File | null>(null);

  const [croppedData, setCroppedData] = useState<{
    dataUrl: string;
    width: number;
    height: number;
  } | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveWidthMm = selectedPreset.isCustomizable ? customWidthMm : selectedPreset.widthMm;
  const effectiveHeightMm = selectedPreset.isCustomizable
    ? customHeightMm
    : selectedPreset.heightMm;

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  // Handle category change
  const handleSelectCategory = (cat: DocumentCategoryConfig) => {
    setSelectedCategory(cat);
    setSelectedPreset(cat.presets[0]);
    setCustomWidthMm(cat.presets[0]?.widthMm || 85.6);
    setCustomHeightMm(cat.presets[0]?.heightMm || 53.98);
  };

  // Handle preset change
  const handleSelectPreset = (preset: DocumentPreset) => {
    setSelectedPreset(preset);
    setCustomWidthMm(preset.widthMm);
    setCustomHeightMm(preset.heightMm);
  };

  const handleUpdateCustomDimensions = (w: number, h: number) => {
    setCustomWidthMm(w);
    setCustomHeightMm(h);
  };

  // Process uploaded file (Image or PDF)
  const processFile = useCallback(
    async (file: File) => {
      const MAX_SIZE = 30 * 1024 * 1024; // 30MB
      if (file.size > MAX_SIZE) {
        toast.error('File exceeds 30MB limit. Please upload a smaller file.');
        return;
      }

      const isPdfFile =
        file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isImgFile =
        file.type.startsWith('image/') ||
        /\.(jpe?g|png|webp|bmp)$/i.test(file.name.toLowerCase());

      if (!isPdfFile && !isImgFile) {
        toast.error('Unsupported file format. Please upload a PDF, JPG, PNG, or WebP document.');
        return;
      }

      // Clear previous states
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
      setUploadedFile(file);
      setCroppedData(null);

      if (isPdfFile) {
        setIsPdf(true);
        setIsLoadingPage(true);
        try {
          const info = await parsePdfFile(file);
          setPdfInfo(info);
          setTotalPages(info.numPages);
          setCurrentPage(1);

          // Render first page at 3.5x scale for ultra-sharp vector details (zero loss)
          const pageData = await info.renderPage(1, 3.5);
          setImageSrc(pageData.dataUrl);
          toast.success(`PDF loaded in 100% sharp quality (${info.numPages} ${info.numPages === 1 ? 'page' : 'pages'})`);
        } catch (err: unknown) {
          if (err instanceof PasswordRequiredError || (err as { name?: string })?.name === 'PasswordRequiredError') {
            setPendingPdfFile(file);
            setIsPasswordModalOpen(true);
            toast.info('This PDF is password-protected. Please enter password to unlock.');
          } else {
            console.error('PDF parsing error:', err);
            toast.error(
              'Failed to read PDF. If it is password protected, click unlock or convert to image.'
            );
          }
        } finally {
          setIsLoadingPage(false);
        }
      } else {
        setIsPdf(false);
        setPdfInfo(null);
        setTotalPages(1);
        setCurrentPage(1);
        const objUrl = URL.createObjectURL(file);
        setImageSrc(objUrl);
        toast.success('Document image uploaded in 100% original quality!');
      }
    },
    [imageSrc]
  );

  // Handle unlocking password-protected PDF
  const handleUnlockPdf = async (password: string): Promise<boolean> => {
    if (!pendingPdfFile) return false;
    try {
      setIsLoadingPage(true);
      const info = await parsePdfFile(pendingPdfFile, password);
      setPdfInfo(info);
      setTotalPages(info.numPages);
      setCurrentPage(1);

      // Render at ultra-high 3.5x scale for razor-sharp clarity
      const pageData = await info.renderPage(1, 3.5);
      setImageSrc(pageData.dataUrl);
      setIsPasswordModalOpen(false);
      setPendingPdfFile(null);
      toast.success('PDF unlocked successfully in 100% original sharpness!');
      return true;
    } catch (err: unknown) {
      console.warn('Unlock failed:', err);
      return false;
    } finally {
      setIsLoadingPage(false);
    }
  };

  // Handle PDF page change
  const handlePdfPageChange = async (newPage: number) => {
    if (!pdfInfo || newPage < 1 || newPage > totalPages) return;
    try {
      setIsLoadingPage(true);
      setCurrentPage(newPage);
      const pageData = await pdfInfo.renderPage(newPage, 3.5);
      setImageSrc(pageData.dataUrl);
    } catch (err) {
      console.error('Failed to render PDF page:', err);
      toast.error('Could not render requested PDF page');
    } finally {
      setIsLoadingPage(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleResetDocument = () => {
    if (imageSrc && imageSrc.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(null);
    setUploadedFile(null);
    setCroppedData(null);
    setIsPdf(false);
    setPdfInfo(null);
    setPendingPdfFile(null);
    setIsPasswordModalOpen(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Password Modal Popup */}
      <PdfPasswordModal
        isOpen={isPasswordModalOpen}
        fileName={pendingPdfFile?.name || 'Document.pdf'}
        documentCategory={selectedCategory.id}
        onUnlock={handleUnlockPdf}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingPdfFile(null);
        }}
      />

      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide">
          <Scissors className="w-3.5 h-3.5" />
          <span>Professional E-Card Cutter & Exact-Size Printing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
          Crop & Print Official Documents at{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
            100% Exact Size
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Upload Aadhaar, PAN, Driving Licence, or Voter IDs in PDF or image format.
          Crop without extra waste and generate print-ready PDFs with razor-sharp quality.
        </p>

        {/* Privacy Assurance Pill */}
        <div className="flex items-center justify-center gap-2 pt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Privacy Guaranteed · In-Memory Processing · Never Saved to Database</span>
        </div>
      </div>

      {/* Document Selector */}
      <DocumentSelector
        selectedCategory={selectedCategory}
        selectedPreset={selectedPreset}
        customWidthMm={customWidthMm}
        customHeightMm={customHeightMm}
        onSelectCategory={handleSelectCategory}
        onSelectPreset={handleSelectPreset}
        onUpdateCustomDimensions={handleUpdateCustomDimensions}
      />

      {/* Main Workspace: Upload vs Cropper */}
      <AnimatePresence mode="wait">
        {!imageSrc ? (
          /* Step 1: Upload Dropzone */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative flex flex-col items-center justify-center w-full min-h-[340px] p-8 border-2 border-dashed rounded-3xl transition-all duration-300 text-center cursor-pointer ${
              isDragging
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.01]'
                : 'border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900/40 hover:border-blue-500/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/70'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileInput}
            />

            <div className="p-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-md mb-4">
              <UploadCloud className="w-10 h-10" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-1.5">
              Drop your {selectedCategory.title.replace(' Cutter', '')} here
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
              Upload original downloaded <strong>PDF</strong> (with or without password) or clear <strong>JPG/PNG</strong> image.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                PDF Documents (Password protected supported)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                JPG, PNG, WebP
              </span>
              <span>•</span>
              <span>100% Razor Sharp Quality</span>
            </div>

            <Button
              type="button"
              variant="default"
              size="sm"
              className="mt-6 rounded-xl font-semibold shadow-xs"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </Button>
          </motion.div>
        ) : (
          /* Step 2: Crop & Preview Workspace */
          <motion.div
            key="crop-workspace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* If PDF, show page navigation */}
            {isPdf && uploadedFile && (
              <PdfPageSelector
                fileName={uploadedFile.name}
                currentPage={currentPage}
                totalPages={totalPages}
                isLoadingPage={isLoadingPage}
                onPageChange={handlePdfPageChange}
              />
            )}

            {/* Interactive Cropper */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>2. Position & Crop Card Area</span>
                  <span className="text-xs font-normal text-zinc-500">(Drag document to center your card)</span>
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  Zero Quality Reduction · 100% Lossless PNG
                </span>
              </div>

              <CropEditor
                imageSrc={imageSrc}
                widthMm={effectiveWidthMm}
                heightMm={effectiveHeightMm}
                documentCategory={selectedCategory.id}
                documentName={selectedPreset.name}
                onChangeDocument={handleResetDocument}
                onDimensionsChange={(newW, newH) => {
                  const matched = selectedCategory.presets.find(
                    (p) => Math.abs(p.widthMm - newW) < 0.5 && Math.abs(p.heightMm - newH) < 0.5
                  );
                  if (matched) {
                    setSelectedPreset(matched);
                  } else {
                    setCustomWidthMm(newW);
                    setCustomHeightMm(newH);
                    const customP =
                      selectedCategory.presets.find((p) => p.isCustomizable) || selectedPreset;
                    setSelectedPreset(customP);
                  }
                }}
                onCropComplete={(data) => {
                  setCroppedData(data);
                  toast.success('Crop applied! Check out the print sheet layout below.');
                  setTimeout(() => {
                    document.getElementById('print-layout-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 120);
                }}
              />
            </div>

            {/* Step 3: Print Layout & Download */}
            {croppedData && (
              <div id="print-layout-section" className="space-y-3 pt-6 border-t border-zinc-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                    3. Exact-Size Print Layout
                  </h3>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Cropped in 100% Full Resolution ({croppedData.width} × {croppedData.height} px)
                  </span>
                </div>

                <PrintLayoutPreview
                  croppedImageDataUrl={croppedData.dataUrl}
                  preset={selectedPreset}
                  docWidthMm={effectiveWidthMm}
                  docHeightMm={effectiveHeightMm}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
