'use client';

import React, { useState } from 'react';
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
import { Download, RefreshCw, LayoutTemplate } from 'lucide-react';
import { motion } from 'framer-motion';

const PRESETS = [
  { name: 'Passport (2x2)', width: 600, height: 600 },
  { name: 'PAN/Aadhaar', width: 413, height: 531 },
  { name: 'Instagram SQ', width: 1080, height: 1080 },
  { name: 'Twitter HDR', width: 1500, height: 500 },
];

const PRINT_LAYOUTS = [
  { name: '8 Photos', count: 8 },
  { name: '16 Photos', count: 16 },
  { name: '32 Photos', count: 32 },
  { name: '52 Photos', count: 52 },
];

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

  const handleProcess = async () => {
    if (!originalFile) return;
    
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', originalFile);
      
      const uploadRes = await apiClient.post(ENDPOINTS.UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const filename = uploadRes.data.filename;
      
      const processRes = await apiClient.post(ENDPOINTS.PROCESS, {
        filename,
        width: settings.width,
        height: settings.height,
        quality: settings.quality,
        format: settings.format
      });
      
      const fullUrl = `${SERVER_BASE_URL}${processRes.data.imageUrl}`;
      setProcessedImageUrl(fullUrl);
      toast.success('Image processed successfully!');
      
    } catch (error) {
      console.error('Processing failed', error);
      toast.error('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintLayout = async (layoutCount: number) => {
    if (!originalFile) return;
    
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', originalFile);
      const uploadRes = await apiClient.post(ENDPOINTS.UPLOAD, formData);
      const filename = uploadRes.data.filename;

      const printRes = await apiClient.post(ENDPOINTS.PRINT_LAYOUT, {
        filename,
        layoutCount
      });

      const fullUrl = `${SERVER_BASE_URL}${printRes.data.imageUrl}`;
      setPrintLayoutUrl(fullUrl);
      toast.success(`A4 layout for ${layoutCount} photos generated!`);

    } catch (error) {
      console.error('Print layout failed', error);
      toast.error('Failed to generate print layout');
    } finally {
      setIsProcessing(false);
    }
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
            <img src={printLayoutUrl} alt="Print Layout" className="max-h-[400px] mx-auto mb-8 border border-zinc-200 shadow-lg rounded-md" />
            <a href={printLayoutUrl} download className={buttonVariants({ size: "lg", className: "px-8 py-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all" })}>
              <Download className="w-5 h-5 mr-2" /> Download High-Res A4
            </a>
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
                    className="w-full text-xs h-auto py-4 flex flex-col items-center gap-1 border-zinc-200 dark:border-white/10 hover:border-primary hover:bg-primary/5 transition-colors rounded-xl"
                    onClick={() => updateSettings({ width: preset.width, height: preset.height })}
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
                  onChange={(e) => updateSettings({ width: e.target.value ? Number(e.target.value) : null })}
                  className="rounded-xl border-zinc-200 dark:border-white/10 focus-visible:ring-primary h-11"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-700 dark:text-zinc-300 font-medium">Height (px)</Label>
                <Input 
                  type="number" 
                  placeholder="Auto" 
                  value={settings.height || ''}
                  onChange={(e) => updateSettings({ height: e.target.value ? Number(e.target.value) : null })}
                  className="rounded-xl border-zinc-200 dark:border-white/10 focus-visible:ring-primary h-11"
                />
              </div>
              <p className="text-xs text-zinc-500 font-medium">Leave an input empty to maintain original aspect ratio.</p>
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
            
            {processedImageUrl && (
              <a href={processedImageUrl} download className={buttonVariants({ variant: "outline", className: "w-full h-12 rounded-xl font-semibold border-zinc-200 hover:bg-zinc-50 text-zinc-900 transition-colors" })}>
                <Download className="w-4 h-4 mr-2" /> Download Single Image
              </a>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-white/10">
            <Label className="font-semibold text-zinc-900 dark:text-white block mb-4">Generate Print Layout (A4)</Label>
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
          <Button variant="ghost" className="w-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-xl" onClick={reset}>
            <RefreshCw className="w-4 h-4 mr-2" /> Start Over with New Image
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
