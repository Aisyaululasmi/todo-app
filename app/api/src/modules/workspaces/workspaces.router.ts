import { Router, Response } from 'express';
import { authenticate } from '../../middleware/auth';
import { tenantContext } from '../../middleware/tenantContext';
import { workspacesService } from './workspaces.service';
import { AppRequest } from '../../types';

const router = Router();

router.use(authenticate);

// GET /api/workspaces
router.get('/', async (req: AppRequest, res: Response, next) => {
  try {
    const workspaces = await workspacesService.listForUser(req.userId!);
    res.json({ success: true, data: workspaces });
  } catch (err) {
    next(err);
  }
});

// GET /api/workspaces/:workspaceId
router.get('/:workspaceId', tenantContext, async (req: AppRequest, res: Response, next) => {
  try {
    const workspace = await workspacesService.getById(req.workspace!.id);
    res.json({ success: true, data: workspace });
  } catch (err) {
    next(err);
  }
});

export default router;
