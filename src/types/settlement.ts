export interface Transfer {
  from: string; // 成员 ID
  to: string; // 成员 ID
  amount: number;
}

export interface MemberBalance {
  memberId: string;
  totalPaid: number; // 总支付金额
  totalOwed: number; // 总应付金额
  balance: number; // 净余额（正数=应收，负数=应付）
}

export interface SettlementResult {
  balances: MemberBalance[];
  transfers: Transfer[];
}
