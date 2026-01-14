import { Link, Outlet, useParams, useLocation } from 'react-router-dom'
import { useProjectStore } from '@/stores'
import { ArrowLeft } from 'lucide-react'

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const location = useLocation()
  const { getProjectById } = useProjectStore()

  const project = projectId ? getProjectById(projectId) : undefined

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">项目不存在</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-700">
          返回首页
        </Link>
      </div>
    )
  }

  const tabs = [
    { name: '账单管理', path: 'expenses' },
    { name: '统计分析', path: 'statistics' },
    { name: '智能结算', path: 'settlement' }
  ]

  const isActive = (path: string) => {
    return location.pathname.endsWith(path)
  }

  return (
    <div>
      {/* 项目头部 */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回项目列表
        </Link>
        <h2 className="text-3xl font-bold text-gray-900">{project.name}</h2>
        {project.description && (
          <p className="text-gray-600 mt-2">{project.description}</p>
        )}
      </div>

      {/* Tab 导航 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <Link
              key={tab.path}
              to={`/projects/${projectId}/${tab.path}`}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                isActive(tab.path)
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Tab 内容 */}
      <Outlet />
    </div>
  )
}
