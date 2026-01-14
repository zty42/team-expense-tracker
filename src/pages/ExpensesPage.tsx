import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useExpenseStore, useMemberStore, useCategoryStore, useProjectStore } from '@/stores'
import { ProjectStatus } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

export default function ExpensesPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { expenses, addExpense, deleteExpense } = useExpenseStore()
  const { members } = useMemberStore()
  const { categories } = useCategoryStore()
  const { getProjectById } = useProjectStore()

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    payerId: '',
    participantIds: [] as string[],
    date: new Date().toISOString().split('T')[0],
    note: ''
  })

  const project = projectId ? getProjectById(projectId) : undefined
  const isCompleted = project?.status === ProjectStatus.COMPLETED

  const projectExpenses = expenses
    .filter(e => e.projectId === projectId)
    .sort((a, b) => b.date - a.date)

  const handleSubmit = () => {
    if (!projectId || !formData.amount || !formData.categoryId || !formData.payerId || formData.participantIds.length === 0) {
      alert('请填写所有必填字段')
      return
    }

    addExpense({
      projectId,
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId,
      payerId: formData.payerId,
      participantIds: formData.participantIds,
      date: new Date(formData.date).getTime(),
      note: formData.note
    })

    // 重置表单
    setFormData({
      amount: '',
      categoryId: '',
      payerId: '',
      participantIds: [],
      date: new Date().toISOString().split('T')[0],
      note: ''
    })
    setShowForm(false)
  }

  const toggleParticipant = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      participantIds: prev.participantIds.includes(memberId)
        ? prev.participantIds.filter(id => id !== memberId)
        : [...prev.participantIds, memberId]
    }))
  }

  const getMemberName = (id: string) => {
    return members.find(m => m.id === id)?.name || '未知'
  }

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id)
    return cat ? `${cat.icon} ${cat.name}` : '未知'
  }

  const projectMembers = project ? members.filter(m => project.memberIds.includes(m.id)) : []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          账单管理 ({projectExpenses.length})
        </h3>
        {!isCompleted && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            添加账单
          </Button>
        )}
      </div>

      {isCompleted && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
          <p className="text-yellow-800 text-sm">
            此项目已完成，无法添加或编辑账单
          </p>
        </div>
      )}

      {/* 添加账单表单 */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>添加账单</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    金额 (元) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    日期 *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分类 *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择分类</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  付款人 *
                </label>
                <select
                  value={formData.payerId}
                  onChange={(e) => setFormData(prev => ({ ...prev, payerId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择付款人</option>
                  {projectMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.avatar} {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  参与消费成员 * (费用将平均分摊)
                </label>
                <div className="space-y-2">
                  {projectMembers.map(member => (
                    <label key={member.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.participantIds.includes(member.id)}
                        onChange={() => toggleParticipant(member.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>
                        {member.avatar} {member.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  备注
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  rows={3}
                  placeholder="可选"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  取消
                </Button>
                <Button onClick={handleSubmit}>添加</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 账单列表 */}
      <div className="space-y-4">
        {projectExpenses.map(expense => (
          <Card key={expense.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ¥{expense.amount.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getCategoryName(expense.categoryId)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      付款人：{getMemberName(expense.payerId)}
                    </div>
                    <div>
                      参与者：{expense.participantIds.map(id => getMemberName(id)).join(', ')}
                    </div>
                    <div>
                      人均：¥{(expense.amount / expense.participantIds.length).toFixed(2)}
                    </div>
                    {expense.note && (
                      <div className="text-gray-500">备注：{expense.note}</div>
                    )}
                    <div className="text-xs text-gray-400">
                      {format(expense.date, 'yyyy-MM-dd HH:mm')}
                    </div>
                  </div>
                </div>
                {!isCompleted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('确定要删除这条账单吗？')) {
                        deleteExpense(expense.id)
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {projectExpenses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无账单，点击"添加账单"开始记账吧！
          </div>
        )}
      </div>
    </div>
  )
}
