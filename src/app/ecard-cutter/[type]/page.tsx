'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ECardStudioView } from '@/features/ecard/components/ECardStudioView';

export default function ECardCutterTypePage() {
  const params = useParams();
  const typeParam = typeof params?.type === 'string' ? params.type : 'aadhaar';

  return <ECardStudioView initialSlug={typeParam} />;
}
