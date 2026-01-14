export const ProjectStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed'
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  memberIds: string[];
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}
