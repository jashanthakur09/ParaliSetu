'use client';

import * as React from 'react';
import { Leaf, Wind, ShieldCheck, IndianRupee } from 'lucide-react';
import { fmtINR, fmtNum } from '@/lib/economics';
import { useParali } from './provider';

export function ImpactStrip() {
  const { impact } = useParali();

  if (!impact) return null;

  return (
    <aside aria-label="Ecological impact ticker" className="border-b bg-muted/40 py-2">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 text-xs md:px-6">
        <div className="flex items-center gap-1.5 font-medium">
          <Leaf className="size-4 text-emerald-600" aria-hidden="true" />
          <span>{fmtNum(impact.tonnes_diverted)} t straw diverted</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-emerald-700">
          <Wind className="size-4" aria-hidden="true" />
          <span>{fmtNum(impact.co2_avoided_tonnes, 1)} t CO₂ avoided</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-blue-700">
          <ShieldCheck className="size-4" aria-hidden="true" />
          <span>{fmtNum(impact.pm25_prevented_kg)} kg PM2.5 blocked</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-amber-700">
          <IndianRupee className="size-4" aria-hidden="true" />
          <span>{fmtINR(impact.farmer_clearing_saved_inr)} clearing saved</span>
        </div>
      </div>
    </aside>
  );
}
