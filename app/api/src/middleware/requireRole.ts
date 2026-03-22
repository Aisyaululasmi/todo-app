import { Response, NextFunction } from 'express';
import { WorkspaceRole } from '@prisma/client';
import { AppRequest } from '../types';

const ROLE_RANK: Record<WorkspaceRole, number> = {
  OWNER: 4,
  ADMIN: 3,
  MEMBER: 2,
  VIEWER: 1,
};

export function requireRole(minRole: WorkspaceRole) {
  return (req: AppRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || ROLE_RANK[userRole] < ROLE_RANK[minRole]) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }
    next();
  };
}
