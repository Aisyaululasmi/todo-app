'use client';

import { useEffect } from 'react';
import { AlertTriangle, CheckSquare, Clock, FolderKanban, TrendingUp } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { useTaskStore } from '@/stores/task-store';
import { useWorkspaceStore } from '@/stores/workspace-store';

function computeStats(tasks: ReturnType<typeof useTaskStore.getState>['tasks'], projectCount: number) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    totalProjects: projectCount,
    totalTasks: tasks.length,
    dueSoon: tasks.filter((t) => {
      if (!t.dueDate || t.status === 'DONE') return false;
      const due = new Date(t.dueDate);
      return due >= now && due <= weekFromNow;
    }).length,
    overdue: tasks.filter((t) => {
      if (!t.dueDate || t.status === 'DONE') return false;
      return new Date(t.dueDate) < now;
    }).length,
    completedThisWeek: tasks.filter((t) => t.status === 'DONE' && new Date(t.updatedAt) >= weekAgo).length,
  };
}

export default function DashboardPage() {
  const { user, isLoading: authLoading, loadUser } = useAuthStore();
  const { tasks, fetchTasks, isLoading: tasksLoading } = useTaskStore();
  const { projects, fetchProjects } = useWorkspaceStore();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const workspaceId = user?.memberships[0]?.workspaceId;
    if (workspaceId) {
      fetchTasks(workspaceId);
      fetchProjects(workspaceId);
    }
  }, [user]);

  const isLoading = authLoading || tasksLoading;
  const stats = computeStats(tasks, projects.length);

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderKanban, color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'Total Tasks', value: stats.totalTasks, icon: CheckSquare, color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'Due Soon', value: stats.dueSoon, icon: Clock, color: stats.dueSoon > 0 ? 'text-amber-600' : 'text-slate-600', bg: stats.dueSoon > 0 ? 'bg-amber-100' : 'bg-slate-100' },
    { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: stats.overdue > 0 ? 'text-red-600' : 'text-slate-600', bg: stats.overdue > 0 ? 'bg-red-100' : 'bg-slate-100' },
    { label: 'Completed This Week', value: stats.completedThisWeek, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">Welcome back, {user?.name}!</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardBody className="flex flex-col gap-3 p-4">
              <div className={`w-fit rounded-lg p-2 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Projects</h2>
        {projects.length === 0 ? (
          <p className="text-sm text-slate-500">No projects yet. Create one to get started.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardBody className="flex flex-col gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 shrink-0 rounded"
                      style={{ backgroundColor: project.color ?? '#6366f1' }}
                    />
                    <h3 className="font-medium text-slate-900 truncate">{project.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{project.description ?? 'No description'}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
