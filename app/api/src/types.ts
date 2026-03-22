import { Request } from 'express';
import { WorkspaceRole } from '@prisma/client';

export interface AppRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: WorkspaceRole;
  };
  workspace?: {
    id: string;
    name: string;
    slug: string;
  };
}
