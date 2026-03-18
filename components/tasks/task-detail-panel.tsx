'use client';

import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { BadgeVariant } from '@/components/ui/badge';
import type { Task, TaskStatus, TaskPriority } from '@/lib/dummy-data';

const statusConfig: Record<TaskStatus, { variant: BadgeVariant; label: string }> = {
  BACKLOG:     { variant: 'default',  label: 'Backlog'     },
  TODO:        { variant: 'primary',  label: 'To Do'       },
  IN_PROGRESS: { variant: 'warning',  label: 'In Progress' },
  IN_REVIEW:   { variant: 'primary',  label: 'In Review'   },
  DONE:        { variant: 'success',  label: 'Done'        },
};

const priorityConfig: Record<TaskPriority, { variant: BadgeVariant; label: string } | null> = {
  URGENT: { variant: 'danger',   label: 'Urgent' },
  HIGH:   { variant: 'warning',  label: 'High'   },
  MEDIUM: { variant: 'primary',  label: 'Medium' },
  LOW:    { variant: 'default',  label: 'Low'    },
  NONE:   null,
};

function formatDate(dateStr: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface TaskDetailPanelProps {
  task: Task;
  onClose: () => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const formattedDate = formatDate(task.dueDate);

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full sm:max-w-lg flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{task.title}</h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="mt-0.5 shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            <Field label="Status">
              <Badge variant={status.variant}>{status.label}</Badge>
            </Field>

            <Field label="Priority">
              {priority
                ? <Badge variant={priority.variant}>{priority.label}</Badge>
                : <span className="text-slate-400">—</span>
              }
            </Field>

            {formattedDate && (
              <Field label="Due Date">
                {formattedDate}
              </Field>
            )}

            {task.description && (
              <Field label="Description">
                <p className="whitespace-pre-wrap leading-relaxed">{task.description}</p>
              </Field>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

export type { TaskDetailPanelProps };
