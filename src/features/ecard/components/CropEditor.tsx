'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  RotateCcw as ResetIcon,
  Sparkles,
  Upload,
  Maximize2,
  CheckCircle2,
  Sliders,
  Layers,
  CreditCard,
  ShieldCheck,
  Crop as CropIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getCroppedImg, PixelCrop } from '../utils/cropHelper';
import { cn } from '@/lib/utils';

interface CropEditorProps {
  imageSrc: string;
  widthMm: number;
  heightMm: number;
  documentCategory: string; // 'aadhaar' | 'pan' | ...
  documentName: string;
  onChangeDocument: () => void;
  onDimensionsChange?: (widthMm: number, heightMm: number) => void;
  onCropComplete: (croppedData: { dataUrl: string; width: number; height: number }) => void;
}

export function CropEditor({
  imageSrc,
  widthMm,
  heightMm,
  documentCategory,
  documentName,
  onChangeDocument,
  onDimensionsChange,
  onCropComplete,
}: CropEditorProps) {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Aspect ratio is locked to physical dimensions to prevent distortion
  const aspect = widthMm / heightMm;

  const handleCropComplete = useCallback((_croppedArea: Area, currentCroppedAreaPixels: Area) => {
    setCroppedAreaPixels(currentCroppedAreaPixels);
    setHasApplied(false);
  }, []);

  const handleResetCrop = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setHasApplied(false);
  };

  const handleRotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees + 360) % 360);
    setHasApplied(false);
  };

  // Generate 100% sharp lossless crop when user clicks "Apply Crop"
  const handleApplyCrop = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    try {
      setIsGenerating(true);
      const result = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropComplete({
        dataUrl: result.dataUrl,
        width: result.width,
        height: result.height,
      });
      setHasApplied(true);
    } catch (err) {
      console.error('Failed to crop image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const isAadhaar = documentCategory === 'aadhaar';

  return (
    <div className="space-y-4">
      {/* Quick Crop Preset Selector for Aadhaar & Standard IDs */}
      <div className="p-3.5 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
            <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Quick Crop Area Presets:</span>
          </div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/50">
            Selected: {widthMm.toFixed(1)} × {heightMm.toFixed(1)} mm ({documentName})
          </span>
        </div>

        {/* Quick Format Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {isAadhaar ? (
            <>
              {/* Both Cards (Front + Back Side-by-Side) */}
              <button
                type="button"
                onClick={() => onDimensionsChange?.(171.20, 53.98)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border',
                  Math.abs(widthMm - 171.2) < 1
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/10 hover:bg-zinc-50'
                )}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Both Cards Side-by-Side (171.2 × 54 mm)</span>
              </button>

              {/* Front Card Only */}
              <button
                type="button"
                onClick={() => onDimensionsChange?.(85.60, 53.98)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border',
                  Math.abs(widthMm - 85.6) < 1 && Math.abs(heightMm - 53.98) < 1
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/10 hover:bg-zinc-50'
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Single Front Card (85.6 × 54 mm)</span>
              </button>

              {/* Back Card Only */}
              <button
                type="button"
                onClick={() => onDimensionsChange?.(85.60, 53.98)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/10 hover:bg-zinc-50"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Single Back Card (85.6 × 54 mm)</span>
              </button>
            </>
          ) : (
            <>
              {/* Standard ID-1 */}
              <button
                type="button"
                onClick={() => onDimensionsChange?.(85.60, 53.98)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border',
                  Math.abs(widthMm - 85.6) < 1 && Math.abs(heightMm - 53.98) < 1
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/10 hover:bg-zinc-50'
                )}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Standard ID-1 Card (85.60 × 53.98 mm)</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onChangeDocument}
            className="ml-auto px-2.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>Upload Other</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Crop Workspace */}
      <div className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden bg-zinc-950 border-2 border-zinc-800 shadow-2xl">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          minZoom={0.5}
          maxZoom={6}
          restrictPosition={false} // Allows free dragging anywhere so user can center the bottom card easily!
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={handleCropComplete}
          showGrid={true}
          style={{
            containerStyle: {
              background: '#09090b',
              borderRadius: '1.5rem',
            },
            cropAreaStyle: {
              border: '2.5px solid #3b82f6',
              boxShadow: '0 0 0 9999em rgba(0, 0, 0, 0.75)',
            },
          }}
        />

        {/* Floating Dimensions Pill */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white text-xs font-semibold border border-white/15 shadow-xl">
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {widthMm.toFixed(2)} mm × {heightMm.toFixed(2)} mm ({aspect > 2.5 ? 'Wide Dual' : 'Card'})
            </span>
          </div>
        </div>

        {/* Helper Badge */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-max max-w-[90%]">
          <span className="text-[10px] sm:text-[11px] font-semibold text-white/90 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg text-center block">
            ✋ Drag document to position · Use buttons below to Zoom in/out
          </span>
        </div>
      </div>

      {/* Crop Controls & Apply Action Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Zoom Section with Quick Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300">
              <span className="flex items-center gap-1.5 font-bold">
                <ZoomIn className="w-4 h-4 text-zinc-400" />
                Zoom Level:
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold text-xs">
                {zoom.toFixed(2)}x
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.2).toFixed(2))))}
                disabled={zoom <= 0.5}
                className="h-8 w-8 rounded-xl shrink-0"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>

              <Slider
                value={[zoom]}
                min={0.5}
                max={5}
                step={0.05}
                onValueChange={(val) => setZoom(val[0])}
                className="flex-1"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setZoom((z) => Math.min(5, Number((z + 0.2).toFixed(2))))}
                disabled={zoom >= 5}
                className="h-8 w-8 rounded-xl shrink-0"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Quick Zoom Presets */}
            <div className="flex items-center gap-1.5 pt-0.5">
              {[
                { label: 'Fit (0.8x)', val: 0.8 },
                { label: '1.0x', val: 1.0 },
                { label: '1.5x', val: 1.5 },
                { label: '2.0x', val: 2.0 },
                { label: '3.0x', val: 3.0 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setZoom(p.val)}
                  className={cn(
                    'flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer',
                    Math.abs(zoom - p.val) < 0.1
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 font-extrabold'
                      : 'border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rotation & Reset */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300">
              <span className="flex items-center gap-1.5 font-bold">
                <RotateCw className="w-4 h-4 text-zinc-400" />
                Rotation:
              </span>
              <span className="font-mono text-zinc-500 font-semibold">{rotation}°</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleRotate(-90)}
                className="flex-1 h-8 rounded-xl text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                90° CCW
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleRotate(90)}
                className="flex-1 h-8 rounded-xl text-xs font-semibold"
              >
                <RotateCw className="w-3.5 h-3.5 mr-1" />
                90° CW
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={handleResetCrop}
                className="h-8 px-3 rounded-xl text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              >
                <ResetIcon className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Big Apply Crop Action Button */}
        <div className="pt-3 border-t border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <CropIcon className="w-4 h-4 text-blue-600" />
            <span>
              Adjust the box around your card, then click <strong>Apply Crop</strong>.
            </span>
          </div>

          <Button
            type="button"
            onClick={handleApplyCrop}
            disabled={isGenerating}
            size="lg"
            className={cn(
              'w-full sm:w-auto px-6 py-5 rounded-2xl font-black text-sm shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2',
              hasApplied
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-500/20'
            )}
          >
            {hasApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Crop Applied! View Print Layout ↓</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Cropping in 100% Quality...' : 'Apply Crop & Generate Sheet'}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
