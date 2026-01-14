import { create } from 'zustand';
import type { Project } from '@/types/project';
import { ProjectStatus } from '@/types/project';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  loadProjects: () => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  completeProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
  getCurrentProject: () => Project | undefined;
  getProjectById: (id: string) => Project | undefined;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProjectId: null,

  loadProjects: () => {
    const projects = storage.get(STORAGE_KEYS.PROJECTS) || [];
    set({ projects });
  },

  addProject: (projectData) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      status: ProjectStatus.ACTIVE,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    set((state) => {
      const projects = [...state.projects, newProject];
      storage.set(STORAGE_KEYS.PROJECTS, projects);
      return { projects };
    });
  },

  updateProject: (id, updates) => {
    set((state) => {
      const projects = state.projects.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
      );
      storage.set(STORAGE_KEYS.PROJECTS, projects);
      return { projects };
    });
  },

  completeProject: (id) => {
    set((state) => {
      const projects = state.projects.map(p =>
        p.id === id
          ? {
              ...p,
              status: ProjectStatus.COMPLETED,
              completedAt: Date.now(),
              updatedAt: Date.now()
            }
          : p
      );
      storage.set(STORAGE_KEYS.PROJECTS, projects);
      return { projects };
    });
  },

  deleteProject: (id) => {
    set((state) => {
      const projects = state.projects.filter(p => p.id !== id);
      storage.set(STORAGE_KEYS.PROJECTS, projects);
      return { projects };
    });
  },

  setCurrentProject: (id) => {
    set({ currentProjectId: id });
  },

  getCurrentProject: () => {
    const { projects, currentProjectId } = get();
    return projects.find(p => p.id === currentProjectId);
  },

  getProjectById: (id) => {
    return get().projects.find(p => p.id === id);
  }
}));
