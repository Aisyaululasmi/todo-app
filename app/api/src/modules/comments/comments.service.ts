import prisma from '../../lib/prisma';

const userSelect = { select: { id: true, name: true, email: true } } as const;

export const commentsService = {
  listComments(taskId: string) {
    // return only top-level comments with their replies nested
    return prisma.comment.findMany({
      where: { taskId, parentId: null },
      include: {
        user: userSelect,
        replies: {
          include: { user: userSelect },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  async createComment(
    taskId: string,
    userId: string,
    data: { body: string; parentId?: string },
  ) {
    // if parentId given, verify it belongs to the same task
    if (data.parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: data.parentId },
      });
      if (!parent || parent.taskId !== taskId) {
        throw Object.assign(new Error('Parent comment not found on this task'), {
          code: 'NOT_FOUND',
          status: 404,
        });
      }
    }

    return prisma.comment.create({
      data: { taskId, userId, body: data.body, parentId: data.parentId ?? null },
      include: {
        user: userSelect,
        replies: { include: { user: userSelect } },
      },
    });
  },

  deleteComment(commentId: string, userId: string) {
    // only the author can delete
    return prisma.comment.delete({
      where: { id: commentId, userId },
    });
  },
};
