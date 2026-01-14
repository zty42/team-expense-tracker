import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjectStore, useMemberStore, useExpenseStore } from '@/stores'
import { ProjectStatus } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Plus, Users, DollarSign, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function HomePage() {
  const { projects, addProject, completeProject } = useProjectStore()
  const { members } = useMemberStore()
  const { expenses } = useExpenseStore()
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return

    addProject({
      name: newProjectName,
      description: newProjectDesc,
      memberIds: members.map(m => m.id)
    })

    setNewProjectName('')
    setNewProjectDesc('')
    setShowNewProject(false)
  }

  const getProjectExpenses = (projectId: string) => {
    return expenses.filter(e => e.projectId === projectId)
  }

  const getProjectTotal = (projectId: string) => {
    return getProjectExpenses(projectId).reduce((sum, e) => sum + e.amount, 0)
  }

  const activeProjects = projects.filter(p => p.status === ProjectStatus.ACTIVE)
  const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">项目列表</h2>
        <Button onClick={() => setShowNewProject(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新建项目
        </Button>
      </div>

      {/* 新建项目表单 */}
      {showNewProject && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>新建项目</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目名称 *
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="例如：杭州团建"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目描述
                </label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="可选"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewProject(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateProject}>创建</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 进行中的项目 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          进行中 ({activeProjects.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeProjects.map(project => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  {project.description && (
                    <CardDescription>{project.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{project.memberIds.length} 人参与</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>¥{getProjectTotal(project.id).toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      创建于 {format(project.createdAt, 'yyyy-MM-dd', { locale: zhCN })}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        if (confirm('确定要完成这个项目吗？完成后将无法再添加账单。')) {
                          completeProject(project.id)
                        }
                      }}
                    >
                      标记为完成
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {activeProjects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无进行中的项目，点击"新建项目"开始吧！
          </div>
        )}
      </div>

      {/* 已完成的项目 */}
      {completedProjects.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            已完成 ({completedProjects.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedProjects.map(project => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer opacity-75">
                  <CardHeader>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    {project.description && (
                      <CardDescription>{project.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{project.memberIds.length} 人参与</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>¥{getProjectTotal(project.id).toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        完成于 {project.completedAt && format(project.completedAt, 'yyyy-MM-dd', { locale: zhCN })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
