import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CalendarDays, Plus, Receipt, Trash2, Users, Wallet } from 'lucide-react'
import { useCategoryStore, useExpenseStore, useMemberStore, useProjectStore } from '@/stores'
import { ProjectStatus } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { ModalSheet } from '@/components/ui/modal-sheet'
import { PageHero } from '@/components/ui/page-hero'
import { formatCurrency, formatDateInputValue, formatDateTimeLabel } from '@/utils/format'

function createDefaultExpenseForm() {
  return {
    amount: '',
    categoryId: '',
    payerId: '',
    participantIds: [] as string[],
    date: formatDateInputValue(Date.now()),
    note: ''
  }
}

export default function ExpensesPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { expenses, addExpense, deleteExpense } = useExpenseStore()
  const { members } = useMemberStore()
  const { categories } = useCategoryStore()
  const { getProjectById } = useProjectStore()

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(createDefaultExpenseForm)

  const project = projectId ? getProjectById(projectId) : undefined
  const isCompleted = project?.status === ProjectStatus.COMPLETED

  const projectExpenses = useMemo(
    () =>
      expenses
        .filter((expense) => expense.projectId === projectId)
        .sort((a, b) => b.date - a.date),
    [expenses, projectId]
  )

  const projectMembers = project
    ? members.filter((member) => project.memberIds.includes(member.id))
    : []
  const totalAmount = projectExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averageAmount = projectExpenses.length > 0 ? totalAmount / projectExpenses.length : 0

  const getMember = (id: string) => members.find((member) => member.id === id)
  const getCategory = (id: string) => categories.find((category) => category.id === id)

  const handleSubmit = () => {
    if (
      !projectId ||
      !formData.amount ||
      !formData.categoryId ||
      !formData.payerId ||
      formData.participantIds.length === 0
    ) {
      alert('请填写所有必填字段')
      return
    }

    addExpense({
      projectId,
      amount: Number(formData.amount),
      categoryId: formData.categoryId,
      payerId: formData.payerId,
      participantIds: formData.participantIds,
      date: new Date(formData.date).getTime(),
      note: formData.note.trim()
    })

    setFormData(createDefaultExpenseForm())
    setShowForm(false)
  }

  const toggleParticipant = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      participantIds: prev.participantIds.includes(memberId)
        ? prev.participantIds.filter((id) => id !== memberId)
        : [...prev.participantIds, memberId]
    }))
  }

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Expenses"
        title="账单管理"
        description="用清晰的金额层级、参与者和分类标签，快速回看每一笔消费的上下文。"
        actions={!isCompleted ? (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            添加账单
          </Button>
        ) : undefined}
        stats={[
          {
            label: '账单数量',
            value: projectExpenses.length,
            description: '当前项目已记录的消费条目',
            icon: Receipt,
            tone: 'warm'
          },
          {
            label: '总支出',
            value: formatCurrency(totalAmount),
            description: '所有账单累计金额',
            icon: Wallet,
            tone: 'rose'
          },
          {
            label: '平均单笔',
            value: formatCurrency(averageAmount),
            description: '用于判断消费密度',
            icon: CalendarDays,
            tone: 'sky'
          },
          {
            label: '参与成员',
            value: projectMembers.length,
            description: '可被选择为付款人或参与者',
            icon: Users,
            tone: 'sage'
          }
        ]}
      />

      {isCompleted && (
        <div className="app-panel rounded-[22px] border-amber-200/70 bg-gradient-to-r from-amber-50 to-white px-4 py-3.5 text-sm leading-6 text-amber-950/85">
          此项目已完成，账单区保持只读状态。你仍然可以查看每笔消费和对应的统计、结算结果。
        </div>
      )}

      {projectExpenses.length > 0 ? (
        <div className="space-y-4">
          {projectExpenses.map((expense) => {
            const payer = getMember(expense.payerId)
            const category = getCategory(expense.categoryId)

            return (
              <Card key={expense.id} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="app-badge bg-orange-100 text-orange-950">
                          {category?.icon || '📝'} {category?.name || '未知分类'}
                        </span>
                        <span className="app-badge bg-white/80 text-muted-foreground shadow-sm">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDateTimeLabel(expense.date)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-end gap-4">
                        <div className="text-4xl font-semibold tracking-tight text-foreground">
                          {formatCurrency(expense.amount)}
                        </div>
                        <div className="rounded-full bg-white/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                          人均 {formatCurrency(expense.amount / expense.participantIds.length)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-[22px] bg-orange-50/70 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            付款人
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-2xl">{payer?.avatar || '👤'}</span>
                            <span className="font-medium text-foreground">
                              {payer?.name || '未知成员'}
                            </span>
                          </div>
                        </div>
                        <div className="rounded-[22px] bg-white/75 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            参与成员
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {expense.participantIds.map((participantId) => {
                              const participant = getMember(participantId)
                              return (
                                <span
                                  key={participantId}
                                  className="app-badge bg-secondary/70 text-secondary-foreground"
                                >
                                  {participant?.avatar || '👤'} {participant?.name || '未知成员'}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {expense.note && (
                        <div className="rounded-[22px] bg-white/75 p-4 text-sm leading-7 text-muted-foreground">
                          {expense.note}
                        </div>
                      )}
                    </div>

                    {!isCompleted && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="self-end lg:self-start"
                        onClick={() => {
                          if (confirm('确定要删除这条账单吗？')) {
                            deleteExpense(expense.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          emoji="🧾"
          title="还没有账单记录"
          description="先记下一笔费用，项目统计和结算方案才会有实际内容。"
          action={!isCompleted ? (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              添加第一笔账单
            </Button>
          ) : undefined}
        />
      )}

      <ModalSheet
        open={showForm}
        onOpenChange={setShowForm}
        title="添加账单"
        description="账单会立即进入项目统计和智能结算。所有参与者默认按均摊逻辑计算。"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="app-field-label">金额</label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, amount: event.target.value }))
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="app-field-label">日期</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, date: event.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label className="app-field-label">消费分类</label>
            <select
              value={formData.categoryId}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, categoryId: event.target.value }))
              }
              className="app-select"
            >
              <option value="">请选择分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="app-field-label">付款人</label>
            <select
              value={formData.payerId}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, payerId: event.target.value }))
              }
              className="app-select"
            >
              <option value="">请选择付款人</option>
              {projectMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.avatar} {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="app-field-label">参与消费成员</label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {projectMembers.map((member) => {
                const isSelected = formData.participantIds.includes(member.id)

                return (
                  <button
                    key={member.id}
                    type="button"
                    className={`rounded-[22px] border px-4 py-3 text-left transition-all ${
                      isSelected
                        ? 'border-primary/40 bg-orange-50 shadow-[0_12px_24px_rgba(213,106,58,0.12)]'
                        : 'border-border/80 bg-white/80 hover:bg-white'
                    }`}
                    onClick={() => toggleParticipant(member.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{member.avatar}</div>
                      <div>
                        <div className="font-medium text-foreground">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {isSelected ? '已参与均摊' : '点击加入均摊'}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="app-field-label">备注</label>
            <textarea
              value={formData.note}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, note: event.target.value }))
              }
              rows={3}
              className="app-textarea"
              placeholder="例如：西湖边晚餐、打车到酒店"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>确认添加</Button>
          </div>
        </div>
      </ModalSheet>
    </div>
  )
}
