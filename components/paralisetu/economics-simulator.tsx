'use client'

import * as React from 'react'
import { Slider } from '@/components/ui/slider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ECON, balerCostPerAcre, fmtINR, fmtINRCompact, fmtNum, platformProfitPerAcre, simulateFleet } from '@/lib/economics'
import { cn } from '@/lib/utils'
import type { LeaseMode } from '@/types/paralisetu'

export function EconomicsSimulator() {
  const [balers, setBalers] = React.useState(20)
  const [lease, setLease] = React.useState<LeaseMode>('seasonal')
  const sim = simulateFleet(balers, lease)
  const perAcre = platformProfitPerAcre(lease)

  const stats: [string, string, string][] = [
    ['Acres cleared', fmtNum(sim.acres), `${balers} balers × ${ECON.leases[lease].acresPerBaler} acres`],
    ['Straw collected', `${fmtNum(sim.tonnes)} t`, '2.0 tonnes / acre'],
    ['CO₂ avoided', `${fmtNum(sim.co2AvoidedTonnes)} t`, '1.46 t per tonne of straw'],
    ['PM2.5 prevented', `${fmtNum(sim.pm25PreventedKg)} kg`, '3.0 kg per tonne of straw'],
    ['Farmer savings', fmtINRCompact(sim.farmerSavings), 'Rs 4,000 / acre clearing cost'],
    ['Farmer UPI cashback', fmtINRCompact(sim.farmerCashback), 'Rs 180 / acre (5% share)'],
    ['Gross revenue', fmtINRCompact(sim.grossRevenue), 'Rs 1,800 / tonne'],
    ['Fleet lease cost', fmtINRCompact(sim.leaseCost), `${fmtINR(ECON.leases[lease].leaseInr)} per baler`],
    ['Platform net profit', fmtINRCompact(sim.netProfit), `${fmtINR(perAcre)} / acre`],
  ]

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border bg-card p-4 shadow-xs md:p-6" aria-label="Fleet simulator">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-end justify-between">
              <label htmlFor="fleet" className="text-sm font-semibold">
                Leased baler fleet
              </label>
              <span className="text-3xl font-semibold tabular-nums text-forest">{balers}</span>
            </div>
            <Slider
              id="fleet"
              className="mt-4"
              min={1}
              max={50}
              step={1}
              value={[balers]}
              onValueChange={(v) => setBalers(Array.isArray(v) ? v[0] : v)}
              aria-label="Number of leased balers"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>50 balers</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold">Lease strategy</div>
            <div role="radiogroup" aria-label="Lease strategy" className="mt-3 grid grid-cols-2 gap-2">
              {(['seasonal', 'peak'] as const).map((m) => {
                const l = ECON.leases[m]
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={lease === m}
                    onClick={() => setLease(m)}
                    className={cn(
                      'rounded-xl border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                      lease === m ? 'border-forest bg-forest text-white' : 'bg-background hover:bg-muted',
                    )}
                  >
                    <div className="text-sm font-semibold">{l.label}</div>
                    <div className={cn('mt-0.5 text-xs', lease === m ? 'text-white/75' : 'text-muted-foreground')}>
                      {fmtINR(l.leaseInr)} · {l.acresPerBaler} acres/baler · {fmtINR(l.leasePerAcre)}/acre
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <dl className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(([label, value, note], i) => (
            <div
              key={label}
              className={cn('rounded-xl border p-3', i === stats.length - 1 ? 'border-verified bg-emerald-50' : 'bg-background')}
            >
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums text-forest">{value}</dd>
              <div className="text-xs text-muted-foreground">{note}</div>
            </div>
          ))}
        </dl>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-xs" aria-label="Unit economics per acre">
        <div className="border-b px-4 py-3">
          <h2 className="text-base font-semibold">Unit economics per acre</h2>
          <p className="text-xs text-muted-foreground">Gross Rs 3,600 = 2.0 t × Rs 1,800. Baler cost = lease/acre + Rs {ECON.balerOpexPerAcre} opex.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Line item</TableHead>
              <TableHead className="text-right">45-Day Seasonal</TableHead>
              <TableHead className="text-right">15-Day Peak</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(
              [
                ['Gross revenue', ECON.grossPerAcre, ECON.grossPerAcre],
                ['Farmer UPI share (5%)', -ECON.farmerSharePerAcre, -ECON.farmerSharePerAcre],
                ['Coordinator / referral pool', -ECON.coordinatorPerAcre, -ECON.coordinatorPerAcre],
                ['Baler lease + opex', -balerCostPerAcre('seasonal'), -balerCostPerAcre('peak')],
                [
                  `Transport & hub (field→hub ${ECON.transportBreakdownPerAcre.fieldToHub} + rent ${ECON.transportBreakdownPerAcre.hubRent} + hub→buyer ${ECON.transportBreakdownPerAcre.hubToFactory})`,
                  -ECON.transportHubPerAcre,
                  -ECON.transportHubPerAcre,
                ],
              ] as [string, number, number][]
            ).map(([label, a, b]) => (
              <TableRow key={label}>
                <TableCell>{label}</TableCell>
                <TableCell className={cn('text-right tabular-nums', a < 0 && 'text-muted-foreground')}>{fmtINR(a)}</TableCell>
                <TableCell className={cn('text-right tabular-nums', b < 0 && 'text-muted-foreground')}>{fmtINR(b)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-emerald-50 font-semibold">
              <TableCell>Platform net profit</TableCell>
              <TableCell className="text-right tabular-nums">{fmtINR(platformProfitPerAcre('seasonal'))}</TableCell>
              <TableCell className="text-right tabular-nums">{fmtINR(platformProfitPerAcre('peak'))}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </div>
  )
}