import { Outlet } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'

export function Layout() {
  return (
    <AppShell>
        <Outlet />
    </AppShell>
  )
}
