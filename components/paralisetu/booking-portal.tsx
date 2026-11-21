'use client'

import * as React from 'react'
import { CalendarCheck, Droplets, Loader2, Plus, Rocket, Trash2, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ECON, addDays, fmtINR, fmtNum, formatDate, pickupDateFor, todayISO } from '@/lib/economics'
import { cn } from '@/lib/utils'
import type { BookingMode, BookingResult } from '@/types/paralisetu'
import { BookingConfirmation } from './booking-confirmation'
import { useParali } from './provider'

interface FarmerRow {
  key: number
  name: string
  phone: string
  acres: string
  harvestDate: string
}

let rowKey = 0
const blankRow = (): FarmerRow => ({
  key: ++rowKey,
  name: '',
  phone: '',
  acres: '',
  harvestDate: addDays(todayISO(), -1),
})

const nativeSelect =
  'h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function BookingPortal() {
  const { clusters, bookingVillageId, setBookingVillageId, submitBooking, t, lang } = useParali()
  const [mode, setMode] = React.useState<BookingMode>('individual')
  const [captainName, setCaptainName] = React.useState('')
  const [rows, setRows] = React.useState<FarmerRow[]>(() => [blankRow()])
  const [referral, setReferral] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [result, setResult] = React.useState<BookingResult | null>(null)

  const village = clusters.find((c) => c.id === bookingVillageId) ?? clusters[0]

  const switchMode = (m: BookingMode) => {
    setMode(m)
    setError(null)
    setRows((r) => (m === 'individual' ? r.slice(0, 1) : r))
    if (m === 'captain') setReferral('')
  }

  const updateRow = (key: number, patch: Partial<FarmerRow>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)))

  const newAcres = rows.reduce((s, r) => s + (parseFloat(r.acres) > 0 ? parseFloat(r.acres) : 0), 0)
  const latestHarvest = rows.reduce<string>((acc, r) => (r.harvestDate > acc ? r.harvestDate : acc), village?.latestHarvestDate ?? '')
  const projectedPickup = latestHarvest ? pickupDateFor(latestHarvest) : null
  const projectedTotal = (village?.totalAcres ?? 0) + newAcres
  const willDispatch = village?.status === 'gathering' && projectedTotal >= ECON.dispatchThresholdAcres
  const projectedPct = Math.min(100, (projectedTotal / ECON.dispatchThresholdAcres) * 100)

  const saved = newAcres * ECON.farmerClearingSavedPerAcre
  const cashback = newAcres * ECON.farmerSharePerAcre
  const coordinatorPool = newAcres * ECON.coordinatorPerAcre

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const res = await submitBooking({
        villageId: bookingVillageId,
        mode,
        captainName: mode === 'captain' ? captainName.trim() || undefined : undefined,
        referredBy: mode === 'individual' && referral.trim() ? referral.trim() : undefined,
        farmers: rows.map((r) => ({
          name: r.name,
          phone: r.phone,
          acres: parseFloat(r.acres),
          harvestDate: r.harvestDate,
        })),
      })
      setResult(res)
      setRows([blankRow()])
      setReferral('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  if (!village) return null

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border bg-card p-4 shadow-xs md:p-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-balance">{t('portalTitle')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('portalSub')}</p>
        </div>

        <div role="radiogroup" aria-label="Booking mode" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
          {(['individual', 'captain'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => switchMode(m)}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                mode === m ? 'bg-card text-forest shadow-xs' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {m === 'captain' ? t('modeCaptain') : t('modeIndividual')}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="village">{t('village')}</Label>
            <select
              id="village"
              className={nativeSelect}
              value={bookingVillageId}
              onChange={(e) => setBookingVillageId(e.target.value)}
            >
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.district} ({fmtNum(c.totalAcres, 1)}/20 ac)
                </option>
              ))}
            </select>
          </div>
          {mode === 'captain' && (
            <div className="space-y-1.5">
              <Label htmlFor="captain">{t('captainName')}</Label>
              <Input id="captain" value={captainName} onChange={(e) => setCaptainName(e.target.value)} placeholder="e.g. Harjinder Kaur" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          {rows.map((r, idx) => (
            <fieldset key={r.key} className="rounded-xl border bg-background p-3">
              <legend className="px-1 text-xs font-medium text-muted-foreground">
                {mode === 'captain' ? `Farmer ${idx + 1}` : 'Your details'}
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`n-${r.key}`}>{t('farmerName')}</Label>
                  <Input id={`n-${r.key}`} required value={r.name} onChange={(e) => updateRow(r.key, { name: e.target.value })} autoComplete="name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`p-${r.key}`}>{t('phone')}</Label>
                  <Input
                    id={`p-${r.key}`}
                    required
                    inputMode="numeric"
                    maxLength={10}
                    pattern="\d{10}"
                    placeholder="10-digit mobile"
                    value={r.phone}
                    onChange={(e) => updateRow(r.key, { phone: e.target.value.replace(/\D/g, '') })}
                    autoComplete="tel"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`a-${r.key}`}>{t('acres')}</Label>
                  <Input
                    id={`a-${r.key}`}
                    required
                    type="number"
                    inputMode="decimal"
                    min="0.5"
                    step="0.5"
                    value={r.acres}
                    onChange={(e) => updateRow(r.key, { acres: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`h-${r.key}`}>{t('harvestDate')}</Label>
                  <Input id={`h-${r.key}`} required type="date" value={r.harvestDate} onChange={(e) => updateRow(r.key, { harvestDate: e.target.value })} />
                </div>
              </div>
              {mode === 'captain' && rows.length > 1 && (
                <Button type="button" variant="ghost" size="sm" className="mt-2 text-destructive" onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))}>
                  <Trash2 /> {t('removeFarmer')}
                </Button>
              )}
            </fieldset>
          ))}
          {mode === 'captain' && (
            <Button type="button" variant="outline" onClick={() => setRows((rs) => [...rs, blankRow()])}>
              <Plus /> {t('addFarmer')}
            </Button>
          )}
        </div>

        {mode === 'individual' ? (
          <div className="space-y-1.5">
            <Label htmlFor="referral">{t('referral')}</Label>
            <Input id="referral" value={referral} onChange={(e) => setReferral(e.target.value.toUpperCase())} placeholder="e.g. KHERI-101" />
            <p className="text-xs text-muted-foreground">{t('referralHint')}</p>
          </div>
        ) : (
          <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <Users className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {t('referralLocked')}
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={busy} className="h-11 w-full bg-forest text-base text-white hover:bg-forest-soft">
          {busy && <Loader2 className="animate-spin" />}
          {mode === 'captain' ? t('submitCaptain') : t('submitIndividual')}
        </Button>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start" aria-label="Live booking preview">
        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <h3 className="text-sm font-semibold">{t('swingTitle')}</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label={t('clearingCost')} value={<span className="font-semibold text-emerald-700">{fmtINR(0)} — free</span>} />
            <Row label={t('clearingSaved')} value={fmtINR(saved)} />
            <Row label={t('upiCashback')} value={fmtINR(cashback)} />
            <Row label={t('referralPotential')} value={fmtINR(coordinatorPool)} muted />
          </dl>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-forest px-3 py-2.5 text-white">
            <span className="text-sm">{t('swingTotal')}</span>
            <span className="text-xl font-semibold tabular-nums">{fmtINR(saved + cashback)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Rs 4,000/acre clearing cost avoided + Rs 180/acre revenue share. Rs 120/acre goes to the coordinator, not the farmer.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {t('progressTitle')} · {village.name}
            </h3>
            <Badge variant="outline">{village.district}</Badge>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-2xl font-semibold tabular-nums">{fmtNum(projectedTotal, 1)}</span>
            <span className="text-sm text-muted-foreground">of {ECON.dispatchThresholdAcres} acres</span>
          </div>
          <Progress
            value={projectedPct}
            className="mt-2 gap-0 [&_[data-slot=progress-track]]:h-2.5"
            indicatorClassName={willDispatch || village.status === 'dispatched' ? 'bg-verified' : 'bg-harvest'}
            aria-label="Projected acres toward dispatch"
          />
          <p className={cn('mt-2 flex items-start gap-1.5 text-sm', willDispatch ? 'font-medium text-emerald-700' : 'text-muted-foreground')}>
            {willDispatch && <Rocket className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
            {village.status === 'dispatched'
              ? 'Machine already dispatched — new acres join this lot.'
              : willDispatch
                ? t('willDispatch')
                : `${fmtNum(Math.max(0, ECON.dispatchThresholdAcres - projectedTotal), 1)} ${t('acresNeeded')}`}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3 text-sm">
            <CalendarCheck className="size-4 text-forest" aria-hidden="true" />
            <span className="text-muted-foreground">{t('pickupOn')}:</span>
            <span className="font-semibold">{projectedPickup ? formatDate(projectedPickup) : '—'}</span>
            <Badge className="gap-1 bg-verified/15 text-emerald-800 hover:bg-verified/15">
              <Droplets /> {t('moistureSafe')}
            </Badge>
          </div>
        </div>
      </aside>

      <BookingConfirmation result={result} onClose={() => setResult(null)} lang={lang} />
    </div>
  )
}

function Row({ label, value, muted }: { label: string; value: React.ReactNode; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={cn(muted && 'text-muted-foreground')}>{label}</dt>
      <dd className={cn('font-medium tabular-nums', muted && 'text-muted-foreground')}>{value}</dd>
    </div>
  )
}