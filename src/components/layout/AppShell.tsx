import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { FolderKanban, Home, Sparkles, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: ReactNode
}

const navItems = [
  {
    to: '/',
    label: '项目',
    shortLabel: '项目',
    icon: Home,
    description: '查看项目、账单与结算进度'
  },
  {
    to: '/members',
    label: '成员',
    shortLabel: '成员',
    icon: Users,
    description: '维护参与记账的成员档案'
  },
  {
    to: '/categories',
    label: '分类',
    shortLabel: '分类',
    icon: FolderKanban,
    description: '整理消费分类与图表颜色'
  }
]

function AppNavLink({
  to,
  label,
  shortLabel,
  description,
  icon: Icon,
  compact = false
}: {
  to: string
  label: string
  shortLabel: string
  description: string
  icon: typeof Home
  compact?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          compact
            ? 'flex min-w-[78px] flex-1 flex-col items-center gap-1.5 rounded-[18px] px-2.5 py-2.5 text-xs font-medium transition-all'
            : 'group flex items-center gap-3 rounded-[20px] px-3.5 py-3 transition-all',
          isActive
            ? 'bg-white text-foreground shadow-[0_10px_22px_rgba(118,86,58,0.1)]'
            : 'text-muted-foreground hover:bg-white/75 hover:text-foreground'
        )
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-[18px] transition-all',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/75 text-muted-foreground group-hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          {compact ? (
            <span>{shortLabel}</span>
          ) : (
            <div className="min-w-0">
              <div className="font-semibold">{label}</div>
              <div className="mt-0.5 text-sm leading-5 text-muted-foreground">
                {description}
              </div>
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1500px] gap-3 px-3 py-3 md:px-4 md:py-4 lg:gap-5 lg:px-5 lg:py-5">
        <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0">
          <div className="app-panel sticky top-5 flex h-[calc(100vh-2.5rem)] flex-col p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-primary text-primary-foreground shadow-[0_10px_22px_rgba(213,106,58,0.28)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight text-foreground">
                  团队记账
                </div>
                <div className="mt-0.5 text-sm leading-5 text-muted-foreground">
                  轻松管理项目消费与结算。
                </div>
              </div>
            </div>

            <nav className="mt-6 space-y-2.5">
              {navItems.map((item) => (
                <AppNavLink key={item.to} {...item} />
              ))}
            </nav>

            <div className="mt-auto rounded-[22px] border border-orange-200/60 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
              <div className="text-sm font-semibold text-orange-950">
                使用建议
              </div>
              <p className="mt-1.5 text-sm leading-6 text-orange-900/75">
                先维护成员和分类，再新建项目，会让账单录入和后续结算更顺手。
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="min-w-0 pb-24 lg:pb-5">
            {children}
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-3 bottom-4 z-40 lg:hidden">
        <div className="app-panel flex items-center gap-1.5 p-1.5">
          {navItems.map((item) => (
            <AppNavLink key={item.to} {...item} compact />
          ))}
        </div>
      </nav>
    </div>
  )
}
