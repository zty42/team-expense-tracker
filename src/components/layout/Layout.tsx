import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Users, FolderKanban } from 'lucide-react'

export function Layout() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">团队记账</h1>
            </div>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') && !location.pathname.includes('/projects/')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                项目
              </Link>
              <Link
                to="/members"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/members')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                成员
              </Link>
              <Link
                to="/categories"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/categories')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FolderKanban className="w-4 h-4 mr-2" />
                分类
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
