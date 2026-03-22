import { create } from 'zustand';
import { api } from '@/lib/api';

export interface Membership {
  workspaceId: string;
  role: string;
  workspace: { name: string; slug: string };
}

export interface User {
  id: string;
  email: string;
  name: string;
  memberships: Membership[];
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const res = await api.post<{ success: boolean; data: { user: User; accessToken: string } }>(
      '/api/auth/login',
      { email, password },
    );
    api.setToken(res.data.accessToken);
    set({ user: res.data.user, isAuthenticated: true, isLoading: false });
  },

  register: async (email, password, name) => {
    const res = await api.post<{ success: boolean; data: { user: User; accessToken: string } }>(
      '/api/auth/register',
      { email, password, name },
    );
    api.setToken(res.data.accessToken);
    set({ user: res.data.user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await api.post('/api/auth/logout').catch(() => {});
    api.setToken(null);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  loadUser: async () => {
    try {
      const res = await api.get<{ success: boolean; data: User }>('/api/auth/me');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch {
      api.setToken(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
