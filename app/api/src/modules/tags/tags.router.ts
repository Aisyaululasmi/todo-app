import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth';
import { tenantContext } from '../../middleware/tenantContext';
import { requireRole } from '../../middleware/requireRole';
import { validate } from '../../middleware/validate';
import { tagsService } from './tags.service';
import { AppRequest } from '../../types';

const router = Router({ mergeParams: true });

router.use(authenticate, tenantContext);

const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().optional(),
});

const updateTagSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().optional(),
});

// GET /api/workspaces/:workspaceId/tags
router.get('/', async (req: AppRequest, res: Response, next) => {
  try {
    const tags = await tagsService.listTags(req.workspace!.id);
    res.json({ success: true, data: tags });
  } catch (err) {
    next(err);
  }
});

// POST /api/workspaces/:workspaceId/tags
router.post('/', requireRole('MEMBER'), validate(createTagSchema), async (req: AppRequest, res: Response, next) => {
  try {
    const tag = await tagsService.createTag(req.workspace!.id, req.body);
    res.status(201).json({ success: true, data: tag });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/workspaces/:workspaceId/tags/:tagId
router.patch('/:tagId', requireRole('MEMBER'), validate(updateTagSchema), async (req: AppRequest, res: Response, next) => {
  try {
    const tag = await tagsService.updateTag(req.params.tagId, req.workspace!.id, req.body);
    res.json({ success: true, data: tag });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/workspaces/:workspaceId/tags/:tagId
router.delete('/:tagId', requireRole('MEMBER'), async (req: AppRequest, res: Response, next) => {
  try {
    await tagsService.deleteTag(req.params.tagId, req.workspace!.id);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
});

export default router;
