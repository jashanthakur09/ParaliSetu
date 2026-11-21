export const ECON = {
  dispatchThresholdAcres: 20,
  strawYieldPerAcre: 2.0,
  buyerRatePerTonne: 1800,
  grossPerAcre: 3600,
  farmerSharePct: 0.05,
  farmerPayoutPerAcre: 180,
  coordinatorPerAcre: 120,
  transportHubPerAcre: 1100,
  balerSeasonalPerAcre: 1400,
  balerPeakPerAcre: 1436,
  farmerClearingSavedPerAcre: 4000,
  co2AvoidedPerTonne: 1.46,
  pm25PreventedKgPerTonne: 3.0,
};

export function fmtINR(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function fmtNum(val: number, decimals: number = 0): string {
  return Number(val).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr || todayISO());
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function pickupDateFor(harvestDateStr: string): string {
  // 3-day moisture drying buffer
  return addDays(harvestDateStr, 3);
}
