import type { Expense } from '@/types/expense';
import type { MemberBalance, Transfer, SettlementResult } from '@/types/settlement';

/**
 * 计算智能结算方案
 * 使用贪心算法最小化转账次数
 */
export function calculateSettlement(
  expenses: Expense[],
  memberIds: string[]
): SettlementResult {
  // 1. 初始化每个成员的余额
  const balanceMap = new Map<string, MemberBalance>();

  memberIds.forEach(id => {
    balanceMap.set(id, {
      memberId: id,
      totalPaid: 0,
      totalOwed: 0,
      balance: 0
    });
  });

  // 2. 遍历所有账单，计算每个人的支付和应付金额
  expenses.forEach(expense => {
    const { amount, payerId, participantIds } = expense;

    // 付款人增加支付金额
    const payerBalance = balanceMap.get(payerId);
    if (payerBalance) {
      payerBalance.totalPaid += amount;
    }

    // 每个参与者增加应付金额（平均分摊）
    const sharePerPerson = amount / participantIds.length;
    participantIds.forEach(participantId => {
      const participantBalance = balanceMap.get(participantId);
      if (participantBalance) {
        participantBalance.totalOwed += sharePerPerson;
      }
    });
  });

  // 3. 计算每个人的净余额（正数=应收，负数=应付）
  const balances = Array.from(balanceMap.values()).map(balance => ({
    ...balance,
    balance: Number((balance.totalPaid - balance.totalOwed).toFixed(2))
  }));

  // 4. 使用贪心算法计算最优转账方案
  const transfers = calculateMinimalTransfers(balances);

  return { balances, transfers };
}

/**
 * 贪心算法：最小化转账次数
 * 思路：
 * 1. 将所有人分为两组：应收（正余额）和应付（负余额）
 * 2. 每次匹配最大债权人和最大债务人
 * 3. 进行转账后更新余额，重复直到所有余额归零
 */
function calculateMinimalTransfers(balances: MemberBalance[]): Transfer[] {
  const transfers: Transfer[] = [];

  // 复制余额数组，避免修改原数组
  const balanceCopy = balances.map(b => ({ ...b }));

  // 过滤出有余额的成员（忽略极小的浮点误差）
  const EPSILON = 0.01;
  const creditors = balanceCopy.filter(b => b.balance > EPSILON); // 应收
  const debtors = balanceCopy.filter(b => b.balance < -EPSILON);  // 应付

  // 对两组进行排序
  creditors.sort((a, b) => b.balance - a.balance); // 降序
  debtors.sort((a, b) => a.balance - b.balance);   // 升序

  let i = 0; // creditors 索引
  let j = 0; // debtors 索引

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    // 计算转账金额（取两者绝对值的较小值）
    const transferAmount = Math.min(
      creditor.balance,
      Math.abs(debtor.balance)
    );

    // 记录转账
    transfers.push({
      from: debtor.memberId,
      to: creditor.memberId,
      amount: Number(transferAmount.toFixed(2))
    });

    // 更新余额
    creditor.balance -= transferAmount;
    debtor.balance += transferAmount;

    // 移动指针
    if (creditor.balance < EPSILON) i++;
    if (Math.abs(debtor.balance) < EPSILON) j++;
  }

  return transfers;
}
