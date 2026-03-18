import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, DollarSign, FolderKanban, Plus, Receipt, Users } from 'lucide-react'
import { useExpenseStore, useMemberStore, useProjectStore } from '@/stores'
import { ProjectStatus } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { ModalSheet } from '@/components/ui/modal-sheet'
import { PageHero } from '@/components/ui/page-hero'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDateLabel } from '@/utils/format'

const outlineLinkButtonClass =
  'inline-flex h-8 items-center justify-center rounded-full border border-border/80 bg-white/90 px-3 text-xs font-medium text-foreground shadow-[0_8px_18px_rgba(118,86,58,0.06)] transition-all hover:bg-white'

export default function HomePage() {
  const navigate = useNavigate()
  const { projects, addProject, completeProject } = useProjectStore()
  const { members } = useMemberStore()
  const { expenses } = useExpenseStore()

  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')

  const activeProjects = projects.filter((project) => project.status === ProjectStatus.ACTIVE)
  const completedProjects = projects.filter((project) => project.status === ProjectStatus.COMPLETED)
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const getProjectExpenses = (projectId: string) =>
    expenses.filter((expense) => expense.projectId === projectId)

  const getProjectTotal = (projectId: string) =>
    getProjectExpenses(projectId).reduce((sum, expense) => sum + expense.amount, 0)

  const getProjectMembers = (memberIds: string[]) =>
    members.filter((member) => memberIds.includes(member.id))

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return

    addProject({
      name: newProjectName.trim(),
      description: newProjectDesc.trim(),
      memberIds: members.map((member) => member.id)
    })

    setNewProjectName('')
    setNewProjectDesc('')
    setShowNewProject(false)
  }

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Projects"
        title="项目管理"
        description="每个项目都保留成员、账单、统计和结算脉络。当前视觉优先照顾高频记账场景，信息保持轻松但不松散。"
        actions={(
          <Button size="lg" onClick={() => setShowNewProject(true)}>
            <Plus className="h-4 w-4" />
            新建项目
          </Button>
        )}
        stats={[
          {
            label: '进行中项目',
            value: activeProjects.length,
            description: '当前仍在持续记账和结算的项目数',
            icon: FolderKanban,
            tone: 'warm'
          },
          {
            label: '参与成员',
            value: members.length,
            description: '当前已录入的团队成员',
            icon: Users,
            tone: 'sage'
          },
          {
            label: '累计账单',
            value: expenses.length,
            description: '所有项目累计记录的账单数量',
            icon: Receipt,
            tone: 'sky'
          },
          {
            label: '总支出',
            value: formatCurrency(totalAmount),
            description: '当前本地数据里的全部消费总额',
            icon: DollarSign,
            tone: 'rose'
          }
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <span className="app-badge bg-white/80 text-primary shadow-sm">
            🍊 生活化暖色界面
          </span>
          <span className="app-badge bg-white/70 text-muted-foreground shadow-sm">
            已完成项目 {completedProjects.length} 个
          </span>
        </div>
      </PageHero>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              进行中的项目
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              优先展示正在发生的消费活动，便于继续录入账单和查看结算走势。
            </p>
          </div>
          <span className="app-badge bg-white/80 text-foreground shadow-sm">
            {activeProjects.length} 个项目
          </span>
        </div>

        {activeProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {activeProjects.map((project) => {
              const projectExpenses = getProjectExpenses(project.id)
              const projectMembers = getProjectMembers(project.memberIds)

              return (
                <Card
                  key={project.id}
                  className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,250,244,0.95),rgba(255,244,235,0.88))]"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-3">
                          <span className="app-badge bg-orange-100 text-orange-900">
                            进行中
                          </span>
                          <div>
                            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                              {project.name}
                            </h3>
                            <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                              {project.description || '还没有写项目描述，可以在项目中补充消费背景与场景。'}
                            </p>
                          </div>
                        </div>
                        <div className="rounded-[20px] bg-white/85 px-3.5 py-2.5 text-right shadow-sm">
                          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                            创建于
                          </div>
                          <div className="mt-2 text-sm font-medium text-foreground">
                            {formatDateLabel(project.createdAt, 'yyyy.MM.dd')}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <div className="rounded-[22px] bg-white/82 p-4 shadow-sm">
                          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            总支出
                          </div>
                          <div className="mt-2 text-xl font-semibold text-foreground">
                            {formatCurrency(getProjectTotal(project.id))}
                          </div>
                        </div>
                        <div className="rounded-[22px] bg-white/82 p-4 shadow-sm">
                          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            账单数
                          </div>
                          <div className="mt-2 text-xl font-semibold text-foreground">
                            {projectExpenses.length}
                          </div>
                        </div>
                        <div className="rounded-[22px] bg-white/82 p-4 shadow-sm">
                          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            参与人数
                          </div>
                          <div className="mt-2 text-xl font-semibold text-foreground">
                            {project.memberIds.length}
                          </div>
                        </div>
                        <div className="rounded-[22px] bg-white/82 p-4 shadow-sm">
                          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            最近消费
                          </div>
                          <div className="mt-2 text-sm font-semibold text-foreground">
                            {projectExpenses[0]
                              ? formatDateLabel(projectExpenses[0].date, 'MM月dd日')
                              : '暂无账单'}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {projectMembers.slice(0, 4).map((member) => (
                              <div
                                key={member.id}
                                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-orange-50 text-xl shadow-sm"
                                title={member.name}
                              >
                                {member.avatar}
                              </div>
                            ))}
                          </div>
                          <div className="text-sm leading-6 text-muted-foreground">
                            {projectMembers.map((member) => member.name).join('、') || '暂无成员'}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Button
                            size="sm"
                            onClick={() => navigate(`/projects/${project.id}/expenses`)}
                          >
                            进入项目
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm('确定要完成这个项目吗？完成后将无法再添加账单。')) {
                                completeProject(project.id)
                              }
                            }}
                          >
                            标记为完成
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <EmptyState
            emoji="📁"
            title="还没有进行中的项目"
            description="先创建一个项目，把成员和账单收进来。后续统计、图表和结算会自动跟上。"
            action={(
              <Button onClick={() => setShowNewProject(true)}>
                <Plus className="h-4 w-4" />
                创建第一个项目
              </Button>
            )}
          />
        )}
      </section>

      {completedProjects.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                已完成项目
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                这些项目保留为历史账本，可继续查看统计和结算结果。
              </p>
            </div>
            <span className="app-badge bg-emerald-100 text-emerald-900">
              <CheckCircle2 className="h-3.5 w-3.5" />
              已归档
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {completedProjects.map((project) => {
              const projectMembers = getProjectMembers(project.memberIds)
              const total = getProjectTotal(project.id)

              return (
                <Card key={project.id} className="border-emerald-200/60 bg-white/65">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3.5 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="app-badge bg-emerald-100 text-emerald-900">
                            已完成
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {project.completedAt
                              ? formatDateLabel(project.completedAt, 'yyyy.MM.dd')
                              : '已结束'}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {project.name}
                        </h3>
                        <p className="text-sm leading-7 text-muted-foreground">
                          {project.description || '没有项目描述'}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>{formatCurrency(total)}</div>
                        <div>{project.memberIds.length} 人参与</div>
                        <div>{projectMembers.map((member) => member.avatar).join(' ')}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Link
                        to={`/projects/${project.id}/expenses`}
                        className={cn(outlineLinkButtonClass, 'bg-white/90')}
                      >
                        查看历史记录
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      <ModalSheet
        open={showNewProject}
        onOpenChange={setShowNewProject}
        title="新建项目"
        description="项目会默认带上当前所有成员，后续账单、统计和结算都围绕这个项目展开。"
      >
        <div className="space-y-5">
          <div>
            <label className="app-field-label">项目名称</label>
            <Input
              value={newProjectName}
              onChange={(event) => setNewProjectName(event.target.value)}
              placeholder="例如：杭州团建、上海出差"
            />
          </div>

          <div>
            <label className="app-field-label">项目描述</label>
            <textarea
              value={newProjectDesc}
              onChange={(event) => setNewProjectDesc(event.target.value)}
              placeholder="可以写下项目背景、时间范围或消费场景"
              className="app-textarea"
            />
          </div>

          <div className="rounded-[20px] bg-orange-50 px-4 py-3.5 text-sm leading-6 text-orange-950/80">
            当前会自动加入 {members.length} 位成员。若团队名单不完整，建议先去成员管理补齐。
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowNewProject(false)}>
              取消
            </Button>
            <Button onClick={handleCreateProject}>创建项目</Button>
          </div>
        </div>
      </ModalSheet>
    </div>
  )
}
