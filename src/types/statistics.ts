export interface CategoryStats {
  categoryId: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface MemberStats {
  memberId: string;
  totalPaid: number; // 支付总额
  totalConsumed: number; // 消费总额
  expenseCount: number; // 参与的账单数
}

export interface ProjectStats {
  totalAmount: number;
  averagePerPerson: number;
  categoryStats: CategoryStats[];
  memberStats: MemberStats[];
}
