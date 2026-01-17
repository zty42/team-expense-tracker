import { describe, it, expect } from 'vitest'
import { calculateProjectStats } from './statistics'
import type { Expense } from '@/types/expense'

describe('calculateProjectStats', () => {
  it('应正确计算基本统计数据', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        projectId: 'p1',
        amount: 300,
        categoryId: 'food',
        payerId: 'A',
        participantIds: ['A', 'B', 'C'],
        date: '2024-01-01',
        note: '午餐'
      },
      {
        id: '2',
        projectId: 'p1',
        amount: 200,
        categoryId: 'transport',
        payerId: 'B',
        participantIds: ['A', 'B'],
        date: '2024-01-02',
        note: '交通'
      }
    ]
    const memberIds = ['A', 'B', 'C']

    const stats = calculateProjectStats(expenses, memberIds)

    // 总金额
    expect(stats.totalAmount).toBe(500)

    // 人均消费（3 个成员）
    expect(stats.averagePerPerson).toBeCloseTo(500 / 3, 2)

    // 分类统计
    expect(stats.categoryStats).toHaveLength(2)

    const foodStats = stats.categoryStats.find(s => s.categoryId === 'food')
    expect(foodStats?.amount).toBe(300)
    expect(foodStats?.count).toBe(1)
    expect(foodStats?.percentage).toBeCloseTo((300 / 500) * 100, 2)

    const transportStats = stats.categoryStats.find(s => s.categoryId === 'transport')
    expect(transportStats?.amount).toBe(200)
    expect(transportStats?.count).toBe(1)
    expect(transportStats?.percentage).toBeCloseTo((200 / 500) * 100, 2)

    // 成员统计
    expect(stats.memberStats).toHaveLength(3)

    const memberA = stats.memberStats.find(m => m.memberId === 'A')
    expect(memberA?.totalPaid).toBe(300) // 支付了午餐
    // 消费：午餐 100 + 交通 100 = 200
    expect(memberA?.totalConsumed).toBeCloseTo(300 / 3 + 200 / 2, 2)
    expect(memberA?.expenseCount).toBe(2) // 参与了两笔账单

    const memberB = stats.memberStats.find(m => m.memberId === 'B')
    expect(memberB?.totalPaid).toBe(200) // 支付了交通
    // 消费：午餐 100 + 交通 100 = 200
    expect(memberB?.totalConsumed).toBeCloseTo(300 / 3 + 200 / 2, 2)
    expect(memberB?.expenseCount).toBe(2)

    const memberC = stats.memberStats.find(m => m.memberId === 'C')
    expect(memberC?.totalPaid).toBe(0) // 未支付任何账单
    expect(memberC?.totalConsumed).toBeCloseTo(300 / 3, 2) // 只参与了午餐
    expect(memberC?.expenseCount).toBe(1)
  })

  it('应处理空账单数组', () => {
    const expenses: Expense[] = []
    const memberIds = ['A', 'B', 'C']

    const stats = calculateProjectStats(expenses, memberIds)

    expect(stats.totalAmount).toBe(0)
    expect(stats.averagePerPerson).toBe(0)
    expect(stats.categoryStats).toHaveLength(0)
    expect(stats.memberStats).toHaveLength(3)

    stats.memberStats.forEach(member => {
      expect(member.totalPaid).toBe(0)
      expect(member.totalConsumed).toBe(0)
      expect(member.expenseCount).toBe(0)
    })
  })

  it('应处理空成员数组', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        projectId: 'p1',
        amount: 300,
        categoryId: 'food',
        payerId: 'A',
        participantIds: ['A', 'B'],
        date: '2024-01-01',
        note: '午餐'
      }
    ]
    const memberIds: string[] = []

    const stats = calculateProjectStats(expenses, memberIds)

    expect(stats.totalAmount).toBe(300)
    expect(stats.averagePerPerson).toBe(0) // 成员数为 0
    expect(stats.categoryStats).toHaveLength(1)
    expect(stats.memberStats).toHaveLength(0)
  })

  it('应正确计算百分比（防止除以零）', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        projectId: 'p1',
        amount: 0,
        categoryId: 'food',
        payerId: 'A',
        participantIds: ['A'],
        date: '2024-01-01',
        note: '免费'
      }
    ]
    const memberIds = ['A']

    const stats = calculateProjectStats(expenses, memberIds)

    const foodStats = stats.categoryStats[0]
    expect(foodStats.percentage).toBe(0) // 总金额为 0，百分比应为 0
  })

  it('应正确处理同一分类多个账单', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        projectId: 'p1',
        amount: 150,
        categoryId: 'food',
        payerId: 'A',
        participantIds: ['A', 'B'],
        date: '2024-01-01',
        note: '早餐'
      },
      {
        id: '2',
        projectId: 'p1',
        amount: 250,
        categoryId: 'food',
        payerId: 'B',
        participantIds: ['A', 'B', 'C'],
        date: '2024-01-01',
        note: '午餐'
      }
    ]
    const memberIds = ['A', 'B', 'C']

    const stats = calculateProjectStats(expenses, memberIds)

    expect(stats.categoryStats).toHaveLength(1) // 只有 food 分类
    const foodStats = stats.categoryStats[0]
    expect(foodStats.amount).toBe(400) // 150 + 250
    expect(foodStats.count).toBe(2) // 两笔账单
  })

  it('应正确处理成员不参与任何账单的情况', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        projectId: 'p1',
        amount: 200,
        categoryId: 'food',
        payerId: 'A',
        participantIds: ['A', 'B'],
        date: '2024-01-01',
        note: '午餐'
      }
    ]
    const memberIds = ['A', 'B', 'C', 'D'] // C 和 D 不参与任何账单

    const stats = calculateProjectStats(expenses, memberIds)

    expect(stats.memberStats).toHaveLength(4)

    const memberC = stats.memberStats.find(m => m.memberId === 'C')
    expect(memberC?.totalPaid).toBe(0)
    expect(memberC?.totalConsumed).toBe(0)
    expect(memberC?.expenseCount).toBe(0)

    const memberD = stats.memberStats.find(m => m.memberId === 'D')
    expect(memberD?.totalPaid).toBe(0)
    expect(memberD?.totalConsumed).toBe(0)
    expect(memberD?.expenseCount).toBe(0)
  })
})