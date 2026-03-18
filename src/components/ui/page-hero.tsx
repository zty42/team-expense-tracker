import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { StatCard, type StatTone } from '@/components/ui/stat-card'

interface HeroStat {
  label: string
  value: ReactNode
  description?: string
  icon?: LucideIcon
  tone?: StatTone
}

interface PageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  stats?: HeroStat[]
  children?: ReactNode
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  stats,
  children
}: PageHeroProps) {
  return (
    <section className="app-panel relative overflow-hidden p-5 md:p-6">
      <div className="absolute -right-12 top-0 h-32 w-32 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="absolute bottom-0 left-10 h-24 w-24 rounded-full bg-emerald-200/25 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-2.5">
            {eyebrow && (
              <div className="inline-flex items-center rounded-full bg-white/75 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
                {eyebrow}
              </div>
            )}
            <div className="space-y-1.5">
              <h1 className="text-[1.9rem] font-semibold tracking-tight text-foreground md:text-[2.35rem]">
                {title}
              </h1>
              {description && (
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-[15px]">
                  {description}
                </p>
              )}
            </div>
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-2.5">
              {actions}
            </div>
          )}
        </div>

        {children && <div className="mt-4">{children}</div>}

        {stats && stats.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                tone={stat.tone}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
