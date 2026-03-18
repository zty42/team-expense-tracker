import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { BarChart3, PieChart as PieChartIcon, Receipt, Users, Wallet } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHero } from '@/components/ui/page-hero'
import { useCategoryStore, useExpenseStore, useMemberStore, useProjectStore } from '@/stores'
import { calculateProjectStats } from '@/utils/statistics'
import { formatCurrency } from '@/utils/format'

const fallbackColors = ['#D56A3A', '#7FC3A5', '#6CB8D9', '#F09C79', '#D982A6', '#D9B87C']

export default function StatisticsPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { expenses } = useExpenseStore()
  const { members } = useMemberStore()
  const { categories } = useCategoryStore()
  const { getProjectById } = useProjectStore()

  const project = projectId ? getProjectById(projectId) : undefined
  const projectExpenses = expenses.filter((expense) => expense.projectId === projectId)
  const stats = calculateProjectStats(projectExpenses, project?.memberIds || [])

  const categoryChartData = stats.categoryStats.map((stat, index) => {
    const category = categories.find((item) => item.id === stat.categoryId)
    return {
      name: category?.name || '未知分类',
      icon: category?.icon || '📝',
      value: stat.amount,
      percentage: stat.percentage,
      color: category?.color || fallbackColors[index % fallbackColors.length]
    }
  })

  const memberChartData = stats.memberStats
    .map((stat) => {
      const member = members.find((item) => item.id === stat.memberId)
      return {
        id: stat.memberId,
        name: member?.name || '未知成员',
        avatar: member?.avatar || '👤',
        consumed: stat.totalConsumed,
        paid: stat.totalPaid,
        expenseCount: stat.expenseCount
      }
    })
    .sort((a, b) => b.consumed - a.consumed)

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Statistics"
        title="统计分析"
        description="把账单拆成更容易阅读的金额结构，快速看到分类占比、成员消费和支付差异。"
        stats={[
          {
            label: '总消费',
            value: formatCurrency(stats.totalAmount),
            description: '项目累计消费总额',
            icon: Wallet,
            tone: 'warm'
          },
          {
            label: '人均消费',
            value: formatCurrency(stats.averagePerPerson),
            description: '按项目成员平均分摊后的参考值',
            icon: Users,
            tone: 'sage'
          },
          {
            label: '账单总数',
            value: projectExpenses.length,
            description: '当前统计覆盖的账单数量',
            icon: Receipt,
            tone: 'sky'
          },
          {
            label: '消费分类',
            value: categoryChartData.length,
            description: '在账单里实际出现过的分类数',
            icon: PieChartIcon,
            tone: 'rose'
          }
        ]}
      />

      {projectExpenses.length === 0 ? (
        <EmptyState
          emoji="📊"
          title="还没有统计数据"
          description="等项目里有账单后，这里会自动生成分类占比、成员支付和消费分布。"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                  分类消费占比
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={112}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryChartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value ?? 0))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {categoryChartData.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-[22px] border border-border/70 bg-white/75 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-2xl"
                            style={{ backgroundColor: `${item.color}20` }}
                          >
                            <div className="flex h-full items-center justify-center text-xl">
                              {item.icon}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          {formatCurrency(item.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  成员消费对比
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={memberChartData} margin={{ top: 12, right: 4, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ecdccc" />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value ?? 0))}
                      />
                      <Bar dataKey="consumed" fill="#7FC3A5" radius={[8, 8, 0, 0]} name="消费金额" />
                      <Bar dataKey="paid" fill="#D56A3A" radius={[8, 8, 0, 0]} name="支付金额" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2.5">
                  {memberChartData.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-[22px] border border-border/70 bg-white/75 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-xl">
                            {member.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{member.name}</div>
                            <div className="text-sm text-muted-foreground">
                              参与 {member.expenseCount} 次
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-semibold text-foreground">
                            支付 {formatCurrency(member.paid)}
                          </div>
                          <div className="text-muted-foreground">
                            消费 {formatCurrency(member.consumed)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">成员详细统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>成员</th>
                      <th className="text-right">支付金额</th>
                      <th className="text-right">消费金额</th>
                      <th className="text-right">参与次数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberChartData.map((member) => (
                      <tr key={member.id} className="border-t border-border/70">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-xl">
                              {member.avatar}
                            </div>
                            <span className="font-medium text-foreground">{member.name}</span>
                          </div>
                        </td>
                        <td className="text-right font-medium">{formatCurrency(member.paid)}</td>
                        <td className="text-right font-medium">{formatCurrency(member.consumed)}</td>
                        <td className="text-right text-muted-foreground">{member.expenseCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
