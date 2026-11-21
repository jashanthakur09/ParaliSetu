'use client'

import * as React from 'react'
import { Banknote, Cloud, Factory, Leaf, PiggyBank, Wind } from 'lucide-react'
import { fmtINR, fmtINRCompact, fmtNum } from '@/lib/economics'
import { cn } from '@/lib/utils'
import { useParali } from './provider'

function Kpi({
  label,
  value,
  title,
  icon: Icon,
  tone,
}: {
  label: string
  value: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  tone: string
}) {
  const [flash, setFlash] = React.useState(0)
  const first = React.useRef(true)
  React.useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setFlash((n) => n + 1)
  }, [value])

  return (
    <div
      key={flash}
      title={title}
      className={cn('rounded-xl border bg-card px-3 py-2.5 shadow-xs', flash > 0 && 'kpi-flash')}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        <Icon className={cn('size-3.5', tone)} aria-hidden="true" />
        {label}
      </div>
      <div className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-forest">{value}</div>
    </div>
  )
}

export function ImpactStrip() {
  const { impact } = useParali()
  if (!impact) {
    return (
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-3 md:grid-cols-3 md:px-6 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[62px] animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }
  return (
    <section
      aria-label="Live impact"
      className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-3 md:grid-cols-3 md:px-6 lg:grid-cols-6"
    >
      <Kpi
        label="Tonnes Diverted"
        value={fmtNum(impact.tonnesDiverted)}
        title="Straw collected from dispatched clusters at 2.0 t/acre"
        icon={Leaf}
        tone="text-verified"
      />
      <Kpi
        label="CO₂ Avoided (t)"
        value={fmtNum(impact.co2AvoidedTonnes, 1)}
        title="1.46 tonnes CO₂ avoided per tonne of straw"
        icon={Cloud}
        tone="text-verified"
      />
      <Kpi
        label="PM2.5 Prevented (kg)"
        value={fmtNum(impact.pm25PreventedKg)}
        title="3.0 kg PM2.5 prevented per tonne of straw"
        icon={Wind}
        tone="text-sky-600"
      />
      <Kpi
        label="Farmer Clearing Saved"
        value={fmtINRCompact(impact.farmerClearingSaved)}
        title={`${fmtINR(impact.farmerClearingSaved)} saved at Rs 4,000 per acre`}
        icon={PiggyBank}
        tone="text-harvest"
      />
      <Kpi
        label="Rural Cash Paid"
        value={fmtINRCompact(impact.ruralCashPaid)}
        title={`${fmtINR(impact.ruralCashPaid)}: farmer UPI share + coordinator pool + local transport and hub wages, paid on settled lots`}
        icon={Banknote}
        tone="text-harvest"
      />
      <Kpi
        label="Platform Net Profit"
        value={fmtINRCompact(impact.platformNetProfit)}
        title={`${fmtINR(impact.platformNetProfit)} at Rs 800 per settled acre`}
        icon={Factory}
        tone="text-forest"
      />
    </section>
  )
}