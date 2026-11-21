'use client';

import * as React from 'react';
import type { Cluster, Fleet, Lot, ImpactMetrics, BookingResult, SettlementResult } from '@/types/paralisetu';
import * as api from '@/lib/api';

export type TabKey = 'map' | 'booking' | 'buyers' | 'economics';

interface ParaliContextType {
  ready: boolean;
  tab: TabKey;
  setTab: (tab: TabKey) => void;
  lang: string;
  setLang: (lang: string) => void;
  clusters: Cluster[];
  selectedClusterId: string | null;
  selectCluster: (id: string) => void;
  bookingVillageId: string;
  setBookingVillageId: (id: string) => void;
  fleet: Fleet;
  lots: Lot[];
  impact: ImpactMetrics | null;
  submitBooking: (payload: any) => Promise<BookingResult>;
  settleLot: (lotId: string) => Promise<SettlementResult>;
  refresh: () => Promise<void>;
  t: (key: string) => string;
}

const ParaliContext = React.createContext<ParaliContextType | null>(null);

export function ParaliProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  const [tab, setTab] = React.useState<TabKey>('map');
  const [lang, setLang] = React.useState('en');
  const [clusters, setClusters] = React.useState<Cluster[]>([]);
  const [selectedClusterId, setSelectedClusterId] = React.useState<string | null>(null);
  const [bookingVillageId, setBookingVillageId] = React.useState<string>('CL-001');
  const [fleet, setFleet] = React.useState<Fleet>({ balers: [], storage_hubs: [], buyers: [], hubs: [] });
  const [lots, setLots] = React.useState<Lot[]>([]);
  const [impact, setImpact] = React.useState<ImpactMetrics | null>(null);

  const normalizeClusters = (raw: Cluster[]): Cluster[] => {
    return raw.map((c) => ({
      ...c,
      name: c.village || c.name || '',
      totalAcres: c.total_booked_acres ?? c.totalAcres ?? 0,
      progressPct: Math.min(100, Math.round(((c.total_booked_acres ?? 0) / (c.threshold_acres || 20)) * 100)),
      status: (c.status === 'Machine Dispatched' ? 'dispatched' : 'gathering') as any,
      latestHarvestDate: c.latest_harvest_date || '',
    }));
  };

  const normalizeLots = (raw: Lot[]): Lot[] => {
    return raw.map((l) => ({
      ...l,
      status: (l.status === 'Ready for Pickup' ? 'available' : 'sold') as any,
    }));
  };

  const loadData = React.useCallback(async () => {
    try {
      const [cRes, fRes, lRes, imp] = await Promise.all([
        api.fetchClusters().catch(() => ({ clusters: [] })),
        api.fetchFleet().catch(() => ({ balers: [], storage_hubs: [], buyers: [] })),
        api.fetchLots().catch(() => ({ lots: [] })),
        api.fetchImpact().catch(() => null),
      ]);

      const normalizedClusters = normalizeClusters(cRes.clusters);
      setClusters(normalizedClusters);

      const hubs = (fRes.storage_hubs || []).map((h) => ({
        ...h,
        storedTonnes: h.current_tonnes,
        capacityTonnes: h.capacity_tonnes,
      }));

      setFleet({
        ...fRes,
        hubs,
      });

      setLots(normalizeLots(lRes.lots));
      setImpact(imp);
      if (normalizedClusters.length > 0 && !selectedClusterId) {
        setSelectedClusterId(normalizedClusters[0].id);
        setBookingVillageId(normalizedClusters[0].id);
      }
    } catch (e) {
      console.error('Failed to load ParaliSetu data:', e);
    } finally {
      setReady(true);
    }
  }, [selectedClusterId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const submitBooking = async (payload: any): Promise<BookingResult> => {
    const res = await api.submitBooking(payload);
    await loadData();
    return res;
  };

  const settleLot = async (lotId: string): Promise<SettlementResult> => {
    const res = await api.settleLot(lotId);
    await loadData();
    return res;
  };

  const t = (key: string) => key;

  return (
    <ParaliContext.Provider
      value={{
        ready,
        tab,
        setTab,
        lang,
        setLang,
        clusters,
        selectedClusterId,
        selectCluster: setSelectedClusterId,
        bookingVillageId,
        setBookingVillageId,
        fleet,
        lots,
        impact,
        submitBooking,
        settleLot,
        refresh: loadData,
        t,
      }}
    >
      {children}
    </ParaliContext.Provider>
  );
}

export function useParali() {
  const ctx = React.useContext(ParaliContext);
  if (!ctx) throw new Error('useParali must be used within ParaliProvider');
  return ctx;
}
