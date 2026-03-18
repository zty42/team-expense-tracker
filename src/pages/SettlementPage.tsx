import { ArrowRight, CircleDollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHero } from '@/components/ui/page-hero'
import { useExpenseStore, useMemberStore, useProjectStore } from '@/stores'
import { calculateSettlement } from '@/utils/settlement'
import { formatCurrency } from '@/utils/format'

export default function SettlementPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { expenses } = useExpenseStore()
  const { members } = useMemberStore()
  const { getProjectById } = useProjectStore()

  const project = projectId ? getProjectById(projectId) : undefined
  const projectExpenses = expenses.filter((expense) => expense.projectId === projectId)
  const settlement = calculateSettlement(projectExpenses, project?.memberIds || [])

  const getMember = (id: string) => members.find((member) => member.id === id)
  const totalTransferAmount = settlement.transfers.reduce(
    (sum, transfer) => sum + transfer.amount,
    0
  )
  const positiveBalances = settlement.balances.filter((item) => item.balance > 0)

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Settlement"
        title="智能结算"
        description="系统会根据成员净余额自动生成较少转账次数的方案，把“谁该转给谁”整理成清楚的动作路径。"
        stats={[
          {
            label: '转账笔数',
            value: settlement.transfers.length,
            description: '按当前账单计算出的建议转账数',
            icon: CircleDollarSign,
            tone: 'warm'
          },
          {
            label: '待结算总额',
            value: formatCurrency(totalTransferAmount),
            description: '需要在成员之间流转的金额',
            icon: Wallet,
            tone: 'rose'
          },
          {
            label: '应收成员',
            value: positiveBalances.length,
            description: '净余额为正、需要收款的成员数',
            icon: TrendingUp,
            tone: 'sage'
          },
          {
            label: '参与成员',
            value: settlement.balances.length,
            description: '已纳入结算计算的成员总数',
            icon: TrendingDown,
            tone: 'sky'
          }
        ]}
      />

      <div className="app-panel rounded-[22px] border-sky-200/70 bg-gradient-to-r from-sky-50 to-white px-4 py-3.5 text-sm leading-6 text-sky-950/80">
        系统使用贪心算法匹配应收与应付金额，优先减少不必要的转账链路，让线下结算更轻量。
      </div>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            成员收支明细
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            每张卡片展示个人支付、应付和最终净余额状态。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settlement.balances.map((balance) => {
            const member = getMember(balance.memberId)
            const statusTone =
              balance.balance > 0
                ? 'bg-emerald-100 text-emerald-900'
                : balance.balance < 0
                ? 'bg-rose-100 text-rose-900'
                : 'bg-stone-100 text-stone-900'

            return (
              <Card key={balance.memberId}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-2xl">
                        {member?.avatar || '👤'}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {member?.name || '未知成员'}
                        </div>
                        <div className={`app-badge mt-2 ${statusTone}`}>
                          {balance.balance > 0
                            ? '应收款'
                            : balance.balance < 0
                            ? '应付款'
                            : '已结清'}
                        </div>
                      </div>
                    </div>

                    {balance.balance > 0 ? (
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    ) : balance.balance < 0 ? (
                      <TrendingDown className="h-5 w-5 text-rose-600" />
                    ) : (
                      <CircleDollarSign className="h-5 w-5 text-stone-400" />
                    )}
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>支付金额</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(balance.totalPaid)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>应付金额</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(balance.totalOwed)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border/70 pt-3">
                      <span className="font-medium text-foreground">净余额</span>
                      <span
                        className={`text-lg font-semibold ${
                          balance.balance > 0
                            ? 'text-emerald-700'
                            : balance.balance < 0
                            ? 'text-rose-700'
                            : 'text-foreground'
                        }`}
                      >
                        {balance.balance > 0 ? '+' : ''}
                        {formatCurrency(balance.balance)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3 text-xl">
            <span>结算方案</span>
            <span className="app-badge bg-white/80 text-muted-foreground shadow-sm">
              共需 {settlement.transfers.length} 笔转账
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {settlement.transfers.length > 0 ? (
            <div className="space-y-4">
              {settlement.transfers.map((transfer, index) => {
                const from = getMember(transfer.from)
                const to = getMember(transfer.to)

                return (
                  <div
                    key={`${transfer.from}-${transfer.to}-${index}`}
                    className="rounded-[22px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,249,244,0.92),rgba(255,255,255,0.9))] p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="app-badge bg-orange-100 text-orange-950">
                          第 {index + 1} 步
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-xl">
                            {from?.avatar || '👤'}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {from?.name || '未知成员'}
                            </div>
                            <div className="text-sm text-muted-foreground">付款方</div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-xl">
                            {to?.avatar || '👤'}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {to?.name || '未知成员'}
                            </div>
                            <div className="text-sm text-muted-foreground">收款方</div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[18px] bg-white/85 px-4 py-2.5 text-right shadow-sm">
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          转账金额
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-primary">
                          {formatCurrency(transfer.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState
              emoji="✨"
              title="当前无需额外转账"
              description="所有成员的支付与应付已经平衡，结算上暂时没有需要执行的动作。"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
