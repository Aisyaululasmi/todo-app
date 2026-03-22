import { Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppRequest } from '../types';

export async function tenantContext(req: AppRequest, res: Response, next: NextFunction) {
  const { workspaceId } = req.params;

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: req.userId! } },
    include: {
      workspace: { select: { id: true, name: true, slug: true } },
      user: { select: { id: true, email: true, name: true } },
    },
  });

  if (!member) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Access denied' },
    });
  }

  req.workspace = member.workspace;
  req.user = { ...member.user, role: member.role };
  next();
}
