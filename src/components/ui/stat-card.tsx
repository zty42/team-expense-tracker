import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatTone = 'warm' | 'sage' | 'sky' | 'rose' | 'stone'

const toneClasses: Record<StatTone, string> = {
  warm: 'border-orange-200/80 bg-gradient-to-br from-orange-50 to-amber-50 text-orange-950',
  sage: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-lime-50 text-emerald-950',
  sky: 'border-sky-200/80 bg-gradient-to-br from-sky-50 to-cyan-50 text-sky-950',
  rose: 'border-rose-200/80 bg-gradient-to-br from-rose-50 to-pink-50 text-rose-950',
  stone: 'border-stone-200/80 bg-gradient-to-br from-stone-50 to-orange-50 text-stone-950'
}

interface StatCardProps {
  label: string
  value: ReactNode
  description?: string
  icon?: LucideIcon
  tone?: StatTone
  className?: string
}

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone = 'stone',
  className
}: StatCardProps) {
  return (
    <div className={cn('rounded-[20px] border p-4 shadow-[0_8px_22px_rgba(118,86,58,0.07)]', toneClasses[tone], className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-current/70">{label}</p>
          <div className="text-[1.75rem] font-semibold tracking-tight">{value}</div>
          {description && (
            <p className="text-sm leading-5 text-current/65">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-[16px] bg-white/70 shadow-sm">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  )
}

export type { StatTone }
