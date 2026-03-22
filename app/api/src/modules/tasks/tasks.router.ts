import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/auth';
import { tenantContext } from '../../middleware/tenantContext';
import { requireRole } from '../../middleware/requireRole';
import { validate } from '../../middleware/validate';
import { tasksService } from './tasks.service';
import { AppRequest } from '../../types';

const router = Router({ mergeParams: true });

router.use(authenticate, tenantContext);

const createTaskSchema = z.object({
  listId: z.string().min(1, 'listId is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED']).optional(),
  listId: z.string().optional(),
  dueDate: z.string().datetime().optional().nullable(),
  position: z.number().int().optional(),
});

// GET /api/workspaces/:workspaceId/tasks
router.get('/', async (req: AppRequest, res: Response, next) => {
  try {
    const tasks = await tasksService.listTasks(req.workspace!.id);
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
});

// GET /api/workspaces/:workspaceId/tasks/:taskId
router.get('/:taskId', async (req: AppRequest, res: Response, next) => {
  try {
    const task = await tasksService.getTask(req.params.taskId, req.workspace!.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Task not found' },
      });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

// POST /api/workspaces/:workspaceId/tasks
router.post(
  '/',
  requireRole('MEMBER'),
  validate(createTaskSchema),
  async (req: AppRequest, res: Response, next) => {
    try {
      const task = await tasksService.createTask(req.body, req.user!.id);
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },
);

// PATCH /api/workspaces/:workspaceId/tasks/:taskId
router.patch(
  '/:taskId',
  requireRole('MEMBER'),
  validate(updateTaskSchema),
  async (req: AppRequest, res: Response, next) => {
    try {
      const existing = await tasksService.getTask(req.params.taskId, req.workspace!.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Task not found' },
        });
      }
      const task = await tasksService.updateTask(req.params.taskId, req.user!.id, req.body);
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },
);

// DELETE /api/workspaces/:workspaceId/tasks/:taskId
router.delete(
  '/:taskId',
  requireRole('MEMBER'),
  async (req: AppRequest, res: Response, next) => {
    try {
      const existing = await tasksService.getTask(req.params.taskId, req.workspace!.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Task not found' },
        });
      }
      await tasksService.deleteTask(req.params.taskId, req.user!.id, existing.title);
      res.json({ success: true, data: null });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
