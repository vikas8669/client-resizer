'use client';

import React from 'react';
import {
  DOCUMENT_CATEGORIES,
  DocumentCategoryConfig,
  DocumentPreset,
} from '../config/documentPresets';
import { ShieldCheck, CreditCard, UserCheck, FileText, Crop, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface DocumentSelectorProps {
  selectedCategory: DocumentCategoryConfig;
  selectedPreset: DocumentPreset;
  customWidthMm: number;
  customHeightMm: number;
  onSelectCategory: (category: DocumentCategoryConfig) => void;
  onSelectPreset: (preset: DocumentPreset) => void;
  onUpdateCustomDimensions: (widthMm: number, heightMm: number) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'ShieldCheck':
      return ShieldCheck;
    case 'CreditCard':
      return CreditCard;
    case 'UserCheck':
      return UserCheck;
    case 'FileText':
      return FileText;
    case 'Crop':
    default:
      return Crop;
  }
};

export function DocumentSelector({
  selectedCategory,
  selectedPreset,
  customWidthMm,
  customHeightMm,
  onSelectCategory,
  onSelectPreset,
  onUpdateCustomDimensions,
}: DocumentSelectorProps) {
  const isCustom = selectedPreset.isCustomizable || selectedCategory.id === 'other';

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">
          1. Select Document Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {DOCUMENT_CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category.iconName);
            const isSelected = selectedCategory.id === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer select-none',
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-xs ring-2 ring-blue-500/20'
                    : 'border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                )}
              >
                <div
                  className={cn(
                    'p-2 rounded-lg mb-1.5 transition-colors',
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold leading-tight line-clamp-1">{category.title.replace(' Cutter', '')}</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate max-w-full">
                  {category.presets[0]?.widthMm} × {category.presets[0]?.heightMm} mm
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Sub-Options (if more than 1 preset in category or customizable) */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span>{selectedCategory.title}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {selectedPreset.widthMm.toFixed(2)} × {selectedPreset.heightMm.toFixed(2)} mm
              </span>
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {selectedCategory.description}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              Aspect Ratio: {(selectedPreset.widthMm / selectedPreset.heightMm).toFixed(3)} : 1
            </span>
          </div>
        </div>

        {/* Presets Pill Selection */}
        {selectedCategory.presets.length > 1 && (
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Format Presets:
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedCategory.presets.map((preset) => {
                const isPresetSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectPreset(preset)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer',
                      isPresetSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    )}
                  >
                    {isPresetSelected && <Check className="w-3 h-3" />}
                    <span>{preset.name}</span>
                    <span className="opacity-75 text-[10px]">
                      ({preset.widthMm} × {preset.heightMm} mm)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Width and Height Inputs (if customizable) */}
        {isCustom && (
          <div className="pt-2 border-t border-zinc-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Custom Physical Width (mm)
              </Label>
              <div className="relative mt-1">
                <Input
                  type="number"
                  step="0.1"
                  min="10"
                  max="300"
                  value={customWidthMm}
                  onChange={(e) => {
                    const w = parseFloat(e.target.value) || 10;
                    onUpdateCustomDimensions(w, customHeightMm);
                  }}
                  className="pr-12 text-sm font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                  mm
                </span>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Custom Physical Height (mm)
              </Label>
              <div className="relative mt-1">
                <Input
                  type="number"
                  step="0.1"
                  min="10"
                  max="300"
                  value={customHeightMm}
                  onChange={(e) => {
                    const h = parseFloat(e.target.value) || 10;
                    onUpdateCustomDimensions(customWidthMm, h);
                  }}
                  className="pr-12 text-sm font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                  mm
                </span>
              </div>
            </div>
          </div>
        )}

        {selectedPreset.notes && (
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
            💡 {selectedPreset.notes}
          </p>
        )}
      </div>
    </div>
  );
}
