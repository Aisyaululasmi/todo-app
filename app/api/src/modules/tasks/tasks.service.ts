import prisma from '../../lib/prisma';

const taskListInclude = {
  list: { select: { id: true, name: true } },
  assignees: { include: { user: { select: { id: true, name: true, email: true } } } },
  tags: { include: { tag: { select: { id: true, name: true, color: true } } } },
  _count: { select: { subtasks: true, comments: true } },
} as const;

function logActivity(taskId: string | null, userId: string, action: string, meta?: object) {
  // fire-and-forget — never blocks the response
  prisma.activityLog
    .create({ data: { taskId, userId, action, meta } })
    .catch((err) => console.error('[activity]', err));
}

export const tasksService = {
  listTasks(workspaceId: string) {
    return prisma.task.findMany({
      where: { list: { project: { workspaceId } } },
      include: taskListInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  getTask(taskId: string, workspaceId: string) {
    return prisma.task.findFirst({
      where: { id: taskId, list: { project: { workspaceId } } },
      include: {
        list: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true, email: true } },
        assignees: { include: { user: { select: { id: true, name: true, email: true } } } },
        subtasks: { orderBy: { position: 'asc' } },
        tags: { include: { tag: { select: { id: true, name: true, color: true } } } },
        comments: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  },

  async createTask(
    data: {
      listId: string;
      title: string;
      description?: string;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      dueDate?: string | null;
    },
    creatorId: string,
  ) {
    const task = await prisma.task.create({
      data: {
        listId: data.listId,
        title: data.title,
        description: data.description,
        priority: data.priority ?? 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        creatorId,
      },
      include: taskListInclude,
    });

    logActivity(task.id, creatorId, 'task.created', {
      title: task.title,
      listId: task.listId,
      priority: task.priority,
    });

    return task;
  },

  async updateTask(
    taskId: string,
    userId: string,
    data: {
      title?: string;
      description?: string | null;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      status?: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
      listId?: string;
      dueDate?: string | null;
      position?: number;
    },
  ) {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.listId !== undefined && { listId: data.listId }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
        ...(data.position !== undefined && { position: data.position }),
      },
      include: taskListInclude,
    });

    // only log the fields that actually changed
    const changes = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
    logActivity(task.id, userId, 'task.updated', { changes });

    return task;
  },

  async deleteTask(taskId: string, userId: string, taskTitle: string) {
    await prisma.task.delete({ where: { id: taskId } });

    // taskId is set to null on cascade — log without taskId
    logActivity(null, userId, 'task.deleted', { taskId, title: taskTitle });
  },
};
