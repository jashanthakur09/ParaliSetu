'use client'

import { ChevronRight, Radar } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { ECON, fmtNum } from '@/lib/economics'
import { cn } from '@/lib/utils'
import { useParali } from './provider'
import { StatusBadge } from './status-badge'

export function ClusterRadar() {
  const { clusters, selectCluster } = useParali()
  const sorted = [...clusters].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'gathering' ? -1 : 1
    return b.totalAcres - a.totalAcres
  })

  return (
    <section aria-label="Cluster radar" className="rounded-2xl border bg-card shadow-xs">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Radar className="size-4 text-forest" aria-hidden="true" />
        <h2 className="text-sm font-semibold">Cluster Radar</h2>
        <span className="ml-auto text-xs text-muted-foreground">{clusters.length} villages</span>
      </div>
      <ul className="divide-y">
        {sorted.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => selectCluster(c.id)}
              className="group flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.district}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={c.status} />
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Progress
                  value={c.progressPct}
                  className="flex-1 gap-0"
                  indicatorClassName={cn(c.status === 'dispatched' ? 'bg-verified' : 'bg-harvest')}
                  aria-label={`${c.name} progress`}
                />
                <span className="text-xs font-medium tabular-nums">
                  {fmtNum(c.totalAcres, 1)} / {ECON.dispatchThresholdAcres} ac
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}