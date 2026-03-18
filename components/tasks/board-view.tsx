'use client';

import { useMemo } from 'react';
import { Kanban, Plus } from 'lucide-react';
import { TaskCard } from '@/components/tasks/task-card';
import type { Task, TaskStatus } from '@/lib/dummy-data';

type Column = {
  status: TaskStatus;
  label: string;
  dotColor: string;
};

const COLUMNS: Column[] = [
  { status: 'BACKLOG',     label: 'Backlog',     dotColor: 'bg-slate-400'  },
  { status: 'TODO',        label: 'To Do',       dotColor: 'bg-blue-400'   },
  { status: 'IN_PROGRESS', label: 'In Progress', dotColor: 'bg-yellow-400' },
  { status: 'IN_REVIEW',   label: 'In Review',   dotColor: 'bg-purple-400' },
  { status: 'DONE',        label: 'Done',        dotColor: 'bg-green-400'  },
];

interface BoardViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onCreateTask?: () => void;
}

export function BoardView({ tasks, onTaskClick, onCreateTask }: BoardViewProps) {
  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      BACKLOG: [], TODO: [], IN_PROGRESS: [], IN_REVIEW: [], DONE: [],
    };
    for (const task of tasks) {
      map[task.status].push(task);
    }
    return map;
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
        <Kanban className="h-12 w-12 text-slate-300" />
        <p className="text-base font-semibold text-slate-700">No tasks yet</p>
        <button
          onClick={onCreateTask}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch]">
      {COLUMNS.map(({ status, label, dotColor }) => {
        const columnTasks = grouped[status];
        return (
          <div key={status} className="w-72 shrink-0 rounded-lg bg-slate-100 p-3 flex flex-col gap-3">
            {/* Column header */}
            <div className="flex items-center gap-2 px-1">
              <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <span className="ml-auto text-xs font-medium text-slate-400">
                {columnTasks.length}
              </span>
            </div>

            {/* Task cards */}
            <div className="flex flex-col gap-2">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
              ))}
            </div>

            {/* Add task */}
            <button className="mt-auto flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Add task
            </button>
          </div>
        );
      })}
    </div>
  );
}

export type { BoardViewProps };
