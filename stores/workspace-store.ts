import { create } from 'zustand';
import { api } from '@/lib/api';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  status: string;
}

interface WorkspaceState {
  projects: Project[];
  fetchProjects: (workspaceId: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  projects: [],

  fetchProjects: async (workspaceId) => {
    const res = await api.get<{ success: boolean; data: Project[] }>(
      `/api/workspaces/${workspaceId}/projects`,
    );
    set({ projects: res.data });
  },
}));
