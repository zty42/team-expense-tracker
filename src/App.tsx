import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import ProjectDetailPage from '@/pages/ProjectDetailPage'
import ExpensesPage from '@/pages/ExpensesPage'
import StatisticsPage from '@/pages/StatisticsPage'
import SettlementPage from '@/pages/SettlementPage'
import MembersPage from '@/pages/MembersPage'
import CategoriesPage from '@/pages/CategoriesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="projects/:projectId" element={<ProjectDetailPage />}>
            <Route index element={<Navigate to="expenses" replace />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="statistics" element={<StatisticsPage />} />
            <Route path="settlement" element={<SettlementPage />} />
          </Route>
          <Route path="members" element={<MembersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
