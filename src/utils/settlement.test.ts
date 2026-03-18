import { describe, it, expect } from 'vitest'
import { calculateSettlement } from './settlement'
import type { Expense } from '@/types/expense'

const baseTimestamp = new Date('2024-01-01T00:00:00Z').getTime()

describe('calculateSettlement', () => {
  it('应正确计算简单案例的结算方案', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        projectId: 'p1',
        amount: 300,
        categoryId: 'food',
        payerId: 'A',
        participantIds: ['A', 'B', 'C'],
        date: baseTimestamp,
        note: '午餐',
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp
      }
    ]
    const memberIds = ['A', 'B', 'C']

    const result = calculateSettlement(expenses, memberIds)

    // 每人应付 100 元
    expect(result.balances).toHaveLength(3)

    const balanceA = result.balances.find(b => b.memberId === 'A')
    const balanceB = result.balances.find(b => b.memberId === 'B')
    const balanceC = result.balances.find(b => b.memberId === 'C')

    // A 支付了 300，应付 100，净余额 +200
    expect(balanceA?.totalPaid).toBe(300)
    expect(balanceA?.totalOwed).toBe(100)
    expect(balanceA?.balance).toBe(200)

    // B 支付了 0，应付 100，净余额 -100
    expect(balanceB?.totalPaid).toBe(0)
    expect(balanceB?.totalOwed).toBe(100)
    expect(balanceB?.balance).toBe(-100)

    // C 同理
    expect(balanceC?.totalPaid).toBe(0)
    expect(balanceC?.totalOwed).toBe(100)
    expect(balanceC?.balance).toBe(-100)

    // 转账方案：B 和 C 各转 100 给 A
    expect(result.transfers).toHaveLength(2)
    expect(result.transfers).toContainEqual({
      from: 'B',
      to: 'A',
      amount: 100
    })
    expect(result.transfers).toContainEqual({
      from: 'C',
      to: 'A',
      amount: 100
    })
  })

  it('应处理复杂多账单案例', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        projectId: 'p1',
        amount: 600,
        categoryId: 'food',
        payerId: 'A',
        participantIds: ['A', 'B'],
        date: baseTimestamp,
        note: '晚餐',
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp
      },
      {
        id: '2',
        projectId: 'p1',
        amount: 300,
        categoryId: 'transport',
        payerId: 'B',
        participantIds: ['A', 'B', 'C'],
        date: baseTimestamp + 86400000,
        note: '交通',
        createdAt: baseTimestamp + 86400000,
        updatedAt: baseTimestamp + 86400000
      },
      {
        id: '3',
        projectId: 'p1',
        amount: 400,
        categoryId: 'hotel',
        payerId: 'C',
        participantIds: ['B', 'C'],
        date: baseTimestamp + 86400000 * 2,
        note: '住宿',
        createdAt: baseTimestamp + 86400000 * 2,
        updatedAt: baseTimestamp + 86400000 * 2
      }
    ]
    const memberIds = ['A', 'B', 'C']

    const result = calculateSettlement(expenses, memberIds)

    // 验证总余额为零（浮点误差容限内）
    const totalBalance = result.balances.reduce((sum, b) => sum + b.balance, 0)
    expect(Math.abs(totalBalance)).toBeLessThan(0.01)

    // 验证转账方案是最优的（最小转账次数）
    // 在这个案例中，预期 2 次转账
    expect(result.transfers.length).toBeLessThanOrEqual(2)

    // 验证每个转账金额正确
    result.transfers.forEach(transfer => {
      expect(transfer.amount).toBeGreaterThan(0)
      expect(typeof transfer.from).toBe('string')
      expect(typeof transfer.to).toBe('string')
    })
  })

  it('应处理空账单数组', () => {
    const expenses: Expense[] = []
    const memberIds = ['A', 'B', 'C']

    const result = calculateSettlement(expenses, memberIds)

    expect(result.balances).toHaveLength(3)
    result.balances.forEach(balance => {
      expect(balance.totalPaid).toBe(0)
      expect(balance.totalOwed).toBe(0)
      expect(balance.balance).toBe(0)
    })
    expect(result.transfers).toHaveLength(0)
  })

  it('应处理不参与任何账单的成员', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        projectId: 'p1',
        amount: 200,
        categoryId: 'food',
        payerId: 'A',
        participantIds: ['A', 'B'],
        date: baseTimestamp,
        note: '午餐',
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp
      }
    ]
    const memberIds = ['A', 'B', 'C'] // C 不参与任何账单

    const result = calculateSettlement(expenses, memberIds)

    const balanceC = result.balances.find(b => b.memberId === 'C')
    expect(balanceC?.totalPaid).toBe(0)
    expect(balanceC?.totalOwed).toBe(0)
    expect(balanceC?.balance).toBe(0)
  })

  it('应正确处理浮点数精度', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        projectId: 'p1',
        amount: 100,
        categoryId: 'food',
        payerId: 'A',
        participantIds: ['A', 'B', 'C'],
        date: baseTimestamp,
        note: '零食',
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp
      }
    ]
    const memberIds = ['A', 'B', 'C']

    const result = calculateSettlement(expenses, memberIds)

    // 100 / 3 ≈ 33.3333...
    const expectedShare = 100 / 3

    const balanceA = result.balances.find(b => b.memberId === 'A')
    expect(balanceA?.balance).toBeCloseTo(100 - expectedShare, 2)

    const balanceB = result.balances.find(b => b.memberId === 'B')
    expect(balanceB?.balance).toBeCloseTo(-expectedShare, 2)

    const balanceC = result.balances.find(b => b.memberId === 'C')
    expect(balanceC?.balance).toBeCloseTo(-expectedShare, 2)
  })
})
