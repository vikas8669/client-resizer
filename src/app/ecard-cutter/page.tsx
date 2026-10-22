'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ECardStudioView } from '@/features/ecard/components/ECardStudioView';

function CutterContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || 'aadhaar';
  return <ECardStudioView initialSlug={typeParam} />;
}

export default function ECardCutterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-sm font-medium text-zinc-500">
          Loading E-Card Cutter...
        </div>
      }
    >
      <CutterContent />
    </Suspense>
  );
}
