import type { Member } from '@/types/member';
import type { Category } from '@/types/category';
import type { Project } from '@/types/project';
import type { Expense } from '@/types/expense';

export const STORAGE_KEYS = {
  PROJECTS: 'team-expense-tracker:projects',
  MEMBERS: 'team-expense-tracker:members',
  CATEGORIES: 'team-expense-tracker:categories',
  EXPENSES: 'team-expense-tracker:expenses',
  INITIALIZED: 'team-expense-tracker:initialized'
} as const;

interface StorageData {
  'team-expense-tracker:projects': Project[];
  'team-expense-tracker:members': Member[];
  'team-expense-tracker:categories': Category[];
  'team-expense-tracker:expenses': Expense[];
  'team-expense-tracker:initialized': boolean;
}

export const storage = {
  get: <K extends keyof StorageData>(key: K): StorageData[K] | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return null;
    }
  },

  set: <K extends keyof StorageData>(key: K, value: StorageData[K]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to storage:`, error);
    }
  },

  remove: (key: keyof StorageData): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
