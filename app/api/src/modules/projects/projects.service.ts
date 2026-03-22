import prisma from '../../lib/prisma';

export const projectsService = {
  listProjects(workspaceId: string) {
    return prisma.project.findMany({
      where: { workspaceId },
      include: {
        members: { select: { userId: true, role: true } },
        _count: { select: { lists: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  createProject(
    workspaceId: string,
    data: { name: string; description?: string; color?: string },
    creatorId: string,
  ) {
    return prisma.project.create({
      data: {
        workspaceId,
        name: data.name,
        description: data.description,
        color: data.color,
        members: { create: { userId: creatorId, role: 'OWNER' } },
      },
      include: {
        members: { select: { userId: true, role: true } },
        _count: { select: { lists: true } },
      },
    });
  },
};
