'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { Dropzone } from './Dropzone';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Button, buttonVariants } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import apiClient from '@/api/api';
import { ENDPOINTS, SERVER_BASE_URL } from '@/api/endpoints';
import { Download, RefreshCw, LayoutTemplate, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Lock, Unlock, Link, Link2, Ratio, Maximize, Scissors, AlertCircle, ZoomIn, ZoomOut, FileType, CheckCircle2, UserCircle, PenTool, Image as ImageIcon, Train, Plus, Minus, RotateCw, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from "@/components/ui/progress";



interface PresetItem {
  name: string;
  width: number;
  height: number;
  targetKB?: number;
  desc?: string;
  isCircular?: boolean;
}


interface PresetGroup {
  group: string;
  icon: React.ReactNode;
  items: PresetItem[];
}

const GOVT_PRESETS: PresetGroup[] = [
  {
    group: 'Passport & Identity',
    icon: <UserCircle className="w-4 h-4" />,
    items: [
      { name: 'SSC/UPSC Photo', width: 200, height: 230, targetKB: 50, desc: 'Common Govt Exam size' },
      { name: 'BPSC Photo', width: 200, height: 290, targetKB: 20, desc: 'Common Govt Exam size' },
      { name: 'Standard (3.5x4.5cm)', width: 413, height: 531, targetKB: 100, desc: 'Passport/Aadhaar' },
      { name: 'IBPS Photo', width: 300, height: 300, targetKB: 50, desc: 'Banking Exams' },
      { name: 'Digital (2x2 inch)', width: 600, height: 600, targetKB: 200, desc: 'US Visa / Digital ID' },
    ]
  },
  {
    group: 'Signatures & Thumb',
    icon: <PenTool className="w-4 h-4" />,
    items: [
      { name: 'SSC Signature', width: 140, height: 60, targetKB: 20, desc: 'Small horizontal' },
      { name: 'IBPS Signature', width: 300, height: 80, targetKB: 20, desc: 'Wide signature' },
      { name: 'Thumb Impression', width: 140, height: 60, targetKB: 50, desc: 'Left/Right Thumb' },
      { name: 'DSSSB Signature', width: 140, height: 110, targetKB: 20, desc: 'DSSSB signature' },
      { name: 'DSSSB Left Thumb', width: 110, height: 140, targetKB: 20, desc: 'DSSSB Left Thumb Impression' },
      { name: 'DSSSB Right Thumb', width: 110, height: 140, targetKB: 20, desc: 'DSSSB Right Thumb Impression' },
    ]
  },
  {
    group: 'Railways (RRB)',
    icon: <Train className="w-4 h-4" />,
    items: [
      { name: 'Railway Photo', width: 240, height: 320, targetKB: 50, desc: 'RRB/RRC Exam' },
      { name: 'Railway Signature', width: 140, height: 60, targetKB: 40, desc: 'Black ink, running hand' },
    ]
  },
  {
    group: 'Social & Web',
    icon: <ImageIcon className="w-4 h-4" />,
    items: [
      { name: 'Instagram Square', width: 1080, height: 1080, desc: '1:1 Ratio' },
      { name: 'Twitter Header', width: 1500, height: 500, desc: '3:1 Ratio' },
      { name: 'Social Media DP', width: 1000, height: 1000, desc: 'Circular DP / Profile', isCircular: true },
    ]
  }

];


const PRINT_LAYOUTS = [
  { name: '4 Copies', count: 4 },
  { name: '8 Copies', count: 8 },
  { name: '16 Copies', count: 16 },
  { name: '32 Copies', count: 32 },
  { name: '52 Copies', count: 52 },
];
const PASSPORT_PRINT_GAP_MM = 2;
const MIN_PRINT_COPIES = 1;
const MAX_PRINT_COPIES = 52;
const MIN_DIMENSION = 100;
const MAX_DIMENSION = 3000;
const DIMENSION_STEP = 10;

// Helper to ensure values are numbers and not NaN
const safeNum = (val: any, fallback: number = 0) => {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
};

// Helper to format bytes
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function EditorWorkspace() {
  const {
    originalFile,
    originalImageUrl,
    processedImageUrl,
    settings,
    updateSettings,
    setProcessedImageUrl,
    isProcessing,
    setIsProcessing,
    reset
  } = useEditorStore();

  const [printLayoutUrl, setPrintLayoutUrl] = useState<string | null>(null);
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<'process' | 'remove-bg' | 'print' | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [processPercentage, setProcessPercentage] = useState(0);
  const [printCopyCount, setPrintCopyCount] = useState(4);


  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [limitDialogContent, setLimitDialogContent] = useState({ title: '', message: '' });
  const [originalAspectRatio, setOriginalAspectRatio] = useState<number | null>(null);

  // Target Size state
  const [targetSizeValue, setTargetSizeValue] = useState<string>('');
  const [targetSizeUnit, setTargetSizeUnit] = useState<'KB' | 'MB'>('KB');

  // Track if changes are pending (settings changed but not processed)
  const [lastProcessedSettings, setLastProcessedSettings] = useState<string>('');

  const hasPendingChanges = useMemo(() => {
    const currentSettings = JSON.stringify({
      w: settings.width,
      h: settings.height,
      fx: settings.focalX,
      fy: settings.focalY,
      z: settings.zoom,
      q: settings.quality,
      f: settings.format,
      r: settings.rotate || 0,
    });
    return currentSettings !== lastProcessedSettings && processedImageUrl !== null;
  }, [settings, lastProcessedSettings, processedImageUrl]);

  const handleRotate = (degreesDelta: number) => {
    const current = settings.rotate || 0;
    const next = (current + degreesDelta + 360) % 360;
    updateSettings({ rotate: next });
  };

  // Load image dimensions to get aspect ratio
  useEffect(() => {
    if (originalImageUrl) {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        setOriginalAspectRatio(isNaN(ratio) ? 1 : ratio);
      };
      img.src = originalImageUrl;
    }
  }, [originalImageUrl]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const NUDGE_STEP = 0.2;

  useEffect(() => {
    const saved = window.sessionStorage.getItem('printLayoutUrl');
    if (saved) {
      setPrintLayoutUrl(saved);
    }
  }, []);

  useEffect(() => {
    if (printLayoutUrl) {
      window.sessionStorage.setItem('printLayoutUrl', printLayoutUrl);
    } else {
      window.sessionStorage.removeItem('printLayoutUrl');
    }
  }, [printLayoutUrl]);

  const extractServerPath = (fullUrl: string) => {
    if (!SERVER_BASE_URL) {
      return null;
    }
    const normalizedBase = SERVER_BASE_URL.endsWith('/') ? SERVER_BASE_URL : `${SERVER_BASE_URL}/`;
    if (!fullUrl.startsWith(normalizedBase)) {
      return null;
    }
    let path = fullUrl.slice(normalizedBase.length);

    // Strip the proxy prefix if it exists (handles /api/images/file/ or api/images/file/)
    path = path.replace(/^\/?api\/images\/file\//, '');

    return path;
  };

  const nudgeFocus = (dx: number, dy: number) => {
    updateSettings({
      focalX: Math.max(-1, Math.min(1, safeNum(settings.focalX, 0) + dx)),
      focalY: Math.max(-1, Math.min(1, safeNum(settings.focalY, 0) + dy)),
    });
  };

  const startProgress = () => {
    setProcessPercentage(0);
    return setInterval(() => {
      setProcessPercentage(prev => {
        if (prev >= 92) return prev;
        return prev + (Math.random() * 12);
      });
    }, 350);
  };

  const handleProcess = async () => {

    if (!originalFile) return;

    setActiveTask('process');
    setIsProcessing(true);
    const interval = startProgress();

    try {

      let imageId = currentImageId;

      // Only upload if we don't have an ID yet
      if (!imageId) {
        const formData = new FormData();
        formData.append('image', originalFile);

        const uploadRes = await apiClient.post(ENDPOINTS.UPLOAD, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        imageId = uploadRes.data?.data?._id;
        if (!imageId) {
          throw new Error('Upload failed: missing image id');
        }
        setCurrentImageId(imageId);
      }

      const multiplier = targetSizeUnit === 'MB' ? 1024 * 1024 : 1024;
      const targetSizeBytes = targetSizeValue ? parseFloat(targetSizeValue) * multiplier : undefined;

      const processRes = await apiClient.post(ENDPOINTS.PROCESS, {
        imageId,
        width: settings.width,
        height: settings.height,
        focalX: settings.focalX,
        focalY: settings.focalY,
        zoom: settings.zoom,
        quality: settings.quality,
        format: settings.format,
        targetSize: targetSizeBytes,
        rotate: settings.rotate || 0,
      });

      const outputPath = processRes.data?.data?.output;
      const fullUrl = outputPath ? `${SERVER_BASE_URL}${outputPath}` : null;
      if (!fullUrl) {
        throw new Error('Processing failed: missing output path');
      }

      setProcessPercentage(100);
      // Update state

      setProcessedImageUrl(fullUrl);
      setLastProcessedSettings(JSON.stringify({
        w: settings.width,
        h: settings.height,
        fx: settings.focalX,
        fy: settings.focalY,
        z: settings.zoom,
        q: settings.quality,
        f: settings.format,
        r: settings.rotate || 0,
      }));

      toast.success('Image processed successfully!');

    } catch (error: any) {
      console.error('Processing failed', error);

      if (error.response?.data?.code === 'RATE_LIMIT_EXCEEDED') {
        setLimitDialogContent({
          title: 'Daily Limit Reached',
          message: error.response.data.message
        });
        setIsLimitDialogOpen(true);
      } else {
        const backendMessage = error.response?.data?.message || 'Failed to process image';
        toast.error(backendMessage);
      }
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setIsProcessing(false);
        setActiveTask(null);
      }, 300);
    }
  };


  const handlePrintLayout = async (layoutCount: number) => {
    if (!originalFile) return;

    const requestedCopies = Math.max(MIN_PRINT_COPIES, Math.min(MAX_PRINT_COPIES, Math.floor(layoutCount)));

    setActiveTask('print');
    setIsProcessing(true);
    const interval = startProgress();

    try {

      let imagePath = processedImageUrl ? extractServerPath(processedImageUrl) : null;

      if (!imagePath) {
        const formData = new FormData();
        formData.append('image', originalFile);
        const uploadRes = await apiClient.post(ENDPOINTS.UPLOAD, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imagePath = uploadRes.data?.data?.originalPath;
      }

      if (!imagePath) {
        throw new Error('Image path is missing for print generation');
      }

      const printRes = await apiClient.post(ENDPOINTS.PRINT_LAYOUT, {
        images: [imagePath],
        type: requestedCopies,
        gapMm: PASSPORT_PRINT_GAP_MM,
      });

      const downloadUrl = printRes.data?.downloadUrl;
      const fullUrl = downloadUrl ? `${SERVER_BASE_URL}${downloadUrl}` : null;
      if (!fullUrl) {
        throw new Error('Print generation failed: missing download URL');
      }
      setProcessPercentage(100);
      setPrintLayoutUrl(fullUrl);
      setPrintCopyCount(requestedCopies);

      toast.success(`A4 layout for ${requestedCopies} passport-size copies generated!`);

    } catch (error: any) {
      console.error('Print layout failed', error);

      if (error.response?.data?.code === 'RATE_LIMIT_EXCEEDED') {
        setLimitDialogContent({
          title: 'Print Limit Reached',
          message: error.response.data.message
        });
        setIsLimitDialogOpen(true);
      } else {
        toast.error('Failed to generate print layout');
      }
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setIsProcessing(false);
        setActiveTask(null);
      }, 300);
    }
  };


  const handleRemoveBackground = async () => {
    if (!originalFile) return;

    setActiveTask('remove-bg');
    setIsProcessing(true);
    const interval = startProgress();

    try {

      let imageId = currentImageId;

      if (!imageId) {
        const formData = new FormData();
        formData.append('image', originalFile);

        const uploadRes = await apiClient.post(ENDPOINTS.UPLOAD, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        imageId = uploadRes.data?.data?._id;
        if (!imageId) {
          throw new Error('Upload failed: missing image id');
        }
        setCurrentImageId(imageId);
      }

      const removeBgRes = await apiClient.post(ENDPOINTS.REMOVE_BG, { imageId });
      const outputPath = removeBgRes.data?.data?.output;
      const fullUrl = outputPath ? `${SERVER_BASE_URL}${outputPath}` : null;

      if (!fullUrl) {
        throw new Error('Remove background failed: missing output path');
      }

      setProcessPercentage(100);
      setProcessedImageUrl(fullUrl);
      toast.success('Background removed. You can print this image now.');
    } catch (error: any) {
      console.error('Remove background failed', error);

      if (error.response?.data?.code === 'RATE_LIMIT_EXCEEDED') {
        setLimitDialogContent({
          title: 'Action Limit Reached',
          message: error.response.data.message
        });
        setIsLimitDialogOpen(true);
      } else {
        const backendMessage = error.response?.data?.message || 'Failed to remove background';
        toast.error(backendMessage);
      }
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setIsProcessing(false);
        setActiveTask(null);
      }, 300);
    }
  };


  const handleStartOver = () => {
    setPrintLayoutUrl(null);
    setCurrentImageId(null);
    setLastProcessedSettings('');
    setTargetSizeValue('');
    window.sessionStorage.removeItem('printLayoutUrl');
    reset();
  };

  const handleSingleDownload = async () => {
    if (!processedImageUrl) return;

    try {
      // Try to fetch first (cleaner, allows naming)
      const response = await fetch(processedImageUrl);
      if (!response.ok) {
        throw new Error('Server returned error status');
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const ext = settings.format === 'png' ? 'png' : 'jpg';
      const filename = `processed-image-${Date.now()}.${ext}`;

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.warn('Single image fetch failed, falling back to direct download', error);

      // Fallback: Direct download using the server's attachment header
      const downloadUrl = `${processedImageUrl}${processedImageUrl.includes('?') ? '&' : '?'}download=true`;
      window.open(downloadUrl, '_blank');

      toast.info('Download started in new tab');
    }
  };

  const handleTargetSizeChange = (val: string) => {
    if (!originalFile) return;

    const numVal = parseFloat(val);
    if (isNaN(numVal)) {
      setTargetSizeValue(val);
      return;
    }

    const multiplier = targetSizeUnit === 'MB' ? 1024 * 1024 : 1024;
    const sizeInBytes = numVal * multiplier;

    if (sizeInBytes > originalFile.size) {
      toast.warning(`Target size cannot exceed original size (${formatFileSize(originalFile.size)})`);
      return;
    }

    setTargetSizeValue(val);

    // Improved Heuristic: JPEG quality is not linear to file size.
    const ratio = (sizeInBytes / originalFile.size);
    const newQuality = Math.round(Math.max(20, Math.min(100, Math.pow(ratio, 0.45) * 100)));
    updateSettings({ quality: newQuality });
  };

  const updatePrintCopyCount = (nextCount: number) => {
    setPrintCopyCount(Math.max(MIN_PRINT_COPIES, Math.min(MAX_PRINT_COPIES, nextCount)));
  };

  if (!originalImageUrl) {
    return (
      <div className="max-w-6xl mx-auto w-full mt-12 mb-20 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side: Upload Area */}
          <div className="w-full">
            <Dropzone />
          </div>

          {/* Right Side: Animated Content */}
          <div className="flex flex-col justify-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1E1F25] dark:text-white mb-4 tracking-tight">
                Your images, <br />
                <span className="text-primary">intelligently processed.</span>
              </h2>
              <p className="text-base lg:text-lg text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                Drop an image into the zone to instantly unlock professional-grade resizing, smart compression, and automated A4 print layouts—all processed securely in your browser.
              </p>

              {/* Animated Infinite SVG Line */}
              <div className="w-full h-24 relative opacity-80 mt-4 overflow-visible">
                <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
                  {/* Background Track */}
                  <path
                    d="M 0,50 C 100,50 150,10 200,50 C 250,90 300,50 400,50"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-zinc-200 dark:text-white/10"
                    fill="none"
                  />
                  {/* Glowing Moving Line */}
                  <motion.path
                    d="M 0,50 C 100,50 150,10 200,50 C 250,90 300,50 400,50"
                    stroke="url(#data_glow)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    pathLength="100"
                    strokeDasharray="30 100"
                    animate={{ strokeDashoffset: [100, -100] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    style={{ willChange: 'stroke-dashoffset' }}
                  />
                  <defs>
                    <linearGradient id="data_glow" x1="0" y1="0" x2="1" y2="0">
                      <stop stopColor="#3B82F6" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#2262C7" />
                      <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Small tech-y labels */}
              <div className="flex items-center justify-between mt-2 text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                <span>Raw Input</span>
                <span>Optimized Output</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate client-side visual guide style with rotation support
  const isRotated90 = (settings.rotate || 0) % 180 !== 0;
  const effectiveAspect = isRotated90 && originalAspectRatio ? 1 / originalAspectRatio : originalAspectRatio || 1;
  const containerAspectRatio = settings.width && settings.height 
    ? settings.width / settings.height 
    : effectiveAspect;

  const rotScale = isRotated90 && originalAspectRatio
    ? Math.max(originalAspectRatio, 1 / originalAspectRatio)
    : 1;

  const visualGuideStyle = {
    objectFit: 'cover' as const,
    objectPosition: `${((safeNum(settings.focalX, 0) + 1) / 2) * 100}% ${((safeNum(settings.focalY, 0) + 1) / 2) * 100}%`,
    width: '100%',
    height: '100%',
    transform: `rotate(${safeNum(settings.rotate, 0)}deg) scale(${safeNum(settings.zoom, 1) * rotScale})`,
    transformOrigin: 'center center',
    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), object-position 0.2s ease-out',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 w-full max-w-7xl mx-auto mt-4 lg:mt-6 mb-12 lg:mb-24 px-2 sm:px-4"
    >
      {/* Canvas Area */}
      <div className="lg:col-span-8 flex flex-col gap-3">
        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 px-3 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xs">
          {/* Rotate Controls */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-1 hidden sm:inline">Rotate:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs rounded-lg gap-1 border-zinc-200 dark:border-white/10 hover:border-primary hover:text-primary"
              onClick={() => handleRotate(-90)}
              title="Rotate 90° Left"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>-90°</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs rounded-lg gap-1 border-zinc-200 dark:border-white/10 hover:border-primary hover:text-primary"
              onClick={() => handleRotate(90)}
              title="Rotate 90° Right"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>+90°</span>
            </Button>
            {(settings.rotate || 0) % 360 !== 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-[11px] text-primary font-bold hover:bg-primary/10 rounded-lg"
                onClick={() => updateSettings({ rotate: 0 })}
                title="Reset rotation to 0°"
              >
                {settings.rotate}° (Reset)
              </Button>
            )}
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-1 hidden md:inline">Quick Presets:</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("h-8 px-2.5 text-xs rounded-lg", settings.preset === 'Standard (3.5x4.5cm)' ? "bg-primary/10 text-primary font-bold" : "hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300")}
              onClick={() => updateSettings({ width: 413, height: 531, preset: 'Standard (3.5x4.5cm)' })}
            >
              Passport
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("h-8 px-2.5 text-xs rounded-lg", settings.preset === '1:1 Square' ? "bg-primary/10 text-primary font-bold" : "hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300")}
              onClick={() => updateSettings({ width: 600, height: 600, preset: '1:1 Square' })}
            >
              1:1 Square
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("h-8 px-2.5 text-xs rounded-lg", !settings.width && !settings.height ? "bg-primary/10 text-primary font-bold" : "hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300")}
              onClick={() => updateSettings({ width: null, height: null, preset: null, focalX: 0, focalY: 0, zoom: 1 })}
            >
              Original
            </Button>
          </div>

          {/* Start Over */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg"
            onClick={handleStartOver}
            title="Upload new image"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden sm:inline">New Image</span>
          </Button>
        </div>

        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.04)]">
          {processedImageUrl && !hasPendingChanges ? (
            <BeforeAfterSlider beforeImage={originalImageUrl} afterImage={processedImageUrl} />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-900/50">
              <div
                className="relative shadow-2xl border-4 border-white dark:border-zinc-800 transition-all duration-300 ease-out overflow-hidden"
                style={{
                  aspectRatio: containerAspectRatio,
                  maxWidth: '100%',
                  maxHeight: '500px'
                }}
              >
                <img
                  src={originalImageUrl}
                  alt="Visual Guide"
                  style={visualGuideStyle}
                  className="rounded-sm"
                />
                {/* Visual overlay to show it's a live guide */}
                <div className={cn("absolute inset-0 pointer-events-none z-10", settings.preset === 'Social Media DP' ? "border-[40px] border-black/40 rounded-full" : "border-2 border-primary/50")}>
                  <div className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                    <Scissors className="w-3 h-3" /> {settings.preset === 'Social Media DP' ? 'Circular Crop' : 'Visual Guide'}
                  </div>
                </div>
              </div>

            </div>
          )}

          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/80 dark:bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <div className="flex flex-col items-center gap-6 w-full max-w-[280px]">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-100 dark:text-zinc-800" />
                      <motion.circle
                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary"
                        strokeDasharray="282.7"
                        initial={{ strokeDashoffset: 282.7 }}
                        animate={{ strokeDashoffset: 282.7 - (282.7 * processPercentage) / 100 }}
                        transition={{ type: "spring", damping: 20, stiffness: 50 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">{Math.round(processPercentage)}%</div>
                  </div>
                  <div className="w-full space-y-2">
                    <Progress value={processPercentage} className="h-1.5" />
                    <p className="text-xs text-center font-medium text-zinc-500 uppercase tracking-widest animate-pulse">
                      {activeTask === 'remove-bg' ? 'Removing Background' : activeTask === 'print' ? 'Generating Print PDF' : 'Optimizing Image'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {printLayoutUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800"
          >
            <h3 className="text-lg font-bold mb-4 text-center">A4 Print Layout Preview</h3>

            {isMobile ? (
              <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 mb-6">
                <LayoutTemplate className="w-12 h-12 text-zinc-400 mb-4" />
                <p className="text-sm text-zinc-500 text-center mb-6">
                  Mobile browsers often block PDF previews. Tap below to view your high-res layout.
                </p>
                <a
                  href={printLayoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "default", size: "lg", className: "w-full rounded-xl" })}
                >
                  View PDF in New Tab
                </a>
              </div>
            ) : (
              <iframe
                title="Print Layout PDF"
                src={printLayoutUrl}
                className="w-full h-[500px] mx-auto mb-8 border border-zinc-200 shadow-lg rounded-xl bg-white"
              />
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={printLayoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "lg", className: "px-8 py-6 rounded-xl border-zinc-200" })}
              >
                Open Fullscreen PDF
              </a>
              <a href={`${printLayoutUrl}?download=true`} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg", className: "px-8 py-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all" })}>
                <Download className="w-5 h-5 mr-2" /> Download High-Res A4
              </a>
            </div>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setPrintLayoutUrl(null)}
                className="text-xs text-zinc-500 hover:text-zinc-700 underline underline-offset-4"
              >
                Clear this preview
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Editor Settings Sidebar (lg:col-span-4) */}
      <div className="lg:col-span-4 flex flex-col bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-white/5 bg-zinc-50/70 dark:bg-white/[0.02] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">Editor Settings</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Precision adjustments for your image.</p>
          </div>
          {hasPendingChanges && (
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20 animate-pulse">
              Unsaved
            </span>
          )}
        </div>

        {/* 4 Clean Tabs */}
        <Tabs defaultValue="presets" className="w-full flex-1 flex flex-col min-h-0">
          <div className="px-4 pt-3 pb-2 border-b border-zinc-100 dark:border-white/5 bg-zinc-50/30">
            <TabsList className="grid w-full grid-cols-4 bg-zinc-100 dark:bg-white/10 p-1 rounded-xl h-9 text-xs">
              <TabsTrigger value="presets" className="rounded-lg text-xs py-1 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-xs">Presets</TabsTrigger>
              <TabsTrigger value="resize" className="rounded-lg text-xs py-1 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-xs">Resize</TabsTrigger>
              <TabsTrigger value="compress" className="rounded-lg text-xs py-1 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-xs">Compress</TabsTrigger>
              <TabsTrigger value="print" className="rounded-lg text-xs py-1 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-xs">Print A4</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 max-h-[380px] sm:max-h-[420px] lg:max-h-[460px] custom-scrollbar">

            <TabsContent value="presets" className="space-y-6 mt-6">
              <ScrollArea className="h-[400px] pr-4">
                {GOVT_PRESETS.map((group) => (
                  <div key={group.group} className="mb-8 last:mb-0">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                        {group.icon}
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">{group.group}</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {group.items.map((p) => (
                        <Button
                          key={p.name}
                          variant="outline"
                          className={cn(
                            "w-full justify-start h-auto p-4 rounded-xl border-zinc-200 dark:border-white/10 transition-all text-left flex flex-col items-start gap-1",
                            settings.preset === p.name ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:border-primary/30 hover:bg-zinc-50"
                          )}
                          onClick={() => {
                            updateSettings({
                              width: p.width,
                              height: p.height,
                              preset: p.name,
                              focalX: 0,
                              focalY: 0,
                              zoom: 1,
                              format: p.isCircular ? 'png' : 'jpeg',
                              quality: p.isCircular ? 100 : settings.quality
                            });
                            if (p.targetKB) {
                              setTargetSizeValue(p.targetKB.toString());
                              setTargetSizeUnit('KB');
                              handleTargetSizeChange(p.targetKB.toString());
                            } else {
                              setTargetSizeValue('');
                            }
                          }}

                        >
                          <div className="flex justify-between w-full items-center">
                            <span className="font-bold text-zinc-900 dark:text-white text-sm">{p.name}</span>
                            <span className="text-[10px] bg-zinc-100 dark:bg-white/10 px-2 py-0.5 rounded-full font-mono">
                              {p.width}×{p.height}
                            </span>
                          </div>
                          <div className="flex justify-between w-full items-end mt-1">
                            <span className="text-[10px] text-zinc-500 leading-none">{p.desc}</span>
                            {p.targetKB && (
                              <span className="text-[10px] font-bold text-primary leading-none">Max {p.targetKB} KB</span>
                            )}
                          </div>
                          {settings.preset === p.name && (
                            <motion.div layoutId="check" className="absolute right-3 top-3">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            </motion.div>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>

            {/* Tab 2: RESIZE & ROTATE */}
            <TabsContent value="resize" className="m-0 space-y-4">
              {/* Rotate Quick Controls */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Rotate Photo</Label>
                  <span className="text-[11px] font-mono font-bold text-primary">
                    {safeNum(settings.rotate, 0)}°
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs rounded-lg gap-1 border-zinc-200 dark:border-white/10"
                    onClick={() => handleRotate(-90)}
                  >
                    <RotateCcw className="w-3 h-3" /> -90° Left
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs rounded-lg gap-1 border-zinc-200 dark:border-white/10"
                    onClick={() => handleRotate(90)}
                  >
                    <RotateCw className="w-3 h-3" /> +90° Right
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    onClick={() => updateSettings({ rotate: 0 })}
                    disabled={!settings.rotate || settings.rotate === 0}
                  >
                    Reset 0°
                  </Button>
                </div>
              </div>

              {/* Width / Height inputs with lock toggle */}
              <div className="grid grid-cols-2 gap-3 relative">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <Label className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Width (px)</Label>
                    {settings.lockAspectRatio && <Lock className="w-2.5 h-2.5 text-primary opacity-50" />}
                  </div>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={settings.width || ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : null;
                      if (settings.lockAspectRatio && val) {
                        const ratio = originalAspectRatio || 1;
                        updateSettings({
                          width: val,
                          height: Math.round(val / ratio),
                          preset: null
                        });
                      } else {
                        updateSettings({ width: val, preset: null });
                      }
                    }}
                    className="rounded-xl border-zinc-200 dark:border-white/10 focus-visible:ring-primary h-9 text-xs"
                  />
                </div>

                {/* Aspect Ratio Lock Toggle */}
                <div className="absolute left-1/2 top-[28px] -translate-x-1/2 z-10">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => updateSettings({ lockAspectRatio: !settings.lockAspectRatio })}
                    className={cn(
                      "h-7 w-7 rounded-full border bg-white dark:bg-zinc-900 shadow-xs transition-all",
                      settings.lockAspectRatio ? "text-primary border-primary/30" : "text-zinc-400 border-zinc-200"
                    )}
                    title={settings.lockAspectRatio ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
                  >
                    {settings.lockAspectRatio ? <Link2 className="h-3 w-3" /> : <Unlock className="h-3 w-3 text-zinc-400" />}
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <Label className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Height (px)</Label>
                    {settings.lockAspectRatio && <Lock className="w-2.5 h-2.5 text-primary opacity-50" />}
                  </div>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={settings.height || ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : null;
                      if (settings.lockAspectRatio && val) {
                        const ratio = originalAspectRatio || 1;
                        updateSettings({
                          height: val,
                          width: Math.round(val * ratio),
                          preset: null
                        });
                      } else {
                        updateSettings({ height: val, preset: null });
                      }
                    }}
                    className="rounded-xl border-zinc-200 dark:border-white/10 focus-visible:ring-primary h-9 text-xs"
                  />
                </div>
              </div>

              {/* Aspect Ratio Shortcuts & Swap */}
              <div className="flex items-center gap-1.5 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-[10px] rounded-lg border-zinc-200 gap-1 text-zinc-600 dark:text-zinc-300"
                  onClick={() => {
                    updateSettings({
                      width: settings.height,
                      height: settings.width,
                      preset: null
                    });
                  }}
                  title="Swap Width and Height"
                >
                  <RefreshCw className="h-2.5 w-2.5" /> Swap
                </Button>
                <div className="h-3.5 w-[1px] bg-zinc-200 dark:bg-white/10" />
                <div className="flex-1 flex gap-1 justify-end">
                  {[
                    { label: '1:1', ratio: 1 },
                    { label: '4:3', ratio: 4 / 3 },
                    { label: '16:9', ratio: 16 / 9 },
                    { label: 'Orig', ratio: originalAspectRatio },
                  ].map((r) => (
                    <Button
                      key={r.label}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="px-2 h-7 text-[10px] text-zinc-500 hover:text-primary hover:bg-primary/5 rounded-lg"
                      onClick={() => {
                        const ratio = r.ratio || 1;
                        if (settings.width) {
                          updateSettings({ height: Math.round(settings.width / ratio), preset: null });
                        } else if (settings.height) {
                          updateSettings({ width: Math.round(settings.height * ratio), preset: null });
                        } else {
                          updateSettings({ width: 1080, height: Math.round(1080 / ratio), preset: null });
                        }
                      }}
                    >
                      {r.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Zoom Control */}
              <div className="pt-2 border-t border-zinc-100 dark:border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Zoom Factor</Label>
                  <span className="text-xs font-bold text-primary">{(safeNum(settings.zoom, 1) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg bg-zinc-100 dark:bg-zinc-800"
                    onClick={() => updateSettings({ zoom: Math.max(1, safeNum(settings.zoom, 1) - 0.1) })}
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </Button>
                  <Slider
                    value={[safeNum(settings.zoom, 1)]}
                    min={1}
                    max={3}
                    step={0.01}
                    onValueChange={(val) => updateSettings({ zoom: (val as number[])[0] })}
                    className="flex-1 py-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg bg-zinc-100 dark:bg-zinc-800"
                    onClick={() => updateSettings({ zoom: Math.min(3, safeNum(settings.zoom, 1) + 0.1) })}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Framing / Focus Position */}
              {settings.width && settings.height && (
                <div className="pt-2 border-t border-zinc-100 dark:border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Framing Position</Label>
                    <button
                      type="button"
                      className="text-[10px] text-zinc-400 hover:text-primary transition-colors"
                      onClick={() => updateSettings({ focalX: 0, focalY: 0, zoom: 1 })}
                    >
                      Reset Center
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Interactive 2D Box */}
                    <div
                      className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/10 relative cursor-crosshair overflow-hidden shrink-0 shadow-inner"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
                        updateSettings({ focalX: Number(x.toFixed(2)), focalY: Number(y.toFixed(2)) });
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                        <div className="w-full h-[1px] bg-zinc-400" />
                        <div className="h-full w-[1px] bg-zinc-400 absolute" />
                      </div>
                      <motion.div
                        animate={{
                          left: `${((safeNum(settings.focalX, 0) + 1) / 2) * 100}%`,
                          top: `${((safeNum(settings.focalY, 0) + 1) / 2) * 100}%`
                        }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="absolute w-2.5 h-2.5 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 border border-white ring-2 ring-primary/20"
                      />
                    </div>

                    {/* 3x3 Arrow Pad */}
                    <div className="grid grid-cols-3 gap-1">
                      <div />
                      <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => nudgeFocus(0, -NUDGE_STEP)}>
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <div />
                      <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => nudgeFocus(-NUDGE_STEP, 0)}>
                        <ArrowLeft className="w-3 h-3" />
                      </Button>
                      <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0 text-[10px]" onClick={() => updateSettings({ focalX: 0, focalY: 0 })}>
                        •
                      </Button>
                      <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => nudgeFocus(NUDGE_STEP, 0)}>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                      <div />
                      <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => nudgeFocus(0, NUDGE_STEP)}>
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                      <div />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Tab 3: COMPRESS */}
            <TabsContent value="compress" className="m-0 space-y-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-white/5 flex justify-between items-center">
                <span className="text-xs text-zinc-500 font-medium">Original File Size:</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  {originalFile ? formatFileSize(originalFile.size) : '0 Bytes'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Target Max Size</Label>
                  <div className="flex bg-zinc-100 dark:bg-white/10 p-0.5 rounded-lg">
                    <button
                      type="button"
                      className={cn("px-2 py-0.5 text-[10px] rounded transition-all", targetSizeUnit === 'KB' ? "bg-white dark:bg-zinc-800 shadow-xs font-bold" : "text-zinc-500")}
                      onClick={() => setTargetSizeUnit('KB')}
                    >KB</button>
                    <button
                      type="button"
                      className={cn("px-2 py-0.5 text-[10px] rounded transition-all", targetSizeUnit === 'MB' ? "bg-white dark:bg-zinc-800 shadow-xs font-bold" : "text-zinc-500")}
                      onClick={() => setTargetSizeUnit('MB')}
                    >MB</button>
                  </div>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="e.g. 50"
                    value={targetSizeValue}
                    onChange={(e) => handleTargetSizeChange(e.target.value)}
                    className="rounded-xl border-zinc-200 dark:border-white/10 h-9 pr-12 text-xs"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-zinc-400">
                    {targetSizeUnit}
                  </div>
                </div>
                <p className="text-[10px] text-zinc-400">Quality adjusts automatically to hit the target file size.</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-white/5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Compression Quality</Label>
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md">{safeNum(settings.quality, 80)}%</span>
                </div>
                <Slider
                  value={[safeNum(settings.quality, 80)]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(val) => {
                    const q = (val as number[])[0];
                    updateSettings({ quality: q });
                    if (targetSizeValue) setTargetSizeValue('');
                  }}
                  className="py-1"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-white/5">
                <Label className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Output Format</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={settings.format === 'jpeg' ? 'default' : 'outline'}
                    className={cn(
                      "rounded-xl h-9 text-xs transition-all",
                      settings.format === 'jpeg'
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                        : "border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300"
                    )}
                    onClick={() => updateSettings({ format: 'jpeg' })}
                  >
                    JPG (Best for Photos)
                  </Button>
                  <Button
                    type="button"
                    variant={settings.format === 'png' ? 'default' : 'outline'}
                    className={cn(
                      "rounded-xl h-9 text-xs transition-all",
                      settings.format === 'png'
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                        : "border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300"
                    )}
                    onClick={() => updateSettings({ format: 'png' })}
                  >
                    PNG (Transparent/Sharp)
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: PRINT A4 */}
            <TabsContent value="print" className="m-0 space-y-4">
              <div>
                <Label className="font-semibold text-xs text-zinc-900 dark:text-white block mb-0.5">Passport Sheet (A4)</Label>
                <p className="text-[11px] text-zinc-500 mb-3">Official 35mm × 45mm passport copies arranged for standard print.</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {PRINT_LAYOUTS.map((layout) => (
                    <Button
                      key={layout.count}
                      type="button"
                      variant="outline"
                      className={cn(
                        "rounded-xl border-zinc-200 dark:border-white/10 hover:border-zinc-300 text-xs h-9 justify-start px-2.5",
                        printCopyCount === layout.count && "border-primary/50 bg-primary/5 text-primary font-bold"
                      )}
                      onClick={() => {
                        updatePrintCopyCount(layout.count);
                        handlePrintLayout(layout.count);
                      }}
                      disabled={isProcessing}
                    >
                      <LayoutTemplate className="w-3.5 h-3.5 mr-1.5 text-zinc-400" /> {layout.name}
                    </Button>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-white/10 overflow-hidden h-9 bg-zinc-50 dark:bg-zinc-900/50">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-none text-zinc-600 dark:text-zinc-300"
                      onClick={() => updatePrintCopyCount(printCopyCount - 1)}
                      disabled={isProcessing || printCopyCount <= MIN_PRINT_COPIES}
                      aria-label="Decrease print copies"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </Button>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                      {printCopyCount} copies
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-none text-zinc-600 dark:text-zinc-300"
                      onClick={() => updatePrintCopyCount(printCopyCount + 1)}
                      disabled={isProcessing || printCopyCount >= MAX_PRINT_COPIES}
                      aria-label="Increase print copies"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    className="h-9 rounded-xl font-semibold text-xs"
                    onClick={() => handlePrintLayout(printCopyCount)}
                    disabled={isProcessing}
                  >
                    Generate {printCopyCount} Copies Layout
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

          <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-white/10 space-y-4">

            <Button
              className={cn(
                "w-full h-12 rounded-xl font-semibold transition-all",
                hasPendingChanges
                  ? "bg-primary text-white shadow-[0_4px_14px_0_rgba(34,98,199,0.39)] hover:shadow-[0_6px_20_rgba(34,98,199,0.23)] hover:-translate-y-0.5"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-white/10"
              )}
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : hasPendingChanges ? 'Apply Changes & Preview' : 'Settings Applied'}
            </Button>


            <Button
              variant="outline"
              className="w-full h-12 rounded-xl font-semibold border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-900 dark:text-white transition-colors"
              onClick={handleRemoveBackground}
              disabled={isProcessing}
            >
              Remove Background
            </Button>


            {processedImageUrl && (
              <button
                type="button"
                onClick={handleSingleDownload}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full h-12 rounded-xl font-semibold border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-900 dark:text-white transition-colors"
                )}
              >
                <Download className="w-4 h-4 mr-2" /> Download Single Image
              </button>
            )}

          </div>

          <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-white/10">
            <Label className="font-semibold text-zinc-900 dark:text-white block mb-2">Generate Print Layout (A4)</Label>
            <p className="text-xs text-zinc-500 mb-4">Real passport size: 35mm x 45mm</p>
            <div className="grid grid-cols-2 gap-3">
              {PRINT_LAYOUTS.map((layout) => (
                <Button
                  key={layout.count}
                  variant="outline"
                  className={cn(
                    "rounded-xl border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:bg-white/5 text-zinc-900 dark:text-white",
                    printCopyCount === layout.count && "border-primary/50 bg-primary/5 text-primary"
                  )}
                  onClick={() => {
                    updatePrintCopyCount(layout.count);
                    handlePrintLayout(layout.count);
                  }}
                  disabled={isProcessing}
                >
                  <LayoutTemplate className="w-4 h-4 mr-2 text-zinc-400" /> {layout.name}
                </Button>
              ))}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-white/10 overflow-hidden sm:w-40">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-none text-zinc-600 dark:text-zinc-300"
                  onClick={() => updatePrintCopyCount(printCopyCount - 1)}
                  disabled={isProcessing || printCopyCount <= MIN_PRINT_COPIES}
                  aria-label="Decrease print copies"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="min-w-12 text-center text-sm font-bold text-zinc-900 dark:text-white">
                  {printCopyCount}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-none text-zinc-600 dark:text-zinc-300"
                  onClick={() => updatePrintCopyCount(printCopyCount + 1)}
                  disabled={isProcessing || printCopyCount >= MAX_PRINT_COPIES}
                  aria-label="Increase print copies"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button
                type="button"
                className="h-11 flex-1 rounded-xl font-semibold"
                onClick={() => handlePrintLayout(printCopyCount)}
                disabled={isProcessing}
              >
                Generate {printCopyCount} {printCopyCount === 1 ? 'Copy' : 'Copies'}
              </Button>
            </div>

          </div>
        </div>

        <div className="mt-auto p-6 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5">
          <Button variant="ghost" className="w-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/5 rounded-xl transition-all" onClick={handleStartOver}>
            <RefreshCw className="w-4 h-4 mr-2" /> Start Over with New Image
          </Button>
        </div>

      {/* </div> */}
      {/* Rate Limit Dialog */}
      <Dialog open={isLimitDialogOpen} onOpenChange={setIsLimitDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600 dark:text-red-500">
              {limitDialogContent.title}
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400 pt-2 text-base">
              {limitDialogContent.message}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl mt-2">
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
              To ensure fair usage and manage costs, we limit some high-resource actions on the free tier.
            </p>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="w-full h-12 rounded-xl bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-bold"
              onClick={() => setIsLimitDialogOpen(false)}
            >
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
