import { create } from 'zustand';
import type { Category } from '@/types/category';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface CategoryState {
  categories: Category[];
  loadCategories: () => void;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'isCustom'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],

  loadCategories: () => {
    const categories = storage.get(STORAGE_KEYS.CATEGORIES) || [];
    set({ categories });
  },

  addCategory: (categoryData) => {
    const newCategory: Category = {
      ...categoryData,
      id: crypto.randomUUID(),
      isCustom: true,
      createdAt: Date.now()
    };

    set((state) => {
      const categories = [...state.categories, newCategory];
      storage.set(STORAGE_KEYS.CATEGORIES, categories);
      return { categories };
    });
  },

  updateCategory: (id, updates) => {
    set((state) => {
      const categories = state.categories.map(c =>
        c.id === id ? { ...c, ...updates } : c
      );
      storage.set(STORAGE_KEYS.CATEGORIES, categories);
      return { categories };
    });
  },

  deleteCategory: (id) => {
    set((state) => {
      const category = state.categories.find(c => c.id === id);
      if (category && !category.isCustom) {
        console.warn('Cannot delete preset category');
        return state;
      }

      const categories = state.categories.filter(c => c.id !== id);
      storage.set(STORAGE_KEYS.CATEGORIES, categories);
      return { categories };
    });
  },

  getCategoryById: (id) => {
    return get().categories.find(c => c.id === id);
  }
}));
