import type { Cluster, Fleet, Lot, BookingResult, SettlementResult, ImpactMetrics } from '@/types/paralisetu';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchClusters(): Promise<{ clusters: Cluster[] }> {
  const res = await fetch(`${API_BASE}/clusters`);
  if (!res.ok) throw new Error('Failed to fetch clusters');
  return res.json();
}

export async function fetchFleet(): Promise<Fleet> {
  const res = await fetch(`${API_BASE}/fleet`);
  if (!res.ok) throw new Error('Failed to fetch fleet');
  return res.json();
}

export async function fetchLots(): Promise<{ lots: Lot[] }> {
  const res = await fetch(`${API_BASE}/lots`);
  if (!res.ok) throw new Error('Failed to fetch lots');
  return res.json();
}

export async function submitBooking(payload: any): Promise<BookingResult> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit booking');
  }
  return res.json();
}

export async function settleLot(lotId: string, leaseType: string = '45_day_seasonal'): Promise<SettlementResult> {
  const res = await fetch(`${API_BASE}/lots/${lotId}/reserve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lease_type: leaseType }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to reserve lot');
  }
  const data = await res.json();
  return data.settlement;
}

export async function fetchImpact(): Promise<ImpactMetrics> {
  const res = await fetch(`${API_BASE}/impact`);
  if (!res.ok) throw new Error('Failed to fetch impact');
  return res.json();
}

export async function resetDemo(): Promise<void> {
  await fetch(`${API_BASE}/reset`, { method: 'POST' });
}
