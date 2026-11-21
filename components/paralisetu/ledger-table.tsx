'use client'

import { fmtINR, fmtNum } from '@/lib/economics'
import { cn } from '@/lib/utils'
import type { PayoutSummary } from '@/types/paralisetu'
import { useParali } from './provider'

export function LedgerTable({ payout, className }: { payout: PayoutSummary; className?: string }) {
  const { t } = useParali()
  const rows: { label: string; value: number; tone?: string; bold?: boolean }[] = [
    { label: t('grossRevenue'), value: payout.grossRevenue, bold: true },
    { label: t('farmerShare'), value: payout.farmerShare, tone: 'text-emerald-700' },
    { label: t('coordinatorPool'), value: payout.coordinatorPool, tone: 'text-amber-700' },
    { label: t('balerOpex'), value: payout.balerOpex },
    { label: t('transportHub'), value: payout.transportHub },
    { label: t('platformProfit'), value: payout.platformProfit, tone: 'text-forest', bold: true },
  ]
  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card text-sm', className)}>
      <div className="flex justify-between bg-muted px-3 py-1.5 text-xs text-muted-foreground">
        <span>
          {fmtNum(payout.acres, 1)} acres · {fmtNum(payout.tonnes, 1)} tonnes
        </span>
        <span>₹1,800 / tonne</span>
      </div>
      <dl className="divide-y">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-3 px-3 py-2">
            <dt className={cn(r.bold && 'font-semibold')}>{r.label}</dt>
            <dd className={cn('font-medium tabular-nums', r.tone, r.bold && 'font-semibold')}>{fmtINR(r.value)}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 bg-emerald-50 px-3 py-2">
          <dt className="font-semibold text-emerald-900">
            Farmer swing ({fmtINR(payout.farmerClearingSaved)} {t('saved')} + {fmtINR(payout.farmerShare)} {t('cashback')})
          </dt>
          <dd className="font-semibold tabular-nums text-emerald-900">{fmtINR(payout.farmerSwing)}</dd>
        </div>
      </dl>
    </div>
  )
}