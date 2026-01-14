import { create } from 'zustand';
import type { Expense } from '@/types/expense';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface ExpenseState {
  expenses: Expense[];
  loadExpenses: () => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByProject: (projectId: string) => Expense[];
  getExpenseById: (id: string) => Expense | undefined;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],

  loadExpenses: () => {
    const expenses = storage.get(STORAGE_KEYS.EXPENSES) || [];
    set({ expenses });
  },

  addExpense: (expenseData) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    set((state) => {
      const expenses = [...state.expenses, newExpense];
      storage.set(STORAGE_KEYS.EXPENSES, expenses);
      return { expenses };
    });
  },

  updateExpense: (id, updates) => {
    set((state) => {
      const expenses = state.expenses.map(e =>
        e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e
      );
      storage.set(STORAGE_KEYS.EXPENSES, expenses);
      return { expenses };
    });
  },

  deleteExpense: (id) => {
    set((state) => {
      const expenses = state.expenses.filter(e => e.id !== id);
      storage.set(STORAGE_KEYS.EXPENSES, expenses);
      return { expenses };
    });
  },

  getExpensesByProject: (projectId) => {
    return get().expenses.filter(e => e.projectId === projectId);
  },

  getExpenseById: (id) => {
    return get().expenses.find(e => e.id === id);
  }
}));
