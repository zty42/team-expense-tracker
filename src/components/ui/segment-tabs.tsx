import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface SegmentTabItem {
  label: string
  to: string
  icon?: ReactNode
  end?: boolean
}

interface SegmentTabsProps {
  items: SegmentTabItem[]
}

export function SegmentTabs({ items }: SegmentTabsProps) {
  return (
    <div className="app-panel sticky top-3 z-20 mb-5 overflow-x-auto p-1.5">
      <nav className="flex min-w-max gap-1.5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'inline-flex items-center gap-2 rounded-[18px] px-3.5 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-white text-foreground shadow-[0_8px_18px_rgba(118,86,58,0.1)]'
                  : 'text-muted-foreground hover:bg-white/70 hover:text-foreground'
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
