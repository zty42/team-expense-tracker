import type { Member } from '@/types/member';
import type { Category } from '@/types/category';
import type { Project } from '@/types/project';
import { ProjectStatus } from '@/types/project';
import type { Expense } from '@/types/expense';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export const seedMembers: Member[] = [
  {
    id: 'member-1',
    name: '张三',
    avatar: '👨',
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'member-2',
    name: '李四',
    avatar: '👩',
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'member-3',
    name: '王五',
    avatar: '🧑',
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: 'member-4',
    name: '赵六',
    avatar: '👨‍💼',
    createdAt: Date.now() - 86400000 * 30
  }
];

export const seedCategories: Category[] = [
  {
    id: 'cat-1',
    name: '餐饮',
    icon: '🍜',
    color: '#FF6B6B',
    isCustom: false,
    createdAt: Date.now()
  },
  {
    id: 'cat-2',
    name: '交通',
    icon: '🚗',
    color: '#4ECDC4',
    isCustom: false,
    createdAt: Date.now()
  },
  {
    id: 'cat-3',
    name: '住宿',
    icon: '🏨',
    color: '#45B7D1',
    isCustom: false,
    createdAt: Date.now()
  },
  {
    id: 'cat-4',
    name: '娱乐',
    icon: '🎮',
    color: '#96CEB4',
    isCustom: false,
    createdAt: Date.now()
  },
  {
    id: 'cat-5',
    name: '购物',
    icon: '🛍️',
    color: '#FFEAA7',
    isCustom: false,
    createdAt: Date.now()
  },
  {
    id: 'cat-6',
    name: '其他',
    icon: '📝',
    color: '#DFE6E9',
    isCustom: false,
    createdAt: Date.now()
  }
];

export const seedProjects: Project[] = [
  {
    id: 'project-1',
    name: '杭州团建',
    description: '2024年春季团队建设活动',
    status: ProjectStatus.ACTIVE,
    memberIds: ['member-1', 'member-2', 'member-3', 'member-4'],
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 1
  }
];

export const seedExpenses: Expense[] = [
  {
    id: 'expense-1',
    projectId: 'project-1',
    amount: 520,
    categoryId: 'cat-1',
    payerId: 'member-1',
    participantIds: ['member-1', 'member-2', 'member-3', 'member-4'],
    date: Date.now() - 86400000 * 6,
    note: '西湖边晚餐',
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 6
  },
  {
    id: 'expense-2',
    projectId: 'project-1',
    amount: 1200,
    categoryId: 'cat-3',
    payerId: 'member-2',
    participantIds: ['member-1', 'member-2', 'member-3', 'member-4'],
    date: Date.now() - 86400000 * 6,
    note: '酒店住宿费',
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 6
  },
  {
    id: 'expense-3',
    projectId: 'project-1',
    amount: 280,
    categoryId: 'cat-2',
    payerId: 'member-3',
    participantIds: ['member-1', 'member-2', 'member-3'],
    date: Date.now() - 86400000 * 5,
    note: '打车费用',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5
  },
  {
    id: 'expense-4',
    projectId: 'project-1',
    amount: 450,
    categoryId: 'cat-4',
    payerId: 'member-1',
    participantIds: ['member-1', 'member-2', 'member-3', 'member-4'],
    date: Date.now() - 86400000 * 5,
    note: '景区门票',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5
  },
  {
    id: 'expense-5',
    projectId: 'project-1',
    amount: 168,
    categoryId: 'cat-1',
    payerId: 'member-4',
    participantIds: ['member-2', 'member-4'],
    date: Date.now() - 86400000 * 4,
    note: '咖啡厅下午茶',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4
  }
];

export function initializeApp() {
  const initialized = storage.get(STORAGE_KEYS.INITIALIZED);

  if (!initialized) {
    storage.set(STORAGE_KEYS.MEMBERS, seedMembers);
    storage.set(STORAGE_KEYS.CATEGORIES, seedCategories);
    storage.set(STORAGE_KEYS.PROJECTS, seedProjects);
    storage.set(STORAGE_KEYS.EXPENSES, seedExpenses);
    storage.set(STORAGE_KEYS.INITIALIZED, true);
  }
}
