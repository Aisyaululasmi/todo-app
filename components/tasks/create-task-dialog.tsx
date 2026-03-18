'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Task, TaskStatus, TaskPriority } from '@/lib/dummy-data';

const selectClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1';

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateTask: (task: Task) => void;
}

const defaultFields = {
  title: '',
  description: '',
  status: 'TODO' as TaskStatus,
  priority: 'NONE' as TaskPriority,
};

export function CreateTaskDialog({ open, onClose, onCreateTask }: CreateTaskDialogProps) {
  const [fields, setFields] = useState(defaultFields);
  const [titleError, setTitleError] = useState('');

  function set<K extends keyof typeof defaultFields>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      if (key === 'title') setTitleError('');
    };
  }

  function handleClose() {
    setFields(defaultFields);
    setTitleError('');
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.title.trim()) {
      setTitleError('Title is required.');
      return;
    }
    onCreateTask({
      id: `task-${Math.random().toString(36).slice(2, 9)}`,
      title: fields.title.trim(),
      description: fields.description.trim(),
      status: fields.status,
      priority: fields.priority,
      dueDate: '',
      projectId: '',
      assigneeId: '',
    });
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Create Task">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="Task title"
          value={fields.title}
          onChange={set('title')}
          error={titleError}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            rows={3}
            placeholder="Optional description"
            value={fields.description}
            onChange={set('description')}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <select value={fields.status} onChange={set('status')} className={selectClass}>
            <option value="BACKLOG">Backlog</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Priority</label>
          <select value={fields.priority} onChange={set('priority')} className={selectClass}>
            <option value="NONE">None</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            Create
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export type { CreateTaskDialogProps };
