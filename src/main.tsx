import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeApp } from './data/seed'
import {
  useMemberStore,
  useCategoryStore,
  useProjectStore,
  useExpenseStore
} from './stores'

// 初始化示例数据（仅首次）
initializeApp()

// 加载所有数据到 Store
useMemberStore.getState().loadMembers()
useCategoryStore.getState().loadCategories()
useProjectStore.getState().loadProjects()
useExpenseStore.getState().loadExpenses()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
