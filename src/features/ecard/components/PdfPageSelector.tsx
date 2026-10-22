'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfPageSelectorProps {
  fileName: string;
  currentPage: number;
  totalPages: number;
  isLoadingPage: boolean;
  onPageChange: (newPage: number) => void;
}

export function PdfPageSelector({
  fileName,
  currentPage,
  totalPages,
  isLoadingPage,
  onPageChange,
}: PdfPageSelectorProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
      <div className="flex items-center gap-2 min-w-0">
        <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
            {fileName}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            PDF Document · {totalPages} pages detected
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Page {currentPage} of {totalPages}
        </span>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoadingPage}
            className="h-8 px-2 rounded-lg"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoadingPage}
            className="h-8 px-2 rounded-lg"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {isLoadingPage && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span className="hidden sm:inline">Rendering page...</span>
          </div>
        )}
      </div>
    </div>
  );
}
