import { create } from 'zustand';
import { api } from '@/lib/api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  listId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;

  fetchTasks: (workspaceId: string, filters?: Record<string, string>) => Promise<void>;
  createTask: (workspaceId: string, data: Partial<Task>) => Promise<void>;
  updateTask: (workspaceId: string, taskId: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (workspaceId: string, taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async (workspaceId, filters = {}) => {
    set({ isLoading: true });
    const query = new URLSearchParams(filters).toString();
    const res = await api.get<{ success: boolean; data: Task[] }>(
      `/api/workspaces/${workspaceId}/tasks${query ? `?${query}` : ''}`,
    );
    set({ tasks: res.data, isLoading: false });
  },

  createTask: async (workspaceId, data) => {
    const res = await api.post<{ success: boolean; data: Task }>(
      `/api/workspaces/${workspaceId}/tasks`,
      data,
    );
    set({ tasks: [...get().tasks, res.data] });
  },

  updateTask: async (workspaceId, taskId, data) => {
    const res = await api.patch<{ success: boolean; data: Task }>(
      `/api/workspaces/${workspaceId}/tasks/${taskId}`,
      data,
    );
    set({ tasks: get().tasks.map((t) => (t.id === taskId ? res.data : t)) });
  },

  deleteTask: async (workspaceId, taskId) => {
    await api.delete(`/api/workspaces/${workspaceId}/tasks/${taskId}`);
    set({ tasks: get().tasks.filter((t) => t.id !== taskId) });
  },
}));
