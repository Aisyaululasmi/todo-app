import prisma from '../../lib/prisma';

export const workspacesService = {
  listForUser(userId: string) {
    return prisma.workspace.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: { select: { userId: true, role: true } },
        _count: { select: { projects: true } },
      },
    });
  },

  getById(workspaceId: string) {
    return prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { projects: true } },
      },
    });
  },
};
