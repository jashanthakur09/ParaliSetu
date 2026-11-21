'use client'

import * as React from 'react'
import { Building2, CheckCircle2, Droplets, Loader2, Warehouse } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ECON, fmtINR, fmtNum } from '@/lib/economics'
import type { SettlementResult } from '@/types/paralisetu'
import { LedgerTable } from './ledger-table'
import { useParali } from './provider'

export function BuyerDashboard() {
  const { lots, fleet, settleLot } = useParali()
  const [busyId, setBusyId] = React.useState<string | null>(null)
  const [settlement, setSettlement] = React.useState<SettlementResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const available = lots.filter((l) => l.status === 'available')
  const sold = lots.filter((l) => l.status === 'sold')

  const reserve = async (id: string) => {
    setBusyId(id)
    setError(null)
    try {
      setSettlement(await settleLot(id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reserve lot')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-5">
      <section aria-label="Storage hubs" className="grid gap-3 md:grid-cols-3">
        {fleet.hubs.map((h) => {
          const pct = Math.min(100, (h.storedTonnes / h.capacityTonnes) * 100)
          return (
            <div key={h.id} className="rounded-2xl border bg-card p-4 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Warehouse className="size-4 text-teal-700" aria-hidden="true" />
                {h.name}
              </div>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-semibold tabular-nums">{fmtNum(h.storedTonnes)} t</span>
                <span className="text-xs text-muted-foreground">of {h.capacityTonnes} t capacity</span>
              </div>
              <Progress
                value={pct}
                className="mt-2 gap-0 [&_[data-slot=progress-track]]:h-2"
                indicatorClassName={pct > 80 ? 'bg-harvest' : 'bg-verified'}
                aria-label={`${h.name} utilisation`}
              />
            </div>
          )
        })}
      </section>

      <section aria-label="Bulk lots" className="overflow-hidden rounded-2xl border bg-card shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Building2 className="size-4 text-forest" aria-hidden="true" /> Industrial Buyer Dashboard
            </h2>
            <p className="text-xs text-muted-foreground">
              Moisture-certified bulk lots at {fmtINR(ECON.pricePerTonne)} / tonne, matched to the nearest buyer within{' '}
              {ECON.maxHubToBuyerKm} km.
            </p>
          </div>
          <Badge variant="outline">
            {available.length} available · {sold.length} settled
          </Badge>
        </div>
        {error && (
          <p role="alert" className="bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lot</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Tonnes</TableHead>
              <TableHead>Moisture</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lots.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.id}</TableCell>
                <TableCell>
                  <div>{l.sourceLabel}</div>
                  <div className="text-xs text-muted-foreground">{l.hubName}</div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{fmtNum(l.tonnes, 1)}</TableCell>
                <TableCell>
                  <Badge className="gap-1 bg-verified/15 text-emerald-800 hover:bg-verified/15">
                    <Droplets /> {l.moisturePct}% · Safe
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>{l.buyerName}</div>
                  <div className="text-xs text-muted-foreground">
                    {l.buyerType} · {l.buyerDistanceKm} km
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">{fmtINR(l.valueInr)}</TableCell>
                <TableCell className="text-right">
                  {l.status === 'sold' ? (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 /> Settled
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      disabled={busyId === l.id}
                      onClick={() => reserve(l.id)}
                      className="bg-forest text-white hover:bg-forest-soft"
                    >
                      {busyId === l.id && <Loader2 className="animate-spin" />}
                      Reserve &amp; Settle
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <Dialog open={!!settlement} onOpenChange={(o) => !o && setSettlement(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {settlement && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-verified" aria-hidden="true" />
                  {settlement.lot.id} settled
                </DialogTitle>
                <DialogDescription>
                  {fmtNum(settlement.lot.tonnes, 1)} t sold to {settlement.lot.buyerName} for {fmtINR(settlement.lot.valueInr)}. Farmer UPI
                  shares and coordinator payouts are released now.
                </DialogDescription>
              </DialogHeader>
              <LedgerTable payout={settlement.payout} />
              <Button onClick={() => setSettlement(null)} className="bg-forest text-white hover:bg-forest-soft">
                Done
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}