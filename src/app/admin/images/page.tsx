'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ImageIcon, Filter, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProcessedImagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Processed Images</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Monitor and manage all image processing tasks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl border-zinc-200 dark:border-zinc-800 dark:text-zinc-300">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button size="sm" className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
            <Download className="h-4 w-4 mr-2" /> Export Log
          </Button>
        </div>
      </div>

      <Card className="border-dashed py-16 text-center bg-zinc-50/30 dark:bg-zinc-900/30 dark:border-zinc-800">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-4">
          <ImageIcon className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No images to display</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
          Image processing logs will appear here once users start using the resizer tools.
        </p>
      </Card>
    </div>
  );
}
