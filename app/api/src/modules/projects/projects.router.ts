import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth';
import { tenantContext } from '../../middleware/tenantContext';
import { requireRole } from '../../middleware/requireRole';
import { validate } from '../../middleware/validate';
import { projectsService } from './projects.service';
import { AppRequest } from '../../types';

const router = Router({ mergeParams: true });

router.use(authenticate, tenantContext);

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
});

// GET /api/workspaces/:workspaceId/projects
router.get('/', async (req: AppRequest, res: Response, next) => {
  try {
    const projects = await projectsService.listProjects(req.workspace!.id);
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
});

// POST /api/workspaces/:workspaceId/projects
router.post(
  '/',
  requireRole('MEMBER'),
  validate(createProjectSchema),
  async (req: AppRequest, res: Response, next) => {
    try {
      const project = await projectsService.createProject(
        req.workspace!.id,
        req.body,
        req.user!.id,
      );
      res.status(201).json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
