'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const isDispatched = status === 'Machine Dispatched' || status === 'dispatched';
  const label = isDispatched ? 'Dispatched' : 'Gathering';

  return (
    <Badge
      variant={isDispatched ? 'default' : 'secondary'}
      className={cn(
        'text-[10px] uppercase font-semibold px-2 py-0.5',
        isDispatched
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300',
        className
      )}
    >
      {label}
    </Badge>
  );
}
