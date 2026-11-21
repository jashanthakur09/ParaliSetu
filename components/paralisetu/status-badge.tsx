import { CheckCircle2, Hourglass } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ClusterStatus } from '@/types/paralisetu'

export function StatusBadge({ status, className }: { status: ClusterStatus; className?: string }) {
  if (status === 'dispatched') {
    return (
      <Badge className={cn('gap-1 bg-verified text-white hover:bg-verified', className)}>
        <CheckCircle2 /> Machine Dispatched
      </Badge>
    )
  }
  return (
    <Badge className={cn('gap-1 bg-harvest text-amber-950 hover:bg-harvest', className)}>
      <Hourglass /> Gathering Demand
    </Badge>
  )
}