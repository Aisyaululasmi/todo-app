'use client';

import { Calendar, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@/lib/dummy-data';

const priorityConfig = {
  URGENT: { variant: 'danger' as const, label: 'Urgent', icon: <Flag className="h-3 w-3" /> },
  HIGH:   { variant: 'warning' as const, label: 'High',   icon: null },
  MEDIUM: { variant: 'primary' as const, label: 'Medium', icon: null },
  LOW:    { variant: 'default' as const, label: 'Low',    icon: null },
  NONE:   null,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const priority = priorityConfig[task.priority];

  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <p className="text-sm font-medium text-slate-900">{task.title}</p>

      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{task.description}</p>
      )}

      {(priority || task.dueDate) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {priority && (
            <Badge variant={priority.variant}>
              {priority.icon}
              {priority.icon && <span className="ml-1">{priority.label}</span>}
              {!priority.icon && priority.label}
            </Badge>
          )}

          {task.dueDate && (
            <Badge variant="default">
              <Calendar className="h-3 w-3" />
              <span className="ml-1">{formatDate(task.dueDate)}</span>
            </Badge>
          )}
        </div>
      )}
    </button>
  );
}

export type { TaskCardProps };
