export interface Expense {
  id: string;
  projectId: string;
  amount: number;
  categoryId: string;
  payerId: string; // 付款人 ID
  participantIds: string[]; // 参与消费的成员 ID 列表
  date: number; // 时间戳
  note?: string;
  createdAt: number;
  updatedAt: number;
}
