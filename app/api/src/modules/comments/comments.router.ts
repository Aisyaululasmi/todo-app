import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth';
import { tenantContext } from '../../middleware/tenantContext';
import { requireRole } from '../../middleware/requireRole';
import { validate } from '../../middleware/validate';
import { commentsService } from './comments.service';
import { AppRequest } from '../../types';

const router = Router({ mergeParams: true });

router.use(authenticate, tenantContext);

const createCommentSchema = z.object({
  body: z.string().min(1, 'Comment body is required'),
  parentId: z.string().uuid().optional(),
});

// GET /api/workspaces/:workspaceId/tasks/:taskId/comments
router.get('/', async (req: AppRequest, res: Response, next) => {
  try {
    const comments = await commentsService.listComments(req.params.taskId);
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
});

// POST /api/workspaces/:workspaceId/tasks/:taskId/comments
router.post('/', requireRole('MEMBER'), validate(createCommentSchema), async (req: AppRequest, res: Response, next) => {
  try {
    const comment = await commentsService.createComment(
      req.params.taskId,
      req.user!.id,
      req.body,
    );
    res.status(201).json({ success: true, data: comment });
  } catch (err: any) {
    if (err.status === 404) {
      return res.status(404).json({
        success: false,
        error: { code: err.code, message: err.message },
      });
    }
    next(err);
  }
});

// DELETE /api/workspaces/:workspaceId/tasks/:taskId/comments/:commentId
router.delete('/:commentId', requireRole('MEMBER'), async (req: AppRequest, res: Response, next) => {
  try {
    await commentsService.deleteComment(req.params.commentId, req.user!.id);
    res.json({ success: true, data: null });
  } catch (err: any) {
    // P2025 = record not found (wrong author or missing)
    if (err.code === 'P2025') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Comment not found or not yours' },
      });
    }
    next(err);
  }
});

export default router;
