'use client'

import * as React from 'react'
import {
  createBooking,
  getBulkLots,
  getClusters,
  getFleet,
  getHotspots,
  getImpactSummary,
  reserveBulkLot,
  resetDemo,
} from '@/lib/api'
import { translate } from '@/lib/i18n'
import type {
  BookingPayload,
  BookingResult,
  BulkLot,
  ClusterView,
  FleetSnapshot,
  Hotspot,
  ImpactSummary,
  Language,
  SettlementResult,
} from '@/types/paralisetu'

export type TabKey = 'map' | 'booking' | 'buyers' | 'economics'

interface ParaliContextValue {
  ready: boolean
  hotspots: Hotspot[]
  clusters: ClusterView[]
  fleet: FleetSnapshot
  lots: BulkLot[]
  impact: ImpactSummary | null
  lang: Language
  setLang: (l: Language) => void
  t: (key: string) => string
  tab: TabKey
  setTab: (t: TabKey) => void
  selectedClusterId: string | null
  selectCluster: (id: string | null) => void
  bookingVillageId: string
  setBookingVillageId: (id: string) => void
  goBookVillage: (id: string) => void
  submitBooking: (payload: BookingPayload) => Promise<BookingResult>
  settleLot: (lotId: string) => Promise<SettlementResult>
  reset: () => Promise<void>
}

const ParaliContext = React.createContext<ParaliContextValue | null>(null)

const EMPTY_FLEET: FleetSnapshot = { balers: [], hubs: [], buyers: [] }

export function ParaliProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false)
  const [hotspots, setHotspots] = React.useState<Hotspot[]>([])
  const [clusters, setClusters] = React.useState<ClusterView[]>([])
  const [fleet, setFleet] = React.useState<FleetSnapshot>(EMPTY_FLEET)
  const [lots, setLots] = React.useState<BulkLot[]>([])
  const [impact, setImpact] = React.useState<ImpactSummary | null>(null)
  const [lang, setLang] = React.useState<Language>('en')
  const [tab, setTab] = React.useState<TabKey>('map')
  const [selectedClusterId, setSelectedClusterId] = React.useState<string | null>(null)
  const [bookingVillageId, setBookingVillageId] = React.useState('C-KHERI')

  const refresh = React.useCallback(async () => {
    const [c, f, l, i] = await Promise.all([getClusters(), getFleet(), getBulkLots(), getImpactSummary()])
    setClusters(c)
    setFleet(f)
    setLots(l)
    setImpact(i)
  }, [])

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      const h = await getHotspots()
      await refresh()
      if (!cancelled) {
        setHotspots(h)
        setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refresh])

  const submitBooking = React.useCallback(
    async (payload: BookingPayload) => {
      const result = await createBooking(payload)
      await refresh()
      return result
    },
    [refresh],
  )

  const settleLot = React.useCallback(
    async (lotId: string) => {
      const result = await reserveBulkLot(lotId)
      await refresh()
      return result
    },
    [refresh],
  )

  const reset = React.useCallback(async () => {
    await resetDemo()
    setSelectedClusterId(null)
    setBookingVillageId('C-KHERI')
    await refresh()
  }, [refresh])

  const goBookVillage = React.useCallback((id: string) => {
    setBookingVillageId(id)
    setSelectedClusterId(null)
    setTab('booking')
  }, [])

  const t = React.useCallback((key: string) => translate(lang, key), [lang])

  const value = React.useMemo<ParaliContextValue>(
    () => ({
      ready,
      hotspots,
      clusters,
      fleet,
      lots,
      impact,
      lang,
      setLang,
      t,
      tab,
      setTab,
      selectedClusterId,
      selectCluster: setSelectedClusterId,
      bookingVillageId,
      setBookingVillageId,
      goBookVillage,
      submitBooking,
      settleLot,
      reset,
    }),
    [ready, hotspots, clusters, fleet, lots, impact, lang, t, tab, selectedClusterId, bookingVillageId, goBookVillage, submitBooking, settleLot, reset],
  )

  return <ParaliContext.Provider value={value}>{children}</ParaliContext.Provider>
}

export function useParali() {
  const ctx = React.useContext(ParaliContext)
  if (!ctx) throw new Error('useParali must be used within ParaliProvider')
  return ctx
}