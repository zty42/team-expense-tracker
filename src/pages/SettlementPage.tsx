import { useParams } from 'react-router-dom'
import { useExpenseStore, useMemberStore, useProjectStore } from '@/stores'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { calculateSettlement } from '@/utils/settlement'
import { ArrowRight, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

export default function SettlementPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { expenses } = useExpenseStore()
  const { members } = useMemberStore()
  const { getProjectById } = useProjectStore()

  const project = projectId ? getProjectById(projectId) : undefined
  const projectExpenses = expenses.filter(e => e.projectId === projectId)
  const projectMemberIds = project?.memberIds || []

  const settlement = calculateSettlement(projectExpenses, projectMemberIds)

  const getMemberName = (id: string) => {
    return members.find(m => m.id === id)?.name || '未知'
  }

  const getMemberAvatar = (id: string) => {
    return members.find(m => m.id === id)?.avatar || '👤'
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">智能结算</h3>

      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-blue-800 text-sm">
          💡 系统使用贪心算法计算出最少转账次数的结算方案，让账单结算更简单！
        </p>
      </div>

      {/* 成员余额卡片 */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">成员收支明细</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settlement.balances.map(balance => (
            <Card key={balance.memberId}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getMemberAvatar(balance.memberId)}</span>
                    <span className="font-semibold text-gray-900">
                      {getMemberName(balance.memberId)}
                    </span>
                  </div>
                  {balance.balance > 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : balance.balance < 0 ? (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  ) : (
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">支付金额：</span>
                    <span className="font-medium">¥{balance.totalPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">应付金额：</span>
                    <span className="font-medium">¥{balance.totalOwed.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-700 font-medium">净余额：</span>
                    <span
                      className={`font-bold ${
                        balance.balance > 0
                          ? 'text-green-600'
                          : balance.balance < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {balance.balance > 0 ? '+' : ''}¥{balance.balance.toFixed(2)}
                    </span>
                  </div>
                  {balance.balance > 0 && (
                    <p className="text-xs text-green-600 mt-1">应收款</p>
                  )}
                  {balance.balance < 0 && (
                    <p className="text-xs text-red-600 mt-1">应付款</p>
                  )}
                  {balance.balance === 0 && (
                    <p className="text-xs text-gray-500 mt-1">已结清</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 结算方案 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>结算方案</span>
            <span className="text-sm font-normal text-gray-500">
              共需 {settlement.transfers.length} 笔转账
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {settlement.transfers.length > 0 ? (
            <div className="space-y-3">
              {settlement.transfers.map((transfer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getMemberAvatar(transfer.from)}</span>
                      <span className="font-medium text-gray-900">
                        {getMemberName(transfer.from)}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getMemberAvatar(transfer.to)}</span>
                      <span className="font-medium text-gray-900">
                        {getMemberName(transfer.to)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ¥{transfer.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>所有账单已结清，无需转账！</p>
            </div>
          )}
        </CardContent>
      </Card>

      {settlement.transfers.length > 0 && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-800 text-sm">
            ✨ 已为您优化结算方案，使用最少的转账次数完成结算
          </p>
        </div>
      )}
    </div>
  )
}
