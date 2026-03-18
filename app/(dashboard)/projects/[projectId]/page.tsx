'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Kanban, List, Plus } from 'lucide-react';
import { projects, tasks as initialTasks } from '@/lib/dummy-data';
import type { Task } from '@/lib/dummy-data';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BoardView } from '@/components/tasks/board-view';
import { TaskDetailPanel } from '@/components/tasks/task-detail-panel';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';

const viewTabs = [
  { id: 'board',    label: 'Board',    icon: <Kanban className="h-4 w-4" /> },
  { id: 'list',     label: 'List',     icon: <List className="h-4 w-4" /> },
  { id: 'calendar', label: 'Calendar', icon: <CalendarDays className="h-4 w-4" /> },
];

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = React.use(params);
  const project = projects.find((p) => p.id === projectId);

  const [view, setView] = useState<'board' | 'list' | 'calendar'>('board');
  const [localTasks, setLocalTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-lg font-medium text-slate-700">Project not found.</p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>
    );
  }

  const projectTasks = localTasks.filter((t) => t.projectId === projectId);

  function handleTaskClick(task: Task) {
    setSelectedTask(task);
  }

  function handleCreateTask(task: Task) {
    setLocalTasks((prev) => [...prev, { ...task, projectId }]);
  }

  return (
    <>
      <div className="flex h-full flex-col gap-6">
        {/* Project header */}
        <div className="flex items-start gap-4">
          <span
            className="h-8 w-8 shrink-0 rounded-lg"
            style={{ backgroundColor: project.color }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{project.description}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <Tabs
            tabs={viewTabs}
            active={view}
            onChange={(id) => setView(id as typeof view)}
          />
          <Button size="sm" onClick={() => setCreateTaskOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* View content */}
        {view === 'board' ? (
          <BoardView tasks={projectTasks} onTaskClick={handleTaskClick} onCreateTask={() => setCreateTaskOpen(true)} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="text-slate-500">
              {view === 'list' ? 'List' : 'Calendar'} view coming soon!
            </p>
          </div>
        )}
      </div>

      {/* Task detail panel */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Create task dialog */}
      <CreateTaskDialog
        open={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </>
  );
}
