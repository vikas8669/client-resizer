'use client';

import React, { useEffect, useRef, useState } from 'react';
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
import { Download, RefreshCw, LayoutTemplate, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


const PRESETS = [
  { name: 'Passport (2x2)', width: 600, height: 600 },
  { name: 'PAN/Aadhaar', width: 413, height: 531 },
  { name: 'Instagram SQ', width: 1080, height: 1080 },
  { name: 'Twitter HDR', width: 1500, height: 500 },
];

const PRINT_LAYOUTS = [
  { name: '8 Copies', count: 8 },
  { name: '16 Copies', count: 16 },
  { name: '32 Copies', count: 32 },
  { name: '52 Copies', count: 52 },
];
const PASSPORT_PRINT_GAP_MM = 2;
const MIN_DIMENSION = 100;
const MAX_DIMENSION = 3000;
const DIMENSION_STEP = 10;

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
  
  // Rate limit state
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [limitDialogContent, setLimitDialogContent] = useState({ title: '', message: '' });
  const NUDGE_STEP = 0.2;
  const autoApplyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      focalX: Math.max(-1, Math.min(1, settings.focalX + dx)),
      focalY: Math.max(-1, Math.min(1, settings.focalY + dy)),
    });
  };

  const handleProcess = async () => {
    if (!originalFile) return;
    
    setActiveTask('process');
    setIsProcessing(true);
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
      
      const processRes = await apiClient.post(ENDPOINTS.PROCESS, {
        imageId,
        width: settings.width,
        height: settings.height,
        focalX: settings.focalX,
        focalY: settings.focalY,
      });
      
      const outputPath = processRes.data?.data?.output;
      const fullUrl = outputPath ? `${SERVER_BASE_URL}/${outputPath}` : null;
      if (!fullUrl) {
        throw new Error('Processing failed: missing output path');
      }
      setProcessedImageUrl(fullUrl);
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
        toast.error('Failed to process image');
      }
    } finally {
      setIsProcessing(false);
      setActiveTask(null);
    }
  };

  const handlePrintLayout = async (layoutCount: number) => {
    if (!originalFile) return;
    
    setActiveTask('print');
    setIsProcessing(true);
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
        type: layoutCount,
        gapMm: PASSPORT_PRINT_GAP_MM,
      });

      const downloadUrl = printRes.data?.downloadUrl;
      const fullUrl = downloadUrl ? `${SERVER_BASE_URL}${downloadUrl}` : null;
      if (!fullUrl) {
        throw new Error('Print generation failed: missing download URL');
      }
      setPrintLayoutUrl(fullUrl);
      toast.success(`A4 layout for ${layoutCount} passport-size copies generated!`);

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
      setIsProcessing(false);
      setActiveTask(null);
    }
  };

  const handleRemoveBackground = async () => {
    if (!originalFile) return;

    setActiveTask('remove-bg');
    setIsProcessing(true);
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
      const fullUrl = outputPath ? `${SERVER_BASE_URL}/${outputPath}` : null;

      if (!fullUrl) {
        throw new Error('Remove background failed: missing output path');
      }

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
        toast.error('Failed to remove background');
      }
    } finally {
      setIsProcessing(false);
      setActiveTask(null);
    }
  };

  const handleStartOver = () => {
    setPrintLayoutUrl(null);
    setCurrentImageId(null);
    window.sessionStorage.removeItem('printLayoutUrl');
    reset();
  };

  const handleSingleDownload = async () => {
    if (!processedImageUrl) return;

    try {
      const response = await fetch(processedImageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch processed image');
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
      console.error('Single image download failed', error);
      toast.error('Failed to download image');
    }
  };

  useEffect(() => {
    if (!originalFile || isProcessing) {
      return;
    }

    if (!settings.width && !settings.height) {
      return;
    }

    if (autoApplyTimeoutRef.current) {
      clearTimeout(autoApplyTimeoutRef.current);
    }

    autoApplyTimeoutRef.current = setTimeout(() => {
      handleProcess();
    }, 450);

    return () => {
      if (autoApplyTimeoutRef.current) {
        clearTimeout(autoApplyTimeoutRef.current);
      }
    };
  }, [originalFile, settings.width, settings.height, settings.focalX, settings.focalY]);

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 w-full max-w-7xl mx-auto mt-4 lg:mt-8 mb-12 lg:mb-24 px-2 sm:px-4"
    >
      {/* Canvas Area */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.04)]">
          {processedImageUrl ? (
            <BeforeAfterSlider beforeImage={originalImageUrl} afterImage={processedImageUrl} />
          ) : (
            <img 
              src={originalImageUrl} 
              alt="Preview" 
              className="max-w-full max-h-[600px] object-contain p-4"
            />
          )}
          {isProcessing && (
            <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md flex items-center justify-center z-50 transition-all">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-semibold text-zinc-900 dark:text-white animate-pulse">Processing Image...</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  {activeTask === 'remove-bg' && 'Removing background...'}
                  {activeTask === 'print' && 'Generating print-ready PDF...'}
                  {activeTask === 'process' && 'Applying resize and quality settings...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {printLayoutUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 text-center shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">A4 Print Layout Ready</h3>
            <iframe title="Print Layout PDF" src={printLayoutUrl} className="w-full h-[420px] mx-auto mb-8 border border-zinc-200 shadow-lg rounded-md bg-white" />
            <button
              type="button"
              onClick={() => setPrintLayoutUrl(null)}
              className="text-xs text-zinc-500 hover:text-zinc-700 mb-4 underline underline-offset-4"
            >
              Clear this preview
            </button>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={printLayoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", className: "px-8 py-6 rounded-xl font-semibold" })}
              >
                Open Fullscreen PDF
              </a>
              <a href={`${printLayoutUrl}?download=true`} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg", className: "px-8 py-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all" })}>
                <Download className="w-5 h-5 mr-2" /> Download High-Res A4
              </a>
            </div>
          </motion.div>
        )}
      </div>

      {/* Toolbar Area */}
      <div className="lg:col-span-4 flex flex-col gap-0 max-h-[60vh] lg:max-h-[85vh] overflow-y-auto bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] custom-scrollbar">
        <div className="p-6 border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-transparent">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Editor Settings</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Precision adjustments for your image.</p>
        </div>

        <div className="p-6">
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-zinc-100 dark:bg-white/10 p-1 rounded-xl">
              <TabsTrigger value="presets" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Presets</TabsTrigger>
              <TabsTrigger value="resize" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Resize</TabsTrigger>
              <TabsTrigger value="compress" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Compress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-3">
                {PRESETS.map((preset) => (
                  <Button 
                    key={preset.name} 
                    variant="outline" 
                    className={`w-full text-xs h-auto py-4 flex flex-col items-center gap-1 transition-colors rounded-xl ${
                      settings.preset === preset.name
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-zinc-200 dark:border-white/10 hover:border-primary hover:bg-primary/5'
                    }`}
                    onClick={() => updateSettings({ width: preset.width, height: preset.height, preset: preset.name, focalX: 0, focalY: 0 })}
                  >
                    <span className="font-semibold text-zinc-900 dark:text-white">{preset.name}</span>
                    <span className="text-zinc-500">{preset.width}x{preset.height}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resize" className="space-y-5 mt-6">
              <div className="space-y-3">
                <Label className="text-zinc-700 dark:text-zinc-300 font-medium">Width (px)</Label>
                <Input 
                  type="number" 
                  placeholder="Auto" 
                  value={settings.width || ''}
                  onChange={(e) => updateSettings({ width: e.target.value ? Number(e.target.value) : null, preset: null, focalX: 0, focalY: 0 })}
                  className="rounded-xl border-zinc-200 dark:border-white/10 focus-visible:ring-primary h-11"
                />
                <Slider
                  value={[settings.width || 1080]}
                  min={MIN_DIMENSION}
                  max={MAX_DIMENSION}
                  step={DIMENSION_STEP}
                  onValueChange={(val) => updateSettings({ width: (val as number[])[0], preset: null })}
                  className="py-2"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-700 dark:text-zinc-300 font-medium">Height (px)</Label>
                <Input 
                  type="number" 
                  placeholder="Auto" 
                  value={settings.height || ''}
                  onChange={(e) => updateSettings({ height: e.target.value ? Number(e.target.value) : null, preset: null, focalX: 0, focalY: 0 })}
                  className="rounded-xl border-zinc-200 dark:border-white/10 focus-visible:ring-primary h-11"
                />
                <Slider
                  value={[settings.height || 1080]}
                  min={MIN_DIMENSION}
                  max={MAX_DIMENSION}
                  step={DIMENSION_STEP}
                  onValueChange={(val) => updateSettings({ height: (val as number[])[0], preset: null })}
                  className="py-2"
                />
              </div>
              <p className="text-xs text-zinc-500 font-medium">Leave an input empty to maintain original aspect ratio.</p>
              <p className="text-xs text-zinc-500 font-medium">After first preview, slider changes auto-update output.</p>

              {settings.width && settings.height && (
                <div className="pt-2">
                  <Label className="text-zinc-700 dark:text-zinc-300 font-medium block mb-3">
                    Framing Position
                  </Label>
                  <div className="grid grid-cols-3 gap-2 max-w-[180px]">
                    <div />
                    <Button type="button" variant="outline" className="h-10" onClick={() => nudgeFocus(0, -NUDGE_STEP)}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <div />
                    <Button type="button" variant="outline" className="h-10" onClick={() => nudgeFocus(-NUDGE_STEP, 0)}>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="outline" className="h-10 text-xs" onClick={() => updateSettings({ focalX: 0, focalY: 0 })}>
                      Center
                    </Button>
                    <Button type="button" variant="outline" className="h-10" onClick={() => nudgeFocus(NUDGE_STEP, 0)}>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <div />
                    <Button type="button" variant="outline" className="h-10" onClick={() => nudgeFocus(0, NUDGE_STEP)}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <div />
                  </div>
                  <p className="text-xs text-zinc-500 mt-3">
                    Move to choose which part of the image is kept in fixed-ratio output.
                  </p>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>Left</span>
                        <span>Right</span>
                      </div>
                      <Slider
                        value={[settings.focalX]}
                        min={-1}
                        max={1}
                        step={0.05}
                        onValueChange={(val) => updateSettings({ focalX: (val as number[])[0] })}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>Up</span>
                        <span>Down</span>
                      </div>
                      <Slider
                        value={[settings.focalY]}
                        min={-1}
                        max={1}
                        step={0.05}
                        onValueChange={(val) => updateSettings({ focalY: (val as number[])[0] })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="compress" className="space-y-8 mt-6">
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <Label className="text-zinc-700 dark:text-zinc-300 font-medium">Compression Quality</Label>
                  <span className="text-sm font-bold bg-primary/10 text-primary px-2 py-1 rounded-md">{settings.quality}%</span>
                </div>
                <Slider 
                  value={[settings.quality]} 
                  min={10} 
                  max={100} 
                  step={1}
                  onValueChange={(val) => updateSettings({ quality: typeof val === 'number' ? val : (val as number[])[0] })}
                  className="py-2"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-zinc-700 dark:text-zinc-300 font-medium">Output Format</Label>
                <div className="flex gap-3">
                  <Button 
                    variant={settings.format === 'jpeg' ? 'default' : 'outline'} 
                    className={`flex-1 rounded-xl h-11 ${settings.format === 'jpeg' ? 'bg-zinc-900 text-white shadow-md' : 'border-zinc-200'}`}
                    onClick={() => updateSettings({ format: 'jpeg' })}
                  >
                    JPG
                  </Button>
                  <Button 
                    variant={settings.format === 'png' ? 'default' : 'outline'} 
                    className={`flex-1 rounded-xl h-11 ${settings.format === 'png' ? 'bg-zinc-900 text-white shadow-md' : 'border-zinc-200'}`}
                    onClick={() => updateSettings({ format: 'png' })}
                  >
                    PNG
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-white/10 space-y-4">
            <Button 
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-[0_4px_14px_0_rgba(34,98,199,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(34,98,199,0.23)] hover:-translate-y-0.5" 
              onClick={handleProcess} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Apply Changes & Preview'}
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl font-semibold border-zinc-200 hover:bg-zinc-50 text-zinc-900 transition-colors"
              onClick={handleRemoveBackground}
              disabled={isProcessing}
            >
              Remove Background
            </Button>
            
            {processedImageUrl && (
              <button
                type="button"
                onClick={handleSingleDownload}
                className={buttonVariants({ variant: "outline", className: "w-full h-12 rounded-xl font-semibold border-zinc-200 hover:bg-zinc-50 text-zinc-900 transition-colors" })}
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
                  className="rounded-xl border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                  onClick={() => handlePrintLayout(layout.count)}
                  disabled={isProcessing}
                >
                  <LayoutTemplate className="w-4 h-4 mr-2 text-zinc-400" /> {layout.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5">
          <Button variant="ghost" className="w-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-xl" onClick={handleStartOver}>
            <RefreshCw className="w-4 h-4 mr-2" /> Start Over with New Image
          </Button>
        </div>
      </div>
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
