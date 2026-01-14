import { useParams } from 'react-router-dom'
import { useExpenseStore, useMemberStore, useCategoryStore, useProjectStore } from '@/stores'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { calculateProjectStats } from '@/utils/statistics'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

export default function StatisticsPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { expenses } = useExpenseStore()
  const { members } = useMemberStore()
  const { categories } = useCategoryStore()
  const { getProjectById } = useProjectStore()

  const project = projectId ? getProjectById(projectId) : undefined
  const projectExpenses = expenses.filter(e => e.projectId === projectId)
  const projectMemberIds = project?.memberIds || []

  const stats = calculateProjectStats(projectExpenses, projectMemberIds)

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9']

  const categoryChartData = stats.categoryStats.map((stat, index) => ({
    name: categories.find(c => c.id === stat.categoryId)?.name || '未知',
    value: stat.amount,
    percentage: stat.percentage,
    color: categories.find(c => c.id === stat.categoryId)?.color || COLORS[index % COLORS.length]
  }))

  const memberChartData = stats.memberStats
    .sort((a, b) => b.totalConsumed - a.totalConsumed)
    .map(stat => ({
      name: members.find(m => m.id === stat.memberId)?.name || '未知',
      consumed: stat.totalConsumed,
      paid: stat.totalPaid
    }))

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">统计分析</h3>

      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">总消费</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              ¥{stats.totalAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">人均消费</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              ¥{stats.averagePerPerson.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">账单总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {projectExpenses.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 分类饼图 */}
        <Card>
          <CardHeader>
            <CardTitle>分类消费占比</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} ${entry.percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `¥${Number(value).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                暂无数据
              </div>
            )}
          </CardContent>
        </Card>

        {/* 成员消费柱状图 */}
        <Card>
          <CardHeader>
            <CardTitle>成员消费统计</CardTitle>
          </CardHeader>
          <CardContent>
            {memberChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={memberChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `¥${Number(value).toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="consumed" fill="#4ECDC4" name="消费金额" />
                  <Bar dataKey="paid" fill="#FF6B6B" name="支付金额" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                暂无数据
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 详细表格 */}
      <Card>
        <CardHeader>
          <CardTitle>成员详细统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    成员
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    支付金额
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    消费金额
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    参与次数
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {memberChartData.map((data, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      ¥{data.paid.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      ¥{data.consumed.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {stats.memberStats.find(s =>
                        members.find(m => m.id === s.memberId)?.name === data.name
                      )?.expenseCount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
