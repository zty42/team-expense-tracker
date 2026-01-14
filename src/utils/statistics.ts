import type { Expense } from '@/types/expense';
import type { CategoryStats, MemberStats, ProjectStats } from '@/types/statistics';

/**
 * 计算项目统计数据
 */
export function calculateProjectStats(
  expenses: Expense[],
  memberIds: string[]
): ProjectStats {
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const averagePerPerson = memberIds.length > 0 ? totalAmount / memberIds.length : 0;

  // 按分类统计
  const categoryMap = new Map<string, { amount: number; count: number }>();
  expenses.forEach(expense => {
    const stat = categoryMap.get(expense.categoryId) || { amount: 0, count: 0 };
    stat.amount += expense.amount;
    stat.count += 1;
    categoryMap.set(expense.categoryId, stat);
  });

  const categoryStats: CategoryStats[] = Array.from(categoryMap.entries()).map(
    ([categoryId, stat]) => ({
      categoryId,
      amount: Number(stat.amount.toFixed(2)),
      count: stat.count,
      percentage: totalAmount > 0 ? Number(((stat.amount / totalAmount) * 100).toFixed(2)) : 0
    })
  );

  // 按成员统计
  const memberMap = new Map<string, MemberStats>();
  memberIds.forEach(id => {
    memberMap.set(id, {
      memberId: id,
      totalPaid: 0,
      totalConsumed: 0,
      expenseCount: 0
    });
  });

  expenses.forEach(expense => {
    // 统计支付金额
    const payer = memberMap.get(expense.payerId);
    if (payer) {
      payer.totalPaid += expense.amount;
    }

    // 统计消费金额（平均分摊）
    const sharePerPerson = expense.amount / expense.participantIds.length;
    expense.participantIds.forEach(participantId => {
      const participant = memberMap.get(participantId);
      if (participant) {
        participant.totalConsumed += sharePerPerson;
        participant.expenseCount += 1;
      }
    });
  });

  const memberStats = Array.from(memberMap.values()).map(stat => ({
    ...stat,
    totalPaid: Number(stat.totalPaid.toFixed(2)),
    totalConsumed: Number(stat.totalConsumed.toFixed(2))
  }));

  return {
    totalAmount: Number(totalAmount.toFixed(2)),
    averagePerPerson: Number(averagePerPerson.toFixed(2)),
    categoryStats,
    memberStats
  };
}
