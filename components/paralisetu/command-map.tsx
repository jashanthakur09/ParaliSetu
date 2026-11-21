'use client'

import * as React from 'react'
import { Crosshair, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  buildDistrictCells,
  HARYANA_OUTLINE,
  MAP_BOUNDS,
  MAP_HEIGHT,
  MAP_WIDTH,
  outlinePath,
  project,
  PUNJAB_OUTLINE,
  PX_PER_KM,
} from '@/lib/geo'
import { ECON } from '@/lib/economics'
import { cn } from '@/lib/utils'
import { useParali } from './provider'

const AMBER = '#F59E0B'
const EMERALD = '#10B981'
const FIRE = '#EF4444'
const FOREST = '#143628'

type LayerKey = 'hotspots' | 'clusters' | 'balers' | 'hubs' | 'buyers'
type Selection = { kind: 'hotspot' | 'baler' | 'hub' | 'buyer'; id: string } | null

const LAYER_META: { key: LayerKey; label: string; swatch: string }[] = [
  { key: 'hotspots', label: 'NASA Fire Hotspots', swatch: FIRE },
  { key: 'clusters', label: 'Village Clusters', swatch: AMBER },
  { key: 'balers', label: 'Leased Balers', swatch: FOREST },
  { key: 'hubs', label: 'Storage Hubs', swatch: '#0f766e' },
  { key: 'buyers', label: 'Industrial Buyers (50 km)', swatch: '#475569' },
]

const MIN_ZOOM = 1
const MAX_ZOOM = 8

