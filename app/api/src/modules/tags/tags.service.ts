import prisma from '../../lib/prisma';

export const tagsService = {
  listTags(workspaceId: string) {
    return prisma.tag.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  },

  createTag(workspaceId: string, data: { name: string; color?: string }) {
    return prisma.tag.create({
      data: {
        workspaceId,
        name: data.name,
        color: data.color ?? '#6366f1',
      },
    });
  },

  updateTag(tagId: string, workspaceId: string, data: { name?: string; color?: string }) {
    return prisma.tag.update({
      where: { id: tagId, workspaceId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.color !== undefined && { color: data.color }),
      },
    });
  },

  deleteTag(tagId: string, workspaceId: string) {
    return prisma.tag.delete({ where: { id: tagId, workspaceId } });
  },
};
