'use client';

import React from 'react';
import {
  Trash2,
  RotateCw,
  Printer,
  Download,
  Palette,
  Sparkles,
  Scissors,
  Layers,
  ChevronDown,
  Check,
  Loader2,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface StudioSettings {
  paperSize: 'A4' | '4x6' | 'Letter';
  cardLayoutMode: 'dual-both' | 'front-only' | 'back-only' | 'single';
  bgColor: string; // 'default' | '#E8F5E9' | '#FFFDE7' | '#FFFFFF' | custom hex
  bgLabel: string;
  isEnhanced: boolean;
  isRounded: boolean;
  cardHeightCm: number;
  gapX: number; // mm
  gapY: number; // mm
  borderWidth: number; // px/mm
  copies: number; // number of card pairs
}

export interface ECardUsageInfo {
  isLoggedIn: boolean;
  isAdmin: boolean;
  paymentEnabled: boolean;
  hasActiveSubscription: boolean;
  usedCount: number;
  remainingCount: number;
  freeMonthlyLimit: number;
  currentPeriod?: string;
}

interface ECardStudioHeaderProps {
  settings: StudioSettings;
  onUpdateSettings: (partial: Partial<StudioSettings>) => void;
  onClear: () => void;
  onRotate: () => void;
  onPrint: () => void;
  onDownload: () => void;
  isProcessing?: boolean;
  usageInfo?: ECardUsageInfo;
  onOpenPlans?: () => void;
}

export const AADHAAR_GOVT_GRADIENT =
  'linear-gradient(180deg, #CADDC9 0%, #E0E8D9 50%, #FBF7EB 100%)';

const BG_COLOR_OPTIONS = [
  {
    id: 'default',
    label: 'Default (Original)',
    color: 'default',
    preview: '#ffffff',
    gradient: undefined,
  },
  {
    id: 'aadhaar-govt',
    label: 'Aadhaar Card Color (Govt Physical Card)',
    color: AADHAAR_GOVT_GRADIENT,
    preview: '#CADDC9',
    gradient: AADHAAR_GOVT_GRADIENT,
  },
];

export function ECardStudioHeader({
  settings,
  onUpdateSettings,
  onClear,
  onRotate,
  onPrint,
  onDownload,
  isProcessing = false,
  usageInfo,
  onOpenPlans,
}: ECardStudioHeaderProps) {
  return (
    <header className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/10 px-3 py-2 sticky top-16 z-40 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left Action Buttons: Trash, Rotate, Print, Download */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="w-8 h-8 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
            title="Delete / Clear Document"
            aria-label="Delete document"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRotate}
            className="w-8 h-8 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            title="Rotate 90° Clockwise"
            aria-label="Rotate document"
          >
            <RotateCw className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPrint}
            disabled={isProcessing}
            className="h-8 px-2.5 rounded-lg text-xs font-semibold gap-1.5 cursor-pointer border-zinc-200 dark:border-white/10"
            title="Print sheet directly at 100% scale"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span className="hidden sm:inline">Print</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onDownload}
            disabled={isProcessing}
            className="h-8 px-3 rounded-lg text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs"
            title="Download print-ready PDF"
          >
            {isProcessing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Export PDF</span>
          </Button>
        </div>

        {/* Center / Controls Group */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Paper Format Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 font-semibold flex items-center gap-1.5 hover:bg-zinc-100 cursor-pointer">
              <span>{settings.paperSize}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-32 rounded-xl">
              <DropdownMenuLabel className="text-[10px] uppercase font-bold text-zinc-400">
                Paper Size
              </DropdownMenuLabel>
              {(['A4', '4x6', 'Letter'] as const).map((p) => (
                <DropdownMenuItem
                  key={p}
                  onClick={() => onUpdateSettings({ paperSize: p })}
                  className="text-xs font-semibold flex items-center justify-between cursor-pointer"
                >
                  <span>{p}</span>
                  {settings.paperSize === p && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Card Layout / Size Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 font-semibold flex items-center gap-1.5 hover:bg-zinc-100 cursor-pointer">
              <span>
                {settings.cardLayoutMode === 'dual-both'
                  ? 'Card Size (Front + Back)'
                  : settings.cardLayoutMode === 'front-only'
                  ? 'Front Card'
                  : 'Back Card'}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 rounded-xl">
              <DropdownMenuLabel className="text-[10px] uppercase font-bold text-zinc-400">
                Card Cutting Format
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onUpdateSettings({ cardLayoutMode: 'dual-both' })}
                className="text-xs font-semibold flex items-center justify-between cursor-pointer"
              >
                <span>Both Cards (Front + Back)</span>
                {settings.cardLayoutMode === 'dual-both' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onUpdateSettings({ cardLayoutMode: 'front-only' })}
                className="text-xs font-semibold flex items-center justify-between cursor-pointer"
              >
                <span>Front Card Only</span>
                {settings.cardLayoutMode === 'front-only' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onUpdateSettings({ cardLayoutMode: 'back-only' })}
                className="text-xs font-semibold flex items-center justify-between cursor-pointer"
              >
                <span>Back Card Only</span>
                {settings.cardLayoutMode === 'back-only' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Colored BG Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 px-2.5 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50/80 dark:bg-amber-950/40 font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 hover:bg-amber-100/80 cursor-pointer">
              <div
                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                style={{
                  background: settings.bgColor === 'default' ? '#e4e4e7' : settings.bgColor,
                }}
              />
              <span className="truncate max-w-[140px]">
                {settings.bgColor === 'default' ? 'Colored BG' : settings.bgLabel}
              </span>
              <ChevronDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 rounded-xl">
              <DropdownMenuLabel className="text-[10px] uppercase font-bold text-zinc-400">
                Card Background Color
              </DropdownMenuLabel>
              {BG_COLOR_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.id}
                  onClick={() => onUpdateSettings({ bgColor: opt.color, bgLabel: opt.label })}
                  onSelect={() => onUpdateSettings({ bgColor: opt.color, bgLabel: opt.label })}
                  className="text-xs font-medium flex items-center gap-2.5 py-2 cursor-pointer"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-zinc-300 shrink-0 shadow-xs"
                    style={{ background: opt.gradient || opt.preview }}
                  />
                  <span className="flex-1 font-semibold">{opt.label}</span>
                  {settings.bgColor === opt.color && (
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <div className="p-2 flex items-center gap-2">
                <span className="text-[11px] font-medium text-zinc-500">Custom:</span>
                <input
                  type="color"
                  value={settings.bgColor === 'default' ? '#DCEDDC' : settings.bgColor}
                  onChange={(e) => onUpdateSettings({ bgColor: e.target.value, bgLabel: 'Custom Color' })}
                  className="w-6 h-6 rounded cursor-pointer border border-zinc-300"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Enhance Toggle */}
          <label className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.isEnhanced}
              onChange={(e) => onUpdateSettings({ isEnhanced: e.target.checked })}
              className="rounded text-blue-600 w-3.5 h-3.5 cursor-pointer"
            />
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Enhance</span>
          </label>

          {/* Rounded Toggle */}
          <label className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.isRounded}
              onChange={(e) => onUpdateSettings({ isRounded: e.target.checked })}
              className="rounded text-blue-600 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Rounded</span>
          </label>

          {/* Card Height Input (cm) */}
          <div className="flex items-center gap-1 border border-zinc-200 dark:border-white/10 rounded-lg px-2 h-8 bg-zinc-50 dark:bg-zinc-900">
            <span className="text-[11px] text-zinc-400 font-medium">Height:</span>
            <input
              type="number"
              step="0.01"
              min="3"
              max="15"
              value={settings.cardHeightCm}
              onChange={(e) =>
                onUpdateSettings({ cardHeightCm: parseFloat(e.target.value) || 5.4 })
              }
              className="w-12 bg-transparent text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none"
            />
            <span className="text-[10px] text-zinc-400">cm</span>
          </div>

          {/* Gap X Input */}
          <div className="flex items-center gap-1 border border-zinc-200 dark:border-white/10 rounded-lg px-2 h-8 bg-zinc-50 dark:bg-zinc-900">
            <span className="text-[11px] text-zinc-400 font-medium">Gap X:</span>
            <input
              type="number"
              min="0"
              max="30"
              value={settings.gapX}
              onChange={(e) => onUpdateSettings({ gapX: parseInt(e.target.value) || 0 })}
              className="w-8 bg-transparent text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none"
            />
          </div>

          {/* Gap Y Input */}
          <div className="flex items-center gap-1 border border-zinc-200 dark:border-white/10 rounded-lg px-2 h-8 bg-zinc-50 dark:bg-zinc-900">
            <span className="text-[11px] text-zinc-400 font-medium">Gap Y:</span>
            <input
              type="number"
              min="0"
              max="30"
              value={settings.gapY}
              onChange={(e) => onUpdateSettings({ gapY: parseInt(e.target.value) || 0 })}
              className="w-8 bg-transparent text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none"
            />
          </div>

          {/* Border Width Input */}
          <div className="flex items-center gap-1 border border-zinc-200 dark:border-white/10 rounded-lg px-2 h-8 bg-zinc-50 dark:bg-zinc-900">
            <span className="text-[11px] text-zinc-400 font-medium">Border:</span>
            <input
              type="number"
              min="0"
              max="5"
              value={settings.borderWidth}
              onChange={(e) => onUpdateSettings({ borderWidth: parseInt(e.target.value) || 0 })}
              className="w-7 bg-transparent text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none"
            />
          </div>

          {/* Copies Input */}
          <div className="flex items-center gap-1 border border-zinc-200 dark:border-white/10 rounded-lg px-2 h-8 bg-zinc-50 dark:bg-zinc-900">
            <span className="text-[11px] text-zinc-400 font-medium">Copies:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.copies}
              onChange={(e) => onUpdateSettings({ copies: parseInt(e.target.value) || 1 })}
              className="w-7 bg-transparent text-xs font-bold text-blue-600 dark:text-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Status / Usage Badge & Subscription CTA */}
        {usageInfo && (
          <div className="flex items-center gap-2 shrink-0">
            {usageInfo.isAdmin ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 text-xs font-bold shadow-xs">
                <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Admin: Unlimited</span>
              </div>
            ) : !usageInfo.isLoggedIn ? (
              <a
                href="/login?redirect=/ecard-cutter"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 text-xs font-bold hover:bg-amber-100 cursor-pointer transition-colors"
              >
                <span>Sign in to Cut</span>
              </a>
            ) : !usageInfo.paymentEnabled ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Unlimited Access</span>
              </div>
            ) : usageInfo.hasActiveSubscription ? (
              <button
                type="button"
                onClick={onOpenPlans}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:opacity-95 cursor-pointer transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Premium Plan</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenPlans}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors border shadow-xs',
                  usageInfo.remainingCount > 0
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                    : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100'
                )}
                title={
                  usageInfo.remainingCount > 0
                    ? 'Click to view upgrade plans'
                    : 'Free limit exhausted - click to subscribe'
                }
              >
                <span className="w-2 h-2 rounded-full shrink-0 bg-current" />
                <span>
                  {usageInfo.remainingCount > 0
                    ? `Free cuts: ${usageInfo.usedCount}/${usageInfo.freeMonthlyLimit}`
                    : '0 free cuts left • Upgrade'}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