export function CommandMap() {
  const { hotspots, clusters, fleet, selectCluster } = useParali()
  const [layers, setLayers] = React.useState<Record<LayerKey, boolean>>({
    hotspots: true,
    clusters: true,
    balers: true,
    hubs: true,
    buyers: true,
  })
  const [view, setView] = React.useState({ k: 1, x: 0, y: 0 })
  const [selection, setSelection] = React.useState<Selection>(null)
  const svgRef = React.useRef<SVGSVGElement | null>(null)
  const drag = React.useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null)
  const justDragged = React.useRef(false)

  const cells = React.useMemo(() => buildDistrictCells(), [])
  const punjabPath = React.useMemo(() => outlinePath(PUNJAB_OUTLINE), [])
  const haryanaPath = React.useMemo(() => outlinePath(HARYANA_OUTLINE), [])

  const clampView = React.useCallback((k: number, x: number, y: number) => {
    const minX = MAP_WIDTH - MAP_WIDTH * k
    const minY = MAP_HEIGHT - MAP_HEIGHT * k
    return { k, x: Math.min(0, Math.max(minX, x)), y: Math.min(0, Math.max(minY, y)) }
  }, [])

  const zoomAt = React.useCallback(
    (factor: number, cx = MAP_WIDTH / 2, cy = MAP_HEIGHT / 2) => {
      setView((v) => {
        const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.k * factor))
        const ratio = k / v.k
        return clampView(k, cx - (cx - v.x) * ratio, cy - (cy - v.y) * ratio)
      })
    },
    [clampView],
  )

  React.useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = svg.getBoundingClientRect()
      const sx = MAP_WIDTH / rect.width
      zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, (e.clientX - rect.left) * sx, (e.clientY - rect.top) * sx)
    }
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return
    drag.current = { sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y, moved: false }
    const svg = svgRef.current!
    const scale = MAP_WIDTH / svg.getBoundingClientRect().width
    const move = (ev: PointerEvent) => {
      const d = drag.current
      if (!d) return
      const dx = ev.clientX - d.sx
      const dy = ev.clientY - d.sy
      if (!d.moved && Math.hypot(dx, dy) > 4) d.moved = true
      if (d.moved) setView((v) => clampView(v.k, d.ox + dx * scale, d.oy + dy * scale))
    }
    const up = () => {
      justDragged.current = !!drag.current?.moved
      drag.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setTimeout(() => (justDragged.current = false), 0)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const pick = (fn: () => void) => () => {
    if (!justDragged.current) fn()
  }

  const toggle = (key: LayerKey, value: boolean) => setLayers((l) => ({ ...l, [key]: value }))
  const inv = 1 / view.k

  const hub = (id: string) => fleet.hubs.find((h) => h.id === id)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-xl border bg-card px-3 py-2.5">
        {LAYER_META.map((l) => (
          <label key={l.key} className="flex cursor-pointer items-center gap-2 text-sm">
            <Switch
              size="sm"
              checked={layers[l.key]}
              onCheckedChange={(v: boolean) => toggle(l.key, v)}
              aria-label={`Toggle ${l.label}`}
            />
            <span className="size-2.5 rounded-full" style={{ background: l.swatch }} aria-hidden="true" />
            {l.label}
          </label>
        ))}
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border bg-[#e9f0ec] shadow-xs"
        style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="size-full cursor-grab touch-none select-none active:cursor-grabbing"
          onPointerDown={onPointerDown}
          role="img"
          aria-label="Interactive map of Punjab and Haryana with fire hotspots, village clusters, balers, hubs and buyers"
        >
          <defs>
            <clipPath id="region-clip">
              <path d={punjabPath} />
              <path d={haryanaPath} />
            </clipPath>
          </defs>
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#dfe9e4" />

          <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
            <path d={haryanaPath} fill="#f4f1e6" />
            <path d={punjabPath} fill="#f8f6ec" />

            <g clipPath="url(#region-clip)">
              {cells.map((c) => (
                <polygon
                  key={c.name}
                  points={c.points}
                  fill="none"
                  stroke="#9fb3a8"
                  strokeWidth={1 / view.k}
                  strokeDasharray={`${4 / view.k} ${3 / view.k}`}
                />
              ))}
            </g>
            <path d={haryanaPath} fill="none" stroke="#6b8579" strokeWidth={2 / view.k} />
            <path d={punjabPath} fill="none" stroke={FOREST} strokeWidth={2.5 / view.k} />

            <Graticule inv={inv} />

            {cells
              .filter((c) => c.cy > 0 && c.cy < MAP_HEIGHT)
              .map((c) => (
                <text
                  key={c.name}
                  x={c.cx}
                  y={c.cy}
                  textAnchor="middle"
                  fontSize={(c.major ? 12 : 10) * inv}
                  fontWeight={c.major ? 600 : 400}
                  fill="#52665c"
                  opacity={c.major ? 0.85 : 0.6}
                  letterSpacing={1.2 * inv}
                  className="pointer-events-none uppercase"
                >
                  {c.name}
                </text>
              ))}
            <text x={project({ lat: 31.7, lng: 75.9 }).x} y={project({ lat: 31.7, lng: 75.9 }).y} fontSize={22 * inv} fill={FOREST} opacity={0.18} fontWeight={700} letterSpacing={6 * inv} className="pointer-events-none">
              PUNJAB
            </text>
            <text x={project({ lat: 29.75, lng: 76.3 }).x} y={project({ lat: 29.75, lng: 76.3 }).y} fontSize={22 * inv} fill={FOREST} opacity={0.18} fontWeight={700} letterSpacing={6 * inv} className="pointer-events-none">
              HARYANA
            </text>

            {layers.buyers &&
              fleet.buyers.map((b) => {
                const p = project(b)
                return (
                  <circle
                    key={`ring-${b.id}`}
                    cx={p.x}
                    cy={p.y}
                    r={ECON.maxHubToBuyerKm * PX_PER_KM}
                    fill="#47556914"
                    stroke="#475569"
                    strokeWidth={1.5 * inv}
                    strokeDasharray={`${6 * inv} ${5 * inv}`}
                  />
                )
              })}

            {layers.hubs &&
              layers.clusters &&
              clusters.map((c) => {
                const h = hub(c.hubId)
                if (!h) return null
                const a = project(c)
                const b = project(h)
                return (
                  <line
                    key={`link-${c.id}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={c.status === 'dispatched' ? EMERALD : AMBER}
                    strokeWidth={1.5 * inv}
                    strokeDasharray={`${3 * inv} ${3 * inv}`}
                    opacity={0.8}
                  />
                )
              })}

            {layers.hubs &&
              layers.buyers &&
              fleet.hubs.map((h) => {
                const buyers = fleet.buyers
                  .map((b) => ({ b, d: Math.hypot(project(b).x - project(h).x, project(b).y - project(h).y) / PX_PER_KM }))
                  .filter((r) => r.d <= ECON.maxHubToBuyerKm)
                return buyers.map(({ b }) => {
                  const a = project(h)
                  const z = project(b)
                  return <line key={`hb-${h.id}-${b.id}`} x1={a.x} y1={a.y} x2={z.x} y2={z.y} stroke="#475569" strokeWidth={1.5 * inv} opacity={0.55} />
                })
              })}

            {layers.hotspots &&
              hotspots.map((h) => {
                const p = project(h)
                const active = selection?.kind === 'hotspot' && selection.id === h.id
                return (
                  <g
                    key={h.id}
                    transform={`translate(${p.x} ${p.y}) scale(${inv})`}
                    onClick={pick(() => setSelection({ kind: 'hotspot', id: h.id }))}
                    className="cursor-pointer"
                  >
                    <circle r={5} fill={FIRE} className="hotspot-pulse" />
                    <circle r={active ? 6 : 4.5} fill={FIRE} stroke="#fff" strokeWidth={1.2} />
                  </g>
                )
              })}

            {layers.hubs &&
              fleet.hubs.map((h) => {
                const p = project(h)
                const pct = Math.min(1, h.storedTonnes / h.capacityTonnes)
                return (
                  <g
                    key={h.id}
                    transform={`translate(${p.x} ${p.y}) scale(${inv})`}
                    onClick={pick(() => setSelection({ kind: 'hub', id: h.id }))}
                    className="cursor-pointer"
                  >
                    <rect x={-11} y={-11} width={22} height={22} rx={5} fill="#0f766e" stroke="#fff" strokeWidth={2} />
                    <path d="M-6 3 V-3 L0 -7 L6 -3 V3 Z" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
                    <rect x={-16} y={14} width={32} height={5} rx={2.5} fill="#fff" stroke="#0f766e" strokeWidth={1} />
                    <rect x={-15} y={15} width={30 * pct} height={3} rx={1.5} fill={pct > 0.8 ? AMBER : EMERALD} />
                    <text y={31} textAnchor="middle" fontSize={10} fontWeight={600} fill="#0f766e" stroke="#fff" strokeWidth={3} paintOrder="stroke">
                      {Math.round(pct * 100)}% full
                    </text>
                  </g>
                )
              })}

            {layers.buyers &&
              fleet.buyers.map((b) => {
                const p = project(b)
                return (
                  <g
                    key={b.id}
                    transform={`translate(${p.x} ${p.y}) scale(${inv})`}
                    onClick={pick(() => setSelection({ kind: 'buyer', id: b.id }))}
                    className="cursor-pointer"
                  >
                    <rect x={-9} y={-9} width={18} height={18} rx={3} transform="rotate(45)" fill="#334155" stroke="#fff" strokeWidth={2} />
                    <text y={-17} textAnchor="middle" fontSize={10} fontWeight={600} fill="#334155" stroke="#fff" strokeWidth={3} paintOrder="stroke">
                      {b.type}
                    </text>
                  </g>
                )
              })}

            {layers.clusters &&
              clusters.map((c) => {
                const p = project(c)
                const colour = c.status === 'dispatched' ? EMERALD : AMBER
                const r = 11
                const circ = 2 * Math.PI * (r + 4)
                return (
                  <g
                    key={c.id}
                    transform={`translate(${p.x} ${p.y}) scale(${inv})`}
                    onClick={pick(() => selectCluster(c.id))}
                    className="cursor-pointer"
                    role="button"
                    aria-label={`${c.name}, ${c.totalAcres} of 20 acres, ${c.status === 'dispatched' ? 'machine dispatched' : 'gathering demand'}`}
                  >
                    <circle r={r + 4} fill="#fff" fillOpacity={0.85} stroke="#d1d9d5" strokeWidth={1} />
                    <circle
                      r={r + 4}
                      fill="none"
                      stroke={colour}
                      strokeWidth={3}
                      strokeDasharray={`${circ * (c.progressPct / 100)} ${circ}`}
                      transform="rotate(-90)"
                      strokeLinecap="round"
                    />
                    <circle r={r - 2} fill={colour} />
                    <text y={3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">
                      {Math.round(c.totalAcres)}
                    </text>
                    <text y={r + 17} textAnchor="middle" fontSize={11} fontWeight={600} fill={FOREST} stroke="#fff" strokeWidth={3.5} paintOrder="stroke">
                      {c.name}
                    </text>
                  </g>
                )
              })}

            {layers.balers &&
              fleet.balers.map((b) => {
                const p = project(b)
                const working = b.status === 'working'
                return (
                  <g
                    key={b.id}
                    transform={`translate(${p.x + 22 * inv} ${p.y - 20 * inv}) scale(${inv})`}
                    onClick={pick(() => setSelection({ kind: 'baler', id: b.id }))}
                    className="cursor-pointer"
                  >
                    <rect x={-10} y={-8} width={20} height={16} rx={4} fill={FOREST} stroke={working ? EMERALD : '#94a3b8'} strokeWidth={2.5} />
                    <text y={3.5} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">
                      {b.name.replace('Baler ', '')}
                    </text>
                  </g>
                )
              })}
          </g>
        </svg>

        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <Button size="icon" variant="outline" className="bg-white" onClick={() => zoomAt(1.4)} aria-label="Zoom in">
            <Plus />
          </Button>
          <Button size="icon" variant="outline" className="bg-white" onClick={() => zoomAt(1 / 1.4)} aria-label="Zoom out">
            <Minus />
          </Button>
          <Button size="icon" variant="outline" className="bg-white" onClick={() => setView({ k: 1, x: 0, y: 0 })} aria-label="Reset view">
            <Crosshair />
          </Button>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border bg-white/90 px-2.5 py-2 text-[11px] leading-5 shadow-xs backdrop-blur">
          <Legend colour={AMBER} label="Gathering Demand (<20 acres)" />
          <Legend colour={EMERALD} label="Machine Dispatched (≥20 acres)" />
          <Legend colour={FIRE} label="NASA FIRMS fire hotspot" />
          <div className="mt-1 text-muted-foreground">
            {MAP_BOUNDS.latMin}°N–{MAP_BOUNDS.latMax}°N · {MAP_BOUNDS.lngMin}°E–{MAP_BOUNDS.lngMax}°E · zoom {view.k.toFixed(1)}×
          </div>
        </div>
      </div>

      <SelectionCard selection={selection} onClose={() => setSelection(null)} />
    </div>
  )
}

function Legend({ colour, label }: { colour: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-2.5 rounded-full" style={{ background: colour }} aria-hidden="true" />
      {label}
    </div>
  )
}

function Graticule({ inv }: { inv: number }) {
  const lines: React.ReactNode[] = []
  for (let lat = Math.ceil(MAP_BOUNDS.latMin * 2) / 2; lat <= MAP_BOUNDS.latMax; lat += 0.5) {
    const y = project({ lat, lng: MAP_BOUNDS.lngMin }).y
    lines.push(
      <line key={`lat-${lat}`} x1={0} x2={MAP_WIDTH} y1={y} y2={y} stroke="#b7c7be" strokeWidth={0.7 * inv} opacity={0.7} />,
      <text key={`lat-t-${lat}`} x={6 * inv} y={y - 3 * inv} fontSize={9 * inv} fill="#6b8579" className="pointer-events-none">
        {lat.toFixed(1)}°N
      </text>,
    )
  }
  for (let lng = Math.ceil(MAP_BOUNDS.lngMin); lng <= MAP_BOUNDS.lngMax; lng += 1) {
    const x = project({ lat: MAP_BOUNDS.latMax, lng }).x
    lines.push(
      <line key={`lng-${lng}`} y1={0} y2={MAP_HEIGHT} x1={x} x2={x} stroke="#b7c7be" strokeWidth={0.7 * inv} opacity={0.7} />,
      <text key={`lng-t-${lng}`} x={x + 4 * inv} y={MAP_HEIGHT - 6 * inv} fontSize={9 * inv} fill="#6b8579" className="pointer-events-none">
        {lng}°E
      </text>,
    )
  }
  return <g>{lines}</g>
}

function SelectionCard({ selection, onClose }: { selection: Selection; onClose: () => void }) {
  const { hotspots, fleet } = useParali()
  if (!selection) {
    return (
      <p className="rounded-xl border border-dashed bg-card/60 px-3 py-2.5 text-sm text-muted-foreground">
        Tap any pin for details. Village pins open the cluster sheet; drag to pan and scroll or use the buttons to zoom.
      </p>
    )
  }

  let title = ''
  let rows: [string, string][] = []
  let accent = FOREST

  if (selection.kind === 'hotspot') {
    const h = hotspots.find((x) => x.id === selection.id)
    if (!h) return null
    title = `Fire hotspot ${h.id}`
    accent = FIRE
    rows = [
      ['District', h.district],
      ['Fire radiative power', `${h.frpMw} MW`],
      ['Confidence', h.confidence],
      ['Satellite pass', `${h.satellite} · ${h.acquiredAt}`],
      ['Coordinates', `${h.lat.toFixed(3)}°N, ${h.lng.toFixed(3)}°E`],
    ]
  } else if (selection.kind === 'hub') {
    const h = fleet.hubs.find((x) => x.id === selection.id)
    if (!h) return null
    title = h.name
    accent = '#0f766e'
    rows = [
      ['District', h.district],
      ['Stored straw', `${h.storedTonnes} t of ${h.capacityTonnes} t`],
      ['Geo-fence', `Villages ≤ ${ECON.maxVillageToHubKm} km · Buyers ≤ ${ECON.maxHubToBuyerKm} km`],
    ]
  } else if (selection.kind === 'buyer') {
    const b = fleet.buyers.find((x) => x.id === selection.id)
    if (!b) return null
    title = b.name
    accent = '#334155'
    rows = [
      ['Type', b.type],
      ['District', b.district],
      ['Standard price', '₹1,800 / tonne (moisture < 20%)'],
    ]
  } else {
    const b = fleet.balers.find((x) => x.id === selection.id)
    if (!b) return null
    title = `${b.name} · ${ECON.leases[b.leaseType].label}`
    rows = [
      ['Status', b.status === 'working' ? 'Working a dispatched cluster' : 'Idle — ready to dispatch'],
      ['Capacity', `${ECON.balerAcresPerDay} acres/day (~${ECON.balerTonnesPerDay} t)`],
    ]
  }

  return (
    <div className="rounded-xl border bg-card p-3 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <span className="size-2.5 rounded-full" style={{ background: accent }} aria-hidden="true" />
          {title}
        </h3>
        <button type="button" onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">
          Dismiss
        </button>
      </div>
      <dl className={cn('mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2')}>
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-dashed py-1 last:border-0 sm:block sm:border-0">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}