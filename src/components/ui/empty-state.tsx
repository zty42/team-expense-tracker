import type { ReactNode } from 'react'

interface EmptyStateProps {
  emoji?: string
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({
  emoji = '🧾',
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="app-panel flex flex-col items-center justify-center px-6 py-12 text-center md:px-10 md:py-16">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/80 text-5xl shadow-[0_12px_30px_rgba(118,86,58,0.1)]">
        {emoji}
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
