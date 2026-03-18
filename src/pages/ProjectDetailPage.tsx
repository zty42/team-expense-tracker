import { Link, Outlet, useParams } from 'react-router-dom'
import { ArrowLeft, BarChart3, Receipt, TrendingUp, Users, Wallet } from 'lucide-react'
import { useExpenseStore, useMemberStore, useProjectStore } from '@/stores'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHero } from '@/components/ui/page-hero'
import { SegmentTabs } from '@/components/ui/segment-tabs'
import { ProjectStatus } from '@/types/project'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDateLabel } from '@/utils/format'

const primaryLinkClass =
  'inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_12px_24px_rgba(213,106,58,0.24)] transition-all hover:-translate-y-0.5 hover:bg-primary/90'

const outlineLinkClass =
  'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border/80 bg-white/85 px-4 py-2 text-sm font-medium text-foreground shadow-[0_8px_18px_rgba(118,86,58,0.06)] transition-all hover:bg-white'

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { getProjectById } = useProjectStore()
  const { expenses } = useExpenseStore()
  const { members } = useMemberStore()

  const project = projectId ? getProjectById(projectId) : undefined

  if (!project) {
    return (
      <EmptyState
        emoji="🧭"
        title="项目不存在"
        description="这个项目可能已经被删除，或者当前链接不再有效。"
        action={(
          <Link to="/" className={primaryLinkClass}>
            返回项目列表
          </Link>
        )}
      />
    )
  }

  const projectExpenses = expenses
    .filter((expense) => expense.projectId === project.id)
    .sort((a, b) => b.date - a.date)
  const projectMembers = members.filter((member) => project.memberIds.includes(member.id))
  const totalAmount = projectExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averageAmount = projectExpenses.length > 0 ? totalAmount / projectExpenses.length : 0

  const tabs = [
    {
      label: '账单管理',
      to: `/projects/${project.id}/expenses`,
      icon: <Receipt className="h-4 w-4" />
    },
    {
      label: '统计分析',
      to: `/projects/${project.id}/statistics`,
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      label: '智能结算',
      to: `/projects/${project.id}/settlement`,
      icon: <Wallet className="h-4 w-4" />
    }
  ]

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Project"
        title={project.name}
        description={project.description || '这个项目还没有补充描述，可以直接开始记录账单。'}
        actions={(
          <>
            <Link
              to="/"
              className={cn(outlineLinkClass, 'bg-white/85')}
            >
              <ArrowLeft className="h-4 w-4" />
              返回项目列表
            </Link>
            <span
              className={cn(
                'app-badge shadow-sm',
                project.status === ProjectStatus.ACTIVE
                  ? 'bg-orange-100 text-orange-900'
                  : 'bg-emerald-100 text-emerald-900'
              )}
            >
              {project.status === ProjectStatus.ACTIVE ? '进行中' : '已完成'}
            </span>
          </>
        )}
        stats={[
          {
            label: '项目总支出',
            value: formatCurrency(totalAmount),
            description: '该项目所有账单累计金额',
            icon: Wallet,
            tone: 'warm'
          },
          {
            label: '账单数量',
            value: projectExpenses.length,
            description: '用于统计、结算的有效账单数',
            icon: Receipt,
            tone: 'sky'
          },
          {
            label: '参与成员',
            value: projectMembers.length,
            description: '当前项目的成员范围',
            icon: Users,
            tone: 'sage'
          },
          {
            label: '平均单笔',
            value: formatCurrency(averageAmount),
            description: '方便快速判断消费节奏',
            icon: TrendingUp,
            tone: 'rose'
          }
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex -space-x-2">
            {projectMembers.slice(0, 5).map((member) => (
              <div
                key={member.id}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-orange-50 text-xl shadow-sm"
                title={member.name}
              >
                {member.avatar}
              </div>
            ))}
          </div>
          <div className="text-sm leading-7 text-muted-foreground">
            {projectMembers.map((member) => member.name).join('、') || '暂无成员'}
          </div>
          <div className="app-badge bg-white/75 text-muted-foreground shadow-sm">
            创建于 {formatDateLabel(project.createdAt)}
          </div>
        </div>
      </PageHero>

      {project.status === ProjectStatus.COMPLETED && (
        <div className="app-panel rounded-[22px] border-emerald-200/70 bg-gradient-to-r from-emerald-50 to-white px-4 py-3.5 text-sm leading-6 text-emerald-950/85">
          这个项目已经完成，后续不能新增账单，但仍然可以查看历史记录、统计结果和结算方案。
        </div>
      )}

      <SegmentTabs items={tabs} />

      <Outlet />
    </div>
  )
}
