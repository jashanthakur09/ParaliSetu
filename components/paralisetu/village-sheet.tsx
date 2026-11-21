'use client'

import { CalendarCheck, Droplets, MapPin, Truck, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ECON, fmtINR, fmtNum, formatDate, payoutFor } from '@/lib/economics'
import { cn } from '@/lib/utils'
import { useParali } from './provider'
import { LedgerTable } from './ledger-table'
import { StatusBadge } from './status-badge'

export function VillageSheet() {
  const { clusters, fleet, selectedClusterId, selectCluster, goBookVillage, t } = useParali()
  const cluster = clusters.find((c) => c.id === selectedClusterId) ?? null
  const hub = cluster ? fleet.hubs.find((h) => h.id === cluster.hubId) : null
  const baler = cluster?.balerId ? fleet.balers.find((b) => b.id === cluster.balerId) : null

  const dispatched = cluster?.status === 'dispatched'
  const accent = dispatched ? 'bg-verified' : 'bg-harvest'

  const captainAcres = cluster?.farmers.filter((f) => f.coordinator === 'captain').reduce((s, f) => s + f.acres, 0) ?? 0
  const referralAcres = cluster?.farmers.filter((f) => f.coordinator === 'referral').reduce((s, f) => s + f.acres, 0) ?? 0
  const noneAcres = cluster?.farmers.filter((f) => f.coordinator === 'none').reduce((s, f) => s + f.acres, 0) ?? 0

  return (
    <Sheet open={!!cluster} onOpenChange={(open) => !open && selectCluster(null)}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto data-[side=right]:sm:max-w-lg">
        {cluster && (
          <>
            <SheetHeader className="border-b p-5 pr-12">
              <div className="flex items-center gap-2">
                <StatusBadge status={cluster.status} />
                <Badge variant="outline" className="gap-1">
                  <MapPin /> {cluster.district}, {cluster.state}
                </Badge>
              </div>
              <SheetTitle className="text-xl">Village {cluster.name}</SheetTitle>
              <SheetDescription>
                {cluster.farmers.length} farmers enrolled · {fmtNum(cluster.totalAcres, 1)} acres ·{' '}
                {fmtNum(cluster.totalAcres * ECON.tonnesPerAcre, 1)} t recoverable straw
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 p-5">
              <section aria-label="Dispatch progress" className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-sm font-medium">20-acre dispatch threshold</span>
                  <span className="text-lg font-semibold tabular-nums">
                    {fmtNum(cluster.totalAcres, 1)} / {ECON.dispatchThresholdAcres} acres
                  </span>
                </div>
                <Progress
                  value={cluster.progressPct}
                  className="gap-0 [&_[data-slot=progress-track]]:h-2.5"
                  indicatorClassName={accent}
                  aria-label="Acres toward dispatch threshold"
                />
                <p className="text-sm text-muted-foreground">
                  {dispatched
                    ? 'Threshold reached — a leased baler and the nearest storage hub are assigned.'
                    : `${fmtNum(cluster.acresToThreshold, 1)} more acres will trigger an automatic baler dispatch.`}
                </p>
              </section>

              <section className="grid gap-2 sm:grid-cols-2">
                <InfoTile icon={CalendarCheck} label={dispatched ? 'Dispatch / pickup date' : 'Projected pickup date'}>
                  <span className="font-semibold">{cluster.pickupDate ? formatDate(cluster.pickupDate) : '—'}</span>
                  <Badge className="mt-1 w-fit gap-1 bg-verified/15 text-emerald-800 hover:bg-verified/15">
                    <Droplets /> {t('moistureSafe')}
                  </Badge>
                  <span className="mt-1 text-xs text-muted-foreground">
                    max(tomorrow, latest harvest {cluster.latestHarvestDate ? formatDate(cluster.latestHarvestDate) : ''} + 3 days)
                  </span>
                </InfoTile>
                <InfoTile icon={MapPin} label="Nearest storage hub">
                  <span className="font-semibold">{hub?.name}</span>
                  <span className={cn('text-sm', cluster.hubDistanceKm <= ECON.maxVillageToHubKm ? 'text-emerald-700' : 'text-destructive')}>
                    {cluster.hubDistanceKm} km (geo-fence ≤ {ECON.maxVillageToHubKm} km)
                  </span>
                </InfoTile>
                <InfoTile icon={Truck} label="Leased baler" className="sm:col-span-2">
                  {dispatched ? (
                    baler ? (
                      <span className="font-semibold">
                        {baler.name} · clears {ECON.balerAcresPerDay} acres/day (~{ECON.balerTonnesPerDay} t)
                      </span>
                    ) : (
                      <span className="font-semibold text-harvest">All balers busy — queued for the next free baler</span>
                    )
                  ) : (
                    <span className="text-sm text-muted-foreground">An idle baler is auto-assigned at 20 acres.</span>
                  )}
                </InfoTile>
              </section>

              <section aria-label="Enrolled farmers" className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="size-4" aria-hidden="true" /> Enrolled farmers
                </h3>
                <ul className="divide-y rounded-xl border bg-card">
                  {cluster.farmers.map((f) => (
                    <li key={f.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                      <div className="min-w-0">
                        <div className="truncate font-medium">{f.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Harvest {formatDate(f.harvestDate)} ·{' '}
                          {f.coordinator === 'captain'
                            ? `Captain: ${f.coordinatorName}`
                            : f.coordinator === 'referral'
                              ? `Referred by ${f.coordinatorName}`
                              : 'No coordinator'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold tabular-nums">{f.acres} ac</div>
                        <code className="text-[11px] text-muted-foreground">{f.referralCode}</code>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-label="Payout ledger" className="space-y-2">
                <h3 className="text-sm font-semibold">{t('ledgerTitle')}</h3>
                <LedgerTable payout={payoutFor(cluster.totalAcres)} />
                <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                  Coordinator pool ({fmtINR(ECON.coordinatorPerAcre)}/acre, no double-dipping): Captain {fmtNum(captainAcres, 1)} ac ·
                  Referrals {fmtNum(referralAcres, 1)} ac · Unclaimed {fmtNum(noneAcres, 1)} ac (to village welfare fund).
                </div>
              </section>

              <Button className="w-full" onClick={() => goBookVillage(cluster.id)}>
                Book acres in {cluster.name}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function InfoTile({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-0.5 rounded-xl border bg-card p-3 text-sm', className)}>
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </div>
      {children}
    </div>
  )
}