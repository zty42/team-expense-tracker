import { create } from 'zustand';
import type { Member } from '@/types/member';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface MemberState {
  members: Member[];
  loadMembers: () => void;
  addMember: (member: Omit<Member, 'id' | 'createdAt'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  getMemberById: (id: string) => Member | undefined;
}

export const useMemberStore = create<MemberState>((set, get) => ({
  members: [],

  loadMembers: () => {
    const members = storage.get(STORAGE_KEYS.MEMBERS) || [];
    set({ members });
  },

  addMember: (memberData) => {
    const newMember: Member = {
      ...memberData,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };

    set((state) => {
      const members = [...state.members, newMember];
      storage.set(STORAGE_KEYS.MEMBERS, members);
      return { members };
    });
  },

  updateMember: (id, updates) => {
    set((state) => {
      const members = state.members.map(m =>
        m.id === id ? { ...m, ...updates } : m
      );
      storage.set(STORAGE_KEYS.MEMBERS, members);
      return { members };
    });
  },

  deleteMember: (id) => {
    set((state) => {
      const members = state.members.filter(m => m.id !== id);
      storage.set(STORAGE_KEYS.MEMBERS, members);
      return { members };
    });
  },

  getMemberById: (id) => {
    return get().members.find(m => m.id === id);
  }
}));
