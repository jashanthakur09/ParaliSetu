'use client'

import * as React from 'react'
import { CheckCircle2, Copy, MessageCircle, Rocket, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ECON, fmtINR, formatDate } from '@/lib/economics'
import { translate, whatsappMessage } from '@/lib/i18n'
import type { BookingResult, Language } from '@/types/paralisetu'
import { LedgerTable } from './ledger-table'

export function BookingConfirmation({
  result,
  onClose,
  lang,
}: {
  result: BookingResult | null
  onClose: () => void
  lang: Language
}) {
  const [copied, setCopied] = React.useState<string | null>(null)
  const t = (k: string) => translate(lang, k)
  const waLang = lang === 'pa' ? 'pa' : 'en'

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(code)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      setCopied(null)
    }
  }

  return (
    <Dialog open={!!result} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] gap-4 overflow-y-auto sm:max-w-xl">
        {result && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="size-5 text-verified" aria-hidden="true" />
                {t('confirmedTitle')} · {result.bookingId}
              </DialogTitle>
              <DialogDescription>
                {result.totalAcres} acres booked in {result.villageName}. Pickup on{' '}
                <strong>{formatDate(result.pickupDate)}</strong>, moisture-safe under {ECON.moistureSafePct}%.
                Village total: {result.acresBefore} → {result.acresAfter} acres.
              </DialogDescription>
            </DialogHeader>

            {result.crossedThreshold && result.dispatch && (
              <div className="rounded-xl bg-forest p-4 text-white">
                <div className="flex items-center gap-2 font-semibold">
                  <Rocket className="size-5 text-verified" aria-hidden="true" />
                  {t('thresholdReached')}
                </div>
                <p className="mt-1.5 flex items-start gap-2 text-sm text-white/85">
                  <Truck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {result.dispatch.balerName
                    ? `${result.dispatch.balerName} is heading to ${result.villageName}.`
                    : 'All balers are busy; this village is first in the queue.'}{' '}
                  Straw goes to {result.dispatch.hubName} ({result.dispatch.hubDistanceKm} km) and appears as {result.dispatch.lotId} on the
                  Buyer Dashboard.
                </p>
              </div>
            )}

            {result.referral && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                Referral applied: {result.referral.referrerName} ({result.referral.code}) earns{' '}
                {fmtINR(result.totalAcres * ECON.coordinatorPerAcre)} for these acres.
              </p>
            )}

            <section className="space-y-3" aria-label="Referral codes">
              <h3 className="text-sm font-semibold">{t('yourCode')}</h3>
              {result.farmers.map((f) => {
                const message = whatsappMessage(waLang, {
                  name: f.name,
                  village: result.villageName,
                  acres: f.acres,
                  saved: fmtINR(f.acres * ECON.farmerClearingSavedPerAcre),
                  cash: fmtINR(f.acres * ECON.farmerSharePerAcre),
                  code: f.referralCode,
                })
                return (
                  <div key={f.referralCode} className="rounded-xl border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium">{f.name}</div>
                        <code className="text-base font-semibold tracking-wide text-forest">{f.referralCode}</code>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => copy(f.referralCode)}>
                          <Copy /> {copied === f.referralCode ? 'Copied' : t('copyCode')}
                        </Button>
                        <Button
                          size="sm"
                          nativeButton={false}
                          render={
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          }
                          className="bg-[#25D366] text-white hover:bg-[#1ebe5b]"
                        >
                          <MessageCircle /> {t('shareWhatsapp')}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2.5 rounded-lg bg-[#e7ffdb] p-2.5 text-sm leading-relaxed text-[#111b21]">
                      <div className="mb-1 text-[11px] font-medium text-[#667781]">{t('whatsappPreview')}</div>
                      {message}
                    </div>
                  </div>
                )
              })}
            </section>

            <section className="space-y-2" aria-label="Payout ledger">
              <h3 className="text-sm font-semibold">{t('ledgerTitle')}</h3>
              <LedgerTable payout={result.payout} />
            </section>

            <Button onClick={onClose} className="w-full bg-forest text-white hover:bg-forest-soft">
              {t('close')}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}